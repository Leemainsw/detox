export type CommunityItem = {
  id: number;
  author: string;
  timeAgo: string;
  title: string;
  content: string;
  likeCount: number;
  commentCount: number;
  thumbUrl: string;
};

export const mockCommunityItems: CommunityItem[] = [
  {
    id: 1,
    title:
      "타이틀입니다.타이틀입니다.타이틀입니다.타이틀입니다.타이틀입니다.타이틀입니다.타이틀입니다.타이틀입니다.타이틀입니다.타이틀입니다.타이틀입니다.타이틀입니다.타이틀입니다.타이틀입니다.타이틀입니다.타이틀입니다.타이틀입니다.",
    content:
      "동해물과 백두산이 마르고 닳도록 하느님이 보우하사 우리 나라 만세.동해물과 백두산이 마르고 닳도록 하느님이 보우하사 우리 나라 만세.동해물과 백두산이 마르고 닳도록 하느님이 보우하사 우리 나라 만세.동해물과 백두산이 마르고 닳도록 하느님이 보우하사 우리 나라 만세.동해물과 백두산이 마르고 닳도록 하느님이 보우하사 우리 나라 만세. 동해물과 백두산이 마르고 닳도록 하느님이 보우하사 우리 나라 만세.동해물과 백두산이 마르고 닳도록 하느님이 보우하사 우리 나라 만세.동해물과 백두산이 마르고 닳도록 하느님이 보우하사 우리 나라 만세.동해물과 백두산이 마르고 닳도록 하느님이 보우하사 우리 나라 만세.동해물과 백두산이 마르고 닳도록 하느님이 보우하사 우리 나라 만세",
    author: "lyla",
    timeAgo: "2분전",
    likeCount: 10,
    commentCount: 5,
    thumbUrl: "/images/default-user.png",
  },
  {
    id: 2,
    title: "두 번째 커뮤니티 글",
    content: "상세 페이지로 이동해 구조를 확인해 보세요.",
    author: "detox-user",
    timeAgo: "1분전",
    likeCount: 20,
    commentCount: 8,
    thumbUrl: "/images/default-user.png",
  },
  {
    id: 3,
    title: "넷플릭스 4인팟 구해요",
    content:
      "다음 결제일은 3월 18일이고 한 자리 남았습니다. 오래 같이 하실 분만 댓글 주세요.",
    author: "streamingFan",
    timeAgo: "5분전",
    likeCount: 6,
    commentCount: 12,
    thumbUrl: "/images/default-user.png",
  },
  {
    id: 4,
    title: "챗GPT 팀플랜 같이 쓰실 분",
    content:
      "업무용으로 쓰고 있고 응답 속도 중요해서 안정적으로 참여하실 분 찾습니다.",
    author: "ai-worker",
    timeAgo: "13분전",
    likeCount: 15,
    commentCount: 7,
    thumbUrl: "/images/default-user.png",
  },
  {
    id: 5,
    title: "애플뮤직 패밀리 한 분 모집",
    content:
      "국내 계정만 받고 있고 매달 1일 정산합니다. 연락 주시면 오픈채팅 공유드릴게요.",
    author: "musiclover",
    timeAgo: "27분전",
    likeCount: 4,
    commentCount: 3,
    thumbUrl: "/images/default-user.png",
  },
  {
    id: 6,
    title: "쿠팡 와우 멤버십 정보 공유",
    content:
      "최근 혜택 변경된 부분 정리해봤어요. 로켓배송, 쿠팡플레이, 적립 조건까지 요약했습니다.",
    author: "deal-note",
    timeAgo: "42분전",
    likeCount: 22,
    commentCount: 16,
    thumbUrl: "/images/default-user.png",
  },
  {
    id: 7,
    title: "디즈니 플러스 화질 이슈 있으신 분?",
    content:
      "TV 앱에서 4K 전환이 잘 안 되네요. 동일 증상 있으시면 기기 정보랑 같이 공유 부탁드립니다.",
    author: "moviebuff",
    timeAgo: "1시간전",
    likeCount: 9,
    commentCount: 11,
    thumbUrl: "/images/default-user.png",
  },
  {
    id: 8,
    title: "라프텔/티빙 중 뭐가 더 나아요?",
    content:
      "애니 위주 시청인데 라프텔이 나을지 티빙이 나을지 고민 중입니다. 사용 후기 부탁드려요.",
    author: "ani-user",
    timeAgo: "2시간전",
    likeCount: 18,
    commentCount: 25,
    thumbUrl: "/images/default-user.png",
  },
];
