import { notFound } from "next/navigation";
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

  const post = await getServerCommunityDetail(id);

  if (!post) {
    notFound();
  }
  const [recommendedPosts, initialComments] = await Promise.all([
    getServerRecommendedCommunityPosts({
      postId: id,
      service: post.service,
    }),
    getServerCommunityComments(id),
  ]);

  return (
    <CommunityDetailPageClient
      postId={id}
      initialPost={post}
      initialRecommendedPosts={recommendedPosts}
      initialComments={initialComments}
    />
  );
}
