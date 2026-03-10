"use client";

import { supabase } from "@/lib/supabase";
import type { TablesInsert } from "@/types/supabase.types";

export type AuthProvider = "anonymous" | "google" | "kakao" | "naver";

type UpsertUserParams = TablesInsert<"users">;

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
