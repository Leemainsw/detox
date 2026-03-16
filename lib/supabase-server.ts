import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error(
    "Supabase URL과 Anon Key가 필요합니다. .env.local에 NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY를 설정해 주세요."
  );
}

const VALIDATED_SUPABASE_URL = SUPABASE_URL;
const VALIDATED_SUPABASE_ANON_KEY = SUPABASE_ANON_KEY;

export async function createSupabaseServerClient() {
  const cookieStore = await cookies();

  return createServerClient(
    VALIDATED_SUPABASE_URL,
    VALIDATED_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll() {
          // 서버 컴포넌트의 조회 단계에서는 쿠키 쓰기가 필요하지 않아서 비워둡니다.
        },
      },
    }
  );
}
