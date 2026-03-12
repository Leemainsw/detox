"use client";
import Button from "./components/button";
import FeedbackState from "./components/feedback-state";
import { useRouter } from "next/navigation";
import BottomCTA from "./components/bottom-cta";

export default function NotFound() {
  const router = useRouter();

  const goHome = () => {
    router.push("/");
  };

  return (
    <div className="mx-auto min-h-screen flex flex-col items-center justify-center px-6">
      <FeedbackState
        title="페이지를 불러올 수 없어요"
        description="죄송하지만 나중에 다시 시도해주세요."
        imageSrc="/images/emoji/error.png"
        imageAlt="404"
      />

      <BottomCTA>
        <Button variant="primary" size="lg" className="w-full" onClick={goHome}>
          홈으로 이동
        </Button>
      </BottomCTA>
    </div>
  );
}
