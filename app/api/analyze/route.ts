import { OpenAI } from "openai";
import { tavily } from "@tavily/core";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const TAVILY_API_KEY = process.env.TAVILY_API_KEY;
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!OPENAI_API_KEY || !TAVILY_API_KEY || !SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error("필수 환경 변수가 설정되지 않았습니다.");
}

const openai = new OpenAI({ apiKey: OPENAI_API_KEY });
const tavilyClient = tavily({ apiKey: TAVILY_API_KEY });

interface ChartDataItem {
  month: string;
  my_spend: number;
  avg_spend: number;
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

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();

    type CookieMethods = {
      getAll: () => { name: string; value: string }[];
      set: (name: string, value: string, options?: unknown) => void;
    };
    const cookieMethods = cookieStore as unknown as CookieMethods;

    const supabase = createServerClient(SUPABASE_URL!, SUPABASE_ANON_KEY!, {
      cookies: {
        getAll() {
          return cookieMethods.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieMethods.set(name, value, options);
          });
        },
      },
    });


    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError) {
      console.error("Supabase 세션 조회 실패:", sessionError);
      return Response.json(
        { error: "세션을 확인할 수 없습니다." },
        { status: 500 }
      );
    }

    const userId = session?.user?.id;
    if (!userId) {
      return Response.json({ error: "로그인이 필요합니다." }, { status: 401 });
    }

    const { data: subscriptions, error: dbError } = await supabase
      .from("subscription")
      .select("*")
      .eq("user_id", userId);

    const { userContext } = await req.json();

    if (dbError) throw dbError;

    if (!subscriptions || subscriptions.length === 0) {
      return Response.json({
        type: "NO_DATA",
        message:
          "아직 등록된 구독 서비스가 없어요!\n분석을 위해 구독 내역을 먼저 입력해 주시겠어요?",
      });
    }

    if (!userContext?.categoryRatio) {
      return Response.json(
        { error: "카테고리 비율 정보가 부족합니다." },
        { status: 400 }
      );
    }

    const currentYear = new Date().getFullYear();
    const searchResult = await withTimeout(
      tavilyClient.search(
        `${currentYear}년 대한민국 주요 구독 서비스(OTT, 쇼핑, 멤버십) 최신 요금제 및 결합 할인 혜택`,
        { searchDepth: "basic", maxResults: 3 }
      ),
      8000,
      "Tavily Search"
    );

    const systemPrompt = `
      당신은 대한민국 최고 수준의 '구독 자산 관리 전략가'이자 '가치 소비 큐레이터'입니다. 
      단순한 비용 절감을 넘어, 사용자의 라이프스타일에 최적화된 자산 배분 리포트를 생성하는 것이 목적입니다.

      [분석 가이드라인]
      1. 통계 데이터 분석: 
         - 사용자의 이용 비중(${JSON.stringify(userContext.categoryRatio)})과 실제 구독 내역을 대조하세요.
         - 특정 카테고리에 지출이 쏠려 있다면 '시장 평균(avg_spend)' 데이터를 활용해 객관적인 지표를 제시하세요.
      2. 최적화 전략 (Tavily 검색 데이터 활용):
         - 검색 결과에 나온 최신 통신사 결합(T우주, 유독, KT 패밀리 등)이나 카드사 프로모션을 적극 반영하세요.
         - 'diff_amount'는 단순히 '안 쓰면 아끼는 돈'이 아니라, '혜택을 챙겼을 때 환급받거나 절감되는 실질적 이득'으로 계산하세요.
      3. 톤앤매너:
         - "낭비하고 있습니다"라는 부정적 표현 대신 "이 혜택을 더하면 자산 가치가 올라갑니다"라는 긍정적이고 전문적인 어조를 유지하세요.

      [응답 형식 제약 - 반드시 엄수]
      - 반드시 아래 구조의 JSON으로만 응답하세요.
      {
        "type": "STATISTICS",
        "title": "리포트 제목 (예: OO님의 3월 가치 소비 최적화 리포트)",
        "description": "사용자의 소비 강점 1가지와 개선 포인트 1가지를 포함한 3줄 요약 조언",
        "last_updated": "${new Date().toISOString().split("T")[0]}",
        "payload": {
          "chart_data": [
            { "month": "1월", "my_spend": 0, "avg_spend": 0 },
            { "month": "2월", "my_spend": 0, "avg_spend": 0 },
            { "month": "3월", "my_spend": 0, "avg_spend": 0 }
          ],
          "diff_amount": 0
        }
      }
    `;

    const response = await withTimeout(
      openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          {
            role: "user",
            content: `구독내역: ${JSON.stringify(subscriptions)}, 시장정보: ${JSON.stringify(searchResult.results)}`,
          },
        ],
        response_format: { type: "json_object" },
      }),
      15000,
      "OpenAI Generation"
    );

    const content = response.choices[0].message.content;
    if (!content) throw new Error("AI 응답 생성 실패");

    const parsed = JSON.parse(content);

    const isValid =
      parsed?.type === "STATISTICS" &&
      typeof parsed?.title === "string" &&
      typeof parsed?.description === "string" &&
      typeof parsed?.last_updated === "string" &&
      Array.isArray(parsed?.payload?.chart_data) &&
      typeof parsed?.payload?.diff_amount === "number" &&
      parsed.payload.chart_data.every(
        (d: ChartDataItem) =>
          typeof d.month === "string" &&
          typeof d.my_spend === "number" &&
          typeof d.avg_spend === "number"
      );

    if (!isValid) throw new Error("AI 응답 형식이 유효하지 않습니다.");

    return Response.json(parsed);
  } catch (error) {
    console.error("AI Analysis Error:", error);
    const isDev = process.env.NODE_ENV !== "production";
    return Response.json(
      {
        error: "분석 중 오류가 발생했습니다.",
        ...(isDev && {
          details: error instanceof Error ? error.message : "Unknown",
        }),
      },
      { status: 500 }
    );
  }
}
