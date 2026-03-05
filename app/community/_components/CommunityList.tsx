import { faCommentDots, faThumbsUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";

type CommunityItem = {
  id: number;
  author: string;
  timeAgo: string;
  title: string;
  content: string;
  likeCount: number;
  commentCount: number;
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
          className="w-full grid grid-cols-1 items-center gap-4 py-4 px-6 bg-white rounded-lg"
        >
          <Link href={`/community/${item.id}`} className="block">
            <div className="flex items-start gap-3">
              {/* <div className="w-12 h-12 rounded-xl border border-gray-100 bg-white flex items-center justify-center overflow-hidden">
          프로필사진
        </div> */}
              <div className="flex gap-2">
                <div className="text-sm text-black font-bold leading-[110%]">
                  {item.author}
                </div>
                <span className="text-xs text-gray-300">{item.timeAgo}</span>
              </div>
            </div>
            <div className="text-sm text-gray-300">
              <h6 className="text-lg text-black font-bold leading-[140%] mb-2 line-clamp-2">
                {item.title}
              </h6>
              <p className="text-base leading-[140%] text-gray-300 line-clamp-3">
                {item.content}
              </p>
            </div>
            <div className="flex gap-4 mt-2">
              <div className="text-sm flex items-center gap-1 text-gray-200">
                <FontAwesomeIcon icon={faThumbsUp} size="sm" />
                <span className="text-gray-400">{item.likeCount}</span>
              </div>
              <div className="text-sm flex items-center gap-1 text-gray-200">
                <FontAwesomeIcon icon={faCommentDots} size="sm" />
                <span className="text-gray-400">{item.commentCount}</span>
              </div>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}
