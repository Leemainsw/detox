import { unstable_cache } from "next/cache";
import { formatRelativeTime } from "@/app/utils/date/formatRelativeTime";
import type {
  CommunityListCursor,
  CommunityListPage,
} from "@/app/community/_types";
import type { SubscriptableBrandType } from "@/app/utils/brand/type";
import {
  COMMUNITY_LIST_CACHE_REVALIDATE_SECONDS,
  COMMUNITY_LIST_CACHE_TAG,
  COMMUNITY_LIST_DEFAULT_PAGE_SIZE,
} from "@/lib/community-list-cache";
import { createPublicSupabaseServerClient } from "@/lib/supabase-server-public";
import type { Tables } from "@/types/supabase.types";

type UserPreview = Pick<Tables<"users">, "id" | "nickname" | "profile_image">;

type PostWithCounts = Tables<"post"> & {
  active_comments: { count: number }[];
  likes: { count: number }[];
};

type CommunityListServerParams = {
  service?: SubscriptableBrandType;
  cursor?: CommunityListCursor | null;
  pageSize?: number;
};

const USER_PREVIEW_SELECT = "id, nickname, profile_image";

const getCachedCommunityListPageSource = unstable_cache(
  async (
    service: SubscriptableBrandType | null,
    cursorCreatedAt: string | null,
    cursorId: string | null,
    pageSize: number
  ): Promise<CommunityListPage> => {
    const supabase = createPublicSupabaseServerClient();
    const cursor =
      cursorCreatedAt && cursorId
        ? {
            createdAt: cursorCreatedAt,
            id: cursorId,
          }
        : null;

    let query = supabase
      .from("post")
      .select(
        `
        *,
        active_comments:comment(count),
        likes(count)
      `
      )
      .is("deleted_at", null)
      .is("active_comments.deleted_at", null);

    if (service) {
      query = query.eq("service", service);
    }

    if (cursor) {
      query = query.or(
        `created_at.lt.${cursor.createdAt},and(created_at.eq.${cursor.createdAt},id.lt.${cursor.id})`
      );
    }

    const { data, error: postsError } = await query
      .order("created_at", { ascending: false })
      .order("id", { ascending: false })
      .limit(pageSize + 1);

    if (postsError) {
      throw postsError;
    }

    const posts = (data ?? []) as PostWithCounts[];

    if (posts.length === 0) {
      return {
        items: [],
        nextCursor: null,
      };
    }

    const hasNextPage = posts.length > pageSize;
    const visiblePosts = hasNextPage ? posts.slice(0, pageSize) : posts;
    const userIds = [...new Set(visiblePosts.map((post) => post.user_id))];
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

    const items = visiblePosts.map((post) => {
      const user = userMap.get(post.user_id);

      return {
        id: post.id,
        service: post.service as SubscriptableBrandType,
        author: user?.nickname ?? "알 수 없는 사용자",
        timeAgo: formatRelativeTime(post.created_at),
        title: post.title,
        content: post.content,
        likeCount: post.likes?.[0]?.count ?? 0,
        commentCount: post.active_comments?.[0]?.count ?? 0,
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
  },
  ["community-list-page"],
  {
    revalidate: COMMUNITY_LIST_CACHE_REVALIDATE_SECONDS,
    tags: [COMMUNITY_LIST_CACHE_TAG],
  }
);

export async function getCachedCommunityListPage(
  params: CommunityListServerParams
) {
  return getCachedCommunityListPageSource(
    params.service ?? null,
    params.cursor?.createdAt ?? null,
    params.cursor?.id ?? null,
    params.pageSize ?? COMMUNITY_LIST_DEFAULT_PAGE_SIZE
  );
}
