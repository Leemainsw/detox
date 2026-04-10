"use client";

import { Suspense } from "react";

import HomePageSkeleton from "./home-page-skeleton";
import HomeSummaryCard from "./home-summary-card";
import HomeSubscriptionSection from "./home-subscription-section";
import Header from "../../components/header";
import BottomNav from "../../components/bottom-nav";
import {
  useGetSubscriptionListSuspenseQuery,
} from "@/query/subscription";
import { useSupabase } from "@/hooks/useSupabase";
import type { Tables } from "@/types/supabase.types";

function HomeMain({
  subscriptions,
  isLoggedIn,
}: {
  subscriptions: Tables<"subscription">[];
  isLoggedIn: boolean;
}) {
  const hasSubscription = subscriptions.length > 0;
  const subscriptionCount = subscriptions.length;
  const thisMonthTotal = subscriptions.reduce(
    (sum, item) =>
      sum +
      (item.payment_type === "trial"
        ? 0
        : item.total_amount /
          Math.max(item.member_count, 1) /
          (item.billing_cycle === "monthly" ? 1 : 12)),
    0
  );

  return (
    <>
      <section className="mb-4 grid grid-cols-[1fr_100px] items-center justify-between bg-white px-6 py-5">
        <HomeSummaryCard
          hasSubscription={hasSubscription}
          thisMonthTotal={thisMonthTotal}
        />
      </section>
      <HomeSubscriptionSection
        hasSubscription={hasSubscription}
        subscriptions={subscriptions}
        subscriptionCount={subscriptionCount}
        thisMonthTotal={thisMonthTotal}
        isLoggedIn={isLoggedIn}
      />
    </>
  );
}

function HomeMainWithSubscriptionQuery({
  userId,
  isLoggedIn,
}: {
  userId: string;
  isLoggedIn: boolean;
}) {
  const { data: subscriptions } = useGetSubscriptionListSuspenseQuery(userId);
  return (
    <HomeMain subscriptions={subscriptions} isLoggedIn={isLoggedIn} />
  );
}

export default function HomePageContent() {
  const { session } = useSupabase();
  const userId = session?.user?.id;
  const isLoggedIn = Boolean(session?.user);

  return (
    <>
      <Header hasNotification />
      <main>
        {!userId ? (
          <HomeMain subscriptions={[]} isLoggedIn={isLoggedIn} />
        ) : (
          <Suspense fallback={<HomePageSkeleton />}>
            <HomeMainWithSubscriptionQuery
              userId={userId}
              isLoggedIn={isLoggedIn}
            />
          </Suspense>
        )}
      </main>
      <BottomNav />
    </>
  );
}
