"use client";

import { useState, useEffect, useRef } from "react";
import Header from "@/app/components/header";
import DateDivider from "./_components/date-divider/date-divider";
import UserBubble from "./_components/user-bubble";
import AIBubble from "./_components/ai-bubble";
import QuickQuestions from "./_components/quick-questions";
import MyChart from "../_components/comparison-chart";

interface AnalysisResponse {
  type: string;
  title: string;
  description: string;
  message?: string;
  payload: {
    chart_data: Array<{ month: string; my_spend: number; avg_spend: number }>;
    diff_amount: number;
  };
}

interface Message {
  role: "user" | "ai";
  content: string;
  time: string;
  type?: "text" | "chart";
  analysisData?: AnalysisResponse;
}

export default function ChatPage() {
  const [aiStatus, setAiStatus] = useState<
    "text" | "analyzing" | "error" | "chart"
  >("text");
  const [messages, setMessages] = useState<Message[]>([]);
  const [showQuickQuestions, setShowQuickQuestions] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, aiStatus]);

  const handleQuestionSelect = async (question: string) => {
    const now = new Date().toLocaleTimeString("ko-KR", {
      hour: "2-digit",
      minute: "2-digit",
    });

    setShowQuickQuestions(false);
    setMessages((prev) => [
      ...prev,
      { role: "user", content: question, time: now, type: "text" },
    ]);
    setAiStatus("analyzing");

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userContext: { categoryRatio: { OTT: 40, Shopping: 30, Food: 30 } },
        }),
      });

      if (!response.ok) throw new Error("분석 실패");

      const data: AnalysisResponse = await response.json();
      const responseTime = new Date().toLocaleTimeString("ko-KR", {
        hour: "2-digit",
        minute: "2-digit",
      });

      if (data.type === "NO_DATA") {
        //  데이터가 없을 때 처리
        setAiStatus("text");
        setMessages((prev) => [
          ...prev,
          {
            role: "ai",
            type: "text",
            content: data.message || "분석할 데이터가 없습니다.",
            time: responseTime,
          },
        ]);
      } else if (!response.ok) {
        throw new Error("분석 실패");
      } else {
        setAiStatus("chart");
        setMessages((prev) => [
          ...prev,
          {
            role: "ai",
            type: "chart",
            content: data.description,
            time: responseTime,
            analysisData: data,
          },
        ]);
      }
    } catch (error) {
      console.error(error);
      setAiStatus("error");
      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          content: "앗, 분석 중에 오류가 생겼어요. 다시 시도해 주시겠어요?",
          time: now,
        },
      ]);
    } finally {
      setShowQuickQuestions(true);
    }
  };

  return (
    <main className="relative flex flex-col w-full h-screen bg-white">
      <Header variant="back" title="AI디톡이와 소비분석" />

      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto pt-4 pb-10 custom-scrollbar"
      >
        <DateDivider />
        <AIBubble
          status="text"
          content="어떤 서비스 기준으로 분석해드릴까요?"
        />

        {messages.map((msg, idx) =>
          msg.role === "user" ? (
            <UserBubble key={idx} content={msg.content} time={msg.time} />
          ) : (
            <AIBubble
              key={idx}
              status={msg.type === "chart" ? "chart" : "text"}
              content={msg.content}
              time={msg.time}
              chartComponent={
                msg.type === "chart" && msg.analysisData ? (
                  <div className="mt-4 w-full">
                    <h4 className="text-sm font-bold mb-2">
                      {msg.analysisData.title}
                    </h4>
                    <MyChart
                      data={msg.analysisData.payload.chart_data}
                      diffAmount={msg.analysisData.payload.diff_amount}
                    />
                  </div>
                ) : null
              }
            />
          )
        )}

        {aiStatus === "analyzing" && <AIBubble status="analyzing" />}
        {showQuickQuestions && aiStatus !== "analyzing" && (
          <QuickQuestions onSelect={handleQuestionSelect} />
        )}
      </div>
    </main>
  );
}
