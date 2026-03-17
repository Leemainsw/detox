"use client";

import { AnalysisResponse } from "@/app/utils/subscriptions/validation";
import { subscriptableBrand } from "@/app/utils/brand/brand";
import type { SubscriptableBrandType } from "@/app/utils/brand/type";
import BrandBox from "@/app/components/brand-box";

interface AnalysisSummaryProps {
  hasData: boolean;
  analysisData?: AnalysisResponse;
}

export default function AnalysisSummary({
  hasData,
  analysisData,
}: AnalysisSummaryProps) {
  // ✅ 데이터가 없거나 형식이 다를 경우 가드
  if (!hasData || !analysisData || !analysisData.payload) return null;

  const analysisItems = analysisData.payload.analysis_items || [];
  const brandTypes = Object.keys(
    subscriptableBrand
  ) as SubscriptableBrandType[];

  // 브랜치 타입 변환 유틸
  const toBrandType = (brandName?: string): SubscriptableBrandType | null => {
    if (!brandName) return null;
    const found = brandTypes.find(
      (t) => t.toLowerCase() === brandName.toLowerCase()
    );
    return found || null;
  };

  return (
    <div className="w-full px-5 py-6 bg-white animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="mb-8">
        <h2 className="title-md text-brand-primary font-bold">
          AI 디톡이<span className="text-gray-900">의 소비분석 요약</span>
        </h2>
        <p className="body-md text-gray-400 mt-1">
          AI가 분석한 정보로 일부는 실제와 다를 수 있어요.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        {analysisItems.map((item, index) => {
          // ✅ brand 필드를 기반으로 BrandBox에 넣을 타입 결정
          const brandType = toBrandType(item.brand);
          // 해당하는 브랜드가 없으면 순차적으로 돌아가며 보여줌 (UI 깨짐 방지)
          const displayBrand =
            brandType ?? brandTypes[index % brandTypes.length];

          // 문구에 따른 타입 판별
          const isSubscribe = item.question.includes("추천");
          const isCancel = item.question.includes("해지");

          return (
            <div key={index} className="flex flex-col gap-6 mb-10 last:mb-0">
              <div className="flex flex-col gap-2">
                {/* 질문 (Title) */}
                <h3 className="title-md font-bold text-gray-900 leading-tight">
                  {item.question}
                </h3>
                {/* 내용 (Content) */}
                <div className="body-lg text-gray-600 leading-relaxed whitespace-pre-line">
                  {item.content}
                </div>
              </div>

              {/* 브랜드 박스 및 버튼 영역 */}
              <div className="w-full bg-gray-50 rounded-2xl py-8 flex flex-col items-center justify-center gap-4 border border-gray-100">
                <BrandBox brandType={displayBrand} size="lg" />

                {(isSubscribe || isCancel) && (
                  <div
                    className={`body-md px-4 py-2 rounded-full font-semibold shadow-sm ${
                      isSubscribe
                        ? "bg-brand-primary text-white"
                        : "bg-white text-gray-500 border border-gray-200"
                    }`}
                  >
                    {isSubscribe ? "구독 추천" : "해지 추천"}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
