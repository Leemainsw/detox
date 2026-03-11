"use client";

import { useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Header from "../components/header";
import BottomNav from "../components/bottom-nav";
import BrandTabs from "./_components/brand-tabs";
import CommunityList from "./_components/community-list";
import Button from "@/app/components/button";
import { Skeleton } from "@/components/ui/skeleton";
import { subscriptableBrand } from "@/app/utils/brand/brand";
import type { CommunityServiceFilter } from "./_types";
import { useInfiniteCommunityListQuery } from "@/query/community";
import FloatingButton from "../components/floating-button";

export default function CommunityListPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  const serviceParam = searchParams.get("service");

  const selectedService: CommunityServiceFilter =
    serviceParam && serviceParam in subscriptableBrand
      ? (serviceParam as CommunityServiceFilter)
      : "all";

  const queryService = selectedService === "all" ? undefined : selectedService;

  const communityListQuery = useInfiniteCommunityListQuery(queryService);

  const items =
    communityListQuery.data?.pages.flatMap((page) => page.items) ?? [];

  const handleChangeService = (nextService: CommunityServiceFilter) => {
    const params = new URLSearchParams(searchParams.toString());

    if (nextService === "all") {
      params.delete("service");
    } else {
      params.set("service", nextService);
    }

    const nextUrl = params.toString()
      ? `/community?${params.toString()}`
      : "/community";

    router.replace(nextUrl);
  };

  const { hasNextPage, isFetchingNextPage, fetchNextPage } = communityListQuery;
  useEffect(() => {
    const node = loadMoreRef.current;
    if (!node) return;

    const observer = new IntersectionObserver((entries) => {
      const entry = entries[0];

      if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    });

    observer.observe(node);

    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const renderLoading = () => (
    <div className="grid grid-cols-1 gap-5 pt-6">
      {Array.from({ length: 4 }).map((_, index) => (
        <div
          key={index}
          className="grid grid-cols-1 gap-3 rounded-lg bg-white px-6 py-4"
        >
          <div className="flex items-center gap-2">
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-4 w-24" />
          </div>
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      ))}
    </div>
  );

  const renderFetchMoreLoading = () => (
    <div className="grid grid-cols-1 gap-5 pt-5">
      {Array.from({ length: 2 }).map((_, index) => (
        <div
          key={index}
          className="grid grid-cols-1 gap-3 rounded-lg bg-white px-6 py-4"
        >
          <div className="flex items-center gap-2">
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-4 w-24" />
          </div>
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-full" />
        </div>
      ))}
    </div>
  );

  const renderError = () => (
    <div className="flex flex-col items-center gap-4 px-6 py-12 text-center">
      <p className="body-md text-gray-400">게시글을 불러오지 못했어요.</p>
      <Button
        variant="secondary"
        size="md"
        onClick={() => communityListQuery.refetch()}
      >
        다시 시도
      </Button>
    </div>
  );

  const renderEmpty = () => (
    <div className="flex flex-col items-center px-6 py-12 text-center">
      <p className="body-md text-gray-400">
        {selectedService === "all"
          ? "아직 등록된 게시글이 없어요."
          : "선택한 서비스의 게시글이 아직 없어요."}
      </p>
    </div>
  );

  return (
    <div className="bg-gray-100 pb-15 min-h-screen">
      <Header variant="text" leftText="커뮤니티" rightContent="알람" />

      <main>
        <BrandTabs value={selectedService} onChange={handleChangeService} />

        <section className="px-6">
          {communityListQuery.isPending && renderLoading()}
          {communityListQuery.isError && renderError()}
          {communityListQuery.isSuccess && items.length === 0 && renderEmpty()}
          {communityListQuery.isSuccess && items.length > 0 && (
            <>
              <CommunityList items={items} />
              {communityListQuery.isFetchingNextPage &&
                renderFetchMoreLoading()}
              <div ref={loadMoreRef} className="h-10" />
            </>
          )}
        </section>

        <div className="fixed right-0 bottom-24 z-10">
          <FloatingButton variant="create" />
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
