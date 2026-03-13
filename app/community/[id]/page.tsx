import CommunityDetailContent from "../_components/community-detail-content";

type CommunityDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function CommunityDetailPage({
  params,
}: CommunityDetailPageProps) {
  const { id } = await params;

  return <CommunityDetailContent postId={id} />;
}
