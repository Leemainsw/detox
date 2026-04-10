import { addMonths, parseISO } from "date-fns";
import getNextPaymentDate from "./getNextPaymentDate";
import calculateTrial from "./calculateTrial";

type SubscriptionForNextPayment = {
  payment_day: number | null;
  billing_cycle: "monthly" | "yearly";
  payment_type: "paid" | "trial";
  start_date: string | null;
  trial_months: number | null;
  next_payment_date: string | null;
};

/**
 * 구독의 다음 결제 예정일 반환
 * - payment_day가 있으면 항상 오늘(또는 체험 종료일) 이후 다음 결제일을 계산
 *   (DB의 next_payment_date는 등록 시점의 값이라 월이 지나도 갱신되지 않음)
 * - payment_day가 없을 때만 저장된 next_payment_date 사용
 */
export default function getNextPaymentDateForSubscription(
  subscription: SubscriptionForNextPayment
): string | null {
  if (subscription.payment_day == null) {
    return subscription.next_payment_date?.trim() || null;
  }

  let fromDate = new Date();
  const inTrial =
    subscription.payment_type === "trial" &&
    calculateTrial(subscription.start_date!, subscription.trial_months ?? 0);
  if (inTrial && subscription.start_date) {
    const trialEnd = addMonths(
      parseISO(subscription.start_date.split("T")[0]),
      subscription.trial_months ?? 0
    );
    if (trialEnd > fromDate) fromDate = trialEnd;
  }

  return getNextPaymentDate(
    subscription.payment_day,
    subscription.billing_cycle,
    fromDate
  );
}
