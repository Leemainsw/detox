import {
  getNotificationSettings,
  upsertNotificationSettings,
} from "@/services/notification-settings";
import {
  useMutation,
  useQuery,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { useSupabase } from "@/hooks/useSupabase";
import { Tables } from "@/types/supabase.types";

export const notificationSettingsKeys = {
  all: ["notification-settings"] as const,
  settings: (userId: string) =>
    [...notificationSettingsKeys.all, "settings", userId] as const,
};

/**
 * 유저의 알림설정을 조회합니다.
 */
export function useNotificationSettings() {
  const { session } = useSupabase();
  const userId = session?.user.id;

  return useQuery({
    queryKey: notificationSettingsKeys.settings(userId ?? ""),
    queryFn: () => getNotificationSettings(userId ?? ""),
    enabled: !!userId && typeof userId === "string",
  });
}

/**
 * 유저의 알림설정을 조회합니다. (Suspense용)
 */
export function useNotificationSettingsSuspense(userId: string) {
  return useSuspenseQuery({
    queryKey: notificationSettingsKeys.settings(userId),
    queryFn: () => getNotificationSettings(userId),
  });
}

/**
 * 유저의 알림설정을 업데이트합니다.
 */

interface UpdateNotificationSettingsParams {
  isCommunityAlertEnabled: boolean;
  isSubscriptionAlertEnabled: boolean;
}
export function useUpdateNotificationSettings() {
  const { session } = useSupabase();
  const userId = session?.user.id;

  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: UpdateNotificationSettingsParams) =>
      upsertNotificationSettings(
        userId ?? "",
        params.isCommunityAlertEnabled,
        params.isSubscriptionAlertEnabled
      ),
    onSuccess: (data: Tables<"notification_settings">) => {
      queryClient.setQueryData(
        notificationSettingsKeys.settings(userId ?? ""),
        data
      );
    },
  });
}
