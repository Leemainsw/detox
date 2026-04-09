"use client";

import { AnalysisResponse } from "@/app/utils/subscriptions/validation";
import { subscriptableBrand } from "@/app/utils/brand/brand";
import type { SubscriptableBrandType } from "@/app/utils/brand/type";
import BrandBox from "@/app/components/brand-box";

export interface AnalysisSummaryItem {
  label: string;
  data: AnalysisResponse;
}

interface AnalysisSummaryProps {
  hasData: boolean;
  items: AnalysisSummaryItem[];
}

export default function AnalysisSummary({
  hasData,
  items,
}: AnalysisSummaryProps) {
  if (!hasData || items.length === 0) return null;

  const brandTypes = Object.keys(
    subscriptableBrand
  ) as SubscriptableBrandType[];

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

      <div className="flex flex-col gap-12">
        {items.map(({ label, data: analysisData }) => {
          const analysisItems = analysisData.payload?.analysis_items || [];
          return (
            <section
              key={label}
              className="flex flex-col gap-6 border-b border-gray-100 pb-10 last:border-0 last:pb-0"
            >
              <p className="body-md font-medium text-gray-500 leading-snug">
                {label}
              </p>
              <div className="flex flex-col gap-1">
                <h3 className="title-md font-bold text-brand-primary leading-tight">
                  {analysisData.title}
                </h3>
                <p className="body-md text-gray-700 leading-relaxed whitespace-pre-line">
                  {analysisData.description}
                </p>
              </div>

              <div className="flex flex-col gap-4">
                {analysisItems.map((item, index) => {
                  const brandType = toBrandType(item.brand);
                  const displayBrand =
                    brandType ?? brandTypes[index % brandTypes.length];

                  const isSubscribe = item.question.includes("추천");
                  const isCancel = item.question.includes("해지");

                  return (
                    <div
                      key={`${label}-${index}`}
                      className="flex flex-col gap-6 mb-2 last:mb-0"
                    >
                      <div className="flex flex-col gap-2">
                        <h4 className="title-sm font-bold text-gray-900 leading-tight">
                          {item.question}
                        </h4>
                        <div className="body-lg text-gray-600 leading-relaxed whitespace-pre-line">
                          {item.content}
                        </div>
                      </div>

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
            </section>
          );
        })}
      </div>
    </div>
  );
}
