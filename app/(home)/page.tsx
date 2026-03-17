import HomeSummaryCard from "./_components/home-summary-card";
import HomeSubscriptionSection, {
  type HomeSubscriptionItem,
} from "./_components/home-subscription-section";
import Header from "../components/header";
import BottomNav from "../components/bottom-nav";
import { subscriptableBrand } from "../utils/brand/brand";

export default function Home() {
  // 실제 데이터와 무관하게 홈 상단/빈 상태 UI만 분기하고, 목록은 목업 데이터를 유지합니다.
  const hasSubscription = true;
  const subscriptionItems: Omit<HomeSubscriptionItem, "name">[] = [
    //더미 데이터
    {
      id: 1,
      href: "/",
      brandType: "netflix",
      price: 0,
      billingCycle: "월간결제",
      badgeLabel: "내일결제",
      badgeVariant: "danger",
    },
    {
      id: 2,
      href: "/",
      brandType: "wavve",
      price: 7900,
      billingCycle: "연간결제",
      badgeLabel: "내일결제",
      badgeVariant: "danger",
    },
    {
      id: 3,
      href: "/",
      brandType: "youtube-premium",
      price: 6900,
      billingCycle: "월간결제",
      badgeLabel: "D-14",
      badgeVariant: "primary",
    },
    {
      id: 4,
      href: "/",
      brandType: "spotify",
      price: 10900,
      billingCycle: "월간결제",
      badgeLabel: "D-24",
      badgeVariant: "primary",
      group: true,
      groupCount: 4,
    },
  ];

  const subscriptionList: HomeSubscriptionItem[] = subscriptionItems.map(
    (item) => ({
      ...item,
      name: subscriptableBrand[item.brandType].label,
    })
  );
  const subscriptionCount = subscriptionList.length;
  const thisMonthTotal = subscriptionList.reduce(
    (sum, item) => sum + (item.price ?? 0),
    0
  );

  return (
    <>
      <Header rightContent="알람아이콘" />
      <main>
        <section className="px-6 py-5 mb-4 bg-white grid grid-cols-[1fr_100px] items-center justify-between">
          <HomeSummaryCard
            hasSubscription={hasSubscription}
            thisMonthTotal={thisMonthTotal}
          />
        </section>
        <HomeSubscriptionSection
          hasSubscription={hasSubscription}
          subscriptionList={subscriptionList}
          subscriptionCount={subscriptionCount}
          thisMonthTotal={thisMonthTotal}
        />
      </main>
      <BottomNav />
    </>
  );
}
