"use client";

import Header from "@/app/components/header";
import DateDivider from "./_components/date-divider/date-divider";
import UserBubble from "./_components/user-bubble";
import AIBubble from "./_components/ai-bubble";
import QuickQuestions from "./_components/quick-questions";
import { useAiChat } from "@/hooks/useAiChat";
import { useCurrentUserQuery } from "@/query/users";

export default function StatisticsAIPage() {
  const { data: user } = useCurrentUserQuery();
  const {
    aiStatus,
    messages,
    streamedResult,
    showQuickQuestions,
    scrollRef,
    handleQuestionSelect,
  } = useAiChat();

  const metadata = user?.user_metadata as
    | Record<string, string | undefined>
    | undefined;
  const username =
    metadata?.display_name ||
    metadata?.full_name ||
    metadata?.nickname ||
    metadata?.name ||
    "사용자";

  return (
    <main className="relative flex flex-col w-full h-screen bg-white">
      <Header variant="back" title="AI디톡이와 소비분석" />

      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto pt-4 pb-10 custom-scrollbar"
      >
        <DateDivider />

        <AIBubble
          showAvatar
          status="text"
          content={`안녕하세요\n저는 ${username}님의\n소비분석을 도와드리는 AI디톡이에요.\n아래 질문 중 하나를 선택해주시면\n제가 알잘딱깔센하게 분석해드릴게요.`}
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
              analysisData={msg.analysisData}
            />
          )
        )}

        {aiStatus === "analyzing" && (
          <AIBubble status="analyzing" content={streamedResult} />
        )}

        {showQuickQuestions && aiStatus !== "analyzing" && (
          <QuickQuestions onSelect={handleQuestionSelect} />
        )}
      </div>
    </main>
  );
}
