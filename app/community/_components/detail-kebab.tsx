"use client";

import { useState } from "react";
import AlertDialogComponent from "@/app/components/alert/alert-dialog";
import KebabMenu from "@/app/components/kebabmenu";
import type { AlertItem } from "@/store/useAlertStore";
import { toast } from "sonner";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrashCan,
  faTriangleExclamation,
} from "@fortawesome/free-solid-svg-icons";

type KebabVariant = "default" | "edit";

interface DetailKebabProps {
  variant?: KebabVariant;
}

export default function DetailKebab({ variant = "default" }: DetailKebabProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const deleteAlert: AlertItem = {
    id: "delete-post-alert",
    title: "게시글을 삭제할까요?",
    description: "삭제 후에는 되돌릴 수 없습니다.",
    confirmText: "삭제",
    cancelText: "취소",
    variant: "danger",
    onConfirm: () => {
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
    },
  };

  return (
    <>
      <KebabMenu
        variant={variant}
        onEdit={variant === "edit" ? () => {} : undefined}
        onDelete={() => setIsDeleteDialogOpen(true)}
        onReport={() =>
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
