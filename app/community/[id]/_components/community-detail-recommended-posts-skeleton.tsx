"use client";

import { Skeleton } from "@/components/ui/skeleton";
import CommunityPostListSkeleton from "../../_components/community-post-list-skeleton";

export default function CommunityDetailRecommendedPostsSkeleton() {
  return (
    <section className="bg-gray-50 px-6 py-6">
      <Skeleton className="h-6 w-52" />
      <CommunityPostListSkeleton count={3} className="pt-6" />
    </section>
  );
}
