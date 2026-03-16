"use client";

import Header from "@/app/components/header";
import { Skeleton } from "@/components/ui/skeleton";

export default function CommunityDetailLoadingScreen() {
  return (
    <>
      <Header variant="back" />
      <main>
        <section className="px-6 py-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-2">
              <Skeleton className="h-8 w-8 rounded-full" />
              <Skeleton className="h-4 w-24" />
            </div>
            <Skeleton className="h-10 w-10 rounded-full" />
          </div>

          <div className="mt-4 space-y-3">
            <Skeleton className="h-7 w-3/4" />
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-5/6" />
            <Skeleton className="h-5 w-2/3" />
          </div>
        </section>

        <section className="border-t-8 border-gray-50 px-6 py-5">
          <div className="flex gap-8">
            <Skeleton className="h-5 w-16" />
            <Skeleton className="h-5 w-16" />
          </div>
        </section>

        <section className="border-t border-gray-50 px-6 py-5">
          <Skeleton className="h-5 w-10" />

          <div className="grid grid-cols-1 gap-5 py-5">
            {Array.from({ length: 2 }).map((_, index) => (
              <div
                key={index}
                className="grid grid-cols-1 gap-3 rounded-lg bg-white"
              >
                <div className="flex items-center gap-2">
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <Skeleton className="h-4 w-24" />
                </div>
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-4/5" />
              </div>
            ))}
          </div>

          <div className="mt-4 flex items-center rounded-lg bg-gray-50 px-4 py-3">
            <Skeleton className="h-5 w-full" />
          </div>
        </section>
      </main>
    </>
  );
}
