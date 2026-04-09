export const QUICK_ANALYSIS_QUESTIONS = [
  "내 소비 습관에 맞는 통신사 결합 할인 혜택을 분석해줘",
  "내가 중복으로 내는 구독료가 얼마인지 알려줘",
  "최근 3개월간 나의 구독 소비 추이를 분석해줘",
] as const;

export type QuickAnalysisQuestion = (typeof QUICK_ANALYSIS_QUESTIONS)[number];
