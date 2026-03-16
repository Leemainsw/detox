"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { getLoginRedirectUrl } from "@/app/utils/auth/get-login-redirect-url";

export function useLoginRedirect(defaultTargetPath?: string) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentPath = searchParams.toString()
    ? `${pathname}?${searchParams.toString()}`
    : pathname;

  const moveToLogin = (targetPath = defaultTargetPath ?? currentPath) => {
    router.push(getLoginRedirectUrl(targetPath));
  };

  const redirectToLoginIfNeeded = (
    isLoggedIn: boolean,
    targetPath?: string
  ) => {
    if (isLoggedIn) {
      return false;
    }

    moveToLogin(targetPath);
    return true;
  };

  return {
    currentPath,
    loginRedirectUrl: getLoginRedirectUrl(defaultTargetPath ?? currentPath),
    moveToLogin,
    redirectToLoginIfNeeded,
  };
}
