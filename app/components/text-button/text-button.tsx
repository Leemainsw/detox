import { cn } from "@/lib/utils";

type TextButtonSize = "sm" | "md" | "lg";

interface Props {
  size?: TextButtonSize;
  children: React.ReactNode;
  underline?: boolean;
  onClick?: () => void;
  className?: string;
}
export default function TextButton({
  size = "md",
  children,
  underline = false,
  onClick,
  className,
}: Props) {
  return (
    <button
      className={cn(
        `text-button-${size}`,
        underline ? "underline" : "",
        className ?? ""
      )}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
