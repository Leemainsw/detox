import {
  getServerCommunityDetail,
  getServerRecommendedCommunityPosts,
} from "@/services/community.server";
import { NextResponse } from "next/server";

/**
 * 클라이언트에서 추천 글을 다시 불러올 때(React Query 등) 서버와 동일한 AI·폴백 로직 사용
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const postId = searchParams.get("postId")?.trim();
  const limitRaw = searchParams.get("limit");

  if (!postId) {
    return NextResponse.json(
      { error: "postId가 필요합니다." },
      { status: 400 }
    );
  }

  const limit =
    limitRaw != null
      ? Math.min(Math.max(parseInt(limitRaw, 10) || 3, 1), 10)
      : undefined;

  const post = await getServerCommunityDetail(postId);
  if (!post) {
    return NextResponse.json(
      { error: "게시글을 찾을 수 없습니다." },
      { status: 404 }
    );
  }

  const items = await getServerRecommendedCommunityPosts({
    postId,
    service: post.service,
    sourceTitle: post.title,
    sourceContent: post.content,
    sourcePostUpdatedAt: post.updatedAt,
    limit,
  });

  return NextResponse.json(items);
}
