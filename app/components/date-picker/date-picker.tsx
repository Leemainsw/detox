"use client";

import * as React from "react";
import { format, isValid, parse } from "date-fns";
import { ko } from "date-fns/locale";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendar } from "@fortawesome/free-solid-svg-icons/faCalendar";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/app/utils/class";

const DIGITS_FORMAT = "yyyyMMdd";

/** 숫자만 최대 8자리(yyyyMMdd) → yyyy-MM-dd 표시 */
function formatDigitsAsDisplay(digits: string): string {
  const d = digits.replace(/\D/g, "").slice(0, 8);
  if (d.length <= 4) return d;
  if (d.length <= 6) return `${d.slice(0, 4)}-${d.slice(4)}`;
  return `${d.slice(0, 4)}-${d.slice(4, 6)}-${d.slice(6)}`;
}

interface DatePickerProps {
  label?: string;
  /** 캘린더 미선택 시 입력 필드 placeholder */
  placeholder?: string;
  value?: Date;
  onChange?: (date: Date | undefined) => void;
  disabled?: boolean;
  className?: string;
}

export default function DatePicker({
  label,
  placeholder = "20001231",
  value,
  onChange,
  disabled,
  className,
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false);
  /** yyyyMMdd 숫자만, 최대 8자리 */
  const [dateDigits, setDateDigits] = React.useState(() =>
    value && isValid(value) ? format(value, DIGITS_FORMAT) : ""
  );
  const inputId = React.useId();
  const displayValue = formatDigitsAsDisplay(dateDigits);

  React.useEffect(() => {
    setDateDigits(value && isValid(value) ? format(value, DIGITS_FORMAT) : "");
  }, [value]);

  const commitInput = () => {
    if (!dateDigits) {
      onChange?.(undefined);
      setDateDigits("");
      return;
    }
    if (dateDigits.length !== 8) {
      setDateDigits(
        value && isValid(value) ? format(value, DIGITS_FORMAT) : ""
      );
      return;
    }
    const parsed = parse(dateDigits, DIGITS_FORMAT, new Date());
    if (isValid(parsed)) {
      onChange?.(parsed);
      setDateDigits(format(parsed, DIGITS_FORMAT));
    } else {
      setDateDigits(
        value && isValid(value) ? format(value, DIGITS_FORMAT) : ""
      );
    }
  };

  return (
    <div className={cn("w-full flex flex-col gap-2", className ?? "")}>
      {label && (
        <label
          htmlFor={inputId}
          className="text-base font-semibold text-gray-400"
        >
          {label}
        </label>
      )}
      <div
        className={cn(
          "flex items-stretch gap-1 rounded-lg bg-gray-50 min-h-[46px]",
          "focus-within:ring-2 focus-within:ring-brand-primary/40",
          "hover:bg-gray-100/80 transition-colors",
          disabled ? "opacity-50 pointer-events-none" : ""
        )}
      >
        <input
          id={inputId}
          type="text"
          inputMode="numeric"
          pattern="[0-9\-]*"
          autoComplete="off"
          spellCheck={false}
          disabled={disabled}
          placeholder={placeholder}
          value={displayValue}
          onChange={(e) => {
            setDateDigits(e.target.value.replace(/\D/g, "").slice(0, 8));
          }}
          onBlur={commitInput}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              (e.target as HTMLInputElement).blur();
            }
          }}
          aria-label={label ? undefined : "날짜"}
          title="숫자 8자리(yyyyMMdd)·자동으로 yyyy-MM-dd로 표시. 오른쪽에서 선택 가능"
          className={cn(
            "flex-1 min-w-0 bg-transparent px-6 py-3 text-base text-gray-400 outline-none",
            "placeholder:text-gray-300",
            displayValue ? "" : "text-gray-300"
          )}
        />
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <button
              type="button"
              disabled={disabled}
              aria-label="캘린더로 날짜 선택"
              className={cn(
                "shrink-0 px-4 flex items-center justify-center rounded-r-lg",
                "text-gray-300 hover:text-gray-400 outline-none focus-visible:ring-2 focus-visible:ring-brand-primary/40"
              )}
            >
              <FontAwesomeIcon icon={faCalendar} className="h-5 w-5" />
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="end">
            <Calendar
              mode="single"
              selected={value}
              onSelect={(date) => {
                onChange?.(date);
                if (date && isValid(date)) {
                  setDateDigits(format(date, DIGITS_FORMAT));
                }
                setOpen(false);
              }}
              defaultMonth={value}
              locale={ko}
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
