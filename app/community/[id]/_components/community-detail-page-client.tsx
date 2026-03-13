"use client";

import { useRef } from "react";
import Header from "@/app/components/header";
import { Skeleton } from "@/components/ui/skeleton";
import { useRecommendedCommunityPostsQuery } from "@/query/community";
import CommunityList from "../../_components/community-list";
import CommunityPostListSkeleton from "../../_components/community-post-list-skeleton";
import AuthorMeta from "../../_components/author-meta";
import type {
  CommunityDetailData,
  CommunityCommentItemData,
  CommunityListItemData,
} from "../../_types";
import CommunityDetailCommentSection from "./community-detail-comment-section";
import CommunityDetailPostActions from "./community-detail-post-actions";
import CommunityDetailReactions from "./community-detail-reactions";

type CommunityDetailPageClientProps = {
  postId: string;
  initialPost: CommunityDetailData;
  initialRecommendedPosts: CommunityListItemData[];
  initialComments: CommunityCommentItemData[];
};

export default function CommunityDetailPageClient({
  postId,
  initialPost,
  initialRecommendedPosts,
  initialComments,
}: CommunityDetailPageClientProps) {
  const commentInputRef = useRef<HTMLInputElement | null>(null);
  const recommendedPostsQuery = useRecommendedCommunityPostsQuery(
    postId,
    initialPost.service,
    initialRecommendedPosts
  );

  const renderRecommendedPostsLoading = () => (
    <section className="bg-gray-50 px-6 py-6">
      <Skeleton className="h-6 w-52" />
      <CommunityPostListSkeleton count={3} className="pt-6" />
    </section>
  );

  const post = initialPost;
  const recommendedPosts = recommendedPostsQuery.data ?? [];

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
            <CommunityDetailPostActions
              postId={postId}
              postUserId={post.userId}
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
          <CommunityDetailReactions
            postId={postId}
            likeCount={post.likeCount}
            commentCount={initialComments.length}
            commentInputRef={commentInputRef}
          />
        </section>

        <CommunityDetailCommentSection
          postId={postId}
          initialComments={initialComments}
          commentInputRef={commentInputRef}
        />

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
