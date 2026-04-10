"use client";

import { useRouter } from "next/navigation";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import FloatingButton from "@/app/components/floating-button";
import { buildCommunityNewPath } from "../_utils/navigation";

interface CommunityCreateFloatingButtonProps {
  returnTo?: string;
}

export default function CommunityCreateFloatingButton({
  returnTo,
}: CommunityCreateFloatingButtonProps) {
  const router = useRouter();

  const handleCreateClick = () => {
    router.push(buildCommunityNewPath(returnTo));
  };

  return (
    <FloatingButton
      ariaLabel="게시글 작성하기"
      onClick={handleCreateClick}
      className="btn-primary"
    >
      <FontAwesomeIcon icon={faPlus} aria-hidden="true" />
    </FloatingButton>
  );
}
