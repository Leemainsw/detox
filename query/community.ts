"use client";

import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import type { QueryClient } from "@tanstack/react-query";
import type { CommunityListCursor } from "@/app/community/_types";
import type { SubscriptableBrandType } from "@/app/utils/brand/type";
import {
  createCommunityComment,
  createCommunityPost,
  deleteCommunityComment,
  deleteCommunityPost,
  getCommunityComments,
  getCommunityDetail,
  getCommunityListPage,
  getCommunityPostLikeStatus,
  reportCommunityComment,
  reportCommunityPost,
  toggleCommunityPostLike,
  updateCommunityPost,
} from "@/services/community";

export const communityKeys = {
  all: ["community"],
  lists: () => [...communityKeys.all, "list"],
  list: (service?: SubscriptableBrandType) => [
    ...communityKeys.lists(),
    service ?? "all",
  ],
  details: () => [...communityKeys.all, "detail"],
  detail: (postId: string) => [...communityKeys.details(), postId],
  comments: () => [...communityKeys.all, "comment"],
  commentList: (postId: string) => [...communityKeys.comments(), postId],
  likes: () => [...communityKeys.all, "like"],
  likeStatus: (postId: string, userId?: string) => [
    ...communityKeys.likes(),
    postId,
    userId ?? "guest",
  ],
} as const;

async function invalidateCommunityPost(
  queryClient: QueryClient,
  postId: string
) {
  await Promise.all([
    queryClient.invalidateQueries({
      queryKey: communityKeys.lists(),
    }),
    queryClient.invalidateQueries({
      queryKey: communityKeys.detail(postId),
    }),
  ]);
}

async function invalidateCommunityPostComments(
  queryClient: QueryClient,
  postId: string
) {
  await Promise.all([
    invalidateCommunityPost(queryClient, postId),
    queryClient.invalidateQueries({
      queryKey: communityKeys.commentList(postId),
    }),
  ]);
}

async function invalidateCommunityPostLikes(
  queryClient: QueryClient,
  postId: string,
  userId?: string
) {
  await Promise.all([
    invalidateCommunityPost(queryClient, postId),
    queryClient.invalidateQueries({
      queryKey: communityKeys.likeStatus(postId, userId),
    }),
  ]);
}

//리스트
export function useInfiniteCommunityListQuery(
  service?: SubscriptableBrandType
) {
  return useInfiniteQuery({
    queryKey: communityKeys.list(service),
    initialPageParam: null as CommunityListCursor | null,
    queryFn: ({ pageParam }) =>
      getCommunityListPage({
        service,
        cursor: pageParam,
      }),
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });
}

//상세
export function useCommunityDetailQuery(postId: string) {
  return useQuery({
    queryKey: communityKeys.detail(postId),
    queryFn: () => getCommunityDetail(postId),
    enabled: Boolean(postId),
  });
}

//작성
export function useCreateCommunityPostMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createCommunityPost,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: communityKeys.lists(),
      });
    },
  });
}

//수정
export function useUpdateCommunityPostMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateCommunityPost,
    onSuccess: async (_, variables) => {
      await invalidateCommunityPost(queryClient, variables.postId);
    },
  });
}

//삭제
export function useDeleteCommunityPostMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteCommunityPost,
    onSuccess: async (_, variables) => {
      await invalidateCommunityPost(queryClient, variables.postId);
    },
  });
}

//댓글조회
export function useCommunityCommentsQuery(postId: string) {
  return useQuery({
    queryKey: communityKeys.commentList(postId),
    queryFn: () => getCommunityComments(postId),
    enabled: Boolean(postId),
  });
}

//좋아요조회
export function useCommunityPostLikeStatusQuery(
  postId: string,
  userId?: string
) {
  return useQuery({
    queryKey: communityKeys.likeStatus(postId, userId),
    queryFn: () =>
      getCommunityPostLikeStatus({
        postId,
        userId: userId!,
      }),
    enabled: Boolean(postId && userId),
  });
}

//댓글작성
export function useCreateCommunityCommentMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createCommunityComment,
    onSuccess: async (_, variables) => {
      await invalidateCommunityPostComments(queryClient, variables.postId);
    },
  });
}

//좋아요토글
export function useToggleCommunityPostLikeMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: toggleCommunityPostLike,
    onSuccess: async (_, variables) => {
      await invalidateCommunityPostLikes(
        queryClient,
        variables.postId,
        variables.userId
      );
    },
  });
}

//댓글삭제
export function useDeleteCommunityCommentMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteCommunityComment,
    onSuccess: async (_, variables) => {
      await invalidateCommunityPostComments(queryClient, variables.postId);
    },
  });
}

//게시글신고
export function useReportCommunityPostMutation() {
  return useMutation({
    mutationFn: reportCommunityPost,
  });
}

//댓글신고
export function useReportCommunityCommentMutation() {
  return useMutation({
    mutationFn: reportCommunityComment,
  });
}
