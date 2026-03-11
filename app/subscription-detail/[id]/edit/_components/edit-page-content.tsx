"use client";

import { useRouter } from "next/navigation";
import Header from "@/app/components/header";
import SubscriptionForm, {
  initialSubscriptionFormData,
  SUBSCRIPTION_FUNNEL_KEY,
  SUBSCRIPTION_STEPS,
} from "@/app/components/subscription-form";
import { useFunnel } from "@/app/hooks/useFunnel";
import type { SubscriptionFormData } from "@/app/components/subscription-form/types/type";
import TextButton from "@/app/components/text-button";

export default function EditPageContent() {
  const router = useRouter();
  const {
    currentStep,
    currentStepIndex,
    canGoPrev,
    next,
    back,
    setState,
    state,
  } = useFunnel<Partial<SubscriptionFormData>, typeof SUBSCRIPTION_STEPS>({
    key: SUBSCRIPTION_FUNNEL_KEY,
    steps: SUBSCRIPTION_STEPS,
    initialState: initialSubscriptionFormData,
    syncWithQuery: true,
    queryKey: "subscription-step",
    destroyOnUnmount: false,
  });

  const handleSubmit = (data: Partial<SubscriptionFormData>) => {
    console.log("Form submitted:", data);
  };

  return (
    <main className="mx-auto flex flex-col gap-5 relative">
      <Header
        variant="back"
        title="구독 수정"
        onBack={() => back(router.back)}
        rightContent={<TextButton>취소</TextButton>}
      />
      <SubscriptionForm
        currentStep={currentStep}
        currentStepIndex={currentStepIndex}
        canGoPrev={canGoPrev}
        state={state}
        next={next}
        back={back}
        setState={setState}
        onSubmit={handleSubmit}
      />
    </main>
  );
}
