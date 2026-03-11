import Header from "@/app/components/header";
import SubscriptionForm from "@/app/components/subscription-form";
import TextButton from "@/app/components/text-button";

export default function Page() {
  return (
    <main className="mx-auto flex flex-col gap-5 relative">
      <Header
        variant="back"
        title="구독 수정"
        rightContent={<TextButton>취소</TextButton>}
      />
      <SubscriptionForm />
    </main>
  );
}
