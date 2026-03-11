import type { SubscriptableBrandType } from "@/app/utils/brand/type";

export type CommunityServiceFilter = SubscriptableBrandType | "all";
export type CommunityListItemData = {
  id: string;
  service: SubscriptableBrandType;
  author: string;
  timeAgo: string;
  title: string;
  content: string;
  likeCount: number;
  commentCount: number;
  thumbUrl: string;
};
export type CommunityDetailData = CommunityListItemData & {
  createdAt: string;
};

export type CommunityListCursor = {
  createdAt: string;
  id: string;
};

export type CommunityListPage = {
  items: CommunityListItemData[];
  nextCursor: CommunityListCursor | null;
};
