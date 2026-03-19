"use client";

import Image from "next/image";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleRight } from "@fortawesome/free-solid-svg-icons/faAngleRight";
import type { FoodResult } from "@/app/utils/subscriptions/random-food";
import HomeSummarySkeleton from "./home-summary-skeleton";

interface Props {
  type: "this-month" | "saved";
  food: FoodResult | null;
  isLoading: boolean;
}

export default function HomeSummaryFoodCard({ type, food, isLoading }: Props) {
  const isSaved = type === "saved";

  if (isLoading || !food) {
    return <HomeSummarySkeleton type={type} />;
  }

  return (
    <>
      <div className="flex flex-col gap-4">
        <div className="title">
          <h2 className="text-2xl">
            {isSaved ? "지난달보다" : "이번달 구독료로"}
          </h2>
          <h1 className="header-md">
            {food.label}{" "}
            <span className="text-brand-primary">
              {food.count}
              {food.unit}
            </span>{" "}
            {isSaved ? "아꼈어요" : ""}
          </h1>
        </div>

        <Link
          href="/statistics"
          className="body-lg text-gray-300 inline-flex items-center gap-1 mt-2"
        >
          자세히 알아보기
          <FontAwesomeIcon icon={faAngleRight} size="xs" />
        </Link>
      </div>
      <div>
        <Image src={food.imageSrc} alt={food.label} width={100} height={100} />
      </div>
    </>
  );
}
