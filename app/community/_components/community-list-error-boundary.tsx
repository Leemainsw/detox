"use client";

import { Component, type ErrorInfo, type ReactNode } from "react";
import Button from "@/app/components/button";
import FeedbackState from "@/app/components/feedback-state";

interface CommunityListErrorBoundaryProps {
  children: ReactNode;
  onReset: () => void;
  resetKey: string;
}

interface CommunityListErrorBoundaryState {
  hasError: boolean;
}

class CommunityListErrorBoundaryInner extends Component<
  CommunityListErrorBoundaryProps,
  CommunityListErrorBoundaryState
> {
  state: CommunityListErrorBoundaryState = {
    hasError: false,
  };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error(error, errorInfo);
  }

  componentDidUpdate(
    prevProps: Readonly<CommunityListErrorBoundaryProps>
  ) {
    if (
      this.state.hasError &&
      prevProps.resetKey !== this.props.resetKey
    ) {
      this.setState({ hasError: false });
    }
  }

  handleReset = () => {
    this.setState({ hasError: false });
    this.props.onReset();
  };

  render() {
    if (this.state.hasError) {
      return (
        <FeedbackState
          description="게시글을 불러오지 못했어요."
          className="px-6 py-12"
          bottomCTA
          ctaClassName="bg-gray-100"
          hasBottomNav
          imageSrc="/images/emoji/error.png"
          contentClassName="gap-0"
          descriptionClassName="body-md font-normal text-gray-400"
        >
          <Button
            variant="secondary"
            size="md"
            className="w-full"
            onClick={this.handleReset}
          >
            다시 시도
          </Button>
        </FeedbackState>
      );
    }

    return this.props.children;
  }
}

export default function CommunityListErrorBoundary(
  props: CommunityListErrorBoundaryProps
) {
  return <CommunityListErrorBoundaryInner {...props} />;
}
