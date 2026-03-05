"use client";

import { useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";

interface Props {
  title: string;
  diffAmount: number;
  status: "over" | "under";
  isLoading?: boolean;
}

export default function ComparisonInsight({ 
  title, 
  diffAmount, 
  status, 
  isLoading = false 
}: Props) {
  const [showSkeleton] = useState(false);

  // 3초 이전에 보여주는건 기능구현에서..

  if (isLoading && showSkeleton) {
    return (
      <div className="flex flex-col items-start px-6 py-6 w-full gap-2">
        <Skeleton className="h-7 w-[150px] rounded-md bg-brand-primary/20" />
        <Skeleton className="h-5 w-[250px] rounded-md bg-brand-primary/20" />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-start px-6 py-6 w-full">
      <h3 className="text-[18px] font-bold text-black leading-tight">
        {title}
      </h3>
      <div className="flex items-center mt-1 text-[16px] text-gray-400 font-medium">
        <span>평균보다&nbsp;</span>
        <span className="font-bold text-brand-primary">
          {diffAmount.toLocaleString()}원
        </span>
        <span>&nbsp;{status === "over" ? "더 쓰고 있어요" : "아끼고 있어요"}</span>
      </div>
    </div>
  );
}