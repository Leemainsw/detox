import Button from "@/app/components/button";
import BottomCTA from "@/app/components/bottom-cta";
import { DatePicker } from "@/app/components/date-picker";
import SegmentedControl from "@/app/components/segmented-control";
import { useState } from "react";
import SelectDay from "./_components/select-day";
import { BillingCycle } from "../../../types/type";
import SelectMonthDay, {
  type MonthDayValue,
} from "./_components/select-month-day";

interface Values {
  billing_cycle: BillingCycle;
  payment_day: string;
  end_date: string;
}
interface Props {
  onNext: (values: Values) => void;
}
export default function InputPaymentInfo({ onNext }: Props) {
  const [billingCycle, setBillingCycle] = useState<BillingCycle>("monthly");
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [selectedMonthDay, setSelectedMonthDay] =
    useState<MonthDayValue | null>(null);
  const [endDate, setEndDate] = useState<string | null>(
    new Date().toISOString()
  );

  const getPaymentDay = (): string | null => {
    if (billingCycle === "monthly") {
      return selectedDay ? selectedDay.toString() : null;
    }

    if (selectedMonthDay) {
      const m = selectedMonthDay.month.toString().padStart(2, "0");
      const d = selectedMonthDay.day.toString().padStart(2, "0");
      return `${m}-${d}`;
    }

    return null;
  };

  const handleNext = () => {
    const paymentDay = getPaymentDay();
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
          disabled={!getPaymentDay() || !endDate}
        >
          다음
        </Button>
      </BottomCTA>
    </>
  );
}
