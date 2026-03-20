"use client";

import { useEffect } from "react";

/**
 * Supabase Auth의 navigator.locks.request() 사용 시 발생하는 AbortError 억제.
 * "Lock broken by another request with the 'steal' option" - 탭 전환/다중 탭 등에서
 * lock 충돌 시 발생. steal 요청이 성공적으로 완료되므로 해당 AbortError는 무시해도 됨.
 * @see https://github.com/supabase/supabase/issues/43565
 */
export default function SupabaseLockErrorHandler() {
  useEffect(() => {
    const handler = (event: PromiseRejectionEvent) => {
      const err = event.reason;
      const msg = err?.message ?? "";
      if (
        err?.name === "AbortError" &&
        (String(msg).includes("Lock broken") || String(msg).includes("steal"))
      ) {
        event.preventDefault();
      }
    };

    window.addEventListener("unhandledrejection", handler);
    return () => window.removeEventListener("unhandledrejection", handler);
  }, []);

  return null;
}
