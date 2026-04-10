import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { notFound } from "next/navigation";
import {
  createCommunityCommentsQueryOptions,
  createCommunityDetailQueryOptions,
  createRecommendedCommunityPostsQueryOptions,
} from "@/query/community-options";
import {
  getServerCommunityComments,
  getServerCommunityDetail,
  getServerRecommendedCommunityPosts,
} from "@/services/community.server";
import CommunityDetailPageClient from "./_components/community-detail-page-client";

type CommunityDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function CommunityDetailPage({
  params,
}: CommunityDetailPageProps) {
  const { id } = await params;
  const queryClient = new QueryClient();

  const post = await queryClient.fetchQuery(
    createCommunityDetailQueryOptions({
      postId: id,
      fetchDetail: getServerCommunityDetail,
    })
  );

  if (!post) {
    notFound();
  }

  await Promise.all([
    queryClient.prefetchQuery(
      createRecommendedCommunityPostsQueryOptions({
        postId: id,
        service: post.service,
        sourceTitle: post.title,
        sourceContent: post.content,
        sourcePostUpdatedAt: post.updatedAt,
        fetchRecommendedPosts: getServerRecommendedCommunityPosts,
      })
    ),
    queryClient.prefetchQuery(
      createCommunityCommentsQueryOptions({
        postId: id,
        fetchComments: getServerCommunityComments,
      })
    ),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <CommunityDetailPageClient postId={id} />
    </HydrationBoundary>
  );
}
