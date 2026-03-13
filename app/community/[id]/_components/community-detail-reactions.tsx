"use client";

import type { RefObject } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { getLoginRedirectUrl } from "@/app/utils/auth/get-login-redirect-url";
import { useToast } from "@/app/hooks/useToast";
import {
  useCommunityPostLikeStatusQuery,
  useToggleCommunityPostLikeMutation,
} from "@/query/community";
import { useCurrentUserQuery } from "@/query/users";
import CommunityReactionStats from "../../_components/community-reaction-stats";

interface CommunityDetailReactionsProps {
  postId: string;
  likeCount: number;
  commentCount: number;
  commentInputRef: RefObject<HTMLInputElement | null>;
}

export default function CommunityDetailReactions({
  postId,
  likeCount,
  commentCount,
  commentInputRef,
}: CommunityDetailReactionsProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { success, error } = useToast();
  const { data: currentUser } = useCurrentUserQuery();
  const currentUserId = currentUser?.id;
  const likeStatusQuery = useCommunityPostLikeStatusQuery(postId, currentUserId);
  const { mutateAsync: toggleCommunityPostLike, isPending: isTogglePending } =
    useToggleCommunityPostLikeMutation();

  const isLoggedIn = Boolean(currentUserId);
  const isLiked = likeStatusQuery.isSuccess ? likeStatusQuery.data : false;
  const likeDisabled =
    isTogglePending ||
    (isLoggedIn && (likeStatusQuery.isPending || likeStatusQuery.isError));

  const currentPath = searchParams.toString()
    ? `${pathname}?${searchParams.toString()}`
    : pathname;
  const loginRedirectUrl = getLoginRedirectUrl(currentPath);

  const moveToLogin = () => {
    router.push(loginRedirectUrl);
  };

  const handleToggleLike = async () => {
    if (!isLoggedIn) {
      moveToLogin();
      return;
    }

    if (!likeStatusQuery.isSuccess || isTogglePending) {
      return;
    }

    try {
      const result = await toggleCommunityPostLike({
        postId,
        userId: currentUserId!,
      });

      if (result.liked) {
        success("좋아요를 눌렀어요.");
        return;
      }

      success("좋아요를 취소했어요.");
    } catch (toggleLikeError) {
      console.error(toggleLikeError);
      error("좋아요 처리에 실패했어요.");
    }
  };

  const handleCommentClick = () => {
    if (!isLoggedIn) {
      moveToLogin();
      return;
    }

    commentInputRef.current?.focus();
  };

  return (
    <CommunityReactionStats
      likeCount={likeCount}
      commentCount={commentCount}
      showLabel
      className="px-6"
      isLiked={isLiked}
      likeDisabled={likeDisabled}
      onLikeClick={handleToggleLike}
      onCommentClick={handleCommentClick}
    />
  );
}
