"use client";

import AnalysisCard from "@/app/statistics/_components/analysis-card/analysis-card";
import { AnalysisResult } from "@/store/useAnalysisStore";
import { subscriptableBrand } from "@/app/utils/brand/brand";
import type { SubscriptableBrandType } from "@/app/utils/brand/type";

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

  const analysisItems = analysisData.payload.analysis_items || [];
  const brandTypes = Object.keys(
    subscriptableBrand
  ) as SubscriptableBrandType[];

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

      <div className="flex flex-col gap-4">
        {analysisItems.map((item, index) => {
          const brandType = brandTypes[index % brandTypes.length];

          return (
            <AnalysisCard
              key={index}
              title={item.question}
              description={
                <>
                  {item.content}
                  {/* 절감 금액은 첫 번째 카드 하단에만 디자인을 유지하며 노출 */}
                  {index === 0 && analysisData.payload.diff_amount > 0 && (
                    <>
                      <br />
                      <span className="font-bold text-gray-800">
                        절감 가능 금액:{" "}
                      </span>
                      <span className="text-brand-primary body-lg">
                        {analysisData.payload.diff_amount.toLocaleString()}원
                      </span>
                    </>
                  )}
                </>
              }
              brandType={brandType}
            />
          );
        })}

        {/* 데이터가 없을 경우 기본 리포트 표시 */}
        {analysisItems.length === 0 && (
          <AnalysisCard
            title={analysisData.title}
            description={analysisData.description}
            brandType={brandTypes[0]}
          />
        )}
      </div>
    </div>
  );
}
