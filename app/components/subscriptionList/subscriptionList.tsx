"use client";

import Image from "next/image";
import Link from "next/link";
import Badge from "../badge/badge";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleRight } from "@fortawesome/free-solid-svg-icons/faAngleRight";
import { faUserGroup } from "@fortawesome/free-solid-svg-icons";
import type { SubscriptionItem } from "@/store";

type Props = Pick<
  SubscriptionItem,
  | "href"
  | "imageSrc"
  | "imageAlt"
  | "name"
  | "price"
  | "billingCycle"
  | "badgeLabel"
  | "badgeVariant"
  | "group"
  | "groupCount"
>;
export default function SubscriptionList({
  href,
  imageSrc = "/images/default.svg",
  imageAlt,
  name,
  price,
  billingCycle,
  badgeLabel,
  badgeVariant,
  group = false,
  groupCount,
}: Props) {
  const resolvedImageAlt = imageAlt ?? `${name} 로고`;
  const isFreeTrial = price === 0;
  return (
    <Link
      href={href}
      className="w-full grid grid-cols-[1fr_auto_auto] items-center gap-4 py-4 bg-white"
    >
      <div className="flex items-start gap-3">
        <div className="w-12 h-12 rounded-xl border border-gray-100 bg-white flex items-center justify-center overflow-hidden">
          <Image src={imageSrc} alt={resolvedImageAlt} width={40} height={40} />
        </div>
        <div>
          <div className="text-base text-black font-bold leading-[150%] flex gap-2 items-center">
            {name}

            {group && groupCount !== undefined && (
              <span className="text-brand-primary text-sm flex gap-1 items-center font-bold">
                <FontAwesomeIcon icon={faUserGroup} size="sm" />
                {groupCount}인
              </span>
            )}
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
      <FontAwesomeIcon icon={faAngleRight} className="w-5 h-5 text-gray-300" />
    </Link>
  );
}
