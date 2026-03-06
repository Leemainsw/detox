export type SubscriptableBrandType =
  | "apple-music"
  | "apple-tv"
  | "chat-gpt"
  | "class101"
  | "claude"
  | "coupang"
  | "disney-plus"
  | "duolingo-max"
  | "duolingo"
  | "laftel"
  | "millie"
  | "naver-membership"
  | "netflix"
  | "nintendo-family"
  | "nord-vpn"
  | "office365"
  | "perplexity"
  | "prime-video"
  | "say-voca"
  | "snow"
  | "spotify"
  | "tving"
  | "toss-prime"
  | "watcha"
  | "wavve"
  | "welaaa"
  | "youtube-premium";

export type SubscriptableBrand = {
  [key in SubscriptableBrandType]: {
    label: string;
    image: string;
    category: string;
  };
};

export type BrandCategoryType =
  | "music"
  | "streaming"
  | "ai"
  | "education"
  | "shopping"
  | "ott"
  | "book"
  | "etc"
  | "game"
  | "picture";
export type BrandCategory = {
  [key in BrandCategoryType]: string;
};
