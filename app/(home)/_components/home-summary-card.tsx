"use client";

import Image from "next/image";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleRight } from "@fortawesome/free-solid-svg-icons/faAngleRight";

interface Props {
  showSubscribedUiState: boolean;
}

export default function HomeSummaryCard({ showSubscribedUiState }: Props) {
  return (
    <>
      <div className="flex flex-col gap-4">
        <div className="title">
          {showSubscribedUiState ? (
            <>
              <h2 className="text-2xl">이번달 구독료로</h2>
              <h1 className="header-md">
                스타벅스 <span className="text-brand-primary">커피 8잔</span>
              </h1>
            </>
          ) : (
            <>
              <h2 className="text-2xl">숨겨진 낭비를 줄이면</h2>
              <h1 className="header-md">
                연간 최대 <span className="text-brand-primary">???원</span>
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
            showSubscribedUiState
              ? "/images/emoji/main-coffee.png"
              : "/images/emoji/main-nodata.png"
          }
          alt=""
          width={100}
          height={100}
        />
      </div>
    </>
  );
}
