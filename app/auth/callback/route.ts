import { getLoginRedirectUrl } from "@/app/utils/auth/get-login-redirect-url";
import { getSafeRedirectPath } from "@/app/utils/auth/get-safe-redirect-path";
import { upsertUserWithNicknameRetry } from "@/app/utils/auth/upsert-user-with-nickname-retry";
import { generateNickname } from "@/app/utils/nickname";
import { createServerClient } from "@supabase/ssr";
import type { User } from "@supabase/supabase-js";
import { NextResponse, type NextRequest } from "next/server";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

function redirectWithCookies(
  path: string,
  request: NextRequest,
  response: NextResponse
) {
  const redirectResponse = NextResponse.redirect(new URL(path, request.url));

  response.cookies.getAll().forEach((cookie) => {
    redirectResponse.cookies.set(cookie);
  });

  return redirectResponse;
}

function getSocialName(user: User) {
  const value = user.user_metadata.name ?? user.user_metadata.full_name;

  if (typeof value !== "string") {
    return null;
  }

  const trimmedValue = value.trim();
  return trimmedValue === "" ? null : trimmedValue;
}

function getOAuthProvider(user: User) {
  const providerFromMetadata = user.app_metadata.provider;

  if (typeof providerFromMetadata === "string" && providerFromMetadata) {
    return providerFromMetadata;
  }

  const providerFromIdentity = user.identities?.[0]?.provider;

  if (typeof providerFromIdentity === "string" && providerFromIdentity) {
    return providerFromIdentity;
  }

  throw new Error("OAuth provider 정보를 찾을 수 없어요.");
}

async function syncOAuthUser(
  supabase: ReturnType<typeof createServerClient>,
  user: User
) {
  const provider = getOAuthProvider(user);
  const providerId =
    user.identities?.find((identity) => identity.provider === provider)?.id ??
    user.id;

  const profileImage =
    user.user_metadata.avatar_url ?? user.user_metadata.picture ?? null;

  const { data: existingUser, error: existingUserError } = await supabase
    .from("users")
    .select("nickname, profile_image")
    .eq("id", user.id)
    .maybeSingle();

  if (existingUserError) {
    throw existingUserError;
  }

  const socialName = getSocialName(user);
  await upsertUserWithNicknameRetry({
    makeNickname: (retryCount) => {
      if (retryCount === 0) {
        return existingUser?.nickname ?? socialName ?? generateNickname();
      }

      return socialName
        ? `${socialName}${Math.floor(1000 + Math.random() * 9000)}`
        : generateNickname();
    },
    tryUpsert: (nickname) =>
      supabase.from("users").upsert({
        id: user.id,
        email: user.email ?? null,
        provider,
        provider_id: providerId,
        is_anonymous: false,
        nickname,
        profile_image: existingUser?.profile_image ?? profileImage,
        deleted_at: null,
      }),
    canRetry: () => !existingUser?.nickname,
  });
}

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  const nextPath = getSafeRedirectPath(
    request.nextUrl.searchParams.get("redirect")
  );

  let response = NextResponse.next({ request });

  const supabase = createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => {
          request.cookies.set(name, value);
        });

        response = NextResponse.next({ request });

        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options);
        });
      },
    },
  });

  if (!code) {
    return redirectWithCookies(
      getLoginRedirectUrl(nextPath),
      request,
      response
    );
  }

  const { data, error } = await supabase.auth.exchangeCodeForSession(code);

  if (error || !data.user) {
    console.error(error);
    return redirectWithCookies(
      getLoginRedirectUrl(nextPath),
      request,
      response
    );
  }

  try {
    await syncOAuthUser(supabase, data.user);
  } catch (syncError) {
    console.error(syncError);
    await supabase.auth.signOut();

    return redirectWithCookies(
      getLoginRedirectUrl(nextPath),
      request,
      response
    );
  }

  return redirectWithCookies(nextPath, request, response);
}
