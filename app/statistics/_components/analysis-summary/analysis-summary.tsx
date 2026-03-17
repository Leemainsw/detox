"use client";

import { AnalysisResult } from "@/store/useAnalysisStore";
import { subscriptableBrand } from "@/app/utils/brand/brand";
import type { SubscriptableBrandType } from "@/app/utils/brand/type";
import BrandBox from "@/app/components/brand-box";

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

  const toBrandTypes = (brands?: string[]) => {
    const list = (brands ?? [])
      .map((b) => b as SubscriptableBrandType)
      .filter((b) => brandTypes.includes(b));
    return list;
  };

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
          const brands = toBrandTypes(item.brands);
          const primaryBrand = brands[0] ?? brandTypes[index % brandTypes.length];

          const isSubscribe = item.kind === "SUBSCRIBE_RECOMMENDATION";
          const isCancel = item.kind === "CANCEL_RECOMMENDATION";
          const isWeek = item.kind === "PAYMENT_WEEK_ALERT";

          return (
            <div key={index} className="flex flex-col gap-6 mb-8">
              <div className="flex flex-col gap-1">
                <h3 className="title-md font-bold text-black">{item.title}</h3>
                <div className="body-lg text-gray-300 leading-snug whitespace-pre-line">
                  {item.description}
                  {isCancel &&
                    typeof item.savings_amount === "number" &&
                    item.savings_amount > 0 && (
                      <>
                        {"\n"}
                        <span className="font-bold text-gray-800">
                          최소 월{" "}
                        </span>
                        <span className="font-bold text-brand-primary">
                          {item.savings_amount.toLocaleString()}원
                        </span>
                        <span className="font-bold text-gray-800">
                          {" "}
                          아낄 수 있어요
                        </span>
                      </>
                    )}
                  {isWeek &&
                    typeof item.expected_amount === "number" &&
                    item.week_range && (
                      <>
                        {"\n"}
                        <span className="font-bold text-gray-800">
                          {item.week_range}
                        </span>
                        <span className="font-bold text-gray-800">
                          {" "}
                          결제 부담이 가장 커요
                        </span>
                        {"\n"}
                        <span className="font-bold text-gray-800">
                          예상 결제액은{" "}
                        </span>
                        <span className="font-bold text-brand-primary">
                          {item.expected_amount.toLocaleString()}원
                        </span>
                        <span className="font-bold text-gray-800">
                          이에요!
                        </span>
                      </>
                    )}
                </div>
              </div>

              <div className="w-full bg-gray-50 rounded-xl py-6 flex flex-col items-center justify-center gap-3">
                {isSubscribe && brands.length >= 2 ? (
                  <div className="flex items-center justify-center gap-4">
                    {brands.slice(0, 2).map((b) => (
                      <BrandBox key={b} brandType={b} size="lg" />
                    ))}
                  </div>
                ) : isWeek && brands.length > 0 ? (
                  <div className="flex items-center justify-center gap-4 flex-wrap px-6">
                    {brands.slice(0, 6).map((b) => (
                      <BrandBox key={b} brandType={b} size="lg" />
                    ))}
                  </div>
                ) : (
                  <BrandBox brandType={primaryBrand} size="lg" />
                )}

                {(isSubscribe || isCancel) && (
                  <button
                    type="button"
                    className={`body-md px-3 py-1.5 rounded-md font-medium ${
                      isSubscribe
                        ? "bg-brand-primary text-white"
                        : "bg-gray-200 text-white"
                    }`}
                  >
                    {item.cta_label ?? (isSubscribe ? "구독 추천" : "해지 추천")}
                  </button>
                )}
              </div>
            </div>
          );
        })}

        {/* 데이터가 없을 경우 기본 리포트 표시 */}
        {analysisItems.length === 0 && (
          <div className="flex flex-col gap-6 mb-8">
            <div className="flex flex-col gap-1">
              <h3 className="title-md font-bold text-black">
                {analysisData.title}
              </h3>
              <div className="body-lg text-gray-300 leading-snug whitespace-pre-line">
                {analysisData.description}
              </div>
            </div>
            <div className="w-full bg-gray-50 rounded-xl py-6 flex flex-col items-center justify-center gap-3">
              <BrandBox brandType={brandTypes[0]} size="lg" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
