"use client";

import { faCircleNotch } from "@fortawesome/free-solid-svg-icons/faCircleNotch";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface Props {
  message?: string;
}

export default function LoadingScreen({
  message = "불러오는 중이에요.",
}: Props) {
  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center gap-4">
      <FontAwesomeIcon
        icon={faCircleNotch}
        className="h-12 w-12 animate-spin text-blue-400 text-5xl"
      />
      <p className="body-md text-gray-400">{message}</p>
    </main>
  );
}
