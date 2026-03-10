"use client";

import { cn } from "@/lib/utils";

export const BOTTOM_CTA_HEIGHT = 88; // py-4(32px) + 버튼 h-14(56px)

interface Props {
  children: React.ReactNode;
  className?: string;
  hasBottomNav?: boolean;
}

export default function BottomCTA({
  children,
  className,
  hasBottomNav = false,
}: Props) {
  return (
    <>
      <div style={{ height: BOTTOM_CTA_HEIGHT }} aria-hidden />
      <div
        className={cn(
          "fixed bottom-0 left-0 right-0 bg-white px-6 py-4",
          hasBottomNav ? "pb-[calc(1rem+60px)]" : "",
          className ?? ""
        )}
      >
        {children}
      </div>
    </>
  );
}
