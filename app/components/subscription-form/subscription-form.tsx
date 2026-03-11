"use client";

import { StepType } from "@/app/hooks/useFunnel";
import { SubscriptionFormData } from "./types/type";
import InputPaymentInfo from "./_components/_steps/input-payment-info";
import SelectBrand from "./_components/_steps/select-brand";
import SelectPaymentType from "./_components/_steps/select-payment-type";
import ProgressBar from "./_components/progress-bar/progress-bar";

export const SUBSCRIPTION_FUNNEL_KEY = "subscription-form";
export const SUBSCRIPTION_STEPS = [
  "select-brand",
  "input-payment-info",
  "select-payment-type",
] as const;

export const initialSubscriptionFormData: Partial<SubscriptionFormData> = {};

interface Props {
  currentStep: StepType<typeof SUBSCRIPTION_STEPS>;
  currentStepIndex: number;
  canGoPrev: boolean;
  state: Partial<SubscriptionFormData>;
  next: () => void;
  back: () => void;
  setState: (
    partial:
      | Partial<SubscriptionFormData>
      | ((prev: Partial<SubscriptionFormData>) => Partial<SubscriptionFormData>)
  ) => void;
  onSubmit: (data: Partial<SubscriptionFormData>) => void;
}

export default function SubscriptionForm({
  currentStep,
  currentStepIndex,
  canGoPrev,
  state,
  next,
  back,
  setState,
  onSubmit,
}: Props) {
  return (
    <>
      <ProgressBar
        steps={[...SUBSCRIPTION_STEPS]}
        currentStep={currentStepIndex + 1}
      />

      {currentStep === "select-brand" && (
        <SelectBrand
          onNext={(values) => {
            setState((prev) => ({ ...prev, ...values }));
            next();
          }}
        />
      )}
      {currentStep === "input-payment-info" && (
        <InputPaymentInfo
          onNext={(values) => {
            setState((prev) => ({ ...prev, ...values }));
            next();
          }}
        />
      )}
      {currentStep === "select-payment-type" && (
        <SelectPaymentType
          onNext={(values) => {
            const merged = { ...state, ...values };
            setState(merged);
            onSubmit(merged);
          }}
        />
      )}
    </>
  );
}
