"use client";

import Image from "next/image";
import Link from "next/link";
import Badge from "../badge/badge";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleRight } from "@fortawesome/free-solid-svg-icons/faAngleRight";

interface Props {
  href: string;
  imageSrc?: string;
  imageAlt?: string;
  name: string;
  trialLabel?: string;
  price?: number;
  billingCycle: "월간결제" | "연간결제";
  badgeLabel: string;
  badgeVariant: "primary" | "danger";
}

export default function SubscriptionList({
  href,
  imageSrc = "/images/default.svg",
  imageAlt = "이미지 설명",
  name,
  price,
  billingCycle,
  badgeLabel,
  badgeVariant,
}: Props) {
  const isFreeTrial = price === 0;
  return (
    <div>
      <Link
        href={href}
        className="w-full grid grid-cols-[1fr_auto_auto] items-center gap-4 py-4 bg-white"
      >
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 rounded-xl border border-gray-100 bg-white flex items-center justify-center overflow-hidden">
            <Image src={imageSrc} alt={imageAlt} width={40} height={40} />
          </div>
          <div>
            <div className="text-base text-black font-bold leading-[150%]">
              {name}
            </div>
            <div className="item-subtext">
              <span>
                {isFreeTrial
                  ? "무료체험"
                  : price !== undefined
                    ? `${price.toLocaleString()}원`
                    : ""}
              </span>
              <span>{billingCycle}</span>
            </div>
          </div>
        </div>
        <Badge variant={badgeVariant}>{badgeLabel}</Badge>
        <FontAwesomeIcon
          icon={faAngleRight}
          className="w-5 h-5 text-gray-300"
        />
      </Link>
    </div>
  );
}
