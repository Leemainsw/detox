"use client";

import FeedbackPage from "@/app/components/feedback-page";

interface Props {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ reset }: Props) {
  return (
    <FeedbackPage
      title="알림을 불러오는 중 문제가 발생했어요."
      description="죄송하지만 나중에 다시 시도해주세요."
      buttonLabel="다시 시도"
      onButtonClick={reset}
    />
  );
}
