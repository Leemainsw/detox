import OpenAI from "openai";

const MAX_INPUT_CHARS = 8_000;

export function buildPostEmbeddingInput(
  title: string,
  content: string
): string {
  return `${title.trim()}\n\n${content}`.slice(0, MAX_INPUT_CHARS);
}

/**
 * OpenAI text-embedding-3-small (DB vector(1536))
 */
export async function fetchPostEmbeddingVector(
  title: string,
  content: string
): Promise<number[] | null> {
  const apiKey = process.env.OPENAI_API_KEY?.trim();
  if (!apiKey) return null;

  try {
    const openai = new OpenAI({ apiKey });
    const res = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: buildPostEmbeddingInput(title, content),
      dimensions: 1536,
    });
    const v = res.data[0]?.embedding;
    return Array.isArray(v) ? v : null;
  } catch {
    return null;
  }
}
