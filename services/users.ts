import { supabase } from "@/lib/supabase";

export type AuthProvider = "anonymous" | "google" | "kakao" | "naver";

interface UpsertUserParams {
  id: string;
  provider: AuthProvider;
  provider_id: string;
  email?: string | null;
  nickname?: string | null;
  profile_image?: string | null;
  is_anonymous: boolean;
}

export async function signInAnonymously() {
  return supabase.auth.signInAnonymously();
}

export async function signOut() {
  return supabase.auth.signOut();
}

export async function getCurrentUser() {
  return supabase.auth.getUser();
}

export async function upsertUser(params: UpsertUserParams) {
  return supabase.from("users").upsert(params);
}
