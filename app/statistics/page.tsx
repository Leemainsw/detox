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

export default function StatisticsPage() {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { data: user } = useCurrentUserQuery();
  const { data: profile } = useUserProfileQuery(user?.id);
  const userName = profile?.nickname || "사용자";

  const { data: subscriptions = [] } = useQuery({
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

  const { data: hasAiData = false } = useQuery({
    queryKey: ["hasAiData", user?.id],
    queryFn: async () => {
      if (!user?.id) return false;
      const { data } = await supabase
        .from("AnalysisResult")
        .select("id")
        .eq("user_id", user.id)
        .limit(1);
      return !!(data && data.length > 0);
    },
    enabled: !!user?.id,
  });

  const isAllEmpty = subscriptions.length === 0;

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

                <div className="mt-10">
                  <ComparisonInsight
                    isLoading={false}
                    title="넷플릭스 유저들과 평균 소비 비교"
                    diffAmount={8500}
                    status="under"
                  />
                  <ComparisonChart
                    userName={`${userName}님`}
                    userAmount={displayAmount}
                    compareName="넷플릭스 평균"
                    compareAmount={displayAmount + 8500}
                  />
                </div>

                {hasAiData && (
                  <div className="mt-10 border-t-8 border-gray-50">
                    <AnalysisSummary hasData={true} />
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
