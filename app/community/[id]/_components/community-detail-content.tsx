"use client";

import { useRef, useState } from "react";
import {
  notFound,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import { getLoginRedirectUrl } from "@/app/utils/auth/get-login-redirect-url";
import CommunityDetailLoading from "./community-detail-loading";

import FeedbackState from "@/app/components/feedback-state";

import Header from "@/app/components/header";
import TextButton from "@/app/components/text-button";
import { useToast } from "@/app/hooks/useToast";
import { Skeleton } from "@/components/ui/skeleton";
import { useCurrentUserQuery } from "@/query/users";
import {
  useCommunityCommentsQuery,
  useCommunityPostLikeStatusQuery,
  useCreateCommunityCommentMutation,
  useCommunityDetailQuery,
  useDeleteCommunityCommentMutation,
  useDeleteCommunityPostMutation,
  useRecommendedCommunityPostsQuery,
  useReportCommunityCommentMutation,
  useReportCommunityPostMutation,
  useToggleCommunityPostLikeMutation,
} from "@/query/community";
import CommentList from "../../_components/comment-list";
import CommunityList from "../../_components/community-list";
import CommunityPostListSkeleton from "../../_components/community-post-list-skeleton";
import CommunityReactionStats from "../../_components/community-reaction-stats";
import DetailKebab from "../../_components/detail-kebab";
import AuthorMeta from "../../_components/author-meta";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { CommunityCommentItemData } from "../../_types";

type CommunityDetailContentProps = {
  postId: string;
};

export default function CommunityDetailContent({
  postId,
}: CommunityDetailContentProps) {
  const router = useRouter();
  const { success, error } = useToast();
  const [comment, setComment] = useState("");
  const commentInputRef = useRef<HTMLInputElement | null>(null);
  const currentUserQuery = useCurrentUserQuery();
  const communityDetailQuery = useCommunityDetailQuery(postId);
  const recommendedPostsQuery = useRecommendedCommunityPostsQuery(
    postId,
    communityDetailQuery.data?.service
  );
  const commentsQuery = useCommunityCommentsQuery(postId);
  const likeStatusQuery = useCommunityPostLikeStatusQuery(
    postId,
    currentUserQuery.data?.id
  );
  const createCommentMutation = useCreateCommunityCommentMutation();
  const deleteCommunityCommentMutation = useDeleteCommunityCommentMutation();
  const deleteCommunityPostMutation = useDeleteCommunityPostMutation();
  const reportCommunityCommentMutation = useReportCommunityCommentMutation();
  const toggleLikeMutation = useToggleCommunityPostLikeMutation();
  const reportCommunityPostMutation = useReportCommunityPostMutation();

  const pathname = usePathname();
  const searchParams = useSearchParams();

  const isLoggedIn = Boolean(currentUserQuery.data?.id);
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

  const renderRecommendedPostsLoading = () => (
    <section className="bg-gray-50 px-6 py-6">
      <Skeleton className="h-6 w-52" />
      <CommunityPostListSkeleton count={3} className="pt-6" />
    </section>
  );

  if (communityDetailQuery.isPending) {
    return <CommunityDetailLoading />;
  }
  if (communityDetailQuery.isError) {
    throw communityDetailQuery.error;
  }

  if (!communityDetailQuery.data) {
    notFound();
  }

  const post = communityDetailQuery.data;
  const isAuthor = currentUserQuery.data?.id === post.userId;
  const recommendedPosts = recommendedPostsQuery.data ?? [];
  const isLikeStatusResolved = likeStatusQuery.isSuccess;
  const isLiked = isLikeStatusResolved ? likeStatusQuery.data : false;

  const handleEdit = () => {
    router.push(`/community/${postId}/edit`);
  };

  const handleDelete = async () => {
    if (!currentUserQuery.data?.id || deleteCommunityPostMutation.isPending) {
      return;
    }

    await deleteCommunityPostMutation.mutateAsync({
      postId,
      userId: currentUserQuery.data.id,
    });

    router.replace("/community");
  };

  const handleToggleLike = async () => {
    if (!isLoggedIn) {
      moveToLogin();
      return;
    }

    if (!likeStatusQuery.isSuccess || toggleLikeMutation.isPending) {
      return;
    }

    try {
      const result = await toggleLikeMutation.mutateAsync({
        postId,
        userId: currentUserQuery.data!.id,
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

  const handleCreateComment = async () => {
    if (!isLoggedIn) {
      moveToLogin();
      return;
    }

    if (!comment.trim() || createCommentMutation.isPending) {
      return;
    }

    try {
      await createCommentMutation.mutateAsync({
        postId,
        userId: currentUserQuery.data!.id,
        content: comment.trim(),
      });
      setComment("");
      success("댓글이 등록되었어요.");
    } catch (createCommentError) {
      console.error(createCommentError);
      error("댓글 등록에 실패했어요.");
    }
  };

  const handleReport = async () => {
    if (!isLoggedIn) {
      moveToLogin();
      return;
    }

    await reportCommunityPostMutation.mutateAsync({
      postId,
      reporterUserId: currentUserQuery.data!.id,
    });
  };

  const handleDeleteComment = async (commentItem: CommunityCommentItemData) => {
    if (!currentUserQuery.data?.id) {
      throw new Error("댓글을 삭제하려면 로그인이 필요해요.");
    }

    await deleteCommunityCommentMutation.mutateAsync({
      commentId: commentItem.id,
      postId: commentItem.postId,
      userId: currentUserQuery.data.id,
    });
  };

  const handleReportComment = async (commentItem: CommunityCommentItemData) => {
    if (!isLoggedIn) {
      moveToLogin();
      return;
    }

    await reportCommunityCommentMutation.mutateAsync({
      commentId: commentItem.id,
      reporterUserId: currentUserQuery.data!.id,
    });
  };

  return (
    <>
      <Header variant="back" />
      <main>
        <section className="px-6 py-4">
          <div className="flex items-center justify-between gap-4">
            <AuthorMeta
              thumbUrl={post.thumbUrl}
              author={post.author}
              timeAgo={post.timeAgo}
            />
            <DetailKebab
              entityName="게시글"
              variant={isAuthor ? "edit" : "default"}
              onEdit={isAuthor ? handleEdit : undefined}
              onDelete={isAuthor ? handleDelete : undefined}
              onReport={isLoggedIn && !isAuthor ? handleReport : undefined}
            />
          </div>

          <div className="mt-4 text-sm text-gray-300">
            <h6 className="mb-2 text-lg font-bold leading-[140%] text-black">
              {post.title}
            </h6>
            <p className="text-base leading-[140%] text-gray-300 whitespace-pre-wrap">
              {post.content}
            </p>
          </div>
        </section>

        <section className="border-t-8 border-gray-50 py-5">
          <CommunityReactionStats
            likeCount={post.likeCount}
            commentCount={post.commentCount}
            showLabel
            className="px-6"
            isLiked={isLiked}
            likeDisabled={
              toggleLikeMutation.isPending ||
              (isLoggedIn &&
                (likeStatusQuery.isPending || likeStatusQuery.isError))
            }
            onLikeClick={handleToggleLike}
            onCommentClick={() => {
              if (!isLoggedIn) {
                moveToLogin();
                return;
              }

              commentInputRef.current?.focus();
            }}
          />
        </section>

        <section className="border-t border-gray-50 px-6 py-5">
          <h3 className="title-md text-gray-400">댓글</h3>

          {commentsQuery.isPending ? (
            renderCommentsLoading()
          ) : commentsQuery.isError ? (
            <FeedbackState
              description="댓글을 불러오지 못했어요."
              className="py-8"
              imageSrc="/images/emoji/no-alarm.png"
              contentClassName="gap-0"
              descriptionClassName="body-md font-normal text-gray-400"
            />
          ) : (
            <CommentList
              items={commentsQuery.data ?? []}
              currentUserId={currentUserQuery.data?.id}
              onDeleteComment={handleDeleteComment}
              onReportComment={handleReportComment}
            />
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
              readOnly={!isLoggedIn || createCommentMutation.isPending}
              className="flex-1 bg-transparent text-base text-gray-400 outline-none placeholder:text-gray-300"
            />
            <TextButton
              size="md"
              disabled={
                createCommentMutation.isPending ||
                (isLoggedIn && !comment.trim())
              }
              onClick={handleCreateComment}
              className="disabled:cursor-not-allowed disabled:opacity-50"
            >
              <FontAwesomeIcon icon={faPaperPlane} />
            </TextButton>
          </div>
        </section>

        {recommendedPostsQuery.isPending ? (
          renderRecommendedPostsLoading()
        ) : recommendedPosts.length > 0 ? (
          <section className="bg-gray-50 px-6 py-6">
            <h3 className="title-md">
              <span className="text-brand-primary">AI디톡이</span>가 추천해주는
              관련 게시글
            </h3>

            <CommunityList items={recommendedPosts} />
          </section>
        ) : null}
      </main>
    </>
  );
}
