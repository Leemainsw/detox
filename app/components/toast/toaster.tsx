"use client";

import { Toaster as SonnerToaster } from "sonner";

export default function Toaster() {
  return (
    <SonnerToaster
      position="bottom-center"
      richColors
      closeButton={false}
      toastOptions={{
        style: {
          fontFamily: "var(--font-pretendard), sans-serif",
          backgroundColor: "var(--color-gray-400)",
          color: "var(--color-white)",
          border: "none",
        },
      }}
    />
  );
}
