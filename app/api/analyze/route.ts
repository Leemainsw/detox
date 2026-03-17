import { OpenAI } from "openai";
import { tavily } from "@tavily/core";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { createClient } from "@supabase/supabase-js";
import { subscriptableBrand } from "@/app/utils/brand/brand"; 

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

interface AnalysisItem {
  question: string;
  content: string;
  brand: string;
}

// --- Utils ---
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

// --- Main Handler ---
export async function POST(req: Request) {
  try {
    const { userContext } = await req.json();

    if (!userContext?.categoryRatio) {
      return Response.json(
        { error: "카테고리 비율 정보가 부족합니다." },
        { status: 400 }
      );
    }

    const availableBrands = Object.keys(subscriptableBrand).join(", ");

    const cookieStore = await cookies();
    type CookieMethods = {
      getAll: () => { name: string; value: string }[];
      set: (name: string, value: string, options?: unknown) => void;
    };
    const cookieMethods = cookieStore as unknown as CookieMethods;

    let supabase = createServerClient(SUPABASE_URL!, SUPABASE_ANON_KEY!, {
      cookies: {
        getAll() { return cookieMethods.getAll(); },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieMethods.set(name, value, options);
          });
        },
      },
    });

    let userId: string | undefined;
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    if (sessionError) console.error("Supabase 세션 조회 실패:", sessionError);
    userId = session?.user?.id;

    if (!userId && userContext?.session?.access_token && userContext?.session?.refresh_token) {
      const tokenClient = createClient(SUPABASE_URL!, SUPABASE_ANON_KEY!);
      await tokenClient.auth.setSession({
        access_token: userContext.session.access_token,
        refresh_token: userContext.session.refresh_token,
      });
      const { data: { user } } = await tokenClient.auth.getUser();
      userId = user?.id;
      supabase = tokenClient as unknown as typeof supabase;
    }

    if (!userId) {
      return Response.json({ error: "로그인이 필요합니다." }, { status: 401 });
    }

    const { data: subscriptions, error: dbError } = await supabase
      .from("subscription")
      .select("*")
      .eq("user_id", userId);

    if (dbError) throw dbError;

    if (!subscriptions || subscriptions.length === 0) {
      return Response.json({
        type: "NO_DATA",
        message: "아직 등록된 구독 서비스가 없어요!\n분석을 위해 구독 내역을 먼저 입력해 주시겠어요?",
      });
    }

    const currentYear = new Date().getFullYear();
    const searchResult = await withTimeout(
      tavilyClient.search(
        `${currentYear}년 한국 OTT 및 구독 서비스 최신 요금제, 통신사(SKT T우주, 유독, KT) 결합 할인 프로모션 정보`,
        { searchDepth: "advanced", maxResults: 5 }
      ),
      10000,
      "Tavily Search"
    );

    const systemPrompt = `
    당신은 대한민국 최고 수준의 '구독 자산 관리 전략가'입니다. 
    사용자의 구독 현황과 라이프스타일을 분석하여 개인화된 Q&A 리포트를 생성하세요.

    [사용자 정보]
    - 닉네임: ${userContext.nickname || "고객"}님
    - 현재 구독 내역: ${JSON.stringify(subscriptions)}
    - 카테고리 비중: ${JSON.stringify(userContext.categoryRatio)}

    [분석 가이드라인]
    1. 질문 중심의 분석: 고정된 제목 대신 유저의 상황을 날카롭게 지적하는 '질문'과 '해결책' 세트를 만드세요.
       (예: "${userContext.nickname}님, 중복되는 OTT 요금을 월 5,000원 더 아낄 수 있다면?")
    2. 콘텐츠 유동성: 억지로 해지를 권유하기보다, 검색된 최신 시장 정보를 바탕으로 실질적인 '이득'이 되는 정보만 최대 3개 생성하세요.
    3. 브랜드 키값 엄수: 'brand' 필드에는 반드시 아래 리스트의 키값만 사용하세요.
       - 허용 리스트: [${availableBrands}]
    4. 팩트 기반: 구체적인 서비스명과 할인 금액을 포함하고, 전문적이면서도 친근한 어조를 유지하세요.

    [응답 형식 제약 - 반드시 JSON으로만 응답]
    {
      "type": "STATISTICS",
      "title": "닉네임을 활용한 매력적인 리포트 제목",
      "description": "닉네임을 언급하며 시작하는 소비 핵심 요약 (3줄)",
      "last_updated": "${new Date().toISOString().split("T")[0]}",
      "payload": {
        "analysis_items": [
          {
            "question": "유저의 상황을 콕 집는 질문",
            "content": "구체적인 수치와 브랜드가 포함된 솔루션",
            "brand": "위 허용 리스트 중 하나"
          }
        ],
        "chart_data": [
          { "month": "1월", "my_spend": 0, "avg_spend": 25000 },
          { "month": "2월", "my_spend": 0, "avg_spend": 25000 },
          { "month": "3월", "my_spend": ${userContext.totalAmount || 0}, "avg_spend": 25000 }
        ],
        "diff_amount": 0,
        "diff_message": "이전 대비 절감 가능 액수 또는 응원 메시지"
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
      20000,
      "OpenAI Generation"
    );

    const content = response.choices[0].message.content;
    if (!content) throw new Error("AI 응답 생성 실패");

    const parsed = JSON.parse(content);

    const isValid =
      parsed?.type === "STATISTICS" &&
      Array.isArray(parsed?.payload?.analysis_items) &&
      parsed.payload.analysis_items.every(
        (item: AnalysisItem) => typeof item.brand === "string" && typeof item.question === "string"
      );

    if (!isValid) throw new Error("AI 응답 형식이 유효하지 않습니다.");

    return Response.json(parsed);
  } catch (error) {
    console.error("AI Analysis Error:", error);
    return Response.json(
      { error: "분석 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}