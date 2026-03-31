"use client";

function digitsOnly(s: string): string {
  return s.replace(/\D/g, "");
}

/** 정수 금액 천 단위 콤마 (ko-KR) */
function formatCurrencyDisplay(digits: string): string {
  if (!digits) return "";
  const n = Number(digits);
  if (Number.isNaN(n)) return "";
  return n.toLocaleString("ko-KR");
}

interface InputProps {
  label?: string;
  placeholder?: string;
  prefix?: string | React.ReactNode;
  suffix?: string | React.ReactNode;
  /** true면 숫자만 입력·표시에 천 단위 콤마, onChange에는 콤마 없는 숫자 문자열 */
  isCurrency?: boolean;
}

export default function Input({
  label,
  placeholder,
  prefix,
  suffix,
  type = "text",
  isCurrency = false,
  onKeyDown: externalOnKeyDown,
  onChange,
  value,
  ...props
}: InputProps & React.InputHTMLAttributes<HTMLInputElement>) {
  const inputType = isCurrency ? "text" : type;
  const inputMode = isCurrency || type === "number" ? "numeric" : undefined;

  const currencyDisplay =
    value === undefined || value === null
      ? ""
      : formatCurrencyDisplay(digitsOnly(String(value)));

  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (type === "number" || isCurrency) {
      if (
        event.key === "e" ||
        event.key === "E" ||
        event.key === "+" ||
        event.key === "-"
      ) {
        event.preventDefault();
      }
    }
    if (isCurrency && (event.key === "." || event.key === ",")) {
      event.preventDefault();
    }
    externalOnKeyDown?.(event);
  };

  const handleCurrencyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!onChange) return;
    const raw = digitsOnly(e.target.value);
    const out = raw === "" ? "" : String(Number(raw));
    const target = e.target;
    const synthetic = {
      ...e,
      target: { ...target, value: out },
      currentTarget: { ...target, value: out },
    } as React.ChangeEvent<HTMLInputElement>;
    onChange(synthetic);
  };

  return (
    <div className="w-full flex flex-col gap-2">
      {label && (
        <label className="text-base font-semibold text-gray-400">{label}</label>
      )}
      <div className="flex min-h-12.5 justify-between items-center gap-2 rounded-lg bg-gray-50 px-6 py-3">
        <div className="flex items-center gap-2 w-full">
          {prefix && (
            <span className="body-md font-bold text-brand-primary whitespace-nowrap">
              {prefix}
            </span>
          )}
          <input
            className="w-full outline-0 text-base text-gray-400 placeholder:text-gray-300"
            placeholder={placeholder}
            type={inputType}
            inputMode={inputMode}
            onKeyDown={onKeyDown}
            {...props}
            value={isCurrency ? currencyDisplay : value}
            onChange={isCurrency ? handleCurrencyChange : onChange}
          />
        </div>
        {suffix && (
          <span className="body-md font-bold text-gray-400 whitespace-nowrap">
            {suffix}
          </span>
        )}
      </div>
    </div>
  );
}
