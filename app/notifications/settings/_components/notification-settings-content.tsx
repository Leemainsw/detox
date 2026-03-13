"use client";

import { useNotificationSettingsSuspense } from "@/query/notification-settings";
import NotificationSettingsForm from "./notification-settings-form";

interface Props {
  userId: string;
}

export default function NotificationSettingsContent({ userId }: Props) {
  const { data: notificationSettings } = useNotificationSettingsSuspense(userId);

  return (
    <NotificationSettingsForm
      key={notificationSettings.id}
      notificationSettings={notificationSettings}
    />
  );
}
