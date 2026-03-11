import Avatar from "@/app/components/avatar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { mockCommunityItems } from "../_data/mock-community";
import { mockCommunityComments } from "../_data/mock-comments";
import Header from "@/app/components/header";
import CommunityList from "../_components/community-list";
import Input from "@/app/components/input";
import CommunityReactionStats from "../_components/community-reaction-stats";
import CommentList from "../_components/comment-list";
import DetailKebab from "../_components/detail-kebab";

type CommunityDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function CommunityDetailPage({
  params,
}: CommunityDetailPageProps) {
  const { id } = await params;
  const postId = Number(id);
  const item = mockCommunityItems.find((v) => v.id === postId);
  const commentItems = mockCommunityComments.filter(
    (comment) => comment.postId === postId
  );
  if (!item) return null; // 또는 notFound()

  return (
    <div>
      <Header variant="back" rightContent={<DetailKebab variant="edit" />} />
      <main>
        <section className="px-6 py-4">
          <div className="flex items-center gap-2 ">
            <Avatar size="sm" src={item.thumbUrl} alt={item.author} />
            <div className="flex gap-3">
              <div className="text-sm text-black font-bold leading-[110%]">
                {item.author}
              </div>
              <span className="text-xs text-gray-300">{item.timeAgo}</span>
            </div>
          </div>
          <div className="text-sm text-gray-300 mt-4">
            <h6 className="text-lg text-black font-bold leading-[140%] mb-2">
              {item.title}
            </h6>
            <p className="text-base leading-[140%] text-gray-300">
              {item.content}
            </p>
          </div>
        </section>

        <section className="border-t-8 border-gray-50 py-5">
          <CommunityReactionStats
            likeCount={item.likeCount}
            commentCount={item.commentCount}
            showLabel
            className="px-6"
          />

          <CommentList items={commentItems} />

          <div className="relative px-5">
            <Input placeholder="댓글을 입력하세요" />
            <button
              type="button"
              aria-label="댓글 달기"
              className="w-12 h-12 flex items-center justify-center absolute right-6 top-[50%] translate-y-[-50%] cursor-pointer"
            >
              <FontAwesomeIcon icon={faPaperPlane} />
            </button>
          </div>
        </section>

        <section className="bg-gray-50 px-6 py-5 border-t-8 border-gray-50">
          <h6 className="title-md">
            <span className="text-brand-primary">AI디톡이</span>가 추천해주는
            관련 게시글
          </h6>
          <CommunityList items={mockCommunityItems} />
        </section>
      </main>
    </div>
  );
}
