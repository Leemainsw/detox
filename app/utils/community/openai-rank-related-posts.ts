import OpenAI from "openai";
import type { SubscriptableBrandType } from "@/app/utils/brand/type";
import { subscriptableBrand } from "@/app/utils/brand/brand";

const RANK_TIMEOUT_MS = 18_000;

function withTimeout<T>(
  promise: Promise<T>,
  ms: number,
  label: string
): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  return Promise.race([
    promise,
    new Promise<T>((_, reject) => {
      timer = setTimeout(
        () => reject(new Error(`${label} 타임아웃 (${ms}ms)`)),
        ms
      );
    }),
  ]).finally(() => {
    if (timer) clearTimeout(timer);
  });
}

export type RankRelatedCandidate = {
  id: string;
  title: string;
  contentPreview: string;
};

/**
 * 후보 글 id 중 현재 글과 주제가 가까운 순으로 최대 limit개만 반환.
 */
export async function rankRelatedPostIdsWithOpenAI(params: {
  sourceTitle: string;
  sourceContent: string;
  service: SubscriptableBrandType;
  candidates: RankRelatedCandidate[];
  limit: number;
}): Promise<string[] | null> {
  const apiKey = process.env.OPENAI_API_KEY?.trim();
  if (!apiKey || params.candidates.length === 0) {
    return null;
  }

  const brandLabel =
    subscriptableBrand[params.service]?.label ?? params.service;
  const sourceBody = [
    `서비스/카테고리: ${brandLabel}`,
    `제목: ${params.sourceTitle}`,
    `본문:\n${params.sourceContent.slice(0, 2_000)}`,
  ].join("\n");

  const list = params.candidates
    .map(
      (c, i) =>
        `[${i + 1}] id=${c.id}\n제목: ${c.title}\n미리보기: ${c.contentPreview.slice(0, 200)}`
    )
    .join("\n\n");

  const userPrompt = `${sourceBody}\n\n아래는 후보 게시글입니다. 현재 글과 주제·질문 맥락이 가장 가까운 순으로 고르세요.\n후보 id만 사용하고, 목록에 없는 id는 쓰지 마세요.\n\n${list}\n\n응답은 반드시 JSON 객체 하나: {"ids":["uuid",...]} 형식. 최대 ${params.limit}개.`;

  try {
    const openai = new OpenAI({ apiKey });
    const completion = await withTimeout(
      openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content:
              'You rank related community posts by topical relevance. Reply with JSON only: {"ids":["..."]} using only candidate ids from the user message.',
          },
          { role: "user", content: userPrompt },
        ],
        response_format: { type: "json_object" },
        temperature: 0.2,
      }),
      RANK_TIMEOUT_MS,
      "OpenAI 추천 랭킹"
    );

    const raw = completion.choices[0]?.message?.content?.trim();
    if (!raw) return null;

    const parsed = JSON.parse(raw) as { ids?: unknown };
    if (!Array.isArray(parsed.ids)) return null;

    const allowed = new Set(params.candidates.map((c) => c.id));
    const ids: string[] = [];
    for (const v of parsed.ids) {
      if (typeof v !== "string" || !allowed.has(v)) continue;
      if (ids.includes(v)) continue;
      ids.push(v);
      if (ids.length >= params.limit) break;
    }

    return ids.length > 0 ? ids : null;
  } catch {
    return null;
  }
}
