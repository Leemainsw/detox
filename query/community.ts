"use client";

import { useQuery } from "@tanstack/react-query";
import type { SubscriptableBrandType } from "@/app/utils/brand/type";
import { getCommunityDetail, getCommunityList } from "@/services/community";

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

export function useCommunityListQuery(service?: SubscriptableBrandType) {
  return useQuery({
    queryKey: communityKeys.list(service),
    queryFn: () => getCommunityList(service),
  });
}

export function useCommunityDetailQuery(postId: string) {
  return useQuery({
    queryKey: communityKeys.detail(postId),
    queryFn: () => getCommunityDetail(postId),
    enabled: Boolean(postId),
  });
}
