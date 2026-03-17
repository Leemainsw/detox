"use client";

import FeedbackState from "@/app/components/feedback-state";
import { useCommunityCommentActions } from "@/app/community/_hooks/use-community-comment-actions";
import type { CommunityCommentItemData } from "../_types";
import AuthorMeta from "./author-meta";
import DetailKebab from "./detail-kebab";

interface CommentListProps {
  items: CommunityCommentItemData[];
}

export default function CommentList({ items }: CommentListProps) {
  const { currentUserId, getDeleteHandler, getReportHandler } =
    useCommunityCommentActions();

  if (items.length === 0) {
    return (
      <FeedbackState
        description="남겨진 댓글이 없어요."
        className="py-8"
        imageSrc="/images/emoji/no-alarm.png"
        contentClassName="gap-0"
        descriptionClassName="body-md font-normal text-gray-400"
      />
    );
  }

  return (
    <ul className="grid grid-cols-1 py-5 gap-5">
      {items.map((item) => (
        <li
          key={item.id}
          className="w-full grid grid-cols-1 items-center gap-1 bg-white rounded-lg"
        >
          <div className="flex items-center justify-between min-h-12">
            <AuthorMeta
              thumbUrl={item.thumbUrl}
              author={item.author}
              timeAgo={item.timeAgo}
            />
            {currentUserId ? (
              <DetailKebab
                entityName="댓글"
                variant={currentUserId === item.userId ? "edit" : "default"}
                onDelete={getDeleteHandler(item)}
                onReport={getReportHandler(item)}
              />
            ) : null}
          </div>
          <div className="text-sm text-gray-300">
            <p className="text-base leading-[140%] text-gray-300 line-clamp-3">
              {item.content}
            </p>
          </div>
        </li>
      ))}
    </ul>
  );
}
