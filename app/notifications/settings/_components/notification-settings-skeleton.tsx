import BottomCTA from "@/app/components/bottom-cta";
import { Skeleton } from "@/components/ui/skeleton";

export default function NotificationSettingsSkeleton() {
  return (
    <>
      <div className="w-full px-6 flex flex-col">
        {[1, 2].map((i) => (
          <div
            key={i}
            className="w-full flex items-center justify-between py-4"
          >
            <div className="flex flex-col gap-2">
              <Skeleton className="h-5 w-24 rounded-md bg-brand-primary/20" />
              <Skeleton className="h-4 w-48 rounded-md bg-brand-primary/20" />
            </div>
            <Skeleton className="h-6 w-11 rounded-full shrink-0  bg-brand-primary/20" />
          </div>
        ))}
      </div>

      <BottomCTA>
        <Skeleton className="h-14 w-full rounded-lg  bg-brand-primary/20" />
      </BottomCTA>
    </>
  );
}
