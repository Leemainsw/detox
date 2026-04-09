export interface ChartDataItem {
  month: string;
  my_spend: number;
  avg_spend: number;
}

export interface AnalysisItem {
  savings_amount?: number | string | null;
  question: string;
  content: string;
  brand?: string;
}

export interface AnalysisResponse {
  type: string;
  title: string;
  description: string;
  last_updated: string;
  payload: {
    analysis_items: AnalysisItem[];
    chart_data: ChartDataItem[];
    diff_amount: number;
    diff_message?: string;
  };
}

export const validateAnalysisResponse = <T extends AnalysisResponse>(
  data: unknown
): data is T => {
  if (typeof data !== "object" || data === null) return false;

  const target = data as Record<string, unknown>;
  if (target.type !== "STATISTICS") return false;

  if (typeof target.title !== "string") return false;
  if (typeof target.description !== "string") return false;
  if (typeof target.last_updated !== "string") return false;

  const payload = target.payload;
  if (typeof payload !== "object" || payload === null) return false;
  const p = payload as Record<string, unknown>;

  if (!Array.isArray(p.analysis_items)) return false;
  if (!Array.isArray(p.chart_data)) return false;
  if (typeof p.diff_amount !== "number" || Number.isNaN(p.diff_amount))
    return false;

  if (
    p.diff_message !== undefined &&
    p.diff_message !== null &&
    typeof p.diff_message !== "string"
  )
    return false;

  const isItemsValid = (p.analysis_items as unknown[]).every((item) => {
    if (typeof item !== "object" || item === null) return false;
    const i = item as Record<string, unknown>;
    if (typeof i.question !== "string") return false;
    if (typeof i.content !== "string") return false;

    if (i.brand !== undefined && i.brand !== null && typeof i.brand !== "string")
      return false;

    if (i.savings_amount !== undefined) {
      const v = i.savings_amount;
      const ok =
        typeof v === "number" ||
        typeof v === "string" ||
        v === null;
      if (!ok) return false;
    }

    return true;
  });
  if (!isItemsValid) return false;

  const isChartValid = (p.chart_data as unknown[]).every((d) => {
    if (typeof d !== "object" || d === null) return false;
    const c = d as Record<string, unknown>;
    return (
      typeof c.month === "string" &&
      typeof c.my_spend === "number" &&
      !Number.isNaN(c.my_spend) &&
      typeof c.avg_spend === "number" &&
      !Number.isNaN(c.avg_spend)
    );
  });

  return isChartValid;
};
