"use client";

import { useParams, useRouter } from "next/navigation";
import Header from "@/app/components/header";
import CommunityForm from "../../_components/community-form";
import BrandTabs from "../../_components/brand-tabs";
import Button from "@/app/components/button";
import type { CommunityDetailData, CommunityServiceFilter } from "../../_types";
import { useCurrentUserQuery } from "@/query/users";
import {
  useCommunityDetailQuery,
  useUpdateCommunityPostMutation,
} from "@/query/community";
import { useState } from "react";

type CommunityEditFormContentProps = {
  postId: string;
  currentUserId: string;
  initialPost: CommunityDetailData;
};

function CommunityEditFormContent({
  postId,
  currentUserId,
  initialPost,
}: CommunityEditFormContentProps) {
  const router = useRouter();
  const updateCommunityPostMutation = useUpdateCommunityPostMutation();
  const [selectedService, setSelectedService] =
    useState<CommunityServiceFilter>(initialPost.service);
  const [title, setTitle] = useState(initialPost.title);
  const [content, setContent] = useState(initialPost.content);

  const isFormValid =
    selectedService !== "all" &&
    title.trim().length > 0 &&
    content.trim().length > 0;

  const handleSubmit = async () => {
    if (selectedService === "all") return;

    try {
      await updateCommunityPostMutation.mutateAsync({
        postId,
        userId: currentUserId,
        service: selectedService,
        title: title.trim(),
        content: content.trim(),
      });

      router.push(`/community/${postId}`);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <BrandTabs
        value={selectedService}
        onChange={setSelectedService}
        includeAll={false}
      />

      <main className="px-6">
        <CommunityForm
          title={title}
          content={content}
          onTitleChange={setTitle}
          onContentChange={setContent}
        />
      </main>

      <div className="btn-wrap px-5 py-6">
        <Button
          variant="primary"
          size="lg"
          disabled={!isFormValid || updateCommunityPostMutation.isPending}
          loading={updateCommunityPostMutation.isPending}
          onClick={handleSubmit}
        >
          수정 하기
        </Button>
      </div>
    </>
  );
}

export default function CommunityEditPage() {
  const { id } = useParams<{ id: string }>();
  const currentUserQuery = useCurrentUserQuery();
  const communityDetailQuery = useCommunityDetailQuery(id);

  if (communityDetailQuery.isPending || currentUserQuery.isPending) {
    return (
      <>
        <Header variant="back" title="게시글 수정하기" />
        <main className="px-6 py-8">
          <p className="body-md text-gray-400">게시글을 불러오는 중입니다.</p>
        </main>
      </>
    );
  }

  if (
    currentUserQuery.isError ||
    !currentUserQuery.data ||
    communityDetailQuery.isError ||
    !communityDetailQuery.data
  ) {
    return (
      <>
        <Header variant="back" title="게시글 수정하기" />
        <main className="px-6 py-8">
          <p className="body-md text-gray-400">게시글을 불러오지 못했어요.</p>
        </main>
      </>
    );
  }

  if (communityDetailQuery.data.userId !== currentUserQuery.data.id) {
    return (
      <>
        <Header variant="back" title="게시글 수정하기" />
        <main className="px-6 py-8">
          <p className="body-md text-gray-400">
            작성한 게시글만 수정할 수 있어요.
          </p>
        </main>
      </>
    );
  }

  return (
    <>
      <Header variant="back" title="게시글 수정하기" />
      <CommunityEditFormContent
        key={id}
        postId={id}
        currentUserId={currentUserQuery.data.id}
        initialPost={communityDetailQuery.data}
      />
    </>
  );
}
