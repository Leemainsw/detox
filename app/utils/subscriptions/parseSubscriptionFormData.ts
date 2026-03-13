import { SubscriptionFormData } from "@/app/components/subscription-form/types/type";
import { TablesInsert } from "@/types/supabase.types";

function parsePaymentDayToDb(
  paymentDay: string | undefined,
  billingCycle: "monthly" | "yearly"
): number | null {
  if (!paymentDay?.trim()) return null;
  const cleaned = paymentDay.replace("-", "");
  const num = parseInt(cleaned, 10);
  if (Number.isNaN(num)) return null;
  return num || null;
}

export default function parseSubscriptionFormData(
  data: Partial<SubscriptionFormData>,
  userId: string
): TablesInsert<"subscription"> {
  const paymentDay = parsePaymentDayToDb(
    data.payment_day,
    data.billing_cycle ?? "monthly"
  );

  if (!data.service || !data.billing_cycle || !data.subscription_mode || !data.payment_type) {
    throw new Error("필수 필드가 누락되었습니다");
  }

  return {
    service: data.service,
    billing_cycle: data.billing_cycle,
    payment_day: paymentDay,
    end_date: data.end_date || null,
    next_payment_date: data.next_payment_date || null,
    subscription_mode: data.subscription_mode,
    payment_type: data.payment_type,
    member_count: data.member_count ?? 1,
    total_amount: data.total_amount ?? 0,
    trial_months: data.trial_months ?? null,
    status: data.status ?? "active",
    user_id: userId,
  };
}
