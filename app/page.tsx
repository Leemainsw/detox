"use client";

import Header from "./components/header";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleRight } from "@fortawesome/free-solid-svg-icons/faAngleRight";
import Link from "next/link";
import Image from "next/image";
import SubscriptionList from "./components/subscription-list";
import Button from "./components/button";
import BottomNav from "./components/bottom-nav";
import type { SubscriptableBrandType } from "./utils/brand/type";
import { useGetSubscriptionListQuery } from "@/query/subscription";
import { useSupabase } from "@/hooks/useSupabase";

export default function Home() {
  const { session } = useSupabase();
  const { data: subscriptions = [] } = useGetSubscriptionListQuery(
    !!session?.user
  );

  const showSubscribedUiState = subscriptions.length > 0;
  const subscriptionCount = subscriptions.length;
  const totalPrice = subscriptions.reduce(
    (sum, item) =>
      sum +
      (item.payment_type === "trial"
        ? 0
        : item.total_amount / Math.max(item.member_count, 1)),
    0
  );

  return (
    <>
      <Header rightContent="알람아이콘" />
      <main>
        <section className="px-6 py-5 mb-4 bg-white grid grid-cols-[1fr_100px] items-center justify-between">
          <div className="flex flex-col gap-4">
            <div className="title">
              {showSubscribedUiState ? (
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
            {showSubscribedUiState ? (
              <Image
                src="/images/emoji/main-coffee.png"
                alt=""
                width={100}
                height={100}
              />
            ) : (
              <Image
                src="/images/emoji/main-nodata.png"
                alt=""
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
              {subscriptions.map((item) => (
                <li key={item.id}>
                  <SubscriptionList
                    href={`/subscription/${item.id}`}
                    brandType={item.service as SubscriptableBrandType}
                    price={item.total_amount / Math.max(item.member_count, 1)}
                    billingCycle={item.billing_cycle}
                    group={item.subscription_mode === "group"}
                    groupCount={Math.max(item.member_count - 1, 0)}
                    isFreeTrial={item.payment_type === "trial"}
                  />
                </li>
              ))}
            </ul>
            {!showSubscribedUiState && (
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
            <Link href="/subscription/add">
              <Button variant="primary" size="lg">
                구독 추가하기
              </Button>
            </Link>
          </div>
        </section>
      </main>
      <BottomNav />
    </>
  );
}
