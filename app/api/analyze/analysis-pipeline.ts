import { OpenAI } from "openai";
import { tavily } from "@tavily/core";
import { getSystemPrompt } from "@/app/utils/subscriptions/constants";

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const TAVILY_API_KEY = process.env.TAVILY_API_KEY;

if (!OPENAI_API_KEY || !TAVILY_API_KEY) {
  throw new Error("OPENAI_API_KEY 또는 TAVILY_API_KEY가 설정되지 않았습니다.");
}

const openai = new OpenAI({ apiKey: OPENAI_API_KEY });
const tavilyClient = tavily({ apiKey: TAVILY_API_KEY });

export function buildTavilyQuery(year: number, question: string): string {
  const q = question.trim();
  if (q.includes("중복")) {
    return `${year}년 한국 OTT 음악 스트리밍 구독 중복 과금 정리 절감`;
  }
  if (q.includes("3개월") || q.includes("추이")) {
    return `${year}년 한국 가구 구독 서비스 월평균 지출 통계 트렌드`;
  }
  return `${year}년 한국 통신사 결합 할인 카드 프로모션 SKT KT LG`;
}

const withTimeout = async <T>(
  promise: Promise<T>,
  ms: number,
  label: string
): Promise<T> => {
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    return await Promise.race([
      promise,
      new Promise<T>((_, reject) => {
        timer = setTimeout(
          () => reject(new Error(`${label} 타임아웃 (${ms}ms)`)),
          ms
        );
      }),
    ]);
  } finally {
    if (timer) clearTimeout(timer);
  }
};

export type StreamAnalysisParams = {
  subscriptions: Record<string, unknown>[];
  categoryRatio: Record<string, number>;
  questionText: string;
};

export async function streamSubscriptionAnalysis(
  params: StreamAnalysisParams,
  onChunk: (chunk: string) => void
): Promise<string> {
  const { subscriptions, categoryRatio, questionText } = params;
  const currentYear = new Date().getFullYear();
  const searchQuery = buildTavilyQuery(
    currentYear,
    questionText || "구독 할인"
  )
    .replace(/\s+/g, " ")
    .slice(0, 200);

  const searchResult = await withTimeout(
    tavilyClient.search(searchQuery, { maxResults: 5 }),
    8000,
    "Tavily Search"
  );

  const lastUpdated = new Date().toISOString().split("T")[0];
  const systemPrompt = getSystemPrompt(categoryRatio, lastUpdated, questionText);

  const stream = await withTimeout(
    openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.45,
      stream: true,
      messages: [
        { role: "system", content: systemPrompt },
        {
          role: "user",
          content: [
            `이번 호출에서 당신이 해야 할 일은 오직 이 질문에만 답하는 것입니다: ${JSON.stringify(questionText || "일반 구독 절감")}`,
            "다른 빠른 질문 유형(결합 전용 / 중복 전용 / 3개월 추이 전용)답변을 복사해 오지 마세요.",
            "구독 필드: service=서비스 키, total_amount=원 단위 납부금(주기에 따른 청구액), billing_cycle=과금 주기.",
            "반드시 위 구독 행을 인용해 서비스명·월 환산 금액·절감액(원)을 숫자로 적으세요.",
            `구독내역: ${JSON.stringify(subscriptions)}`,
            `카테고리 비중: ${JSON.stringify(categoryRatio)}`,
            `웹 검색 요약(출처·수치 인용 가능): ${JSON.stringify(searchResult.results)}`,
          ].join("\n"),
        },
      ],
    }),
    15000,
    "OpenAI"
  );

  let accumulated = "";
  for await (const event of stream) {
    const delta = event.choices?.[0]?.delta?.content;
    if (!delta) continue;
    accumulated += delta;
    onChunk(delta);
  }
  return accumulated;
}
