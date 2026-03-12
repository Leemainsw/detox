"use client";

import { useState } from "react";
import AlertDialogComponent from "@/app/components/alert/alert-dialog";
import KebabMenu from "@/app/components/kebabmenu";
import { useToast } from "@/app/hooks/useToast";
import type { AlertItem } from "@/store/useAlertStore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrashCan,
  faTriangleExclamation,
} from "@fortawesome/free-solid-svg-icons";

interface DetailKebabProps {
  variant?: "default" | "edit";
  onEdit?: () => void;
  onDelete?: () => Promise<void> | void;
}

export default function DetailKebab({
  variant = "default",
  onEdit,
  onDelete,
}: DetailKebabProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const { toast } = useToast();

  const deleteAlert: AlertItem = {
    id: "delete-post-alert",
    title: "게시글을 삭제할까요?",
    description: "삭제 후에는 되돌릴 수 없습니다.",
    confirmText: "삭제",
    cancelText: "취소",
    variant: "danger",
    onConfirm: async () => {
      try {
        await onDelete?.();

        toast(
          <span className="inline-flex items-center gap-2 body-md">
            <FontAwesomeIcon
              icon={faTrashCan}
              className="w-4 h-4 text-gray-400"
            />
            게시글이 삭제되었습니다.
          </span>,
          {
            className: "!justify-center",
            style: { textAlign: "center" },
          }
        );
      } catch (error) {
        console.error(error);
      }
    },
  };

  return (
    <>
      <KebabMenu
        variant={variant}
        onEdit={variant === "edit" ? onEdit : undefined}
        onDelete={
          variant === "edit" ? () => setIsDeleteDialogOpen(true) : undefined
        }
        onReport={
          variant === "default"
            ? () =>
                toast(
                  <span className="inline-flex items-center gap-2 body-md">
                    <FontAwesomeIcon
                      icon={faTriangleExclamation}
                      className="w-4 h-4 text-gray-400"
                    />
                    게시글이 신고되었습니다.
                  </span>,
                  {
                    className: "!justify-center",
                    style: { textAlign: "center" },
                  }
                )
            : undefined
        }
      />
      <AlertDialogComponent
        alert={deleteAlert}
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      />
    </>
  );
}
