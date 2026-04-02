"use client";

import { cn } from "@/app/utils/class";
import useEmblaCarousel from "embla-carousel-react";
import { useEffect } from "react";

export interface FilterChipOption {
  label: string;
  value: string;
}

interface Props {
  options: FilterChipOption[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export default function FilterChips({
  options,
  value,
  onChange,
  className,
}: Props) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    dragFree: true,
  });

  useEffect(() => {
    if (!emblaApi) {
      return;
    }

    const chipValues = ["all", ...options.map((tab) => tab.value)];
    const activeIndex = chipValues.findIndex(
      (chipValue) => chipValue === value
    );

    if (activeIndex >= 0) {
      emblaApi.scrollTo(activeIndex);
    }
  }, [options, emblaApi, value]);

  return (
    <div
      className={cn("pb-1 ", className ?? "")}
      role="group"
      aria-label="필터 선택"
    >
      <div
        ref={emblaRef}
        className="overflow-hidden [touch-action:pan-y_pinch-zoom] cursor-grab"
      >
        <div className="tab-wrap ml-6 mr-6 flex gap-2 transition-transform">
          <button
            type="button"
            aria-pressed={value === "all"}
            onClick={() => onChange("all")}
            className={cn(
              "shrink-0 rounded-xl px-3 py-2 body-lg transition-colors cursor-pointer",
              value === "all"
                ? "bg-brand-primary text-white font-bold"
                : "bg-white text-gray-300 border border-gray-100"
            )}
          >
            전체
          </button>
          {options.map((option) => {
            const isSelected = value === option.value;
            return (
              <button
                key={option.value}
                type="button"
                aria-pressed={isSelected}
                onClick={() => onChange(option.value)}
                className={cn(
                  "shrink-0 rounded-xl px-3 py-2 body-lg transition-colors cursor-pointer",
                  isSelected
                    ? "bg-brand-primary text-white font-bold"
                    : "bg-white text-gray-300 border border-gray-100"
                )}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
