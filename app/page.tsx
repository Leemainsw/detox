"use client";

import Header from "./components/header";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleRight } from "@fortawesome/free-solid-svg-icons/faAngleRight";
import Link from "next/link";
import Image from "next/image";
import SubscriptionList from "./components/subscriptionList";
import Button from "./components/button";
import BottomNav from "./components/bottomNav";
import { useSubscriptionStore } from "@/store";
import type { SubscriptionItem } from "@/store";

export default function Home() {
  const subsList: SubscriptionItem[] = [
    //더미 데이터
    {
      id: 1,
      href: "/",
      name: "넷플릭스",
      price: 0,
      billingCycle: "월간결제",
      badgeLabel: "내일결제",
      badgeVariant: "danger",
    },
    {
      id: 2,
      href: "/",
      name: "웨이브",
      price: 7900,
      billingCycle: "연간결제",
      badgeLabel: "내일결제",
      badgeVariant: "danger",
    },
    {
      id: 3,
      href: "/",
      name: "유튜브 프리미엄",
      price: 6900,
      billingCycle: "월간결제",
      badgeLabel: "D-14",
      badgeVariant: "primary",
    },
    {
      id: 4,
      href: "/",
      name: "스포티파이",
      price: 10900,
      billingCycle: "월간결제",
      badgeLabel: "D-24",
      badgeVariant: "primary",
      group: true,
      groupCount: 4,
    },
  ];

  const hasSubscription = useSubscriptionStore(
    (state) => state.hasSubscription
  );
  const list = useSubscriptionStore((state) => state.list);
  const subscriptionList = list.length > 0 ? list : subsList;
  const subscriptionCount = subscriptionList.length;
  const totalPrice = subscriptionList.reduce(
    (sum, item) => sum + (item.price ?? 0),
    0
  );

  return (
    <>
      <Header rightContent="알람아이콘" />
      <main>
        <section className="px-6 py-5 mb-4 bg-white grid grid-cols-[1fr_100px] items-center justify-between">
          <div className="flex flex-col gap-4">
            <div className="title">
              {hasSubscription ? (
                <>
                  <h2 className="text-2xl">이번달 구독료로</h2>
                  <h1 className="header-md">
                    스타벅스{" "}
                    <span className="text-brand-primary">커피 8잔</span>
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
            {hasSubscription ? (
              <Image
                src="/images/emoji/main-coffee.png"
                alt="메인 이미지"
                width={100}
                height={100}
              />
            ) : (
              <Image
                src="/images/emoji/main-nodata.png"
                alt="메인 이미지"
                width={100}
                height={100}
              />
            )}
          </div>
        </section>
        <section className="pt-10 bg-white border-t-gray-100 border-t-16">
          <div className="relative flex flex-col justify-center items-start gap-4 ">
            <div className="px-6 w-full flex justify-between items-center">
              <h6 className="title-md text-black">
                나의 구독{" "}
                <span className="text-brand-primary">
                  총 {subscriptionCount}개
                </span>
              </h6>
              <h6 className="header-md">{totalPrice.toLocaleString()}원</h6>
            </div>
            <ul className="px-6 w-full">
              {subscriptionList.map((item) => (
                <li key={item.id}>
                  <SubscriptionList
                    href={item.href}
                    name={item.name}
                    price={item.price}
                    billingCycle={item.billingCycle}
                    badgeLabel={item.badgeLabel}
                    badgeVariant={item.badgeVariant}
                    group={item.group}
                    groupCount={item.groupCount}
                    imageSrc={item.imageSrc}
                    imageAlt={item.imageAlt}
                  />
                </li>
              ))}
            </ul>
            {!hasSubscription && (
              <div className="absolute w-full h-full flex flex-col items-center justify-center gap-4 text-center bg-linear-to-bl from-white/50 to-white backdrop-blur-[1.5px]">
                <h6 className="title-md text-black">
                  구독 서비스를 추가 하세요
                </h6>
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
      </main>
      <BottomNav />
    </>
  );
}
