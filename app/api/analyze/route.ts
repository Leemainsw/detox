import { OpenAI } from "openai";
import { tavily } from "@tavily/core";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const TAVILY_API_KEY = process.env.TAVILY_API_KEY;

if (!OPENAI_API_KEY || !TAVILY_API_KEY) {
  throw new Error("OPENAI_API_KEY and TAVILY_API_KEY must be configured");
}

const openai = new OpenAI({ apiKey: OPENAI_API_KEY });
const tavilyClient = tavily({ apiKey: TAVILY_API_KEY });

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
        },
      }
    );

    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      return Response.json(
        { error: "Unauthorized: 로그인이 필요합니다." },
        { status: 401 }
      );
    }

    const { subscriptions, userContext } = await req.json();

    if (!Array.isArray(subscriptions) || subscriptions.length === 0) {
      return Response.json(
        { error: "subscriptions 배열이 필요합니다." },
        { status: 400 }
      );
    }

    if (!userContext?.categoryRatio) {
      return Response.json(
        { error: "userContext.categoryRatio가 필요합니다." },
        { status: 400 }
      );
    }

    const searchResult = await tavilyClient.search(
      "2026년 대한민국 주요 구독 서비스(OTT, 쇼핑, 음악, 통신사 결합, AI) 최신 요금제 및 프로모션 할인 혜택",
      { searchDepth: "basic", maxResults: 3 }
    );

    const today = new Date().toISOString().split("T")[0];

    const systemPrompt = `
      당신은 전문적인 구독 자산 관리 전략가입니다. 
      사용자의 소비 패턴을 시장 데이터와 대조하여 '자산 최적화 리포트'를 생성하세요.

      [분석 가이드라인]
      1. 통계 데이터 산출: 이용 비중(${JSON.stringify(userContext.categoryRatio)})과 구독 내역을 바탕으로 월별 지출액(my_spend)과 시장 평균 지출액(avg_spend) 트렌드를 분석하세요.
      2. 최적화 차액 추론: Tavily 검색 결과(통신사 결합, 프로모션 등)를 기반으로, 최적화 시 절감할 수 있는 금액(diff_amount)을 도출하세요.
      3. 긍정적 자산 배분: title과 description 작성 시 '지출 낭비 지적'이 아닌 '더 현명한 가치 소비'의 관점에서 전문적이고 긍정적인 톤앤매너로 기술하세요.

      [응답 형식 제약]
      - 프론트엔드 타입 검증을 위해 반드시 아래 구조의 JSON으로만 응답하세요. 키(key) 이름과 구조를 절대 임의로 변경하지 마세요:
      {
        "type": "STATISTICS",
        "title": "리포트 제목 (예: 현명한 가치 소비 통계 리포트)",
        "description": "분석 결과에 대한 핵심 요약 및 맞춤형 조언",
        "last_updated": "${today}",
        "payload": {
          "chart_data": [
            {
              "month": "1월",
              "my_spend": 0,
              "avg_spend": 0
            },
            {
              "month": "2월",
              "my_spend": 0,
              "avg_spend": 0
            }
          ],
          "diff_amount": 0
        }
      }
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        {
          role: "user",
          content: `
              [분석 대상 데이터]
              - 내 구독 내역: ${JSON.stringify(subscriptions)}
              - 내 카테고리 이용 비중: ${JSON.stringify(userContext.categoryRatio)}
              - 실시간 시장 정보: ${JSON.stringify(searchResult.results)}
              
              위 데이터를 바탕으로 정밀 분석 리포트를 JSON으로 생성해줘.
            `,
        },
      ],
      response_format: { type: "json_object" },
    });

    const content = response.choices[0].message.content;

    if (!content) {
      throw new Error("AI 응답 생성에 실패했습니다.");
    }

    return Response.json(JSON.parse(content));
  } catch (error) {
    console.error("AI Analysis Error:", error);
    const message = error instanceof Error ? error.message : "알 수 없는 오류";
    return Response.json(
      { error: "분석 중 오류가 발생했습니다.", details: message },
      { status: 500 }
    );
  }
}
