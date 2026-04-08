import {
  createSubscription,
  deleteSubscription,
  getSubscriptionDetail,
  getSubscriptionList,
  updateSubscription,
} from "@/services/subscription";
import { Tables, TablesUpdate } from "@/types/supabase.types";
import {
  useMutation,
  useQuery,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";

/** 홈·통계 등에서 같은 목록 캐시를 공유할 때 짧게 유지 (초 단위) */
export const SUBSCRIPTION_LIST_STALE_TIME_MS = 60 * 1000;

export const subscriptionKeys = {
  all: ["subscription"] as const,
  list: (userId: string) => [...subscriptionKeys.all, "list", userId] as const,
  /** `list(userId)` 전부 무효화할 때 (접두사 매칭) */
  listAll: () => [...subscriptionKeys.all, "list"] as const,
  detail: (id: string) => [...subscriptionKeys.all, "detail", id] as const,
};

/**
 * 구독 목록 조회
 */
export const useGetSubscriptionListQuery = (userId: string) => {
  return useQuery({
    queryKey: subscriptionKeys.list(userId),
    queryFn: () => getSubscriptionList(userId),
    enabled: !!userId,
    staleTime: SUBSCRIPTION_LIST_STALE_TIME_MS,
  });
};

/**
 * 구독 목록 조회 (Suspense — 로그인 유저 id가 있을 때만 사용)
 */
export const useGetSubscriptionListSuspenseQuery = (userId: string) => {
  return useSuspenseQuery({
    queryKey: subscriptionKeys.list(userId),
    queryFn: () => getSubscriptionList(userId),
    staleTime: SUBSCRIPTION_LIST_STALE_TIME_MS,
  });
};

/**
 * 구독 생성
 * @returns 구독 생성 뮤테이션
 */
export const useCreateSubscriptionMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createSubscription,
    onSuccess: (data) => {
      queryClient.setQueryData(
        subscriptionKeys.list(data.user_id),
        (old: Tables<"subscription">[] | undefined) => [...(old ?? []), data]
      );
    },
  });
};

/**
 * 구독 상세 조회 (useQuery - loading 상태 직접 처리)
 */
export const useGetSubscriptionDetailQuery = (id: string) => {
  return useQuery({
    queryKey: subscriptionKeys.detail(id),
    queryFn: () => getSubscriptionDetail(id),
    enabled: !!id,
  });
};

/**
 * 구독 상세 조회 (useSuspenseQuery - Suspense fallback 사용)
 */
export const useGetSubscriptionDetailSuspenseQuery = (id: string) => {
  return useSuspenseQuery({
    queryKey: subscriptionKeys.detail(id),
    queryFn: () => getSubscriptionDetail(id),
  });
};

/*
 * 구독 삭제
 */
export const useDeleteSubscriptionMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteSubscription,
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: subscriptionKeys.listAll() });
      queryClient.removeQueries({ queryKey: subscriptionKeys.detail(id) });
    },
  });
};

/*
 * 구독 수정
 */
export const useUpdateSubscriptionMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      values,
    }: {
      id: string;
      values: TablesUpdate<"subscription">;
    }) => updateSubscription(id, values),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: subscriptionKeys.list(data.user_id),
      });
      queryClient.setQueryData(subscriptionKeys.detail(data.id), data);
    },
  });
};
