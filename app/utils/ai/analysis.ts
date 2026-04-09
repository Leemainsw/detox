import { subscriptableBrand } from "@/app/utils/brand/brand";

export const calculateCategoryRatio = (
  subscriptions: Array<{ service: string; total_amount: number }>
) => {
  const totals: Record<string, number> = {};
  let grandTotal = 0;

  subscriptions.forEach((sub) => {
    const category =
      subscriptableBrand[sub.service as keyof typeof subscriptableBrand]
        ?.category ?? "etc";
    const amount = Number(sub.total_amount) || 0;
    totals[category] = (totals[category] ?? 0) + amount;
    grandTotal += amount;
  });

  if (grandTotal === 0) return {};

  const ratio: Record<string, number> = {};
  Object.entries(totals).forEach(([category, value]) => {
    ratio[category] = Math.round((value / grandTotal) * 100);
  });

  return ratio;
};
