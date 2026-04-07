"use client";

import { useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import FeedbackPage from "@/app/components/feedback-page";
import Header from "@/app/components/header";
import {
  useCommunityCommentsQuery,
  useCommunityDetailQuery,
  useRecommendedCommunityPostsQuery,
} from "@/query/community";
import CommunityReactionStats from "../../_components/community-reaction-stats";
import CommunityList from "../../_components/community-list";
import AuthorMeta from "../../_components/author-meta";
import CommunityDetailCommentSection from "./community-detail-comment-section";
import CommunityDetailLoadingScreen from "./community-detail-loading-screen";
import CommunityDetailPostActions from "./community-detail-post-actions";
import CommunityDetailRecommendedPostsSkeleton from "./community-detail-recommended-posts-skeleton";
import { getCommunityReturnTo } from "../../_utils/navigation";

type CommunityDetailPageClientProps = {
  postId: string;
};

export default function CommunityDetailPageClient({
  postId,
}: CommunityDetailPageClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const commentInputRef = useRef<HTMLInputElement | null>(null);
  const returnTo = getCommunityReturnTo(searchParams.get("returnTo"));
  const detailQuery = useCommunityDetailQuery(postId);
  const post = detailQuery.data;
  const commentsQuery = useCommunityCommentsQuery(postId);
  const recommendedPostsQuery = useRecommendedCommunityPostsQuery(
    postId,
    post?.service
  );

  const comments = commentsQuery.data ?? [];
  const recommendedPosts = recommendedPostsQuery.data ?? [];

  if (post === undefined) {
    return <CommunityDetailLoadingScreen />;
  }

  if (post === null) {
    return (
      <FeedbackPage
        title="페이지를 불러올 수 없어요"
        description="삭제되었거나 없는 게시글입니다."
        buttonLabel="커뮤니티 홈으로 이동"
        buttonHref={returnTo}
      />
    );
  }

  return (
    <>
      <Header
        variant="back"
        onBack={() => router.replace(returnTo)}
        fallbackPath={returnTo}
      />
      <main>
        <section className="px-6 py-4">
          <div className="flex items-center justify-between gap-4">
            <AuthorMeta
              thumbUrl={post.thumbUrl}
              author={post.author}
              timeAgo={post.timeAgo}
            />
            <CommunityDetailPostActions
              postId={postId}
              postUserId={post.userId}
              returnTo={returnTo}
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
            commentCount={comments.length}
            showLabel
            className="px-6"
            postId={postId}
            commentInputRef={commentInputRef}
          />
        </section>

        <CommunityDetailCommentSection
          postId={postId}
          comments={comments}
          isCommentsPending={commentsQuery.isPending}
          isCommentsError={commentsQuery.isError}
          commentInputRef={commentInputRef}
        />

        {recommendedPostsQuery.isPending ? (
          <CommunityDetailRecommendedPostsSkeleton />
        ) : recommendedPosts.length > 0 ? (
          <section className="bg-gray-50 px-6 py-6">
            <h3 className="title-md">
              <span className="text-brand-primary">AI디톡이</span>가 추천해주는
              관련 게시글
            </h3>

            <CommunityList items={recommendedPosts} returnTo={returnTo} />
          </section>
        ) : null}
      </main>
    </>
  );
}
