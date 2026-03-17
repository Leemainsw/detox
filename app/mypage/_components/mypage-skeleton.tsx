import { Skeleton } from "@/components/ui/skeleton";
import BottomNav from "../../components/bottom-nav";
import Header from "../../components/header";

export default function MypageSkeleton() {
  return (
    <main className="w-full min-h-screen flex flex-col items-center relative">
      <Header variant="text" leftText="내 정보" />

      <div className="w-full flex flex-col px-6 mt-18 gap-18">
        <div className="flex flex-col gap-4 items-center">
          <div className="relative w-fit">
            <Skeleton className="h-[100px] w-[100px] rounded-full" />
            <Skeleton className="absolute bottom-0 right-[-10px] h-11 w-11 rounded-full" />
          </div>
          <div className="flex flex-col gap-1 items-center">
            <Skeleton className="h-6 w-24 rounded-md" />
            <Skeleton className="h-4 w-32 rounded-md" />
          </div>
        </div>

        <div className="flex flex-col gap-4 items-center">
          <div className="w-full flex flex-col gap-2">
            <Skeleton className="h-5 w-16 rounded-md" />
            <Skeleton className="h-12.5 w-full rounded-lg" />
          </div>
          <Skeleton className="h-14 w-full rounded-lg" />
        </div>
      </div>

      <BottomNav />
    </main>
  );
}
