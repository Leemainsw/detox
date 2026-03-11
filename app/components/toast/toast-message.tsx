import type { IconProp } from "@fortawesome/fontawesome-svg-core";
import {
  faCircleCheck,
  faCircleExclamation,
  faCircleInfo,
  faTriangleExclamation,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export type ToastMessageVariant = "success" | "error" | "info" | "warning";

interface ToastMessageProps {
  icon?: IconProp;
  variant?: ToastMessageVariant;
  children: React.ReactNode;
}

const variantIcons: Record<ToastMessageVariant, IconProp> = {
  success: faCircleCheck,
  error: faCircleExclamation,
  info: faCircleInfo,
  warning: faTriangleExclamation,
};

export default function ToastMessage({
  icon,
  variant = "info",
  children,
}: ToastMessageProps) {
  const resolvedIcon = icon ?? variantIcons[variant];

  return (
    <span className="body-md inline-flex items-center gap-2 text-white">
      <FontAwesomeIcon icon={resolvedIcon} className="h-4 w-4 text-gray-50" />
      {children}
    </span>
  );
}
