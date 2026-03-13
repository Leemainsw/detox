"use client";

import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/supabase.types";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Supabase URL과 Anon Key가 필요합니다. .env.local에 NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY를 설정해 주세요."
  );
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
