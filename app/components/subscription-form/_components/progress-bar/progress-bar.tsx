"use client";

import { useEffect, useState } from "react";

interface Props {
  steps: string[];
  currentStep: number;
}
export default function ProgressBar({ steps, currentStep }: Props) {
  const targetScale = steps.length > 0 ? currentStep / steps.length : 0;
  const [scale, setScale] = useState(0);

  useEffect(() => {
    let innerId: number;
    const id = requestAnimationFrame(() => {
      innerId = requestAnimationFrame(() => setScale(targetScale));
    });
    return () => {
      cancelAnimationFrame(id);
      cancelAnimationFrame(innerId);
    };
  }, [targetScale]);

  return (
    <div className="px-6">
      <div className="w-full h-2 rounded-lg bg-progress-bar overflow-hidden">
        <div
          className="h-full w-full rounded-lg bg-brand-primary origin-left transition-transform duration-500 ease-out"
          style={{ transform: `scaleX(${scale})` }}
        />
      </div>
    </div>
  );
}
