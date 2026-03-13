"use client";

import BottomCTA from "@/app/components/bottom-cta";
import Button from "@/app/components/button";
import Switch from "@/app/components/switch";
import { useToast } from "@/app/hooks/useToast";
import { useUpdateNotificationSettings } from "@/query/notification-settings";
import { useState } from "react";
import type { Tables } from "@/types/supabase.types";

interface Props {
  notificationSettings: Tables<"notification_settings">;
}

export default function NotificationSettingsForm({
  notificationSettings,
}: Props) {
  const [isCommunityAlertEnabled, setIsCommunityAlertEnabled] =
    useState<boolean>(notificationSettings.is_community_alert_enabled);
  const [isSubscriptionAlertEnabled, setIsSubscriptionAlertEnabled] =
    useState<boolean>(notificationSettings.is_subscription_alert_enabled);

  const {
    mutateAsync: updateNotificationSettings,
    isPending: isUpdatingNotificationSettings,
  } = useUpdateNotificationSettings();
  const { success, error: errorToast } = useToast();

  const handleUpdateNotificationSettings = async () => {
    try {
      await updateNotificationSettings({
        isCommunityAlertEnabled,
        isSubscriptionAlertEnabled,
      });
      success("알림설정이 저장되었습니다.");
    } catch (error) {
      errorToast("알림설정 저장에 실패했습니다.");
      console.error(error);
    }
  };

  return (
    <>
      <div className="w-full px-6 flex flex-col">
        <div className="w-full flex items-center justify-between py-4">
          <div className="flex flex-col items-start justify-center gap-1">
            <span className="title-md font-bold text-gray-400">
              커뮤니티 알람
            </span>
            <span className="body-lg font-normal text-gray-300">
              새로운 댓글이나 게시글 알림을 받습니다
            </span>
          </div>
          <Switch
            checked={isCommunityAlertEnabled}
            onCheckedChange={setIsCommunityAlertEnabled}
          />
        </div>

        <div className="w-full flex items-center justify-between py-4">
          <div className="flex flex-col items-start justify-center gap-1">
            <span className="title-md font-bold text-gray-400">
              구독일 알람
            </span>
            <span className="body-lg font-normal text-gray-300">
              결제일 관련 알림을 받습니다
            </span>
          </div>
          <Switch
            checked={isSubscriptionAlertEnabled}
            onCheckedChange={setIsSubscriptionAlertEnabled}
          />
        </div>
      </div>

      <BottomCTA>
        <Button
          variant="primary"
          size="lg"
          onClick={handleUpdateNotificationSettings}
          loading={isUpdatingNotificationSettings}
        >
          저장하기
        </Button>
      </BottomCTA>
    </>
  );
}
