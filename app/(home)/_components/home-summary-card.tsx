"use client";

import { getSubscriptionSummary } from "@/app/utils/subscriptions/get-subscription-summary";
import { useRandomFood } from "../_hooks/use-random-food";
import HomeSummaryFoodCard from "./home-summary-food-card";
import HomeSummaryStaticCard from "./home-summary-static-card";

interface Props {
  hasSubscription: boolean;
  thisMonthTotal: number;
  lastMonthTotal?: number | null;
}

export default function HomeSummaryCard({
  hasSubscription,
  thisMonthTotal,
  lastMonthTotal,
}: Props) {
  const card = getSubscriptionSummary({
    hasSubscription,
    thisMonthTotal,
    lastMonthTotal,
  });
  const { food, isLoading } = useRandomFood({
    enabled: card.type === "this-month" || card.type === "saved",
    totalPrice:
      card.type === "this-month" || card.type === "saved"
        ? card.targetPrice
        : 0,
  });

  switch (card.type) {
    case "empty":
      return <HomeSummaryStaticCard type="empty" />;

    case "same":
      return <HomeSummaryStaticCard type="same" />;

    case "saved":
      return (
        <HomeSummaryFoodCard
          type="saved"
          food={food}
          isLoading={isLoading}
        />
      );

    case "this-month":
      return (
        <HomeSummaryFoodCard
          type="this-month"
          food={food}
          isLoading={isLoading}
        />
      );
  }
}
