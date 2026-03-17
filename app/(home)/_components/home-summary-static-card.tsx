"use client";

import Image from "next/image";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleRight } from "@fortawesome/free-solid-svg-icons/faAngleRight";

interface Props {
  type: "empty" | "same";
}

export default function HomeSummaryStaticCard({ type }: Props) {
  const isEmpty = type === "empty";

  return (
    <>
      <div className="flex flex-col gap-4">
        <div className="title">
          {isEmpty ? (
            <>
              <h2 className="text-2xl">숨겨진 구독 추가하고</h2>
              <h1 className="header-md">
                연간 최대 <span className="text-brand-primary">???원</span>
              </h1>
            </>
          ) : (
            <>
              <h2 className="text-2xl">한눈에 보는</h2>
              <h1 className="header-md">
                이번달 <span className="text-brand-primary">구독통계</span>
              </h1>
            </>
          )}
        </div>

        <Link
          href="/통계메인"
          className="body-lg text-gray-300 inline-flex items-center gap-1 mt-2"
        >
          자세히 알아보기
          <FontAwesomeIcon icon={faAngleRight} size="xs" />
        </Link>
      </div>
      <div>
        <Image
          src={
            isEmpty
              ? "/images/emoji/main-nodata.png"
              : "/images/emoji/main-money.png"
          }
          alt=""
          width={100}
          height={100}
        />
      </div>
    </>
  );
}
