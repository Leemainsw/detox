"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import FeedbackState from "@/app/components/feedback-state";
import Header from "@/app/components/header";
import BottomNav from "@/app/components/bottom-nav";
import FloatingButton from "@/app/components/floating-button";
import Button from "@/app/components/button";
import BrandTabs from "./brand-tabs";
import CommunityList from "./community-list";
import CommunityPostListSkeleton from "./community-post-list-skeleton";
import type { CommunityListPage, CommunityServiceFilter } from "../_types";
import { useInfiniteCommunityListQuery } from "@/query/community";

interface CommunityListPageClientProps {
  initialService: CommunityServiceFilter;
  initialPage: CommunityListPage;
}

export default function CommunityListPageClient({
  initialService,
  initialPage,
}: CommunityListPageClientProps) {
  const router = useRouter();
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  const queryService = initialService === "all" ? undefined : initialService;
  const {
    data,
    isPending,
    isError,
    isSuccess,
    refetch,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useInfiniteCommunityListQuery(queryService, initialPage);

  const items = data?.pages.flatMap((page) => page.items) ?? [];

  const handleChangeService = (nextService: CommunityServiceFilter) => {
    const nextUrl =
      nextService === "all"
        ? "/community"
        : `/community?service=${nextService}`;

    router.replace(nextUrl);
  };

  useEffect(() => {
    const node = loadMoreRef.current;
    if (!node) {
      return;
    }

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
    <CommunityPostListSkeleton count={4} className="pt-6" />
  );

  const renderFetchMoreLoading = () => (
    <CommunityPostListSkeleton
      count={2}
      className="pt-5"
      descriptionLineCount={1}
    />
  );

  const renderError = () => (
    <FeedbackState
      description="게시글을 불러오지 못했어요."
      className="px-6 py-12"
      bottomCTA
      ctaClassName="bg-gray-100"
      hasBottomNav
      imageSrc="/images/emoji/error.png"
      contentClassName="gap-0"
      descriptionClassName="body-md font-normal text-gray-400"
    >
      <Button
        variant="secondary"
        size="md"
        className="w-full"
        onClick={() => refetch()}
      >
        다시 시도
      </Button>
    </FeedbackState>
  );

  const renderEmpty = () => (
    <FeedbackState
      description={
        initialService === "all"
          ? "아직 등록된 게시글이 없어요."
          : "선택한 서비스의 게시글이 아직 없어요."
      }
      className="gap-5 px-6 py-12"
      imageSrc="/images/emoji/no-alarm.png"
      contentClassName="gap-0"
      descriptionClassName="body-md font-normal text-gray-400"
    />
  );

  return (
    <div className="bg-gray-100 pb-15 min-h-screen">
      <Header variant="text" leftText="커뮤니티" rightContent="알람" />

      <main>
        <BrandTabs value={initialService} onChange={handleChangeService} />

        <section className="px-6">
          {isPending && renderLoading()}
          {isError && renderError()}
          {isSuccess && items.length === 0 && renderEmpty()}
          {isSuccess && items.length > 0 && (
            <>
              <CommunityList items={items} />
              {isFetchingNextPage && renderFetchMoreLoading()}
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
