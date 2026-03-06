export type CommunityCommentItem = {
  id: number;
  postId: number;
  author: string;
  timeAgo: string;
  content: string;
  thumbUrl: string;
};

export const mockCommunityComments: CommunityCommentItem[] = [
  {
    id: 1,
    postId: 1,
    author: "mint",
    timeAgo: "방금 전",
    content: "저도 이 내용 궁금했는데 정리해주셔서 감사합니다.",
    thumbUrl: "/images/default-user.png",
  },
  {
    id: 2,
    postId: 1,
    author: "jane",
    timeAgo: "3분전",
    content: "혹시 다음 달 모집도 하실 예정이면 알려주세요.",
    thumbUrl: "/images/default-user.png",
  },
  {
    id: 3,
    postId: 2,
    author: "neo",
    timeAgo: "10분전",
    content: "상세 레이아웃 참고하기 좋네요. 저도 비슷하게 작업 중입니다.",
    thumbUrl: "/images/default-user.png",
  },
  {
    id: 4,
    postId: 2,
    author: "rina",
    timeAgo: "24분전",
    content: "댓글 입력창 위치가 좋아요. 하단 고정도 잘 되네요.",
    thumbUrl: "/images/default-user.png",
  },
  {
    id: 5,
    postId: 3,
    author: "haru",
    timeAgo: "1시간전",
    content: "한 자리 남으면 저 참여하고 싶어요.",
    thumbUrl: "/images/default-user.png",
  },
];
