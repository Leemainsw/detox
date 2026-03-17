import { create } from "zustand";
import { persist } from "zustand/middleware";

interface BaseAnalysis {
  title: string;
  description: string;
  last_updated: string;
}

interface StatisticsPayload extends BaseAnalysis {
  type: "STATISTICS";
  payload: {
    analysis_items: Array<{
      kind:
        | "SUBSCRIBE_RECOMMENDATION"
        | "CANCEL_RECOMMENDATION"
        | "PAYMENT_WEEK_ALERT";
      title: string;
      description: string;
      brands?: string[];
      cta_label?: string;
      savings_amount?: number;
      week_range?: string;
      expected_amount?: number;
    }>;
    chart_data: { month: string; my_spend: number; avg_spend: number }[];
    diff_amount: number;
    diff_message: string;
  };
}

interface RecommendationPayload extends BaseAnalysis {
  type: "RECOMMENDATION";
  payload: {
    recommended_services: {
      name: string;
      category: string;
      reason: string;
      logo_url?: string;
    }[];
  };
}

interface MaintenancePayload extends BaseAnalysis {
  type: "MAINTENANCE";
  payload: {
    redundant_services: string[];
    potential_savings: number;
  };
}

interface PaymentSchedulePayload extends BaseAnalysis {
  type: "PAYMENT_SCHEDULE";
  payload: {
    target_week: string;
    expected_amount: number;
    scheduled_services: string[];
  };
}

export type AnalysisResult =
  | StatisticsPayload
  | RecommendationPayload
  | MaintenancePayload
  | PaymentSchedulePayload;

export type AnalysisType = AnalysisResult["type"];

// ✅ 1. STATISTICS 내부 아이템의 유효성을 검사하는 헬퍼 함수 (코드래빗 권장)
const isStatisticsItem = (
  value: unknown
): value is StatisticsPayload["payload"]["analysis_items"][number] => {
  if (!value || typeof value !== "object") return false;
  const item = value as Record<string, unknown>;

  return (
    (item.kind === "SUBSCRIBE_RECOMMENDATION" ||
      item.kind === "CANCEL_RECOMMENDATION" ||
      item.kind === "PAYMENT_WEEK_ALERT") &&
    typeof item.title === "string" &&
    typeof item.description === "string"
  );
};

const isAnalysisType = (value: unknown): value is AnalysisType => {
  return (
    value === "STATISTICS" ||
    value === "RECOMMENDATION" ||
    value === "MAINTENANCE" ||
    value === "PAYMENT_SCHEDULE"
  );
};

// ✅ 2. 런타임 데이터 검증 로직 강화
const isAnalysisResult = (value: unknown): value is AnalysisResult => {
  if (!value || typeof value !== "object") return false;
  const data = value as Record<string, unknown>;

  // 공통 기본 필드 검사
  const baseValid =
    isAnalysisType(data.type) &&
    typeof data.title === "string" &&
    typeof data.description === "string" &&
    typeof data.last_updated === "string" &&
    typeof data.payload === "object" &&
    data.payload !== null;

  if (!baseValid) return false;

  // ✅ 3. STATISTICS 타입일 경우 내부 페이로드(items, message)까지 딥 체크
  if (data.type === "STATISTICS") {
    const payload = data.payload as Record<string, unknown>;
    return (
      Array.isArray(payload.analysis_items) &&
      payload.analysis_items.every(isStatisticsItem) &&
      typeof payload.diff_message === "string"
    );
  }

  return true;
};

interface AnalysisState {
  result: AnalysisResult | null;
  isLoading: boolean;
  setResult: (newResult: unknown) => void;
  setIsLoading: (status: boolean) => void;
  clearResult: () => void;
}

export const useAnalysisStore = create<AnalysisState>()(
  persist(
    (set) => ({
      result: null,
      isLoading: false,

      setResult: (newResult) => {
        // ✅ 4. 데이터 저장 전 검증 단계 거치기
        if (!isAnalysisResult(newResult)) {
          console.error(
            "[AnalysisStore] 유효하지 않은 데이터 형식입니다. 저장이 차단되었습니다:",
            newResult
          );
          return;
        }

        set({ result: newResult, isLoading: false });
      },

      setIsLoading: (status) => set({ isLoading: status }),
      clearResult: () => set({ result: null, isLoading: false }),
    }),
    {
      name: "ai-analysis-storage",
      partialize: (state) => ({ result: state.result }),
    }
  )
);
