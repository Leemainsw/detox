"use client";

import { useSupabase } from "@/hooks/useSupabase";
import { useRouter } from "next/navigation";
import { Suspense, useEffect } from "react";
import NotificationsContent from "./notifications-content";
import NotificationsSkeleton from "./notifications-skeleton";

export default function NotificationsPage() {
  const router = useRouter();
  const { session, loading } = useSupabase();
  const userId = session?.user?.id;

  useEffect(() => {
    if (!loading && !session) {
      router.replace("/login");
    }
  }, [session, loading, router]);

  if (loading || !session) {
    return <NotificationsSkeleton />;
  }

  if (!userId) {
    return <NotificationsSkeleton />;
  }

  return (
    <Suspense fallback={<NotificationsSkeleton />}>
      <NotificationsContent userId={userId} />
    </Suspense>
  );
}
