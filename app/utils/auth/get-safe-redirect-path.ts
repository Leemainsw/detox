export function getSafeRedirectPath(redirectPath: string | null) {
  if (
    !redirectPath ||
    !redirectPath.startsWith("/") ||
    redirectPath.startsWith("//") ||
    redirectPath.includes("\\")
  ) {
    return "/";
  }

  return redirectPath;
}
