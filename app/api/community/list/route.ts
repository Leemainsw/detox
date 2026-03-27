import { type NextRequest } from "next/server";
import type {
  CommunityListCursor,
} from "@/app/community/_types";
import { subscriptableBrand } from "@/app/utils/brand/brand";
import type { SubscriptableBrandType } from "@/app/utils/brand/type";
import {
  COMMUNITY_LIST_DEFAULT_PAGE_SIZE,
  COMMUNITY_LIST_MAX_PAGE_SIZE,
} from "@/lib/community-list-cache";
import { getCachedCommunityListPage } from "@/services/community-list-reader";

function parseService(value: string | null): SubscriptableBrandType | null {
  if (!value) {
    return null;
  }

  return Object.prototype.hasOwnProperty.call(subscriptableBrand, value)
    ? (value as SubscriptableBrandType)
    : null;
}

function parseCursor(
  cursorCreatedAt: string | null,
  cursorId: string | null
): CommunityListCursor | null {
  if (!cursorCreatedAt || !cursorId) {
    return null;
  }

  return {
    createdAt: cursorCreatedAt,
    id: cursorId,
  };
}

function parsePageSize(value: string | null) {
  const parsedValue = Number(value);

  if (!Number.isFinite(parsedValue) || parsedValue <= 0) {
    return COMMUNITY_LIST_DEFAULT_PAGE_SIZE;
  }

  return Math.min(Math.trunc(parsedValue), COMMUNITY_LIST_MAX_PAGE_SIZE);
}

export async function GET(request: NextRequest) {
  try {
    const service = parseService(request.nextUrl.searchParams.get("service"));
    const cursorCreatedAt =
      request.nextUrl.searchParams.get("cursorCreatedAt");
    const cursorId = request.nextUrl.searchParams.get("cursorId");
    const cursor = parseCursor(cursorCreatedAt, cursorId);
    const pageSize = parsePageSize(request.nextUrl.searchParams.get("pageSize"));

    const page = await getCachedCommunityListPage({
      service: service ?? undefined,
      cursor,
      pageSize,
    });

    return Response.json(page);
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "커뮤니티 목록을 불러오지 못했어요.";

    return Response.json({ message }, { status: 500 });
  }
}
