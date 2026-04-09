import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AnalysisItem {
  savings_amount?: number | string | null;
  question: string;
  content: string;
  brand?: string;
}

interface StatisticsPayload {
  type: "STATISTICS";
  title: string;
  description: string;
  last_updated: string;
  payload: {
    analysis_items: AnalysisItem[];
    chart_data: { month: string; my_spend: number; avg_spend: number }[];
    diff_amount: number;
    diff_message?: string;
  };
}

export type AnalysisResult = StatisticsPayload;

const isAnalysisResult = (value: unknown): value is AnalysisResult => {
  if (!value || typeof value !== "object") return false;

  const data = value as Record<string, unknown>;
  if (data.type !== "STATISTICS") return false;

  const payload = data.payload as Record<string, unknown> | undefined;
  if (!payload || typeof payload !== "object") return false;

  const items = payload.analysis_items;
  if (!Array.isArray(items)) return false;

  return items.every((item: unknown) => {
    if (!item || typeof item !== "object") return false;
    const i = item as Record<string, unknown>;
    return typeof i.question === "string" && typeof i.content === "string";
  });
};

function normalizeQuestionKey(question: string) {
  return question.trim();
}

interface AnalysisState {
  byQuestion: Record<string, AnalysisResult>;
  isLoading: boolean;
  setResultForQuestion: (question: string, newResult: unknown) => void;
  setIsLoading: (status: boolean) => void;
  clearResult: () => void;
}

export const useAnalysisStore = create<AnalysisState>()(
  persist(
    (set) => ({
      byQuestion: {},
      isLoading: false,

      setResultForQuestion: (question, newResult) => {
        if (!isAnalysisResult(newResult)) {
          console.error(
            "[AnalysisStore] 데이터 형식이 올바르지 않습니다:",
            newResult
          );
          return;
        }
        const key = normalizeQuestionKey(question);
        set((state) => ({
          byQuestion: { ...state.byQuestion, [key]: newResult },
          isLoading: false,
        }));
      },

      setIsLoading: (status) => set({ isLoading: status }),
      clearResult: () => set({ byQuestion: {}, isLoading: false }),
    }),
    {
      name: "ai-analysis-by-question",
      partialize: (state) => ({ byQuestion: state.byQuestion }),
    }
  )
);
