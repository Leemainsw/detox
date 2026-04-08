"use client";

import { useSupabase } from "@/hooks/useSupabase";
import useRealtimeNotifications from "@/app/hooks/useRealtimeNotifications";

export default function NotificationRealtimeListener() {
  const { session } = useSupabase();
  useRealtimeNotifications(session?.user?.id);
  return null;
}
