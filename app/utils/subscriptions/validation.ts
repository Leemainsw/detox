export interface ChartDataItem {
  month: string;
  my_spend: number;
  avg_spend: number;
}

export interface AnalysisItem {
  question: string;
  content: string;
  brand: string;
}

export interface AnalysisResponse {
  type: string;
  title: string;
  description: string;
  payload: {
    analysis_items: AnalysisItem[];
    chart_data: ChartDataItem[];
    diff_amount: number;
    diff_message: string;
  };
}

export const validateAnalysisResponse = <T extends AnalysisResponse>(
  data: unknown
): data is T => {
  const target = data as T;

  return (
    target?.type === "STATISTICS" &&
    typeof target?.title === "string" &&
    typeof target?.description === "string" &&
    Array.isArray(target?.payload?.analysis_items) &&
    target.payload.analysis_items.every(
      (item) =>
        typeof item.question === "string" &&
        typeof item.content === "string" &&
        typeof item.brand === "string"
    ) &&
    Array.isArray(target?.payload?.chart_data) &&
    typeof target?.payload?.diff_amount === "number" &&
    typeof target?.payload?.diff_message === "string"
  );
};
