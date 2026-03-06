"use client";
import { useState } from "react";
import ProgressBar from "./_components/progress-bar/progress-bar";
import SelectPaymentType from "./_components/_steps/select-payment-type";
import InputPaymentInfo from "./_components/_steps/input-payment-info";
import SelectBrand from "./_components/_steps/select-brand";

const steps = ["select-brand", "select-payment-type", "input-payment-info"];

export default function SubscriptionForm() {
  const [currentStep, setCurrentStep] = useState(1);

  return (
    <>
      <ProgressBar steps={steps} currentStep={currentStep} />

      {currentStep === 1 && <SelectBrand onNext={() => setCurrentStep(2)} />}

      {currentStep === 2 && (
        <InputPaymentInfo onNext={() => setCurrentStep(3)} />
      )}
      {currentStep === 3 && (
        <SelectPaymentType onNext={() => setCurrentStep(4)} />
      )}
    </>
  );
}
