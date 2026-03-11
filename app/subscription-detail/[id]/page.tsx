"use client";
import Header from "@/app/components/header";
import { useParams, useRouter } from "next/navigation";
import PaymentInfoCard from "./_components/payment-info-card";
import SubscriptionMetaList from "./_components/subscription-meta-list";
import { useAlert } from "@/app/hooks/useAlert";
import TextButton from "@/app/components/text-button";

export default function Page() {
  const router = useRouter();
  const { id } = useParams();

  const alert = useAlert();

  const goEdit = () => {
    router.push(`/subscription-detail/${id}/edit`);
  };

  const handleDelete = () => {
    alert.alert({
      title: "구독을 삭제하시겠습니까?",
      description: "삭제된 구독은 복구할 수 없습니다.",
      variant: "danger",
      cancelText: "취소",
      confirmText: "삭제",
    });
  };

  return (
    <main className="relative w-full min-h-screen flex flex-col items-start justify-start">
      <Header
        variant="back"
        onBack={() => router.back()}
        rightContent={<TextButton onClick={goEdit}>수정</TextButton>}
      />

      <div className="w-full mt-5 px-6 flex flex-col gap-5">
        {/* TODO: SubscriptionList 컴포넌트 수정 필요, 수정한 뒤 주석 해제 */}
        {/* <SubscriptionList
          href={`/subscription-detail/${id}`}
          brandType="apple-music"
          name="Apple Music"
          billingCycle="월간결제"
          badgeLabel="D-10"
          badgeVariant="primary"
          price={4900}
        /> */}

        <PaymentInfoCard
          splitBar={{
            type: "multi",
            myAmount: 4900,
            totalAmount: 19600,
            partyCount: 3,
          }}
          nextPaymentAmount={4900}
          totalAccumulatedAmount={178000}
        />

        <SubscriptionMetaList
          items={[
            { label: "구독 종료일", value: "이번달 26일" },
            { label: "결제 예정일", value: "27일" },
          ]}
        />
      </div>

      <TextButton
        size="sm"
        className="absolute left-1/2 -translate-x-1/2 bottom-[108px]"
        underline
        onClick={handleDelete}
      >
        구독 삭제하기
      </TextButton>
    </main>
  );
}
