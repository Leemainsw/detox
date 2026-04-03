import { fetchPostEmbeddingVector } from "@/app/utils/community/post-embedding-openai";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import { NextResponse } from "next/server";

/**
 * 본인 글에 대해 임베딩을 계산해 post.embedding에 저장합
 */
export async function POST(request: Request) {
  let body: { postId?: string };
  try {
    body = (await request.json()) as { postId?: string };
  } catch {
    return NextResponse.json(
      { error: "JSON 본문이 필요합니다." },
      { status: 400 }
    );
  }

  const postId = body.postId?.trim();
  if (!postId) {
    return NextResponse.json(
      { error: "postId가 필요합니다." },
      { status: 400 }
    );
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.id) {
    return NextResponse.json(
      { error: "로그인이 필요합니다." },
      { status: 401 }
    );
  }

  const { data: post, error: postError } = await supabase
    .from("post")
    .select("id, user_id, title, content")
    .eq("id", postId)
    .is("deleted_at", null)
    .maybeSingle();

  if (postError || !post) {
    return NextResponse.json(
      { error: "게시글을 찾을 수 없습니다." },
      { status: 404 }
    );
  }

  if (post.user_id !== user.id) {
    return NextResponse.json({ error: "권한이 없습니다." }, { status: 403 });
  }

  const vector = await fetchPostEmbeddingVector(post.title, post.content);
  if (!vector) {
    return NextResponse.json(
      {
        error: "임베딩을 생성하지 못했습니다.",
      },
      { status: 503 }
    );
  }

  const { error: updateError } = await supabase
    .from("post")
    .update({ embedding: vector })
    .eq("id", postId)
    .eq("user_id", user.id);

  if (updateError) {
    console.error("[embeddings]", updateError);
    if (updateError.code === "PGRST204") {
      return NextResponse.json(
        {
          error: "DB에 post.embedding 컬럼이 없습니다.",
        },
        { status: 503 }
      );
    }
    return NextResponse.json(
      { error: "임베딩 저장에 실패했습니다." },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true });
}
