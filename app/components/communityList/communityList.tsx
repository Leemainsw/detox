import { faCommentDots, faThumbsUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";

interface Props {
  href: string;
  userName: string;
  timeAgo: string;
  communityTitle: string;
  communityContent: string;
  likeCount: number;
  commentCount: number;
}

export default function CommunityList({
  href,
  userName,
  timeAgo,
  communityTitle,
  communityContent,
  likeCount,
  commentCount,
}: Props) {
  return (
    <Link
      href={href}
      className="w-full grid grid-cols-1 items-center gap-4 py-4 px-6 bg-white rounded-lg"
    >
      <div className="flex items-start gap-3">
        {/* <div className="w-12 h-12 rounded-xl border border-gray-100 bg-white flex items-center justify-center overflow-hidden">
          프로필사진
        </div> */}
        <div className="flex gap-2">
          <div className="text-sm text-black font-bold leading-[110%]">
            {userName}
          </div>
          <span className="text-xs text-gray-300">{timeAgo}</span>
        </div>
      </div>
      <div className="text-sm text-gray-300">
        <h6 className="text-lg text-black font-bold leading-[140%] mb-2 line-clamp-2">
          {communityTitle}
        </h6>
        <p className="text-base leading-[140%] text-gray-300 line-clamp-3">
          {communityContent}
        </p>
      </div>
      <div className="flex gap-4 mt-2">
        <div className="text-sm flex items-center gap-1 text-gray-200">
          <FontAwesomeIcon icon={faThumbsUp} size="sm" />
          <span className="text-gray-400">{likeCount}</span>
        </div>
        <div className="text-sm flex items-center gap-1 text-gray-200">
          <FontAwesomeIcon icon={faCommentDots} size="sm" />
          <span className="text-gray-400">{commentCount}</span>
        </div>
      </div>
    </Link>
  );
}
