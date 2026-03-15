"use client";

import BrandBox from "@/app/components/brand-box";
import type { SubscriptableBrandType } from "@/app/utils/brand/type";
import { cn } from "@/lib/utils";
import CommunityNotificationBox from "./community-notification-box";
import { formatRelativeTime } from "@/app/utils/date/formatRelativeTime";
import {
  useDeleteNotificationMutation,
  useReadNotificationMutation,
} from "@/query/notification";
import { useToast } from "@/app/hooks/useToast";
import type { Tables } from "@/types/supabase.types";
import getNotificationTitle from "@/app/utils/notifications/getNotificationTitle";

type NotificationWithSubscription = Tables<"notification"> & {
  subscription?: Tables<"subscription"> | null;
};

interface Props {
  notification: NotificationWithSubscription;
}

export default function NotificationItem({ notification }: Props) {
  const { error, success } = useToast();

  const deleteMutation = useDeleteNotificationMutation(notification.user_id);
  const readMutation = useReadNotificationMutation(notification.user_id);
  const isDeleting = deleteMutation.isPending;

  const handleDeleteClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await deleteMutation.mutateAsync(notification.id);
      success("삭제되었어요.");
    } catch (err) {
      const message = err instanceof Error ? err.message : "삭제에 실패했어요.";
      error(message);
    }
  };

  const handleRead = async () => {
    try {
      await readMutation.mutateAsync(notification.id);
      success("읽음 처리되었어요.");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "읽음 처리에 실패했어요.";
      error(message);
    }
  };

  const brand = (notification.subscription?.service ??
    "netflix") as SubscriptableBrandType;

  const isCommunity = notification.type.includes("community");
  const communityType =
    notification.type === "community_comment" ? "comment" : "like";

  return (
    <li
      className={cn(
        "w-full flex justify-between items-center gap-2 cursor-pointer",
        notification.is_read && "opacity-50"
      )}
      onClick={handleRead}
    >
      <div className="flex items-center gap-3">
        {isCommunity ? (
          <CommunityNotificationBox type={communityType} />
        ) : (
          <BrandBox brandType={brand} size="sm" />
        )}
        <div className="flex flex-col items-start gap-1 w-[calc(100%-48px-12px)]">
          {getNotificationTitle(notification.type, notification.title)}
          <span className="body-lg font-normal text-gray-400 wrap-break-word">
            {notification.message}
          </span>
        </div>
      </div>
      <div className="flex flex-col justify-between items-end gap-2 whitespace-nowrap w-1/4">
        <span className="body-md text-gray-200">
          {formatRelativeTime(notification.created_at)}
        </span>
        <button
          type="button"
          className="body-md font-normal text-gray-300 disabled:opacity-50"
          onClick={handleDeleteClick}
          disabled={isDeleting}
        >
          삭제
        </button>
      </div>
    </li>
  );
}
