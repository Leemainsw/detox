"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faArrowUp } from "@fortawesome/free-solid-svg-icons";
import { cn } from "@/app/utils/class";

type FloatingButtonProps = {
  variant: "create" | "top";
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
};

const variantMap = {
  create: {
    icon: faPlus,
    className: "btn-primary",
    ariaLabel: "추가하기",
  },
  top: {
    icon: faArrowUp,
    className: "btn-white",
    ariaLabel: "맨 위로 이동하기",
  },
} as const;

export default function FloatingButton({
  variant,
  onClick,
  disabled,
  className,
}: FloatingButtonProps) {
  const {
    icon,
    className: variantClassName,
    ariaLabel,
  } = variantMap[variant];

  const handleTopClick = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleClick = onClick ?? (variant === "top" ? handleTopClick : undefined);

  return (
    <button
      type="button"
      aria-label={ariaLabel}
      onClick={handleClick}
      disabled={disabled}
      className={cn(
        "btn btn-rounded mr-6",
        variantClassName,
        disabled ? "btn-disabled" : "",
        className ?? ""
      )}
    >
      <FontAwesomeIcon icon={icon} aria-hidden="true" />
    </button>
  );
}
