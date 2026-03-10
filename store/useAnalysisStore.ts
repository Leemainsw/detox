import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AnalysisResult {
  summary: string; // 분석 요약 문구
  total_saving_expect: number; // 예상 절약 금액
  comparison_text: string; // AI 비유
  analysis_tips: string[]; // 절약 팁 리스트 (배열)
}

interface AnalysisState {
  result: AnalysisResult | null; // 실제 데이터가 담길 변수 / 처음에는 데이터가 없으므로 null

  // 데이터를 저장하는 함수
  setResult: (newResult: AnalysisResult) => void;

  // 데이터를 초기화하는 함수 (다시 분석하고 싶을 때 사용)
  clearResult: () => void;
}

// 스토어 생성
export const useAnalysisStore = create<AnalysisState>()(
  persist(
    (set) => ({
      result: null, // 초기 상태

      // 결과 저장 로직
      setResult: (newResult) => set({ result: newResult }),

      // 데이터 삭제 로직
      clearResult: () => set({ result: null }),
    }),
    {
      name: "ai-analysis-storage", // 로컬 스토리지 이름
    }
  )
);
