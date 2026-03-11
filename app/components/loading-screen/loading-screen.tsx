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
        className="h-20 w-20 animate-spin text-blue-400 text-3xl mb-5"
      />
      <div className="flex flex-col items-center justify-center gap-2">
        <h1 className="header-md">{message}</h1>
        <p className="title-md font-medium text-gray-300">
          화면을 불러오는 중입니다.
        </p>
      </div>
    </main>
  );
}
