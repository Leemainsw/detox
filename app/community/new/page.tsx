"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/app/components/header";
import CommunityForm from "../_components/community-form";
import BrandTabs from "../_components/brand-tabs";
import Button from "@/app/components/button";
import type { CommunityServiceFilter } from "../_types";
import { useCurrentUserQuery } from "@/query/users";
import { useCreateCommunityPostMutation } from "@/query/community";

export default function CommunityNewPage() {
  const router = useRouter();

  const [selectedService, setSelectedService] =
    useState<CommunityServiceFilter>("netflix");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const currentUserQuery = useCurrentUserQuery();
  const createCommunityPostMutation = useCreateCommunityPostMutation();

  const isFormValid =
    selectedService !== "all" &&
    title.trim().length > 0 &&
    content.trim().length > 0;

  const handleSubmit = async () => {
    if (!currentUserQuery.data?.id) return;
    if (selectedService === "all") return;

    try {
      const createdPost = await createCommunityPostMutation.mutateAsync({
        userId: currentUserQuery.data.id,
        service: selectedService,
        title: title.trim(),
        content: content.trim(),
      });

      router.push(`/community/${createdPost.id}`);
    } catch (error) {
      console.error(error);
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
          disabled={
            !isFormValid ||
            !currentUserQuery.data?.id ||
            createCommunityPostMutation.isPending
          }
          loading={createCommunityPostMutation.isPending}
          onClick={handleSubmit}
        >
          작성 하기
        </Button>
      </div>
    </>
  );
}
