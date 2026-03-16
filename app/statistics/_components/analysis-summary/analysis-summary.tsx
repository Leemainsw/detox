"use client";

import AnalysisCard from "@/app/statistics/_components/analysis-card/analysis-card";
import { AnalysisResult } from "@/store/useAnalysisStore";

interface AnalysisSummaryProps {
  hasData: boolean;
  analysisData?: AnalysisResult;
}

export default function AnalysisSummary({
  hasData,
  analysisData,
}: AnalysisSummaryProps) {
  if (!hasData || !analysisData || analysisData.type !== "STATISTICS")
    return null;

  return (
    <div className="w-full px-5 py-6 bg-white animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="mb-8">
        <h2 className="title-md text-brand-primary">
          AI디톡이<span className="text-gray-900">의 소비분석 요약</span>
        </h2>
        <p className="body-md text-gray-200 mt-1">
          AI가 분석한 정보로 일부는 실제와 다를 수 있어요.
        </p>
      </div>

      <AnalysisCard
        title={analysisData.title}
        description={
          <>
            {analysisData.description}
            <br />
            <span className="font-bold text-gray-800">절감 가능 금액: </span>
            <span className="text-brand-primary body-lg">
              {analysisData.payload.diff_amount.toLocaleString()}원
            </span>
          </>
        }
        brandType="netflix"
      />
    </div>
  );
}
