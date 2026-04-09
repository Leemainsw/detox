import { subscriptableBrand } from "@/app/utils/brand/brand";
import type { ChartDataItem } from "@/app/utils/subscriptions/validation";

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

export function analysisMentionsTrend(title: string, description: string) {
  const t = `${title}\n${description}`;
  return /3개월|세\s*달|추이|트렌드|월별\s*지출|소비\s*추세/.test(t);
}

export function getTrendLabel(chartData: ChartDataItem[]): string {
  if (!Array.isArray(chartData) || chartData.length < 2) return "";
  const spends = chartData.map((d) => Number(d.my_spend) || 0);
  const first = spends[0];
  const last = spends[spends.length - 1];
  if (first === last) return "최근 3개월 구독 지출은 비슷한 수준으로 유지되고 있어요.";
  if (last > first)
    return "최근으로 올수록 구독 지출이 다소 증가한 추세예요.";
  return "최근으로 올수록 구독 지출이 다소 감소한 추세예요.";
}

export function chartHasPlausibleValues(chartData: ChartDataItem[]) {
  if (!Array.isArray(chartData) || chartData.length === 0) return false;
  return chartData.some(
    (c) => (Number(c.my_spend) || 0) > 0 || (Number(c.avg_spend) || 0) > 0
  );
}
