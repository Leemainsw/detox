"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faArrowUp } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/navigation";
import { cn } from "@/app/utils/class";
import { getLoginRedirectUrl } from "@/app/utils/auth/get-login-redirect-url";
import { useCurrentUserQuery } from "@/query/users";

type FloatingButtonProps = {
  variant: "create" | "top";
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

export default function FloatingButton({ variant }: FloatingButtonProps) {
  const { icon, className, ariaLabel } = variantMap[variant];
  const router = useRouter();
  const { data: currentUser, isPending: isCurrentUserPending } =
    useCurrentUserQuery();

  const handleTopClick = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCreateClick = () => {
    if (isCurrentUserPending) {
      return;
    }

    if (!currentUser?.id) {
      router.push(getLoginRedirectUrl("/community/new"));
      return;
    }

    router.push("/community/new");
  };

  const handleClick = variant === "create" ? handleCreateClick : handleTopClick;

  return (
    <button
      type="button"
      aria-label={ariaLabel}
      onClick={handleClick}
      className={cn("btn btn-rounded mr-6", className)}
    >
      <FontAwesomeIcon icon={icon} aria-hidden="true" />
    </button>
  );
}
