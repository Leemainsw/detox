"use client";

import Header from "@/app/components/header";
import DateDivider from "./_components/date-divider/date-divider";
import UserBubble from "./_components/user-bubble";
import AIBubble from "./_components/ai-bubble";
import QuickQuestions from "./_components/quick-questions";
import MyChart from "../_components/comparison-chart";
import { useAiChat } from "../../../hooks/useAiChat";

export default function Page() {
  const {
    aiStatus,
    messages,
    showQuickQuestions,
    scrollRef,
    handleQuestionSelect,
  } = useAiChat();

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
                      diffMessage={msg.analysisData.payload.diff_message}
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
