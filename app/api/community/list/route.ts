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

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const ISO_DATETIME_REGEX =
  /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})$/;

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
): CommunityListCursor | null | "invalid" {
  if (!cursorCreatedAt || !cursorId) {
    return null;
  }

  if (
    !ISO_DATETIME_REGEX.test(cursorCreatedAt) ||
    Number.isNaN(Date.parse(cursorCreatedAt)) ||
    !UUID_REGEX.test(cursorId)
  ) {
    return "invalid";
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

    if (cursor === "invalid") {
      return Response.json(
        { message: "유효하지 않은 커서 값입니다." },
        { status: 400 }
      );
    }

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
