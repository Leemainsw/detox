import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useCurrentUserQuery } from "@/query/users";
import { useGetSubscriptionListQuery } from "@/query/subscription";
import { supabase } from "@/lib/supabase";

export function useSubscriptionStats() {
  const { data: user } = useCurrentUserQuery();
  const userId = user?.id ?? "";

  const {
    data: subscriptions = [],
    isLoading: isSubscriptionsLoading,
    isFetching: isSubscriptionsFetching,
    isError: isSubscriptionsError,
  } = useGetSubscriptionListQuery(userId);

  const subscriptionSummaries = useMemo(
    () =>
      subscriptions.map((sub) => ({
        service: sub.service,
        amount: Number(sub.total_amount) || 0,
      })),
    [subscriptions]
  );

  const services = useMemo(
    () =>
      Array.from(new Set(subscriptionSummaries.map((s) => s.service))).filter(
        (service): service is string => Boolean(service)
      ),
    [subscriptionSummaries]
  );

  const {
    data: serviceAvgMap = {},
    isLoading: isServiceAvgLoading,
    isError: isServiceAvgError,
  } = useQuery<Record<string, number>>({
    queryKey: ["service-avg", services],

    queryFn: async () => {
      if (services.length === 0) return {};

      const { data, error } = await supabase.rpc("get_service_averages", {
        service_names: services,
      });

      if (error) throw error;

      return Object.fromEntries(
        (data ?? []).map(
          ({
            service,
            avg_amount,
          }: {
            service: string;
            avg_amount: number;
          }) => [service, avg_amount]
        )
      );
    },

    enabled: services.length > 0,
  });

  return {
    subscriptions,
    subscriptionSummaries,
    serviceAvgMap,
    isSubscriptionsLoading,
    isSubscriptionsFetching,
    isServiceAvgLoading,
    isError: isSubscriptionsError || isServiceAvgError,
  };
}
