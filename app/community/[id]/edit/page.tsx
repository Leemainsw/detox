"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import FeedbackPage from "@/app/components/feedback-page/feedback-page";
import Header from "@/app/components/header";
import LoadingScreen from "@/app/components/loading-screen";
import { supabase } from "@/lib/supabase";
import { useCommunityDetailQuery } from "@/query/community";
import CommunityEditFormContent from "./_components/community-edit-form-content";

function CommunityEditPageContent() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [isCurrentUserPending, setIsCurrentUserPending] = useState(true);
  const [isCurrentUserError, setIsCurrentUserError] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadCurrentUser = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (!isMounted) {
        return;
      }

      if (error) {
        console.error(error);
        setIsCurrentUserError(true);
        setIsCurrentUserPending(false);
        return;
      }

      setCurrentUserId(user?.id ?? null);
      setIsCurrentUserPending(false);
    };

    void loadCurrentUser();

    return () => {
      isMounted = false;
    };
  }, []);

  const {
    data: communityDetail,
    isPending: isCommunityDetailPending,
    isError: isCommunityDetailError,
  } = useCommunityDetailQuery(id);

  if (isCommunityDetailPending || isCurrentUserPending) {
    return <LoadingScreen message="게시글을 불러오는 중이에요." />;
  }

  if (
    isCurrentUserError ||
    !currentUserId ||
    isCommunityDetailError ||
    !communityDetail
  ) {
    return (
      <FeedbackPage
        title="게시글을 불러오지 못했어요."
        description="죄송하지만 나중에 다시 시도해주세요."
        buttonLabel="커뮤니티로 가기"
        onButtonClick={() => router.replace("/community")}
      />
    );
  }

  if (communityDetail.userId !== currentUserId) {
    return (
      <FeedbackPage
        title="수정 권한이 없어요."
        description="작성한 게시글만 수정할 수 있어요."
        buttonLabel="게시글로 가기"
        onButtonClick={() => router.replace(`/community/${id}`)}
      />
    );
  }

  return (
    <>
      <Header
        variant="back"
        title="게시글 수정하기"
        fallbackPath={`/community/${id}`}
      />
      <CommunityEditFormContent
        key={id}
        postId={id}
        currentUserId={currentUserId}
        initialPost={communityDetail}
      />
    </>
  );
}

export default function CommunityEditPage() {
  return <CommunityEditPageContent />;
}
