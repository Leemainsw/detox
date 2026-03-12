import { supabase } from "@/lib/supabase";
import { Tables } from "@/types/supabase.types";

/**
 * 유저의 알림설정을 조회합니다.
 */
export const getNotificationSettings = async (
  userId: string
): Promise<Tables<"notification_settings">> => {
  const { data, error } = await supabase
    .from("notification_settings")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (error) {
    throw error;
  }

  return data;
};

/**
 * 유저의 알림설정을 업데이트합니다.
 * @param userId - 유저 ID
 * @param isCommunityAlertEnabled - 커뮤니티 알림 활성화 여부
 * @param isSubscriptionAlertEnabled - 구독일 알림 활성화 여부
 * @returns - 알림설정
 */
export const upsertNotificationSettings = async (
  userId: string,
  isCommunityAlertEnabled: boolean,
  isSubscriptionAlertEnabled: boolean
) => {
  if (userId == "") {
    throw new Error("User ID is required");
  }

  const { data, error } = await supabase
    .from("notification_settings")
    .upsert(
      {
        user_id: userId,
        is_community_alert_enabled: isCommunityAlertEnabled,
        is_subscription_alert_enabled: isSubscriptionAlertEnabled,
      },
      { onConflict: "user_id" }
    )
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
};
