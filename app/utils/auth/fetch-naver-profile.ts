type UnknownRecord = Record<string, unknown>;
const NAVER_PROFILE_TIMEOUT_MS = 3000;

export type OAuthProfile = {
  providerId?: string | null;
  email?: string | null;
  name?: string | null;
  profileImage?: string | null;
};

function toRecord(value: unknown): UnknownRecord | null {
  return value && typeof value === "object" ? (value as UnknownRecord) : null;
}

function getString(record: UnknownRecord | null, key: string) {
  const value = record?.[key];
  return typeof value === "string" ? value.trim() || null : null;
}

export async function fetchNaverProfile(
  providerToken?: string | null
): Promise<OAuthProfile | null> {
  if (!providerToken) {
    return null;
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(
    () => controller.abort(),
    NAVER_PROFILE_TIMEOUT_MS
  );

  try {
    const response = await fetch("https://openapi.naver.com/v1/nid/me", {
      headers: {
        Authorization: `Bearer ${providerToken}`,
      },
      cache: "no-store",
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error("네이버 프로필 정보를 불러오지 못했어요.");
    }

    const json = (await response.json()) as unknown;
    const payload = toRecord(toRecord(json)?.response);

    return {
      providerId: getString(payload, "id"),
      email: getString(payload, "email"),
      name: getString(payload, "name") ?? getString(payload, "nickname"),
      profileImage: getString(payload, "profile_image"),
    };
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      throw new Error("네이버 프로필 조회가 시간 초과되었어요.");
    }

    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}
