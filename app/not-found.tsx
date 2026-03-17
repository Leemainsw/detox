import FeedbackPage from "@/app/components/feedback-page";

export default function NotFound() {
  return (
    <FeedbackPage
      title="페이지를 불러올 수 없어요"
      description="죄송하지만 나중에 다시 시도해주세요."
      buttonLabel="홈으로 이동"
      buttonSize="lg"
      imageAlt="404"
      buttonHref="/"
    />
  );
}
