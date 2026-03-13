import Button from "@/app/components/button";
import BottomCTA from "@/app/components/bottom-cta";
import { DatePicker } from "@/app/components/date-picker";
import SegmentedControl from "@/app/components/segmented-control";
import { useState } from "react";
import SelectDay from "./_components/select-day";
import SelectMonthDay from "./_components/select-month-day";
import { BillingCycle } from "../../../types/type";
import {
  parsePaymentDayToDay,
  parsePaymentDayToMonthDay,
  formatPaymentDay,
} from "../../../utils";

interface Values {
  billing_cycle: BillingCycle;
  payment_day: string;
  end_date: string;
}
interface Props {
  values?: Partial<Values>;
  onNext: (values: Values) => void;
}
export default function InputPaymentInfo({ values, onNext }: Props) {
  const [billingCycle, setBillingCycle] = useState<BillingCycle>(
    values?.billing_cycle ?? "monthly"
  );

  const [selectedDay, setSelectedDay] = useState<number | null>(() =>
    parsePaymentDayToDay(values?.payment_day)
  );

  const [selectedMonthDay, setSelectedMonthDay] = useState(() =>
    parsePaymentDayToMonthDay(values?.payment_day)
  );

  const [endDate, setEndDate] = useState<string | null>(
    values?.end_date ?? new Date().toISOString()
  );

  const paymentDay = formatPaymentDay(
    billingCycle,
    selectedDay,
    selectedMonthDay
  );

  const handleNext = () => {
    if (!paymentDay || !endDate) return;
    onNext({
      billing_cycle: billingCycle,
      payment_day: paymentDay,
      end_date: endDate,
    });
  };

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
          value={billingCycle}
          onValueChange={(value) => setBillingCycle(value as BillingCycle)}
        />

        {/* 월간: 일만 선택 */}
        {billingCycle === "monthly" && (
          <SelectDay value={selectedDay} onValueChange={setSelectedDay} />
        )}

        {/* 연간: 월-일 선택 */}
        {billingCycle === "yearly" && (
          <SelectMonthDay
            value={selectedMonthDay}
            onValueChange={setSelectedMonthDay}
          />
        )}

        {/* 공통 */}
        <DatePicker
          label="언제 구독이 끝나나요?"
          value={endDate ? new Date(endDate) : new Date()}
          onChange={(date) => setEndDate(date?.toISOString() ?? null)}
        />
      </div>

      <BottomCTA>
        <Button
          variant="primary"
          size="lg"
          onClick={handleNext}
          disabled={!paymentDay || !endDate}
        >
          다음
        </Button>
      </BottomCTA>
    </>
  );
}
