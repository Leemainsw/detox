"use client";

import { createBrowserClient } from "@supabase/ssr";
import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import AIAnalysisBanner from "./_components/ai-analysis-banner/ai-analysis-banner";
import Header from "@/app/components/header";
import BottomNav from "@/app/components/bottom-nav";
import MonthExpenseSelector from "./_components/month-expense-selector";
import ComparisonInsight from "./_components/comparison-insight";
import ComparisonChart from "./_components/comparison-chart";
import EmptyAnalysis from "./_components/empty-analysis";
import EmptySubscriptionOverlay from "./_components/empty-subscription-overlay";
import AnalysisSummary from "./_components/analysis-summary/analysis-summary";
import { calculateMonthlyTotal } from "@/app/utils/subscriptions/calculate";
import { useCurrentUserQuery, useUserProfileQuery } from "@/query/users";
import { useAnalysisStore } from "@/store/useAnalysisStore";

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function StatisticsPage() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentSubscriptionIndex, setCurrentSubscriptionIndex] = useState(0);

  const { data: user } = useCurrentUserQuery();
  const { data: profile } = useUserProfileQuery(user?.id);
  const userName = profile?.nickname || "사용자";

  const { result: analysisData } = useAnalysisStore();

  const { data: subscriptions = [] } = useQuery<
    { service: string; total_amount: number }[]
  >({
    queryKey: ["subscriptions", user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      const { data } = await supabase
        .from("subscription")
        .select("*")
        .eq("user_id", user.id);
      return data || [];
    },
    enabled: !!user?.id,
  });

  const isAllEmpty = subscriptions.length === 0;

  const subscriptionSummaries = useMemo(
    () =>
      subscriptions.map((sub) => ({
        service: sub.service,
        amount: Number(sub.total_amount) || 0,
      })),
    [subscriptions]
  );

  const monthlyTotalAmount = useMemo(
    () => calculateMonthlyTotal(subscriptions, selectedDate),
    [selectedDate, subscriptions]
  );

  const isMonthlyEmpty = !isAllEmpty && monthlyTotalAmount === 0;
  const average30s = 25000;
  const displayAmount = isAllEmpty || isMonthlyEmpty ? 0 : monthlyTotalAmount;
  const diffAmount = Math.abs(displayAmount - average30s);
  const status = displayAmount > average30s ? "over" : "under";

  const handleMonthChange = (date: Date) => {
    setSelectedDate(date);
  };

  const handlePrevSubscription = () => {
    setCurrentSubscriptionIndex((prev) =>
      prev === 0 ? subscriptionSummaries.length - 1 : prev - 1
    );
  };

  const handleNextSubscription = () => {
    setCurrentSubscriptionIndex((prev) =>
      prev === subscriptionSummaries.length - 1 ? 0 : prev + 1
    );
  };

  return (
    <main
      className={`relative flex flex-col w-full min-h-screen bg-white ${isAllEmpty ? "overflow-hidden h-screen" : ""}`}
    >
      <Header variant="text" leftText="통계" />

      <div className="flex flex-col w-full flex-1 pb-32">
        <AIAnalysisBanner isAllEmpty={isAllEmpty} />

        <div className="relative flex-1 flex flex-col">
          <MonthExpenseSelector
            selectedDate={selectedDate}
            groupCount={displayAmount}
            onChangeDate={handleMonthChange}
          />

          <div className="relative flex-1 w-full">
            {!isAllEmpty && !isMonthlyEmpty && (
              <div className="w-full animate-in fade-in duration-500">
                <div className="mt-4">
                  <ComparisonInsight
                    isLoading={false}
                    title="30대의 평균 소비 비교"
                    diffAmount={diffAmount}
                    status={status}
                  />
                  <ComparisonChart
                    userName={`${userName}님`}
                    userAmount={displayAmount}
                    compareName="30대 평균"
                    compareAmount={average30s}
                  />
                </div>

                {subscriptionSummaries.length > 0 && (
                  <div className="mt-10">
                    {subscriptionSummaries.length > 0 && (
                      <>
                        {(() => {
                          const current =
                            subscriptionSummaries[
                              currentSubscriptionIndex
                            ] || subscriptionSummaries[0];
                          const subDiff = Math.abs(
                            displayAmount - current.amount
                          );
                          const subStatus =
                            displayAmount > current.amount ? "over" : "under";

                          return (
                            <>
                              <ComparisonInsight
                                isLoading={false}
                                title={`${current.service} 유저들과 평균 소비 비교`}
                                diffAmount={subDiff}
                                status={subStatus}
                              />
                              <div className="relative">
                                <button
                                  type="button"
                                  aria-label="이전 구독 서비스"
                                  className="absolute left-8 top-28 -translate-y-1/2 z-10 h-9 w-9 rounded-full bg-white/90 text-gray-600 "
                                  onClick={handlePrevSubscription}
                                >
                                  ◀
                                </button>
                                <button
                                  type="button"
                                  aria-label="다음 구독 서비스"
                                  className="absolute right-8 top-28 -translate-y-1/2 z-10 h-9 w-9 rounded-full bg-white/90 text-gray-600"
                                  onClick={handleNextSubscription}
                                >
                                  ▶
                                </button>

                                <ComparisonChart
                                  userName={current.service}
                                  userAmount={current.amount}
                                  compareName={`${current.service} 평균 소비`}
                                  compareAmount={displayAmount}
                                  diffAmount={subDiff}
                                />
                              </div>
                            </>
                          );
                        })()}
                      </>
                    )}
                  </div>
                )}

                {analysisData && (
                  <div className="mt-10 border-t-8 border-gray-50">
                    <AnalysisSummary
                      hasData={true}
                      analysisData={analysisData}
                    />
                  </div>
                )}
              </div>
            )}

            {!isAllEmpty && isMonthlyEmpty && <EmptyAnalysis />}
          </div>

          {isAllEmpty && <EmptySubscriptionOverlay />}
        </div>
      </div>

      <BottomNav />
    </main>
  );
}
