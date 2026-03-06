import Button from "@/app/components/button";
import BottomCTA from "@/app/components/bottom-cta";
import { DatePicker } from "@/app/components/date-picker";
import SegmentedControl from "@/app/components/segmented-control";
import { useState } from "react";

interface Props {
  onNext: () => void;
}
export default function InputPaymentInfo({ onNext }: Props) {
  const [paymentInterval, setPaymentInterval] = useState("monthly");

  return (
    <>
      <div className="flex flex-col gap-5 px-6 relative">
        <h1 className="header-md leading-tight">
          결제일 및 종료일을
          <br />
          입력 해주세요
        </h1>
      </div>

      <div className="flex flex-col gap-5 px-6">
        <SegmentedControl
          options={[
            { label: "월간결제", value: "monthly" },
            { label: "연간결제", value: "yearly" },
          ]}
          value={paymentInterval}
          onValueChange={setPaymentInterval}
        />

        <DatePicker label="몇일마다 결제하나요?" />
        <DatePicker label="언제 구독이 끝나나요?" />
      </div>

      <BottomCTA>
        <Button variant="primary" size="lg" onClick={onNext}>
          다음
        </Button>
      </BottomCTA>
    </>
  );
}
