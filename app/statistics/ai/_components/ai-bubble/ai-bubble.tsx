"use client";

import Image from "next/image";
import { faCircleNotch } from "@fortawesome/free-solid-svg-icons/faCircleNotch";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import AiBot from "@/public/images/emoji/ai-bot.png";
import ComparisonChart from "@/app/statistics/_components/comparison-chart/comparison-chart";
import {
  analysisMentionsTrend,
  chartHasPlausibleValues,
  getTrendLabel,
} from "@/app/utils/ai/analysis";
import type {
  AnalysisItem,
  AnalysisResponse,
} from "@/app/utils/subscriptions/validation";

type AIBubbleStatus = "text" | "analyzing" | "chart" | "error";

interface AIBubbleProps {
  status: AIBubbleStatus;
  content?: string;
  time?: string;
  analysisData?: AnalysisResponse;
  /** 첫 환영 말풍선 등에만 로봇 프로필 표시 */
  showAvatar?: boolean;
}

function formatInsightQuestion(question: string) {
  const t = question.trim();
  if (/^Q[.．:：]\s*/i.test(t)) return t;
  return `Q. ${t}`;
}

function savingsNumber(item?: AnalysisItem): number | null {
  if (!item?.savings_amount && item?.savings_amount !== 0) return null;
  if (typeof item.savings_amount === "number") {
    return Number.isFinite(item.savings_amount) ? item.savings_amount : null;
  }
  const n = Number(String(item.savings_amount).replace(/[^0-9.-]/g, ""));
  return Number.isFinite(n) ? n : null;
}

export default function AIBubble({
  status,
  content = "",
  time,
  analysisData,
  showAvatar = false,
}: AIBubbleProps) {
  const isAnalyzing = status === "analyzing";
  const isChart = status === "chart" && !!analysisData?.payload;

  const analyzingText = (() => {
    const trimmed = content.trim();
    const withoutLeadingBullet = trimmed.replace(/^[●•]\s*/, "");
    return withoutLeadingBullet || "디톡이가 분석을 시작했어요...";
  })();

  const renderAnalysisCard = () => {
    if (!analysisData?.payload) return null;

    const payload = analysisData.payload;
    const items = Array.isArray(payload.analysis_items)
      ? payload.analysis_items
      : [];
    const insightItem = items[0];
    const recommendationItem =
      items.length >= 2 ? items[items.length - 1] : null;

    const descParagraphs = analysisData.description
      .split(/\n\n+/)
      .map((s) => s.trim())
      .filter(Boolean);
    const summaryLead = descParagraphs[0] ?? analysisData.description.trim();

    const savingsFromItem = insightItem ? savingsNumber(insightItem) : null;
    const diff = payload.diff_amount;

    let highlightPlain: string | null = null;
    if (savingsFromItem != null && savingsFromItem > 0) {
      highlightPlain = `예상 절감 약 월 ${savingsFromItem.toLocaleString("ko-KR")}원`;
    } else if (diff > 0) {
      highlightPlain = `예상 절감 약 월 ${diff.toLocaleString("ko-KR")}원`;
    }

    const disclaimer =
      (payload.diff_message && payload.diff_message.trim()) || null;

    const chartRows = Array.isArray(payload.chart_data)
      ? payload.chart_data
      : [];
    const mentionsTrend = analysisMentionsTrend(
      analysisData.title,
      analysisData.description
    );
    const sparseChart =
      chartRows.length > 0 &&
      chartRows.every((c) => c.my_spend === 0 && c.avg_spend === 0);
    const showTrendChart =
      mentionsTrend &&
      chartRows.length > 0 &&
      chartHasPlausibleValues(chartRows) &&
      !sparseChart;
    const trendLabel = showTrendChart ? getTrendLabel(chartRows) : "";

    let recommendationBody: string | null = null;
    if (recommendationItem && recommendationItem !== insightItem) {
      const parts = [
        recommendationItem.question?.trim(),
        recommendationItem.content?.trim(),
      ].filter(Boolean);
      recommendationBody = parts.join("\n\n");
    } else if (descParagraphs.length > 1) {
      recommendationBody = descParagraphs[descParagraphs.length - 1] ?? null;
    }

    return (
      <article className="w-full max-w-[100%] rounded-2xl border border-gray-100 bg-white px-4 py-5 shadow-sm">
        <h3 className="title-md font-bold text-brand-primary leading-snug">
          {analysisData.title}
        </h3>
        {summaryLead ? (
          <p className="body-md mt-2 text-gray-900 leading-relaxed">
            {summaryLead}
          </p>
        ) : null}

        {insightItem ? (
          <div className="mt-4 rounded-xl bg-gray-50 p-4">
            <span className="inline-flex rounded-full bg-brand-primary px-2.5 py-0.5 text-[11px] font-semibold tracking-wide text-white">
              AI INSIGHT
            </span>
            <p className="title-sm font-bold text-gray-900 mt-3">
              {formatInsightQuestion(insightItem.question)}
            </p>
            <div className="body-md mt-2 text-gray-700 leading-relaxed whitespace-pre-line">
              {insightItem.content}
            </div>
          </div>
        ) : null}

        {highlightPlain ? (
          <div className="mt-4 flex items-start gap-2 rounded-xl bg-blue-50 px-3.5 py-3">
            <span className="shrink-0 text-base leading-none" aria-hidden>
              💡
            </span>
            <p className="body-md font-medium text-brand-primary leading-relaxed">
              {highlightPlain}
            </p>
          </div>
        ) : null}

        {disclaimer ? (
          <p className="body-md mt-4 text-gray-500 leading-relaxed">
            {disclaimer}
          </p>
        ) : null}

        {mentionsTrend ? (
          showTrendChart ? (
            <div className="mt-4">
              <div className="mb-2 font-bold text-gray-700">
                최근 3개월 구독 소비 추세 (월별)
              </div>
              <ComparisonChart data={chartRows} isLoading={false} />
              {trendLabel ? (
                <div className="text-sm mt-2 text-gray-600">{trendLabel}</div>
              ) : null}
            </div>
          ) : (
            <div className="mt-4 text-sm text-gray-500">
              최근 3개월 추적 데이터가 부족합니다. 다음에 추가 분석을
              요청하세요.
            </div>
          )
        ) : null}

        {recommendationBody ? (
          <div className="mt-4 rounded-xl border border-blue-200 bg-blue-50/80 px-3.5 py-3">
            <p className="body-md font-medium text-brand-primary leading-relaxed whitespace-pre-line">
              {recommendationBody}
            </p>
          </div>
        ) : null}
      </article>
    );
  };

  return (
    <div className="flex flex-col items-start mb-6 px-6 animate-in slide-in-from-left-2 w-full">
      <div
        className={`flex items-start w-full ${showAvatar ? "gap-3" : ""}`}
      >
        {showAvatar ? (
          <div className="shrink-0 pt-0.5">
            <Image
              src={AiBot}
              alt="AI 디톡이"
              width={44}
              height={44}
              className="h-11 w-11 object-contain"
            />
          </div>
        ) : null}
        <div
          className={
            showAvatar
              ? "min-w-0 flex-1 flex flex-col items-stretch"
              : "w-full flex flex-col items-stretch"
          }
        >
          {isChart ? (
            renderAnalysisCard()
          ) : (
            <div className="bg-gray-100 text-gray-900 px-3 py-3 text-left rounded-lg rounded-tl-none max-w-[90%] break-keep wrap-anywhere">
              {isAnalyzing ? (
                <div className="flex items-start gap-2.5">
                  <FontAwesomeIcon
                    icon={faCircleNotch}
                    className="mt-1 h-4 w-4 shrink-0 animate-spin text-gray-600"
                    aria-hidden
                  />
                  <p className="body-lg leading-relaxed text-gray-700 whitespace-pre-line">
                    {analyzingText}
                  </p>
                </div>
              ) : (
                <p className="body-lg leading-relaxed text-gray-800 whitespace-pre-line">
                  {content}
                </p>
              )}
            </div>
          )}

          {time && (
            <span className="label-lg text-gray-300 mt-2">{time}</span>
          )}
        </div>
      </div>
    </div>
  );
}
