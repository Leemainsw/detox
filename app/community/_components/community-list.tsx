"use client";
import Avatar from "@/app/components/avatar";
import Link from "next/link";
import CommunityReactionStats from "./community-reaction-stats";

type CommunityItem = {
  id: number;
  author: string;
  timeAgo: string;
  title: string;
  content: string;
  likeCount: number;
  commentCount: number;
  thumbUrl: string;
};
type CommunityListProps = {
  items: CommunityItem[];
};

export default function CommunityList({ items }: CommunityListProps) {
  return (
    <ul className="grid grid-cols-1 gap-5 pt-6">
      {items.map((item) => (
        <li
          key={item.id}
          className="w-full grid grid-cols-1 items-center gap-2 py-4 px-6 bg-white rounded-lg"
        >
          <Link href={`/community/${item.id}`} className="block">
            <div className="flex items-center gap-2">
              <Avatar size="sm" src={item.thumbUrl} alt={item.author} />
              <div className="flex gap-3">
                <div className="text-sm text-black font-bold leading-[110%]">
                  {item.author}
                </div>
                <span className="text-xs text-gray-300">{item.timeAgo}</span>
              </div>
            </div>
            <div className="text-sm text-gray-300 mt-4">
              <h6 className="text-lg text-black font-bold leading-[140%] mb-2 line-clamp-2">
                {item.title}
              </h6>
              <p className="text-base leading-[140%] text-gray-300 line-clamp-3">
                {item.content}
              </p>
            </div>
          </Link>
          <CommunityReactionStats
            likeCount={item.likeCount}
            commentCount={item.commentCount}
          />
        </li>
      ))}
    </ul>
  );
}
