"use client";

import { useState, type RefObject } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getLoginRedirectUrl } from "@/app/utils/auth/get-login-redirect-url";
import FeedbackState from "@/app/components/feedback-state";
import TextButton from "@/app/components/text-button";
import { useToast } from "@/app/hooks/useToast";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useCommunityCommentsQuery,
  useCreateCommunityCommentMutation,
} from "@/query/community";
import { useCurrentUserQuery } from "@/query/users";
import CommentList from "../../_components/comment-list";
import type { CommunityCommentItemData } from "../../_types";

interface CommunityDetailCommentSectionProps {
  postId: string;
  initialComments: CommunityCommentItemData[];
  commentInputRef: RefObject<HTMLInputElement | null>;
}

export default function CommunityDetailCommentSection({
  postId,
  initialComments,
  commentInputRef,
}: CommunityDetailCommentSectionProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { success, error } = useToast();
  const [comment, setComment] = useState("");
  const { data: currentUser } = useCurrentUserQuery();
  const currentUserId = currentUser?.id;
  const commentsQuery = useCommunityCommentsQuery(postId, initialComments);
  const { mutateAsync: createCommunityComment, isPending: isCreatePending } =
    useCreateCommunityCommentMutation();

  const isLoggedIn = Boolean(currentUserId);
  const currentPath = searchParams.toString()
    ? `${pathname}?${searchParams.toString()}`
    : pathname;
  const loginRedirectUrl = getLoginRedirectUrl(currentPath);

  const moveToLogin = () => {
    router.push(loginRedirectUrl);
  };

  const renderCommentsLoading = () => (
    <div className="grid grid-cols-1 gap-5 py-5">
      {Array.from({ length: 2 }).map((_, index) => (
        <div key={index} className="grid grid-cols-1 gap-3 rounded-lg bg-white">
          <div className="flex items-center gap-2">
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-4 w-24" />
          </div>
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-4/5" />
        </div>
      ))}
    </div>
  );

  const handleCreateComment = async () => {
    if (!currentUserId) {
      moveToLogin();
      return;
    }

    if (!comment.trim() || isCreatePending) {
      return;
    }

    try {
      await createCommunityComment({
        postId,
        userId: currentUserId,
        content: comment.trim(),
      });
      setComment("");
      success("댓글이 등록되었어요.");
    } catch (createCommentError) {
      console.error(createCommentError);
      error("댓글 등록에 실패했어요.");
    }
  };

  return (
    <section className="border-t border-gray-50 px-6 py-5">
      <h3 className="title-md text-gray-400">댓글</h3>

      {commentsQuery.isPending ? (
        renderCommentsLoading()
      ) : commentsQuery.isError ? (
        <FeedbackState
          description="댓글을 불러오지 못했어요."
          className="py-8"
          imageSrc="/images/emoji/error.png"
          contentClassName="gap-0"
          descriptionClassName="body-md font-normal text-gray-400"
        />
      ) : (
        <CommentList items={commentsQuery.data ?? []} />
      )}

      <div className="mt-4 flex items-center rounded-lg bg-gray-50 px-4 py-3">
        <input
          ref={commentInputRef}
          type="text"
          value={comment}
          onChange={(event) => {
            if (!isLoggedIn) {
              return;
            }

            setComment(event.target.value);
          }}
          onFocus={() => {
            if (!isLoggedIn) {
              moveToLogin();
            }
          }}
          placeholder={
            isLoggedIn
              ? "댓글을 입력하세요"
              : "댓글 작성은 로그인 후 가능해요"
          }
          readOnly={!isLoggedIn || isCreatePending}
          className="flex-1 bg-transparent text-base text-gray-400 outline-none placeholder:text-gray-300"
        />
        <TextButton
          size="md"
          disabled={isCreatePending || (isLoggedIn && !comment.trim())}
          onClick={handleCreateComment}
          className="disabled:cursor-not-allowed disabled:opacity-50"
        >
          <FontAwesomeIcon icon={faPaperPlane} />
        </TextButton>
      </div>
    </section>
  );
}
