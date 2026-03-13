"use client";

import { useRouter } from "next/navigation";
import FeedbackPage from "@/app/components/feedback-page";

export default function NotFound() {
  const router = useRouter();

  return (
    <FeedbackPage
      title="페이지를 불러올 수 없어요"
      description="삭제되었거나 없는 게시글입니다."
      buttonLabel="커뮤니티 홈으로 이동"
      onButtonClick={() => router.replace("/community")}
    />
  );
}
