"use client";

import CommunityItem, { type CommunityListItem } from "./community-item";

type CommunityListProps = {
  items: CommunityListItem[];
};

export default function CommunityList({ items }: CommunityListProps) {
  return (
    <ul className="grid grid-cols-1 gap-5 pt-6">
      {items.map((item) => (
        <CommunityItem key={item.id} item={item} />
      ))}
    </ul>
  );
}
