import { infiniteQueryOptions, queryOptions } from "@tanstack/react-query";
import type {
  CommunityCommentItemData,
  CommunityDetailData,
  CommunityListCursor,
  CommunityListItemData,
  CommunityListPage,
} from "@/app/community/_types";
import type { SubscriptableBrandType } from "@/app/utils/brand/type";

export const communityKeys = {
  all: ["community"],
  lists: () => [...communityKeys.all, "list"],
  list: (service?: SubscriptableBrandType) => [
    ...communityKeys.lists(),
    service ?? "all",
  ],
  details: () => [...communityKeys.all, "detail"],
  detail: (postId: string) => [...communityKeys.details(), postId],
  recommendations: () => [...communityKeys.all, "recommendation"],
  recommendationList: (postId: string) => [
    ...communityKeys.recommendations(),
    postId,
  ],
  recommendedPosts: (postId: string, service?: SubscriptableBrandType) => [
    ...communityKeys.recommendationList(postId),
    service ?? "all",
  ],
  comments: () => [...communityKeys.all, "comment"],
  commentList: (postId: string) => [...communityKeys.comments(), postId],
  likes: () => [...communityKeys.all, "like"],
  likeStatuses: (postId: string) => [...communityKeys.likes(), postId],
  likeStatus: (postId: string, userId?: string) => [
    ...communityKeys.likeStatuses(postId),
    userId ?? "guest",
  ],
} as const;

export const COMMUNITY_STALE_TIME = 30 * 1000;
export const COMMUNITY_LIST_STALE_TIME = COMMUNITY_STALE_TIME;

type CommunityListPageFetcher = (params: {
  service?: SubscriptableBrandType;
  cursor?: CommunityListCursor | null;
  pageSize?: number;
}) => Promise<CommunityListPage>;

type CommunityDetailFetcher = (
  postId: string
) => Promise<CommunityDetailData | null>;

type CommunityCommentsFetcher = (
  postId: string
) => Promise<CommunityCommentItemData[]>;

type RecommendedCommunityPostsFetcher = (params: {
  postId: string;
  service: SubscriptableBrandType;
  limit?: number;
}) => Promise<CommunityListItemData[]>;

export function createCommunityListInfiniteQueryOptions(params: {
  service?: SubscriptableBrandType;
  fetchPage: CommunityListPageFetcher;
}) {
  return infiniteQueryOptions({
    queryKey: communityKeys.list(params.service),
    initialPageParam: null as CommunityListCursor | null,
    queryFn: ({ pageParam }) =>
      params.fetchPage({
        service: params.service,
        cursor: pageParam,
      }),
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    staleTime: COMMUNITY_STALE_TIME,
  });
}

export function createCommunityDetailQueryOptions(params: {
  postId: string;
  fetchDetail: CommunityDetailFetcher;
}) {
  return queryOptions({
    queryKey: communityKeys.detail(params.postId),
    queryFn: () => params.fetchDetail(params.postId),
    staleTime: COMMUNITY_STALE_TIME,
  });
}

export function createCommunityCommentsQueryOptions(params: {
  postId: string;
  fetchComments: CommunityCommentsFetcher;
}) {
  return queryOptions({
    queryKey: communityKeys.commentList(params.postId),
    queryFn: () => params.fetchComments(params.postId),
    staleTime: COMMUNITY_STALE_TIME,
  });
}

export function createRecommendedCommunityPostsQueryOptions(params: {
  postId: string;
  service: SubscriptableBrandType;
  fetchRecommendedPosts: RecommendedCommunityPostsFetcher;
}) {
  return queryOptions({
    queryKey: communityKeys.recommendedPosts(params.postId, params.service),
    queryFn: () =>
      params.fetchRecommendedPosts({
        postId: params.postId,
        service: params.service,
      }),
    staleTime: COMMUNITY_STALE_TIME,
  });
}
