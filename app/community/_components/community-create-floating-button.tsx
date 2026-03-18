"use client";

import { useRouter } from "next/navigation";
import FloatingButton from "@/app/components/floating-button";
import { useCurrentUserQuery } from "@/query/users";

export default function CommunityCreateFloatingButton() {
  const router = useRouter();
  const createPath = "/community/new";
  const {
    data: currentUser,
    isPending: isCurrentUserPending,
    isError: isCurrentUserError,
  } = useCurrentUserQuery();

  if (
    isCurrentUserPending ||
    isCurrentUserError ||
    !currentUser?.id
  ) {
    return null;
  }

  const handleCreateClick = () => {
    router.push(createPath);
  };

  return <FloatingButton variant="create" onClick={handleCreateClick} />;
}
