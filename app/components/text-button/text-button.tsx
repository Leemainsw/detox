import { cn } from "@/lib/utils";

type TextButtonSize = "sm" | "md" | "lg";

interface Props {
  size?: TextButtonSize;
  children: React.ReactNode;
  underline?: boolean;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
}
export default function TextButton({
  size = "md",
  children,
  underline = false,
  onClick,
  className,
  disabled = false,
}: Props) {
  return (
    <button
      className={cn(
        `text-button-${size}`,
        underline ? "underline" : "",
        className ?? ""
      )}
      onClick={onClick}
      type="button"
      disabled={disabled}
    >
      {children}
    </button>
  );
}
