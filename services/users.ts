"use client";

import { supabase } from "@/lib/supabase";
import type { Tables, TablesInsert } from "@/types/supabase.types";

export type AuthProvider = "anonymous" | "google" | "kakao" | "naver";

type UpsertUserParams = TablesInsert<"users">;
export type UserProfile = Tables<"users">;

export async function signInAnonymously() {
  return supabase.auth.signInAnonymously();
}

export async function signOut() {
  return supabase.auth.signOut();
}

export async function getCurrentUser() {
  return supabase.auth.getUser();
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
