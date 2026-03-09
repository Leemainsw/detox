import BottomCTA from "@/app/components/bottom-cta";
import Button from "@/app/components/button";
import Input from "@/app/components/input";
import SegmentedControl from "@/app/components/segmented-control";
import { useState } from "react";

interface Props {
  onNext: () => void;
}
export default function SelectPaymentType({ onNext }: Props) {
  const [paymentType, setPaymentType] = useState("solo");
  const [paymentMethod, setPaymentMethod] = useState("paid");
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
            { label: "여럿이서", value: "shared" },
          ]}
          value={paymentType}
          onValueChange={setPaymentType}
        />
        {paymentType === "shared" && (
          <Input
            label="총 몇명이서 구독하시나요?"
            placeholder="사람 수를 입력해주세요"
            suffix="명"
            type="number"
          />
        )}

        <SegmentedControl
          options={[
            { label: "유료결제", value: "paid" },
            { label: "무료결제", value: "free" },
          ]}
          value={paymentMethod}
          onValueChange={setPaymentMethod}
        />
        {paymentMethod === "paid" && (
          <Input
            prefix="매월"
            label="매월 얼마를 내고 있나요?"
            placeholder="총 금액을 입력하세요"
            suffix="원"
          />
        )}
        {paymentMethod === "free" && (
          <Input
            label="무료체험은 얼마나 이용할 수 있나요?"
            placeholder="개월수를 입력해주세요"
            suffix="개월"
            type="number"
            onChange={(e) => {
              const value = Number(e.target.value);
              if (value > 12) {
                e.target.value = "12";
              }
              if (value < 1) {
                e.target.value = "1";
              }
            }}
          />
        )}
      </div>

      <BottomCTA>
        <Button variant="primary" size="lg" onClick={onNext}>
          다음
        </Button>
      </BottomCTA>
    </>
  );
}
