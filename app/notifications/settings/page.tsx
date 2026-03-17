"use client";

import Header from "@/app/components/header";
import { useSupabase } from "@/hooks/useSupabase";
import { useRouter } from "next/navigation";
import { Suspense } from "react";
import NotificationSettingsContent from "./_components/notification-settings-content";
import NotificationSettingsSkeleton from "./_components/notification-settings-skeleton";

export default function Page() {
  const router = useRouter();
  const { session, loading } = useSupabase();
  const userId = session?.user.id;

  return (
    <main className="relative w-full min-h-screen flex flex-col items-start justify-start">
      <Header variant="back" onBack={() => router.back()} title="알림설정" />

      <div className="w-full py-4 px-6 bg-blue-50 flex items-center justify-center">
        <span className="body-md font-normal text-brand-primary">
          알림을 끄더라도 중요한 공지 등은 계속 전송될 수 있습니다.
        </span>
      </div>

      {userId && !loading ? (
        <Suspense fallback={<NotificationSettingsSkeleton />}>
          <NotificationSettingsContent userId={userId} />
        </Suspense>
      ) : (
        <NotificationSettingsSkeleton />
      )}
    </main>
  );
}
