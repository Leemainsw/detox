"use client";

import type { RefObject } from "react";
import { useLoginRedirect } from "@/app/hooks/use-login-redirect";
import { useToast } from "@/app/hooks/useToast";
import {
  useCommunityPostLikeStatusQuery,
  useToggleCommunityPostLikeMutation,
} from "@/query/community";
import { useCurrentUserQuery } from "@/query/users";

interface UseCommunityDetailReactionsParams {
  postId: string;
  commentInputRef: RefObject<HTMLInputElement | null>;
}

export function useCommunityDetailReactions({
  postId,
  commentInputRef,
}: UseCommunityDetailReactionsParams) {
  const { success, error } = useToast();
  const { data: currentUser } = useCurrentUserQuery();
  const currentUserId = currentUser?.id;
  const { redirectToLoginIfNeeded } = useLoginRedirect();
  const likeStatusQuery = useCommunityPostLikeStatusQuery(postId, currentUserId);
  const { mutateAsync: toggleCommunityPostLike, isPending: isTogglePending } =
    useToggleCommunityPostLikeMutation();

  const isLoggedIn = Boolean(currentUserId);
  const isLiked = likeStatusQuery.isSuccess ? likeStatusQuery.data : false;
  const likeDisabled =
    isTogglePending ||
    (isLoggedIn && (likeStatusQuery.isPending || likeStatusQuery.isError));

  const handleToggleLike = async () => {
    if (redirectToLoginIfNeeded(isLoggedIn)) {
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
    if (redirectToLoginIfNeeded(isLoggedIn)) {
      return;
    }

    commentInputRef.current?.focus();
  };

  return {
    isLiked,
    likeDisabled,
    handleToggleLike,
    handleCommentClick,
  };
}
