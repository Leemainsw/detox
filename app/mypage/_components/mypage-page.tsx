"use client";

import { useSupabase } from "@/hooks/useSupabase";
import { useRouter } from "next/navigation";
import { Suspense, useEffect } from "react";
import MypageContent from "./mypage-content";
import MypageSkeleton from "./mypage-skeleton";

export default function MypagePage() {
  const router = useRouter();
  const { session, loading } = useSupabase();
  const userId = session?.user?.id;

  useEffect(() => {
    if (!loading && !session) {
      router.replace("/login");
    }
  }, [session, loading, router]);

  if (loading || !session) {
    return <MypageSkeleton />;
  }

  if (!userId) {
    return <MypageSkeleton />;
  }

  return (
    <Suspense fallback={<MypageSkeleton />}>
      <MypageContent userId={userId} />
    </Suspense>
  );
}
