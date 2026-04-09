import { OpenAI } from "openai";
import { tavily } from "@tavily/core";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { getSystemPrompt } from "@/app/utils/subscriptions/constants";
import { validateAnalysisResponse } from "@/app/utils/subscriptions/validation";
import { extractJsonChunk } from "@/app/utils/ai/stream-parser";

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const TAVILY_API_KEY = process.env.TAVILY_API_KEY;
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!OPENAI_API_KEY || !TAVILY_API_KEY || !SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error("필수 환경 변수가 설정되지 않았습니다.");
}

const openai = new OpenAI({ apiKey: OPENAI_API_KEY });
const tavilyClient = tavily({ apiKey: TAVILY_API_KEY });

const withTimeout = async <T>(promise: Promise<T>, ms: number, label: string): Promise<T> => {
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    return await Promise.race([
      promise,
      new Promise<T>((_, reject) => {
        timer = setTimeout(() => reject(new Error(`${label} 타임아웃 (${ms}ms)`)), ms);
      }),
    ]);
  } finally {
    if (timer) clearTimeout(timer);
  }
};

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const supabase = createServerClient(SUPABASE_URL!, SUPABASE_ANON_KEY!, {
      cookies: {
        get(name: string) { return cookieStore.get(name)?.value; },
      },
    });

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const { data: subscriptions, error: dbError } = await supabase
      .from("subscription")
      .select("*")
      .eq("user_id", session.user.id);

    const { userContext, question } = await req.json();

    if (dbError || !subscriptions?.length || !userContext?.categoryRatio) {
      return Response.json({ error: "데이터 부족" }, { status: 400 });
    }

    // Tavily 검색
    const currentYear = new Date().getFullYear();
    const searchResult = await withTimeout(
      tavilyClient.search(`${currentYear}년 한국 구독 서비스 할인 프로모션`, { maxResults: 3 }),
      8000,
      "Tavily Search"
    );

    // 💡 분리된 프롬프트 함수 사용
    const lastUpdated = new Date().toISOString().split("T")[0];
    const systemPrompt = getSystemPrompt(userContext.categoryRatio, lastUpdated);

    const stream = await withTimeout(
      openai.chat.completions.create({
        model: "gpt-4o-mini",
        stream: true,
        messages: [
          { role: "system", content: systemPrompt },
          {
            role: "user",
            content: `질문: ${JSON.stringify(question ?? "")}\n구독내역: ${JSON.stringify(subscriptions)}\n시장정보: ${JSON.stringify(searchResult.results)}`,
          },
        ],
      }),
      15000,
      "OpenAI"
    );

    const encoder = new TextEncoder();
    let accumulated = "";

    const readable = new ReadableStream<Uint8Array>({
      async start(controller) {
        try {
          for await (const event of stream) {
            const delta = event.choices?.[0]?.delta?.content;
            if (!delta) continue;
            accumulated += delta;
            controller.enqueue(encoder.encode(delta));
          }
        } catch (e) {
          console.error("OpenAI stream error:", e);
        } finally {
          try {
            const { jsonPart } = extractJsonChunk(accumulated);
            if (jsonPart) {
              const parsed = JSON.parse(jsonPart);
              if (!validateAnalysisResponse(parsed)) {
                console.error("Invalid AI JSON shape");
              }
            } else {
              console.error("Missing [JSON_DATA] marker in AI output");
            }
          } catch (e) {
            console.error("Final JSON parse/validate error:", e);
          }
          controller.close();
        }
      },
    });

    return new Response(readable, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("Analysis Error:", error);
    return Response.json({ error: "분석 중 오류 발생" }, { status: 500 });
  }
}