import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import type { Database } from "@/types/supabase.types";
import StatisticsPageClient from "./statistics-page-client";

type SubscriptionRow = Database["public"]["Tables"]["subscription"]["Row"];

/** `query/users.ts`의 `useCurrentUserQuery` / `useUserProfileQuery`와 동일한 키 */
const currentUserQueryKey = ["users", "auth", "current-user"] as const;
const profileByIdQueryKey = (userId: string) =>
  ["users", "profile", userId] as const;

export default async function StatisticsPage() {
  const queryClient = new QueryClient();
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    await queryClient.prefetchQuery({
      queryKey: currentUserQueryKey,
      queryFn: async () => user,
    });

    await queryClient.prefetchQuery({
      queryKey: profileByIdQueryKey(user.id),
      queryFn: async () => {
        const { data, error } = await supabase
          .from("users")
          .select("*")
          .eq("id", user.id)
          .is("deleted_at", null)
          .maybeSingle();
        if (error) throw error;
        return data;
      },
    });

    await queryClient.prefetchQuery({
      queryKey: ["subscriptions", user.id],
      queryFn: async () => {
        const { data, error } = await supabase
          .from("subscription")
          .select("*")
          .eq("user_id", user.id);
        if (error) throw error;
        return (data ?? []) as SubscriptionRow[];
      },
    });

    const subs = queryClient.getQueryData<SubscriptionRow[]>([
      "subscriptions",
      user.id,
    ]);

    const services = Array.from(
      new Set(
        (subs ?? [])
          .map((s) => s.service)
          .filter((s): s is string => Boolean(s))
      )
    );

    if (services.length > 0) {
      await queryClient.prefetchQuery({
        queryKey: ["service-avg", services],
        queryFn: async () => {
          const { data, error } = await supabase.rpc("get_service_averages", {
            service_names: services,
          });
          if (error) throw error;
          return Object.fromEntries(
            (data ?? []).map(
              (row: { service: string; avg_amount: number }) => [
                row.service,
                row.avg_amount,
              ]
            )
          );
        },
      });
    }
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <StatisticsPageClient />
    </HydrationBoundary>
  );
}
