import { BrandCategory as BrandCategoryType, SubscriptableBrand } from "./type";

export const BrandCategory: BrandCategoryType = {
  music: "music",
  streaming: "streaming",
  ai: "AI",
  education: "education",
  ott: "OTT/영상",
  shopping: "쇼핑/멤버십",
  book: "도서",
  etc: "기타",
  game: "게임",
  picture: "사진/동영상",
};

export const subscriptableBrand: SubscriptableBrand = {
  netflix: {
    label: "넷플릭스",
    image: "/images/netflix.png",
    category: "ott",
  },
  "apple-music": {
    label: "애플 뮤직",
    image: "/image/apple-music.png",
    category: "music",
  },
  "apple-tv": {
    label: "애플 티비",
    image: "/image/apple-tv.png",
    category: "ott",
  },
  "chat-gpt": {
    label: "챗GPT",
    image: "/image/chat-gpt.png",
    category: "ai",
  },
  class101: {
    label: "클래스101",
    image: "/image/class101.png",
    category: "education",
  },
  claude: {
    label: "클로드",
    image: "/image/claude.png",
    category: "ai",
  },
  coupang: {
    label: "쿠팡",
    image: "/image/coupang.png",
    category: "shopping",
  },
  "disney-plus": {
    label: "디즈니+",
    image: "/image/disney-plus.png",
    category: "ott",
  },
  "duolingo-max": {
    label: "듀오링고 맥스",
    image: "/image/duolingo-max.png",
    category: "education",
  },
  duolingo: {
    label: "듀오링고",
    image: "/image/duolingo.png",
    category: "education",
  },
  laftel: {
    label: "라프텔",
    image: "/image/laftel.png",
    category: "ott",
  },
  millie: {
    label: "밀리의 서재",
    image: "/image/millie.png",
    category: "book",
  },
  "naver-membership": {
    label: "네이버 맴버십",
    image: "/image/naver-membership.png",
    category: "shopping",
  },
  "nintendo-family": {
    label: "닌텐도 패밀리",
    image: "/image/nintendo-family.png",
    category: "game",
  },
  "nord-vpn": {
    label: "노드 VPN",
    image: "/image/nord-vpn.png",
    category: "etc",
  },
  office365: {
    label: "오피스365",
    image: "/image/office365.png",
    category: "education",
  },
  perplexity: {
    label: "퍼플렉시티",
    image: "/image/perplexity.png",
    category: "ai",
  },
  "prime-video": {
    label: "프라임 비디오",
    image: "/image/prime-video.png",
    category: "ott",
  },
  "say-voca": {
    label: "말해보카",
    image: "/image/say-voca.png",
    category: "education",
  },
  snow: {
    label: "스노우",
    image: "/image/snow.png",
    category: "picture",
  },
  spotify: {
    label: "스포티파이",
    image: "/image/spotify.png",
    category: "music",
  },
  tving: {
    label: "티빙",
    image: "/image/tving.png",
    category: "ott",
  },
  "toss-prime": {
    label: "토스 프라임",
    image: "/image/toss-prime.png",
    category: "shopping",
  },
  watcha: {
    label: "왓챠",
    image: "/image/watcha.png",
    category: "ott",
  },
  wavve: {
    label: "웨이브",
    image: "/image/wavve.png",
    category: "ott",
  },
  welaaa: {
    label: "윌라",
    image: "/image/welaaa.png",
    category: "book",
  },
  "youtube-premium": {
    label: "유튜브 프리미엄",
    image: "/image/youtube-premium.png",
    category: "music",
  },
};
