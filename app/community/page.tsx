"use client";
import CommunityList from "./_components/community-list";
import BrandTabs from "./_components/brand-tabs";
import Header from "../components/header";
import BottomNav from "../components/bottomNav";

const mockItems = [
  {
    id: 1,
    title: "첫 번째 커뮤니티 글",
    content: "커뮤니티 리스트 페이지 예시 데이터입니다.",
    author: "lyla",
    timeAgo: "2분전",
    likeCount: 10,
    commentCount: 5,
    thumbUrl: "/images/default-user.png",
  },
  {
    id: 2,
    title: "두 번째 커뮤니티 글",
    content: "상세 페이지로 이동해 구조를 확인해 보세요.",
    author: "detox-user",
    timeAgo: "1분전",
    likeCount: 20,
    commentCount: 8,
    thumbUrl: "/images/default-user.png",
  },
];

export default function CommunityListPage() {
  return (
    <div className="h-screen bg-gray-100">
      <Header variant="text" leftText="커뮤니티" rightContent="알람" />
      <main className="">
        <BrandTabs />
        <CommunityList items={mockItems} />
      </main>
      <BottomNav />
    </div>
  );
}
