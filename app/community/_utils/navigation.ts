import { getSafeRedirectPath } from "@/app/utils/auth/get-safe-redirect-path";

export const COMMUNITY_LIST_PATH = "/community";

export function getCommunityListPath(service?: string | null) {
  if (!service || service === "all") {
    return COMMUNITY_LIST_PATH;
  }

  const searchParams = new URLSearchParams({
    service,
  });

  return `${COMMUNITY_LIST_PATH}?${searchParams.toString()}`;
}

export function getCommunityReturnTo(returnTo?: string | null) {
  const safeReturnTo = getSafeRedirectPath(returnTo ?? null);

  return safeReturnTo === "/" ? COMMUNITY_LIST_PATH : safeReturnTo;
}

function appendReturnTo(path: string, returnTo?: string | null) {
  if (!returnTo) {
    return path;
  }

  const searchParams = new URLSearchParams({
    returnTo: getCommunityReturnTo(returnTo),
  });

  return `${path}?${searchParams.toString()}`;
}

export function buildCommunityDetailPath(postId: string, returnTo?: string | null) {
  return appendReturnTo(`${COMMUNITY_LIST_PATH}/${postId}`, returnTo);
}

export function buildCommunityEditPath(postId: string, returnTo?: string | null) {
  return appendReturnTo(`${COMMUNITY_LIST_PATH}/${postId}/edit`, returnTo);
}

export function buildCommunityNewPath(returnTo?: string | null) {
  return appendReturnTo(`${COMMUNITY_LIST_PATH}/new`, returnTo);
}
