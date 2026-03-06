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
        },
      }}
    />
  );
}
