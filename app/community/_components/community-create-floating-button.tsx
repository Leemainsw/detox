"use client";

import { useRouter } from "next/navigation";
import FloatingButton from "@/app/components/floating-button";
import { useLoginRedirect } from "@/app/hooks/use-login-redirect";
import { useCurrentUserQuery } from "@/query/users";

export default function CommunityCreateFloatingButton() {
  const router = useRouter();
  const createPath = "/community/new";
  const { moveToLogin } = useLoginRedirect("/community/new");
  const {
    data: currentUser,
    isPending: isCurrentUserPending,
    isError: isCurrentUserError,
  } = useCurrentUserQuery();

  const handleCreateClick = () => {
    if (isCurrentUserPending) {
      return;
    }

    if (isCurrentUserError) {
      router.push(createPath);
      return;
    }

    if (!currentUser?.id) {
      moveToLogin();
      return;
    }

    router.push(createPath);
  };

  return (
    <FloatingButton
      variant="create"
      onClick={handleCreateClick}
      disabled={isCurrentUserPending}
    />
  );
}
