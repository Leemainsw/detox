"use client";

import type { RefObject } from "react";
import { useCommunityDetailReactions } from "@/app/hooks/use-community-detail-reactions";
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
  const { isLiked, likeDisabled, handleToggleLike, handleCommentClick } =
    useCommunityDetailReactions({
      postId,
      commentInputRef,
    });

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
