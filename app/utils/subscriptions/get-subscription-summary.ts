import { MIN_FOOD_PRICE } from "./random-food";

export type SubscriptionSummary =
  | {
      type: "empty";
    }
  | {
      type: "same";
    }
  | {
      type: "this-month";
      targetPrice: number;
    }
  | {
      type: "saved";
      targetPrice: number;
      savedPrice: number;
    };

interface Params {
  hasSubscription: boolean;
  thisMonthTotal: number;
  lastMonthTotal?: number | null;
}

export function getSubscriptionSummary({
  hasSubscription,
  thisMonthTotal,
  lastMonthTotal,
}: Params): SubscriptionSummary {
  if (!hasSubscription) {
    return { type: "empty" };
  }

  if (thisMonthTotal < MIN_FOOD_PRICE) {
    return { type: "same" };
  }

  if (typeof lastMonthTotal !== "number") {
    return {
      type: "this-month",
      targetPrice: thisMonthTotal,
    };
  }

  const savedPrice = lastMonthTotal - thisMonthTotal;

  if (savedPrice > 0) {
    if (savedPrice < MIN_FOOD_PRICE) {
      return { type: "same" };
    }

    return {
      type: "saved",
      targetPrice: savedPrice,
      savedPrice,
    };
  }

  if (savedPrice === 0) {
    return { type: "same" };
  }

  return {
    type: "this-month",
    targetPrice: thisMonthTotal,
  };
}
