"use client";

import SubscriptionList from "@/app/components/subscription-list";
import Button from "@/app/components/button";
import type { SubscriptableBrandType } from "@/app/utils/brand/type";

export interface HomeSubscriptionItem {
  id: number;
  href: string;
  brandType: SubscriptableBrandType;
  name: string;
  price?: number;
  billingCycle: "월간결제" | "연간결제";
  badgeLabel: string;
  badgeVariant: "primary" | "danger";
  group?: boolean;
  groupCount?: number;
}

interface Props {
  hasSubscription: boolean;
  subscriptionList: HomeSubscriptionItem[];
  subscriptionCount: number;
  thisMonthTotal: number;
}

export default function HomeSubscriptionSection({
  hasSubscription,
  subscriptionList,
  subscriptionCount,
  thisMonthTotal,
}: Props) {
  return (
    <section className="pt-10 bg-white border-t-gray-100 border-t-16">
      <div className="relative flex flex-col justify-center items-start gap-4 ">
        <div className="px-6 w-full flex justify-between items-center">
          <h6 className="title-md text-black">
            나의 구독{" "}
            <span className="text-brand-primary">총 {subscriptionCount}개</span>
          </h6>
          <h6 className="header-md">{thisMonthTotal.toLocaleString()}원</h6>
        </div>
        <ul className="px-6 w-full">
          {subscriptionList.map((item) => (
            <li key={item.id}>
              <SubscriptionList
                href={item.href}
                brandType={item.brandType}
                name={item.name}
                price={item.price}
                billingCycle={item.billingCycle}
                badgeLabel={item.badgeLabel}
                badgeVariant={item.badgeVariant}
                group={item.group}
                groupCount={item.groupCount}
              />
            </li>
          ))}
        </ul>
        {!hasSubscription && (
          <div className="absolute w-full h-full flex flex-col items-center justify-center gap-4 text-center bg-linear-to-bl from-white/50 to-white backdrop-blur-[1.5px]">
            <h6 className="title-md text-black">구독 서비스를 추가 하세요</h6>
            <p className="body-md text-gray-300">
              내가 사용하는 구독을 추가하고
              <br />
              소비를 절약해보세요
            </p>
          </div>
        )}
      </div>
      <div className="mx-6 btn-wrap">
        <Button variant="primary" size="lg">
          구독 추가하기
        </Button>
      </div>
    </section>
  );
}
