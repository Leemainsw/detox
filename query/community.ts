"use client";

import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import type { CommunityListCursor } from "@/app/community/_types";
import type { SubscriptableBrandType } from "@/app/utils/brand/type";
import {
  createCommunityPost,
  deleteCommunityPost,
  getCommunityDetail,
  getCommunityListPage,
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
} as const;

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

export function useCommunityDetailQuery(postId: string) {
  return useQuery({
    queryKey: communityKeys.detail(postId),
    queryFn: () => getCommunityDetail(postId),
    enabled: Boolean(postId),
  });
}

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

export function useUpdateCommunityPostMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateCommunityPost,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: communityKeys.lists(),
      });
      queryClient.invalidateQueries({
        queryKey: communityKeys.detail(variables.postId),
      });
    },
  });
}

export function useDeleteCommunityPostMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteCommunityPost,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: communityKeys.lists(),
      });
      queryClient.invalidateQueries({
        queryKey: communityKeys.detail(variables.postId),
      });
    },
  });
}
