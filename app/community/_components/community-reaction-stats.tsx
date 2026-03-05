import { faCommentDots, faThumbsUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { cn } from "@/lib/utils";

interface CommunityReactionStatsProps {
  likeCount: number;
  commentCount: number;
  showLabel?: boolean;
  interactive?: boolean;
  likeActive?: boolean;
  className?: string;
  itemClassName?: string;
  textClassName?: string;
}

export default function CommunityReactionStats({
  likeCount,
  commentCount,
  showLabel = false,
  interactive = false,
  likeActive = false,
  className,
  itemClassName,
  textClassName,
}: CommunityReactionStatsProps) {
  const likeText = showLabel ? `좋아요 ${likeCount}` : `${likeCount}`;
  const commentText = showLabel ? `댓글 ${commentCount}` : `${commentCount}`;
  const baseItemClassName = cn(
    "text-sm flex items-center gap-1 text-gray-200",
    itemClassName
  );
  const baseTextClassName = cn("text-gray-400", textClassName);

  return (
    <div className={cn("flex gap-4", className)}>
      {interactive ? (
        <button
          type="button"
          className={cn(baseItemClassName, likeActive && "active")}
        >
          <FontAwesomeIcon
            icon={faThumbsUp}
            size="sm"
            className={cn(likeActive ? "text-brand-primary" : "text-gray-200")}
          />
          <span
            className={cn(
              baseItemClassName,
              likeActive ? "text-brand-primary" : "text-gray-200"
            )}
          >
            {likeText}
          </span>
        </button>
      ) : (
        <div className={baseItemClassName}>
          <FontAwesomeIcon icon={faThumbsUp} size="sm" />
          <span className={baseTextClassName}>{likeText}</span>
        </div>
      )}

      {interactive ? (
        <button type="button" className={baseItemClassName}>
          <FontAwesomeIcon icon={faCommentDots} size="sm" />
          <span className={baseTextClassName}>{commentText}</span>
        </button>
      ) : (
        <div className={baseItemClassName}>
          <FontAwesomeIcon icon={faCommentDots} size="sm" />
          <span className={baseTextClassName}>{commentText}</span>
        </div>
      )}
    </div>
  );
}
