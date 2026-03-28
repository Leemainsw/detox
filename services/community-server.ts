import { formatRelativeTime } from "@/app/utils/date/formatRelativeTime";
import { getRequestOrigin } from "@/lib/request-origin";
import type {
  CommunityCommentItemData,
  CommunityDetailData,
  CommunityListItemData,
  CommunityListCursor,
  CommunityListPage,
} from "@/app/community/_types";
import type { SubscriptableBrandType } from "@/app/utils/brand/type";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import {
  createCommunityListApiPath,
  fetchCommunityListPage,
} from "@/services/community-list-api";
import type { Tables } from "@/types/supabase.types";

type UserPreview = Pick<Tables<"users">, "id" | "nickname" | "profile_image">;

const USER_PREVIEW_SELECT = "id, nickname, profile_image";

export async function getServerCommunityListPage(params: {
  service?: SubscriptableBrandType;
  cursor?: CommunityListCursor | null;
  pageSize?: number;
}): Promise<CommunityListPage> {
  const origin = await getRequestOrigin();
  const path = createCommunityListApiPath(params);

  return fetchCommunityListPage(new URL(path, origin), {
    cache: "no-store",
  });
}

export async function getServerCommunityDetail(
  postId: string
): Promise<CommunityDetailData | null> {
  const supabase = await createSupabaseServerClient();

  const { data: post, error: postError } = await supabase
    .from("post")
    .select("*")
    .eq("id", postId)
    .is("deleted_at", null)
    .maybeSingle();

  if (postError) {
    throw postError;
  }

  if (!post) {
    return null;
  }

  const [
    { data: user, error: userError },
    { count: commentCount, error: commentsError },
    { count: likeCount, error: likesError },
  ] = await Promise.all([
    supabase
      .from("users")
      .select(USER_PREVIEW_SELECT)
      .eq("id", post.user_id)
      .is("deleted_at", null)
      .maybeSingle(),
    supabase
      .from("comment")
      .select("id", { count: "exact", head: true })
      .eq("post_id", post.id)
      .is("deleted_at", null),
    supabase
      .from("likes")
      .select("id", { count: "exact", head: true })
      .eq("post_id", post.id),
  ]);

  if (userError) throw userError;
  if (commentsError) throw commentsError;
  if (likesError) throw likesError;

  return {
    id: post.id,
    userId: post.user_id,
    service: post.service as SubscriptableBrandType,
    author: user?.nickname ?? "알 수 없는 사용자",
    timeAgo: formatRelativeTime(post.created_at),
    title: post.title,
    content: post.content,
    likeCount: likeCount ?? 0,
    commentCount: commentCount ?? 0,
    thumbUrl: user?.profile_image ?? "/images/default-user.png",
    createdAt: post.created_at,
  };
}

export async function getServerRecommendedCommunityPosts(params: {
  postId: string;
  service: SubscriptableBrandType;
  limit?: number;
}): Promise<CommunityListItemData[]> {
  const limit = params.limit ?? 3;
  const sameServicePage = await getServerCommunityListPage({
    service: params.service,
    pageSize: Math.max(limit + 1, 4),
  });

  const recommendedPosts = sameServicePage.items.filter(
    (item) => item.id !== params.postId
  );

  if (recommendedPosts.length >= limit) {
    return recommendedPosts.slice(0, limit);
  }

  const fallbackPage = await getServerCommunityListPage({
    pageSize: Math.max(limit * 3, 10),
  });

  const existingIds = new Set(recommendedPosts.map((item) => item.id));
  const mergedPosts = [
    ...recommendedPosts,
    ...fallbackPage.items.filter((item) => {
      if (item.id === params.postId || existingIds.has(item.id)) {
        return false;
      }

      existingIds.add(item.id);
      return true;
    }),
  ];

  return mergedPosts.slice(0, limit);
}

export async function getServerCommunityComments(
  postId: string
): Promise<CommunityCommentItemData[]> {
  const supabase = await createSupabaseServerClient();

  const { data: comments, error: commentsError } = await supabase
    .from("comment")
    .select("*")
    .eq("post_id", postId)
    .is("deleted_at", null)
    .order("created_at", { ascending: true });

  if (commentsError) {
    throw commentsError;
  }

  if (!comments || comments.length === 0) {
    return [];
  }

  const userIds = [...new Set(comments.map((comment) => comment.user_id))];

  const { data: users, error: usersError } = await supabase
    .from("users")
    .select(USER_PREVIEW_SELECT)
    .in("id", userIds)
    .is("deleted_at", null);

  if (usersError) {
    throw usersError;
  }

  const userMap = new Map<string, UserPreview>(
    (users ?? []).map((user) => [user.id, user])
  );

  return comments.map((comment) => {
    const user = userMap.get(comment.user_id);

    return {
      id: comment.id,
      postId: comment.post_id,
      userId: comment.user_id,
      author: user?.nickname ?? "알 수 없는 사용자",
      timeAgo: formatRelativeTime(comment.created_at),
      content: comment.content,
      thumbUrl: user?.profile_image ?? "/images/default-user.png",
      createdAt: comment.created_at,
    };
  });
}
