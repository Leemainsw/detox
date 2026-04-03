import { formatRelativeTime } from "@/app/utils/date/formatRelativeTime";
import type {
  CommunityCommentItemData,
  CommunityDetailData,
  CommunityListItemData,
  CommunityListCursor,
  CommunityListPage,
} from "@/app/community/_types";
import type { SubscriptableBrandType } from "@/app/utils/brand/type";
import { rankRelatedPostIdsWithOpenAI } from "@/app/utils/community/openai-rank-related-posts";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import type { Tables } from "@/types/supabase.types";

type UserPreview = Pick<Tables<"users">, "id" | "nickname" | "profile_image">;

type PostWithCounts = Tables<"post"> & {
  active_comments: { count: number }[];
  likes: { count: number }[];
};

type SupabaseServerClient = Awaited<
  ReturnType<typeof createSupabaseServerClient>
>;

const USER_PREVIEW_SELECT = "id, nickname, profile_image";

const RECOMMENDATION_CACHE_TTL_MS = 7 * 24 * 60 * 60 * 1000;

/** 목록 카드 데이터 반환 (삭제된 글은 제외) */
function mapPostsToListItems(
  visiblePosts: PostWithCounts[],
  userMap: Map<string, UserPreview>
): CommunityListItemData[] {
  return visiblePosts.map((post) => {
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
}

export async function getServerCommunityListPageWithClient(
  supabase: SupabaseServerClient,
  params: {
    service?: SubscriptableBrandType;
    cursor?: CommunityListCursor | null;
    pageSize?: number;
  }
): Promise<CommunityListPage> {
  const pageSize = params.pageSize ?? 10;

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

  if (params.service) {
    query = query.eq("service", params.service);
  }

  if (params.cursor) {
    query = query.or(
      `created_at.lt.${params.cursor.createdAt},and(created_at.eq.${params.cursor.createdAt},id.lt.${params.cursor.id})`
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

  const items = mapPostsToListItems(visiblePosts, userMap);

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

export async function getServerCommunityListPage(params: {
  service?: SubscriptableBrandType;
  cursor?: CommunityListCursor | null;
  pageSize?: number;
}): Promise<CommunityListPage> {
  const supabase = await createSupabaseServerClient();
  return getServerCommunityListPageWithClient(supabase, params);
}

/** id 순서를 유지하여 목록 카드 데이터 반환 (삭제된 글은 제외) */
export async function getServerCommunityListItemsByIds(
  supabase: SupabaseServerClient,
  ids: string[]
): Promise<CommunityListItemData[]> {
  if (ids.length === 0) return [];

  const { data, error: postsError } = await supabase
    .from("post")
    .select(
      `
      *,
      active_comments:comment(count),
      likes(count)
    `
    )
    .in("id", ids)
    .is("deleted_at", null)
    .is("active_comments.deleted_at", null);

  if (postsError) throw postsError;

  const posts = (data ?? []) as PostWithCounts[];
  if (posts.length === 0) return [];

  const userIds = [...new Set(posts.map((post) => post.user_id))];
  const { data: users, error: usersError } = await supabase
    .from("users")
    .select(USER_PREVIEW_SELECT)
    .in("id", userIds)
    .is("deleted_at", null);

  if (usersError) throw usersError;

  const userMap = new Map<string, UserPreview>(
    (users ?? []).map((user) => [user.id, user])
  );

  const byId = new Map(
    mapPostsToListItems(posts, userMap).map((item) => [item.id, item])
  );

  return ids
    .map((id) => byId.get(id))
    .filter((item): item is CommunityListItemData => item != null);
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
    updatedAt: post.updated_at,
  };
}

function vectorParamForRpc(
  embedding: string | number[] | null | undefined
): string {
  if (embedding == null) return "";
  if (typeof embedding === "string") return embedding;
  return `[${embedding.join(",")}]`;
}

/** 벡터 유사도 후보 → 부족 시 같은 서비스·전체 최신으로 보강 */
async function buildRecommendationCandidatePool(
  supabase: SupabaseServerClient,
  params: {
    postId: string;
    service: SubscriptableBrandType;
    targetPoolSize: number;
  }
): Promise<{ items: CommunityListItemData[]; usedVector: boolean }> {
  const { data: srcRow } = await supabase
    .from("post")
    .select("embedding")
    .eq("id", params.postId)
    .maybeSingle();

  let items: CommunityListItemData[] = [];
  let usedVector = false;

  if (srcRow?.embedding != null) {
    const q = vectorParamForRpc(srcRow.embedding);
    if (q.length > 0) {
      const { data: matchRows, error: rpcError } = await supabase.rpc(
        "match_posts_for_recommendation",
        {
          query_embedding: q,
          match_source_id: params.postId,
          match_count: params.targetPoolSize,
        }
      );

      if (!rpcError && matchRows?.length) {
        const ids = (matchRows as { id: string }[]).map((r) => r.id);
        items = await getServerCommunityListItemsByIds(supabase, ids);
        usedVector = items.length > 0;
      }
    }
  }

  if (items.length >= params.targetPoolSize) {
    return {
      items: items.slice(0, params.targetPoolSize),
      usedVector,
    };
  }

  const sameServicePage = await getServerCommunityListPageWithClient(supabase, {
    service: params.service,
    pageSize: Math.max(params.targetPoolSize + 2, 25),
  });

  const merged: CommunityListItemData[] = [...items];
  const seen = new Set(merged.map((i) => i.id));
  seen.add(params.postId);

  for (const item of sameServicePage.items) {
    if (seen.has(item.id)) continue;
    merged.push(item);
    seen.add(item.id);
    if (merged.length >= params.targetPoolSize) break;
  }

  if (merged.length < params.targetPoolSize) {
    const fallbackPage = await getServerCommunityListPageWithClient(supabase, {
      pageSize: Math.max(params.targetPoolSize * 2, 35),
    });
    for (const item of fallbackPage.items) {
      if (seen.has(item.id)) continue;
      merged.push(item);
      seen.add(item.id);
      if (merged.length >= params.targetPoolSize) break;
    }
  }

  return {
    items: merged.slice(0, params.targetPoolSize),
    usedVector,
  };
}

export async function getServerRecommendedCommunityPosts(params: {
  postId: string;
  service: SubscriptableBrandType;
  /** AI 랭킹용 (없으면 규칙 기반만) */
  sourceTitle?: string;
  sourceContent?: string;
  /** post.updated_at — 캐시 일치 시에만 히트 */
  sourcePostUpdatedAt: string;
  limit?: number;
}): Promise<CommunityListItemData[]> {
  const supabase = await createSupabaseServerClient();
  const limit = params.limit ?? 3;
  const targetPoolSize = 20;

  const { data: cacheRow, error: cacheReadError } = await supabase
    .from("post_recommendation")
    .select("*")
    .eq("source_post_id", params.postId)
    .maybeSingle();

  if (!cacheReadError && cacheRow) {
    // 원글 수정 시점이 캐시에 저장된 시점과 같을 때만 히트 (수정 후엔 다시 계산)
    const versionOk =
      cacheRow.source_post_updated_at === params.sourcePostUpdatedAt;

    // 캐시 행이 TTL 이내인지 (오래된 추천 목록은 재생성)
    const ageOk =
      Date.now() - new Date(cacheRow.updated_at).getTime() <
      RECOMMENDATION_CACHE_TTL_MS;

    // 유효한 캐시이고 추천 ID가 있을 때만 ID → 목록 아이템으로 복원 시도
    if (versionOk && ageOk && cacheRow.related_post_ids.length > 0) {
      const hydrated = await getServerCommunityListItemsByIds(
        supabase,
        cacheRow.related_post_ids
      );
      // 일부 글이 삭제·비공개 등으로 조회되지 않으면 캐시를 쓰지 않고 아래에서 재계산
      if (hydrated.length === cacheRow.related_post_ids.length) {
        return hydrated.slice(0, limit);
      }
    }
  }

  // 벡터·규칙 등으로 후보 글 모음을 만든 뒤, 그중에서 최종 추천을 고름
  const { items: pool, usedVector: usedVectorPool } =
    await buildRecommendationCandidatePool(supabase, {
      postId: params.postId,
      service: params.service,
      targetPoolSize,
    });

  // 제목, 본문이 있고 후보가 있을 때만 OpenAI로 재정렬 시도
  const canUseAi =
    Boolean(params.sourceTitle?.trim()) &&
    params.sourceContent != null &&
    pool.length > 0;

  let usedAi = false;
  let result: CommunityListItemData[] = [];

  if (canUseAi) {
    // 후보 메타만 넘겨 관련도 순으로 post id 목록을 받음
    const aiIds = await rankRelatedPostIdsWithOpenAI({
      sourceTitle: params.sourceTitle!.trim(),
      sourceContent: params.sourceContent ?? "",
      service: params.service,
      candidates: pool.map((p) => ({
        id: p.id,
        title: p.title,
        contentPreview: p.content,
      })),
      limit,
    });

    if (aiIds && aiIds.length > 0) {
      // 풀에 있는 객체를 id로 빠르게 찾아, AI가 준 순서대로 다시 나열
      const byId = new Map(pool.map((p) => [p.id, p]));
      const ordered: CommunityListItemData[] = [];
      for (const id of aiIds) {
        const item = byId.get(id);
        if (item) ordered.push(item);
      }
      if (ordered.length > 0) {
        result = ordered.slice(0, limit);
        usedAi = true;
      }
    }
  }

  // AI 미사용·실패 시 후보 풀의 기본 순서(앞쪽 limit개)로 폴백
  if (result.length === 0) {
    result = pool.slice(0, limit);
  }

  if (result.length > 0) {
    // 캐시/분석용: 벡터 후보 여부 + OpenAI 랭킹 여부를 문자열로 기록
    const algorithm_version = usedAi
      ? usedVectorPool
        ? "vec+openai-v1"
        : "openai-rank-v1"
      : usedVectorPool
        ? "vec+rule-v1"
        : "rule-fallback-v1";

    // 다음 요청은 캐시 히트 가능하도록 추천 id·알고리즘·원글 버전 저장
    const { error: upsertError } = await supabase
      .from("post_recommendation")
      .upsert(
        {
          source_post_id: params.postId,
          related_post_ids: result.map((r) => r.id),
          algorithm_version,
          source_post_updated_at: params.sourcePostUpdatedAt,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "source_post_id" }
      );

    if (upsertError) {
      console.warn("[post_recommendation] upsert 실패:", upsertError.message);
    }
  }

  return result;
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
