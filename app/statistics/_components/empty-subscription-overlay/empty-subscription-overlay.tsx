"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useSupabase } from "@/hooks/useSupabase";

export default function EmptySubscriptionOverlay() {
  const { session } = useSupabase();
  const isLoggedIn = Boolean(session?.user);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  return (
    <div className="absolute inset-0 z-40 flex flex-col items-center justify-center bg-white/70 backdrop-blur-xs px-6">
      <div className="text-center mb-10">
        <h2 className="text-xl font-bold text-black mb-2">
          구독 서비스를 추가하세요
        </h2>
        <p className="body-lg text-gray-500 leading-relaxed">
          추가된 구독 서비스가 없어
          <br />
          <span className="font-bold text-gray-300">
            지금은 통계를 낼 수 없어요
          </span>
        </p>
      </div>

      <div className="w-full max-w-sm">
        {isLoggedIn ? (
          <Link href="/subscription/add" className="btn btn-primary btn-lg">
            구독 추가하기
          </Link>
        ) : (
          <Link
            href="/login?redirect=/subscription/add"
            className="btn btn-primary btn-lg"
          >
            로그인하고 구독 추가하기
          </Link>
        )}
      </div>
    </div>
  );
}
