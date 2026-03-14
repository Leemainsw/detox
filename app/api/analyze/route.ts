import { OpenAI } from "openai";
import { tavily } from "@tavily/core";

// 인스턴스 초기화
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "",
});

const tavilyClient = tavily({ apiKey: process.env.TAVILY_API_KEY || "" });

export async function POST(req: Request) {
  try {
    const { subscriptions, userContext } = await req.json();

    // 실시간 시장 데이터 수집 tavily AI
    const searchResult = await tavilyClient.search(
      "2026년 대한민국 주요 구독 서비스(OTT, 쇼핑, 음악, 통신사 결합, AI) 최신 요금제 및 프로모션 할인 혜택",
      { searchDepth: "basic", maxResults: 3 }
    );

    const systemPrompt = `
      당신은 전문적인 구독 자산 관리 전략가입니다. 
      사용자의 소비 패턴을 시장 데이터와 대조하여 '자산 최적화 리포트'를 생성하세요.

      [분석 가이드라인]
      1. '비용 효율성(Cost-Efficiency) 점수' 산출: 이용 비중(${JSON.stringify(userContext.categoryRatio)}) 대비 지출의 적절성을 100점 만점으로 계산하세요.
      2. 중복 및 결합 할인 추론: Tavily 검색 결과에 기반하여, 사용자가 놓치고 있는 통신사 결합(T우주, 유독 등)이나 멤버십 혜택을 찾아내세요.
      3. 긍정적 자산 배분: 모든 제안은 '지출 낭비'가 아닌 '더 현명한 가치 소비'의 관점에서 기술하세요.

      [응답 형식 제약]
      - 반드시 아래 구조의 JSON으로만 응답하세요:
      {
        "type": "statistics",
        "efficiency_score": 0,
        "total_monthly_savings": 0,
        "analysis_summary": "전체 분석 요약",
        "details": [
          {
            "service_name": "서비스명",
            "status": "현재 상태 분석",
            "optimized_plan": "추천 대안 또는 유지",
            "logic": "추천 근거(시장 데이터 기반)"
          }
        ],
        "insight_tag": "사용자를 위한 한 줄 핵심 조언"
      }
    `;

    // OpenAI GPT-4o-mini 호출
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

    // 결과 반환
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
