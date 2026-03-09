"use client";

import * as React from "react";
import { Textarea as ShadcnTextarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface Props extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  maxLength?: number;
}

export default function TextArea({
  className,
  maxLength = 2000,
  value,
  onChange,
  label,
  placeholder,
  ...props
}: Props) {
  const [internalValue, setInternalValue] = React.useState("");
  const resolvedValue = typeof value === "string" ? value : internalValue;
  const currentLength = resolvedValue.length;
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (value === undefined) setInternalValue(e.target.value);
    onChange?.(e);
  };

  return (
    <div className="relative w-full flex flex-col gap-2">
      {label && (
        <label className="text-base font-semibold text-gray-400">{label}</label>
      )}
      <ShadcnTextarea
        className={cn(
          "min-h-[200px] w-full resize-none rounded-2xl bg-gray-50 p-4 pb-10 border-none placeholder:text-gray-300 focus-visible:ring-0 shadow-none",
          className
        )}
        maxLength={maxLength}
        value={resolvedValue}
        onChange={handleChange}
        placeholder={placeholder}
        {...props}
      />

      <div className="absolute bottom-4 right-4 label-lg text-gray-300 label-lg">
        <span className={currentLength > 0 ? "text-gray-300" : ""}>
          {currentLength}
        </span>
        <span>/{maxLength}</span>
      </div>
    </div>
  );
}
