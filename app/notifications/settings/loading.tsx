import Header from "@/app/components/header";
import { Skeleton } from "@/components/ui/skeleton";
import NotificationSettingsSkeleton from "./_components/notification-settings-skeleton";

export default function Loading() {
  return (
    <main className="relative w-full min-h-screen flex flex-col items-start justify-start">
      <Header variant="back" title="알림설정" />

      <div className="w-full py-4 px-6 bg-blue-50 flex items-center justify-center">
        <Skeleton className="h-5 w-64 rounded-md" />
      </div>

      <NotificationSettingsSkeleton />
    </main>
  );
}
