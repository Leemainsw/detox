"use client";

import { formatRelativeTime } from "@/app/utils/date/formatRelativeTime";
import type {
  CommunityDetailData,
  CommunityListItemData,
} from "@/app/community/_types";
import type { SubscriptableBrandType } from "@/app/utils/brand/type";
import type { Tables } from "@/types/supabase.types";
import { supabase } from "@/lib/supabase";

type PostRow = Tables<"post">;
type UserRow = Tables<"users">;
type CommentRow = Tables<"comment">;
type LikeRow = Tables<"likes">;

export async function getCommunityList(
  service?: SubscriptableBrandType
): Promise<CommunityListItemData[]> {
  let query = supabase
    .from("post")
    .select("*")
    .is("deleted_at", null)
    .order("created_at", { ascending: false });

  if (service) {
    query = query.eq("service", service);
  }

  const { data: posts, error: postsError } = await query;

  if (postsError) {
    throw postsError;
  }

  if (!posts || posts.length === 0) {
    return [];
  }

  const postIds = posts.map((post) => post.id);
  const userIds = [...new Set(posts.map((post) => post.user_id))];

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

  return posts.map((post) => {
    const user = userMap.get(post.user_id);
    return {
      id: post.id,
      service: post.service as SubscriptableBrandType,
      author: user?.nickname ?? "알수없는사용자",
      timeAgo: formatRelativeTime(post.created_at),
      title: post.title,
      content: post.content,
      likeCount: likeCountMap[post.id] ?? 0,
      commentCount: commentCountMap[post.id] ?? 0,
      thumbUrl: user?.profile_image ?? "/images/default-user.png",
    };
  });
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
    author: user?.nickname ?? "알수없는사용자",
    timeAgo: formatRelativeTime(post.created_at),
    title: post.title,
    content: post.content,
    likeCount: likes?.length ?? 0,
    commentCount: comments?.length ?? 0,
    thumbUrl: user?.profile_image ?? "/images/default-user.png",
    createdAt: post.created_at,
  };
}
