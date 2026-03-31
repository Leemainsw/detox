"use client";

import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { notificationsKeys } from "@/query/notification";
import type { Tables } from "@/types/supabase.types";
import { useToast } from "@/app/hooks/useToast";

export type UseRealtimeNotificationsOptions = {
  /** 새 알림 INSERT 시 토스트 표시 (기본 true) */
  toastOnInsert?: boolean;
};

/**
 * @description `notification` 테이블 INSERT를 실시간 구독하고, 목록·안읽음 배지 쿼리를 갱신합니다.
 * @param userId 로그인 유저 ID 없으면 구독하지 않음
 */
export default function useRealtimeNotifications(
  userId: string | null | undefined,
  options: UseRealtimeNotificationsOptions = {}
) {
  const { toastOnInsert = true } = options;
  const queryClient = useQueryClient();
  const { info } = useToast();

  useEffect(() => {
    if (!userId?.trim()) return;

    const channel = supabase
      .channel(`notification-realtime:${userId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notification",
          filter: `user_id=eq.${userId}`,
        },
        async (payload) => {
          console.log("payload", payload);
          const row = payload.new as Tables<"notification">;
          await queryClient.invalidateQueries({
            queryKey: notificationsKeys.all,
          });
          if (toastOnInsert) {
            const text = [row.title, row.message].filter(Boolean).join(" · ");
            if (text) info(text);
          }
        }
      )
      .subscribe((status) => {
        if (status === "CHANNEL_ERROR") {
          console.warn(
            "[Realtime] notification 채널 오류 — Publications에 notification 테이블이 포함됐는지 확인하세요."
          );
        }
      });

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [userId, queryClient, info, toastOnInsert]);
}
