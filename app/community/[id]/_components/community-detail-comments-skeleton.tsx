"use client";

import { Skeleton } from "@/components/ui/skeleton";

export default function CommunityDetailCommentsSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-5 py-5">
      {Array.from({ length: 2 }).map((_, index) => (
        <div key={index} className="grid grid-cols-1 gap-3 rounded-lg bg-white">
          <div className="flex items-center gap-2">
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-4 w-24" />
          </div>
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-4/5" />
        </div>
      ))}
    </div>
  );
}
