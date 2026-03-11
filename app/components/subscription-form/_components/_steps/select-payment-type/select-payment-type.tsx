import BottomCTA from "@/app/components/bottom-cta";
import Button from "@/app/components/button";
import Input from "@/app/components/input";
import SegmentedControl from "@/app/components/segmented-control";
import { useState } from "react";
import { PaymentType, SubscriptionMode } from "../../../types/type";

interface Values {
  subscription_mode: SubscriptionMode;
  payment_type: PaymentType;
  member_count: number;
  total_amount: number;
  trial_months: number;
}

interface Props {
  onNext: (values: Values) => void;
}
export default function SelectPaymentType({ onNext }: Props) {
  const [subscriptionMode, setSubscriptionMode] =
    useState<SubscriptionMode>("solo");
  const [paymentType, setPaymentType] = useState<PaymentType>("paid");
  const [memberCount, setMemberCount] = useState<number | null>(null);
  const [trialMonthCount, setTrialMonthCount] = useState<number | null>(null);
  const [totalAmount, setTotalAmount] = useState<number | null>(null);
  return (
    <>
      <div className="flex flex-col gap-5 px-6 relative">
        <h1 className="header-md leading-tight">
          결제 유형을
          <br />
          선택 해주세요
        </h1>
      </div>

      <div className="flex flex-col gap-5 px-6">
        <SegmentedControl
          options={[
            { label: "혼자서", value: "solo" },
            { label: "여럿이서", value: "group" },
          ]}
          value={subscriptionMode}
          onValueChange={(value) =>
            setSubscriptionMode(value as SubscriptionMode)
          }
        />
        {subscriptionMode === "group" && (
          <Input
            label="총 몇명이서 구독하시나요?"
            placeholder="사람 수를 입력해주세요"
            suffix="명"
            type="number"
            onChange={(e) => {
              setMemberCount(Number(e.target.value));
            }}
            value={memberCount ? memberCount.toString() : ""}
          />
        )}

        <SegmentedControl
          options={[
            { label: "유료결제", value: "paid" },
            { label: "무료결제", value: "trial" },
          ]}
          value={paymentType}
          onValueChange={(value) => setPaymentType(value as PaymentType)}
        />

        {paymentType === "paid" && (
          <Input
            prefix="매월"
            label="매월 얼마를 내고 있나요?"
            placeholder="총 금액을 입력하세요"
            suffix="원"
            onChange={(e) => {
              setTotalAmount(Number(e.target.value));
            }}
            value={totalAmount ? totalAmount.toString() : ""}
          />
        )}
        {paymentType === "trial" && (
          <Input
            label="무료체험은 얼마나 이용할 수 있나요?"
            placeholder="개월수를 입력해주세요"
            suffix="개월"
            type="number"
            onChange={(e) => {
              setTrialMonthCount(Number(e.target.value));
            }}
            value={trialMonthCount ? trialMonthCount.toString() : ""}
            onBlur={(e) => {
              if (e.target.value === "" || e.target.value === "0") return;
              const value = Math.min(12, Math.max(1, Number(e.target.value)));
              e.target.value = String(value);
            }}
          />
        )}
      </div>

      <BottomCTA>
        <Button
          variant="primary"
          size="lg"
          onClick={() =>
            onNext({
              subscription_mode: subscriptionMode,
              payment_type: paymentType,
              member_count: memberCount ?? 0,
              total_amount: totalAmount ?? 0,
              trial_months: trialMonthCount ?? 0,
            })
          }
          disabled={
            (subscriptionMode === "group" && !memberCount) ||
            (paymentType === "paid" && !totalAmount) ||
            (paymentType === "trial" && !trialMonthCount)
          }
        >
          다음
        </Button>
      </BottomCTA>
    </>
  );
}
