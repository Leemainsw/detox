"use client";

import Link from "next/link";
import Button from "@/app/components/button";
import FeedbackState from "@/app/components/feedback-state";
import { cn } from "@/app/utils/class";

type FeedbackPageBaseProps = {
  title: string;
  description: string;
  buttonLabel: string;
  buttonLoading?: boolean;
  buttonSize?: "md" | "lg";
  imageSrc?: string;
  imageAlt?: string;
};

type FeedbackPageProps =
  | (FeedbackPageBaseProps & {
      buttonHref: string;
      onButtonClick?: never;
    })
  | (FeedbackPageBaseProps & {
      onButtonClick: () => void;
      buttonHref?: never;
    });

export default function FeedbackPage({
  title,
  description,
  buttonLabel,
  buttonLoading = false,
  buttonSize = "md",
  imageSrc = "/images/emoji/error.png",
  imageAlt = "",
  ...buttonProps
}: FeedbackPageProps) {
  const buttonHref =
    "buttonHref" in buttonProps ? buttonProps.buttonHref : undefined;

  return (
    <main className="mx-auto flex min-h-screen flex-col items-center justify-center px-6">
      <FeedbackState
        title={title}
        description={description}
        imageSrc={imageSrc}
        imageAlt={imageAlt}
        bottomCTA
      >
        {buttonHref ? (
          <Link
            href={buttonHref}
            className={cn("btn btn-primary w-full", `btn-${buttonSize}`)}
          >
            {buttonLabel}
          </Link>
        ) : (
          <Button
            variant="primary"
            size={buttonSize}
            className="w-full"
            loading={buttonLoading}
            onClick={buttonProps.onButtonClick}
          >
            {buttonLabel}
          </Button>
        )}
      </FeedbackState>
    </main>
  );
}
