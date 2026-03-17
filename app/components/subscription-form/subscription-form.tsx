"use client";

import { StepType } from "@/app/hooks/useFunnel";
import { SubscriptionFormData } from "./types/type";
import InputPaymentInfo from "./_components/_steps/input-payment-info";
import SelectBrand from "./_components/_steps/select-brand";
import SelectPaymentType from "./_components/_steps/select-payment-type";
import ProgressBar from "./_components/progress-bar/progress-bar";
import { Tables } from "@/types/supabase.types";

const SUBSCRIPTION_FUNNEL_BASE = "subscription-form";

/** Per-route funnel key to avoid state collision between add/edit flows */
export function getSubscriptionFunnelKey(routeId: string): string {
  return `${SUBSCRIPTION_FUNNEL_BASE}-${routeId}`;
}
export const SUBSCRIPTION_STEPS = [
  "select-brand",
  "input-payment-info",
  "select-payment-type",
] as const;

export const initialSubscriptionFormData: Partial<SubscriptionFormData> = {};

interface Props {
  currentStep: StepType<typeof SUBSCRIPTION_STEPS>;
  currentStepIndex: number;
  state: Partial<SubscriptionFormData>;
  next: () => void;
  setState: (
    partial:
      | Partial<SubscriptionFormData>
      | ((prev: Partial<SubscriptionFormData>) => Partial<SubscriptionFormData>)
  ) => void;
  onSubmit: (data: Partial<SubscriptionFormData>) => void;
  loading?: boolean;
}

export default function SubscriptionForm({
  currentStep,
  currentStepIndex,
  state,
  next,
  setState,
  onSubmit,
  loading,
}: Props) {
  return (
    <>
      <ProgressBar
        steps={[...SUBSCRIPTION_STEPS]}
        currentStep={currentStepIndex + 1}
      />

      {currentStep === "select-brand" && (
        <SelectBrand
          values={state}
          onNext={(values) => {
            setState((prev) => ({ ...prev, ...values }));
            next();
          }}
        />
      )}
      {currentStep === "input-payment-info" && (
        <InputPaymentInfo
          values={state}
          onNext={(values) => {
            setState((prev) => ({ ...prev, ...values }));
            next();
          }}
        />
      )}
      {currentStep === "select-payment-type" && (
        <SelectPaymentType
          values={state as Partial<Tables<"subscription">>}
          onNext={(values) => {
            const merged = { ...state, ...values };
            setState(merged);
            onSubmit(merged);
          }}
          loading={loading}
        />
      )}
    </>
  );
}
