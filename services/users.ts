"use client";

import {
  isAuthSessionMissingError,
  type AuthError,
} from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import type {
  Tables,
  TablesInsert,
  TablesUpdate,
} from "@/types/supabase.types";

type UpsertUserParams = TablesInsert<"users">;
export type UserProfile = Tables<"users">;

//소셜
export async function signInWithOAuth(
  provider: "google" | "kakao",
  redirectTo: string
) {
  return supabase.auth.signInWithOAuth({
    provider,
    options: { redirectTo },
  });
}

//익명
export async function signInAnonymously() {
  return supabase.auth.signInAnonymously();
}

export async function signOut() {
  return supabase.auth.signOut();
}

const SIGN_OUT_MAX_ATTEMPTS = 3;
const SIGN_OUT_RETRY_BASE_MS = 350;

/** 탈퇴 등에서 로그아웃만 반복 실패할 때 재시도 */
export async function signOutWithRetry(): Promise<{ error: AuthError | null }> {
  let lastError: AuthError | null = null;

  for (let attempt = 0; attempt < SIGN_OUT_MAX_ATTEMPTS; attempt++) {
    const { error } = await signOut();
    if (!error) {
      return { error: null };
    }
    lastError = error;
    if (attempt < SIGN_OUT_MAX_ATTEMPTS - 1) {
      await new Promise((r) =>
        setTimeout(r, SIGN_OUT_RETRY_BASE_MS * (attempt + 1))
      );
    }
  }

  return { error: lastError };
}

export async function getCurrentUser() {
  const result = await supabase.auth.getUser();

  if (isAuthSessionMissingError(result.error)) {
    return {
      ...result,
      data: {
        ...result.data,
        user: null,
      },
      error: null,
    };
  }

  return result;
}

export async function getUserProfile(userId: string) {
  return supabase
    .from("users")
    .select("*")
    .eq("id", userId)
    .is("deleted_at", null)
    .maybeSingle();
}

export async function upsertUser(params: UpsertUserParams) {
  return supabase.from("users").upsert(params);
}

type UpdateUserParams = Pick<
  TablesUpdate<"users">,
  "nickname" | "profile_image"
>;

export async function updateUserProfile(
  userId: string,
  params: UpdateUserParams
) {
  return supabase
    .from("users")
    .update(params)
    .eq("id", userId)
    .select()
    .single();
}

/** 회원 탈퇴(소프트 삭제). 이후 클라이언트에서 signOut 호출 권장 */
export async function softDeleteUserAccount(userId: string) {
  return supabase
    .from("users")
    .update({ deleted_at: new Date().toISOString() })
    .eq("id", userId)
    .is("deleted_at", null);
}

/** 탈퇴 후 signOut만 실패한 경우 세션이 살아 있으므로 롤백용으로 복구 */
export async function revertSoftDeleteUserAccount(userId: string) {
  return supabase
    .from("users")
    .update({ deleted_at: null })
    .eq("id", userId)
    .not("deleted_at", "is", null);
}
