"use client";

import { useRouter } from "next/navigation";
import DetailKebab from "../../_components/detail-kebab";
import {
  useDeleteCommunityPostMutation,
  useReportCommunityPostMutation,
} from "@/query/community";
import { useCurrentUserQuery } from "@/query/users";
import { buildCommunityEditPath } from "../../_utils/navigation";

interface CommunityDetailPostActionsProps {
  postId: string;
  postUserId: string;
  returnTo: string;
}

export default function CommunityDetailPostActions({
  postId,
  postUserId,
  returnTo,
}: CommunityDetailPostActionsProps) {
  const router = useRouter();
  const { data: currentUser } = useCurrentUserQuery();
  const { mutateAsync: deleteCommunityPost, isPending: isDeletePending } =
    useDeleteCommunityPostMutation();
  const { mutateAsync: reportCommunityPost } =
    useReportCommunityPostMutation();
  const currentUserId = currentUser?.id;

  const isAuthor = currentUserId === postUserId;

  const handleEdit = () => {
    router.push(buildCommunityEditPath(postId, returnTo));
  };

  const handleDelete = async () => {
    if (!currentUserId || isDeletePending) {
      return;
    }

    await deleteCommunityPost({
      postId,
      userId: currentUserId,
    });

    router.replace(returnTo);
  };

  const handleReport = async () => {
    if (!currentUserId) {
      return;
    }

    await reportCommunityPost({
      postId,
      reporterUserId: currentUserId,
    });
  };

  return (
    <DetailKebab
      entityName="게시글"
      variant={isAuthor ? "edit" : "default"}
      onEdit={isAuthor ? handleEdit : undefined}
      onDelete={isAuthor ? handleDelete : undefined}
      onReport={currentUserId && !isAuthor ? handleReport : undefined}
    />
  );
}
