"use client";

import { useState } from "react";

import BrandBox from "@/app/components/brand-box";
import { subscriptableBrand } from "@/app/utils/brand/brand";
import { SubscriptableBrandType } from "@/app/utils/brand/type";
import { cn } from "@/lib/utils";

export default function BrandTabs() {
  const brandTabs = Object.entries(subscriptableBrand);
  const [activeKey, setActiveKey] = useState<string>(brandTabs[0]?.[0] ?? "");

  return (
    <div
      className="tab-wrap ml-6 flex gap-2 overflow-x-auto pt-6 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
      onWheel={(event) => {
        event.currentTarget.scrollLeft += event.deltaY;
      }}
    >
      {brandTabs.map(([key, brand]) => (
        <button
          key={key}
          type="button"
          aria-pressed={activeKey === key}
          onClick={() => setActiveKey(key)}
          className={cn(
            "flex min-w-fit max-w-12 flex-col items-center gap-2 transition-opacity",
            activeKey === key ? "opacity-100" : "opacity-60"
          )}
        >
          <BrandBox
            brandType={key as SubscriptableBrandType}
            size="sm"
            isActive={activeKey === key}
          />
          <span
            className={cn(
              "max-w-12 text-center text-sm leading-[110%] whitespace-normal break-keep",
              activeKey === key ? "font-semibold text-black" : "text-black"
            )}
          >
            {brand.label}
          </span>
        </button>
      ))}
    </div>
  );
}
