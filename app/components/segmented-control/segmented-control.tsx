"use client";

import * as ToggleGroup from "@radix-ui/react-toggle-group";
import { cn } from "@/lib/utils";

export interface SegmentedControlOption {
  label: string;
  value: string;
}

interface Props {
  options: SegmentedControlOption[];
  value: string;
  onValueChange: (value: string) => void;
  className?: string;
  disabled?: boolean;
}

export default function SegmentedControl({
  options,
  value,
  onValueChange,
  className,
  disabled = false,
}: Props) {
  return (
    <ToggleGroup.Root
      type="single"
      value={value || undefined}
      onValueChange={(v) => v && onValueChange(v)}
      disabled={disabled}
      className={cn(
        "inline-flex rounded-xl bg-gray-50 p-1 gap-1",
        disabled && "opacity-50 cursor-not-allowed",
        className ?? ""
      )}
      aria-label="선택"
    >
      {options.map((option) => (
        <ToggleGroup.Item
          key={option.value}
          value={option.value}
          className={cn(
            "w-full px-6 py-2 body-md rounded-lg transition-all duration-200",
            "data-[state=on]:bg-white data-[state=on]:text-gray-400 data-[state=on]:font-bold data-[state=on]:shadow-sm",
            "data-[state=off]:bg-transparent data-[state=off]:text-gray-300 data-[state=off]:font-medium",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-300 focus-visible:ring-offset-1"
          )}
          aria-label={option.label}
        >
          {option.label}
        </ToggleGroup.Item>
      ))}
    </ToggleGroup.Root>
  );
}
