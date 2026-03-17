"use client";

import Image from "next/image";
import { AnalysisResponse } from "@/app/utils/subscriptions/validation";

type AIStatus = "text" | "analyzing" | "error" | "chart";

interface AIBubbleProps {
  content?: string;
  time?: string;
  status?: AIStatus;
  analysisData?: AnalysisResponse;
}

export default function AIBubble({
  content,
  time,
  status = "text",
  analysisData,
}: AIBubbleProps) {
  return (
    <div className="flex flex-col mb-6 px-6 animate-in fade-in">
      <div className="flex items-center mb-2">
        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center mr-2 overflow-hidden">
          <Image
            src="/images/emoji/robot.png"
            alt="AI 디톡이"
            width={28}
            height={28}
            className="w-full h-full object-cover"
          />
        </div>
        <span className="font-bold body-lg text-gray-900">AI디톡이</span>
      </div>

      <div className="flex flex-col items-start max-w-[90%]">
        <div className="bg-white border border-gray-100 px-4 py-3 rounded-2xl w-full">
          {status === "analyzing" && (
            <div className="flex items-center gap-3 py-1 text-brand-primary font-medium body-lg">
              분석 중이니 잠시만 기다려주세요
            </div>
          )}

          {status === "error" && (
            <p className="body-lg text-red-500 font-medium">
              분석에 실패했어요. 다시 시도해주세요.
            </p>
          )}

          {content && status !== "chart" && (
            <p className="body-lg whitespace-pre-wrap font-medium text-gray-700 leading-relaxed">
              {content}
            </p>
          )}

          {analysisData?.payload?.analysis_items && (
            <div className="mt-3 flex flex-col gap-4">
              <div className="py-2 border-b border-gray-50">
                <p className="title-sm text-brand-primary font-bold">
                  {analysisData.title}
                </p>
                <p className="body-sm text-gray-400">
                  {analysisData.description}
                </p>
              </div>

              {analysisData.payload.analysis_items.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-gray-50 p-3 rounded-xl flex flex-col gap-1 border border-gray-100"
                >
                  <span className="text-xs font-bold text-brand-secondary bg-brand-secondary/10 w-fit px-2 py-0.5 rounded">
                    {item.brand} 분석
                  </span>
                  <p className="body-md font-bold text-gray-800">
                    {item.question}
                  </p>
                  <p className="body-sm text-gray-500 leading-snug">
                    {item.content}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {status !== "analyzing" && time && (
          <span className="label-lg text-gray-300 mt-1.5 ml-1">{time}</span>
        )}
      </div>
    </div>
  );
}
