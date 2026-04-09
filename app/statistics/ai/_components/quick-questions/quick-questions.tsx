"use client";

import { QUICK_ANALYSIS_QUESTIONS } from "@/app/utils/ai/quick-analysis-questions";

interface QuickQuestionsProps {
  onSelect: (question: string) => void;
}

export default function QuickQuestions({ onSelect }: QuickQuestionsProps) {
  const questions = [...QUICK_ANALYSIS_QUESTIONS];

  return (
    <div className="flex flex-col items-end gap-2.5 px-6 mb-6">
      {questions.map((q, idx) => (
        <button
          type="button"
          key={idx}
          onClick={() => onSelect(q)}
          className="body-lg bg-gray-200 text-white px-3 py-3 rounded-lg rounded-tr-none transition-opacity text-right break-keep max-w-[90%]"
        >
          {q}
        </button>
      ))}
    </div>
  );
}
