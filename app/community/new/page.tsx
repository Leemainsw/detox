"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/app/components/header";
import CommunityForm from "../_components/community-form";
import BrandTabs from "../_components/brand-tabs";
import Button from "@/app/components/button";
import { useToast } from "@/app/hooks/useToast";
import type { CommunityServiceValue } from "../_types";
import { useCurrentUserQuery } from "@/query/users";
import { useCreateCommunityPostMutation } from "@/query/community";

function CommunityNewPageContent() {
  const router = useRouter();
  const { error } = useToast();

  const [selectedService, setSelectedService] =
    useState<CommunityServiceValue>("netflix");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const { data: currentUser } = useCurrentUserQuery();
  const currentUserId = currentUser?.id;
  const { mutateAsync: createCommunityPost, isPending: isCreatePending } =
    useCreateCommunityPostMutation();

  const isFormValid = title.trim().length > 0 && content.trim().length > 0;

  const handleSubmit = async () => {
    if (!currentUserId || !isFormValid || isCreatePending) {
      return;
    }

    try {
      const createdPost = await createCommunityPost({
        userId: currentUserId,
        service: selectedService,
        title: title.trim(),
        content: content.trim(),
      });

      router.push(`/community/${createdPost.id}`);
    } catch (createPostError) {
      console.error(createPostError);
      error("게시글 작성에 실패했어요.");
    }
  };

  return (
    <>
      <Header variant="back" title="게시글 작성하기" />

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
          disabled={!isFormValid || !currentUserId}
          loading={isCreatePending}
          onClick={handleSubmit}
        >
          작성 하기
        </Button>
      </div>
    </>
  );
}

export default function CommunityNewPage() {
  return <CommunityNewPageContent />;
}
