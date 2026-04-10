import {
  deleteAllNotifications,
  deleteNotification,
  getNotifications,
  getPastNotifications,
  getTodayNotifications,
  hasUnreadNotifications,
  readNotification,
} from "@/services/notification";
import {
  useMutation,
  useQuery,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";

/** 뮤테이션·실시간(INSERT) invalidate로 갱신. 재진입 시 불필요한 refetch 방지 */
export const NOTIFICATION_QUERIES_STALE_TIME_MS = Infinity;

export const NOTIFICATION_QUERIES_GC_TIME_MS = 1000 * 60 * 30;

export const notificationsKeys = {
  all: ["notifications"] as const,
  list: (userId: string) => [...notificationsKeys.all, userId] as const,
  today: (userId: string) =>
    [...notificationsKeys.all, userId, "today"] as const,
  past: (userId: string) => [...notificationsKeys.all, userId, "past"] as const,
  hasUnreadNotifications: (userId: string) =>
    [...notificationsKeys.all, userId, "hasUnreadNotifications"] as const,
};

export function useNotifications(userId: string) {
  return useQuery({
    queryKey: notificationsKeys.list(userId),
    queryFn: () => getNotifications(userId),
    enabled: !!userId,
    staleTime: NOTIFICATION_QUERIES_STALE_TIME_MS,
    gcTime: NOTIFICATION_QUERIES_GC_TIME_MS,
  });
}

export function useNotificationsSuspenseQuery(userId: string) {
  return useSuspenseQuery({
    queryKey: notificationsKeys.list(userId),
    queryFn: () => getNotifications(userId),
    staleTime: NOTIFICATION_QUERIES_STALE_TIME_MS,
    gcTime: NOTIFICATION_QUERIES_GC_TIME_MS,
  });
}

export function useTodayNotificationsSuspenseQuery(userId: string) {
  return useSuspenseQuery({
    queryKey: notificationsKeys.today(userId),
    queryFn: () => getTodayNotifications(userId),
    staleTime: NOTIFICATION_QUERIES_STALE_TIME_MS,
    gcTime: NOTIFICATION_QUERIES_GC_TIME_MS,
  });
}

export function usePastNotificationsSuspenseQuery(userId: string) {
  return useSuspenseQuery({
    queryKey: notificationsKeys.past(userId),
    queryFn: () => getPastNotifications(userId),
    staleTime: NOTIFICATION_QUERIES_STALE_TIME_MS,
    gcTime: NOTIFICATION_QUERIES_GC_TIME_MS,
  });
}

export function useDeleteNotificationMutation(userId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteNotification,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: notificationsKeys.list(userId),
      });
      queryClient.invalidateQueries({
        queryKey: notificationsKeys.today(userId),
      });
      queryClient.invalidateQueries({
        queryKey: notificationsKeys.past(userId),
      });
    },
  });
}

export function useDeleteAllNotificationsMutation(userId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => deleteAllNotifications(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: notificationsKeys.list(userId),
      });
      queryClient.invalidateQueries({
        queryKey: notificationsKeys.today(userId),
      });
      queryClient.invalidateQueries({
        queryKey: notificationsKeys.past(userId),
      });
    },
  });
}

export function useReadNotificationMutation(userId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: readNotification,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: notificationsKeys.list(userId),
      });
      queryClient.invalidateQueries({
        queryKey: notificationsKeys.today(userId),
      });
      queryClient.invalidateQueries({
        queryKey: notificationsKeys.past(userId),
      });
      queryClient.invalidateQueries({
        queryKey: notificationsKeys.hasUnreadNotifications(userId),
      });
    },
  });
}

export function useHasUnreadNotificationsQuery(userId: string) {
  return useQuery({
    queryKey: notificationsKeys.hasUnreadNotifications(userId),
    queryFn: () => hasUnreadNotifications(userId),
    enabled: !!userId && userId.length > 0,
    staleTime: NOTIFICATION_QUERIES_STALE_TIME_MS,
    gcTime: NOTIFICATION_QUERIES_GC_TIME_MS,
  });
}
