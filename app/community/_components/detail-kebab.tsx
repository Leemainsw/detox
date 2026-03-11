"use client";

import { useState } from "react";
import AlertDialogComponent from "@/app/components/alert/alert-dialog";
import KebabMenu from "@/app/components/kebabmenu";
import { useToast } from "@/app/hooks/useToast";
import type { AlertItem } from "@/store/useAlertStore";

type KebabVariant = "default" | "edit";

interface DetailKebabProps {
  variant?: KebabVariant;
}

export default function DetailKebab({ variant = "default" }: DetailKebabProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const { success, warning } = useToast();

  const deleteAlert: AlertItem = {
    id: "delete-post-alert",
    title: "게시글을 삭제할까요?",
    description: "삭제 후에는 되돌릴 수 없습니다.",
    confirmText: "삭제",
    cancelText: "취소",
    variant: "danger",
    onConfirm: () => {
      success("게시글이 삭제되었습니다.");
    },
  };

  return (
    <>
      <KebabMenu
        variant={variant}
        onEdit={variant === "edit" ? () => {} : undefined}
        onDelete={() => setIsDeleteDialogOpen(true)}
        onReport={() => warning("게시글이 신고되었습니다.")}
      />
      <AlertDialogComponent
        alert={deleteAlert}
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      />
    </>
  );
}
