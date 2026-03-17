"use client";

import FeedbackPage from "@/app/components/feedback-page";

export default function CommunityDetailError() {
  return (
    <FeedbackPage
      title="게시글을 불러오지 못했어요."
      description="죄송하지만 나중에 다시 시도해주세요."
      buttonLabel="커뮤니티 홈으로 이동"
      buttonHref="/community"
    />
  );
}
