import { formatRelativeTime } from "@/app/utils/date/formatRelativeTime";
import { supabase } from "@/lib/supabase";
import type {
  CommunityDetailData,
  CommunityListCursor,
  CommunityListPage,
} from "@/app/community/_types";
import type { SubscriptableBrandType } from "@/app/utils/brand/type";
import type { Tables } from "@/types/supabase.types";

type UserRow = Tables<"users">;

export async function getCommunityListPage(params: {
  service?: SubscriptableBrandType;
  cursor?: CommunityListCursor | null;
  pageSize?: number;
}): Promise<CommunityListPage> {
  const pageSize = params.pageSize ?? 10;

  let query = supabase.from("post").select("*").is("deleted_at", null);

  if (params.service) {
    query = query.eq("service", params.service);
  }

  if (params.cursor) {
    query = query.or(
      `created_at.lt.${params.cursor.createdAt},and(created_at.eq.${params.cursor.createdAt},id.lt.${params.cursor.id})`
    );
  }

  const { data: posts, error: postsError } = await query
    .order("created_at", { ascending: false })
    .order("id", { ascending: false })
    .limit(pageSize + 1);

  if (postsError) {
    throw postsError;
  }

  if (!posts || posts.length === 0) {
    return {
      items: [],
      nextCursor: null,
    };
  }

  const hasNextPage = posts.length > pageSize;
  const visiblePosts = hasNextPage ? posts.slice(0, pageSize) : posts;

  const postIds = visiblePosts.map((post) => post.id);
  const userIds = [...new Set(visiblePosts.map((post) => post.user_id))];

  const [
    { data: users, error: usersError },
    { data: comments, error: commentsError },
    { data: likes, error: likesError },
  ] = await Promise.all([
    supabase.from("users").select("*").in("id", userIds).is("deleted_at", null),
    supabase
      .from("comment")
      .select("*")
      .in("post_id", postIds)
      .is("deleted_at", null),
    supabase.from("likes").select("*").in("post_id", postIds),
  ]);

  if (usersError) throw usersError;
  if (commentsError) throw commentsError;
  if (likesError) throw likesError;

  const userMap = new Map<string, UserRow>(
    (users ?? []).map((user) => [user.id, user])
  );

  const commentCountMap = (comments ?? []).reduce<Record<string, number>>(
    (acc, comment) => {
      acc[comment.post_id] = (acc[comment.post_id] ?? 0) + 1;
      return acc;
    },
    {}
  );

  const likeCountMap = (likes ?? []).reduce<Record<string, number>>(
    (acc, like) => {
      acc[like.post_id] = (acc[like.post_id] ?? 0) + 1;
      return acc;
    },
    {}
  );

  const items = visiblePosts.map((post) => {
    const user = userMap.get(post.user_id);

    return {
      id: post.id,
      service: post.service as SubscriptableBrandType,
      author: user?.nickname ?? "알 수 없는 사용자",
      timeAgo: formatRelativeTime(post.created_at),
      title: post.title,
      content: post.content,
      likeCount: likeCountMap[post.id] ?? 0,
      commentCount: commentCountMap[post.id] ?? 0,
      thumbUrl: user?.profile_image ?? "/images/default-user.png",
    };
  });

  const lastPost = visiblePosts[visiblePosts.length - 1];

  return {
    items,
    nextCursor:
      hasNextPage && lastPost
        ? {
            createdAt: lastPost.created_at,
            id: lastPost.id,
          }
        : null,
  };
}

export async function getCommunityDetail(
  postId: string
): Promise<CommunityDetailData | null> {
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
    { data: comments, error: commentsError },
    { data: likes, error: likesError },
  ] = await Promise.all([
    supabase
      .from("users")
      .select("*")
      .eq("id", post.user_id)
      .is("deleted_at", null)
      .maybeSingle(),
    supabase
      .from("comment")
      .select("*")
      .eq("post_id", post.id)
      .is("deleted_at", null),
    supabase.from("likes").select("*").eq("post_id", post.id),
  ]);

  if (userError) throw userError;
  if (commentsError) throw commentsError;
  if (likesError) throw likesError;

  return {
    id: post.id,
    service: post.service as SubscriptableBrandType,
    author: user?.nickname ?? "알 수 없는 사용자",
    timeAgo: formatRelativeTime(post.created_at),
    title: post.title,
    content: post.content,
    likeCount: likes?.length ?? 0,
    commentCount: comments?.length ?? 0,
    thumbUrl: user?.profile_image ?? "/images/default-user.png",
    createdAt: post.created_at,
  };
}

export async function createCommunityPost(params: {
  userId: string;
  service: SubscriptableBrandType;
  title: string;
  content: string;
}) {
  return supabase.from("post").insert({
    user_id: params.userId,
    service: params.service,
    title: params.title,
    content: params.content,
  });
}
