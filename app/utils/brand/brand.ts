import { BrandCategory as BrandCategoryType, SubscriptableBrand } from "./type";
import type { SubscriptableBrandType } from "./type";

export const BrandCategory: BrandCategoryType = {
  music: "음악",
  streaming: "스트리밍",
  ai: "AI",
  education: "교육",
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
    image: "/images/subscribe-logos/netflix.png",
    category: "ott",
  },
  "apple-music": {
    label: "애플 뮤직",
    image: "/images/subscribe-logos/apple-music.png",
    category: "music",
  },
  "apple-tv": {
    label: "애플 티비",
    image: "/images/subscribe-logos/apple-tv.png",
    category: "ott",
  },
  "chat-gpt": {
    label: "챗GPT",
    image: "/images/subscribe-logos/chat-gpt.png",
    category: "ai",
  },
  class101: {
    label: "클래스 101",
    image: "/images/subscribe-logos/class101.png",
    category: "education",
  },
  claude: {
    label: "클로드",
    image: "/images/subscribe-logos/claude.png",
    category: "ai",
  },
  coupang: {
    label: "쿠팡",
    image: "/images/subscribe-logos/coupang.png",
    category: "shopping",
  },
  "disney-plus": {
    label: "디즈니+",
    image: "/images/subscribe-logos/disney-plus.png",
    category: "ott",
  },
  "duolingo-max": {
    label: "듀오링고 맥스",
    image: "/images/subscribe-logos/duolingo-max.png",
    category: "education",
  },
  duolingo: {
    label: "듀오링고",
    image: "/images/subscribe-logos/duolingo.png",
    category: "education",
  },
  laftel: {
    label: "라프텔",
    image: "/images/subscribe-logos/laftel.png",
    category: "ott",
  },
  millie: {
    label: "밀리의 서재",
    image: "/images/subscribe-logos/millie.png",
    category: "book",
  },
  "naver-membership": {
    label: "네이버 멤버십",
    image: "/images/subscribe-logos/naver-membership.png",
    category: "shopping",
  },
  "nintendo-family": {
    label: "닌텐도 패밀리",
    image: "/images/subscribe-logos/nintendo-family.png",
    category: "game",
  },
  "nord-vpn": {
    label: "노드 VPN",
    image: "/images/subscribe-logos/nord-vpn.png",
    category: "etc",
  },
  office365: {
    label: "오피스 365",
    image: "/images/subscribe-logos/office365.png",
    category: "education",
  },
  perplexity: {
    label: "퍼플렉시티",
    image: "/images/subscribe-logos/perplexity.png",
    category: "ai",
  },
  "prime-video": {
    label: "프라임 비디오",
    image: "/images/subscribe-logos/prime-video.png",
    category: "ott",
  },
  "say-voca": {
    label: "말해보카",
    image: "/images/subscribe-logos/say-voca.png",
    category: "education",
  },
  snow: {
    label: "스노우",
    image: "/images/subscribe-logos/snow.png",
    category: "picture",
  },
  spotify: {
    label: "스포티 파이",
    image: "/images/subscribe-logos/spotify.png",
    category: "music",
  },
  tving: {
    label: "티빙",
    image: "/images/subscribe-logos/tving.png",
    category: "ott",
  },
  "toss-prime": {
    label: "토스 프라임",
    image: "/images/subscribe-logos/toss-prime.png",
    category: "shopping",
  },
  watcha: {
    label: "왓챠",
    image: "/images/subscribe-logos/watcha.png",
    category: "ott",
  },
  wavve: {
    label: "웨이브",
    image: "/images/subscribe-logos/wavve.png",
    category: "ott",
  },
  welaaa: {
    label: "윌라",
    image: "/images/subscribe-logos/welaaa.png",
    category: "book",
  },
  "youtube-premium": {
    label: "유튜브 프리미엄",
    image: "/images/subscribe-logos/youtube-premium.png",
    category: "music",
  },
};

export function getBrandsByCategory(
  category: string
): SubscriptableBrandType[] {
  if (category === "all") {
    return Object.keys(subscriptableBrand) as SubscriptableBrandType[];
  }
  return (Object.keys(subscriptableBrand) as SubscriptableBrandType[]).filter(
    (key) => subscriptableBrand[key].category === category
  );
}

export const CATEGORY_FILTER_OPTIONS = Object.entries(BrandCategory).map(
  ([value, label]) => ({ label, value })
);
