import Header from "@/app/components/header";
import SubscriptionForm from "@/app/components/subscription-form";

export default function Page() {
  return (
    <main className="max-w-md mx-auto flex flex-col gap-5 relative">
      <Header
        variant="back"
        title="구독 수정"
        rightContent={
          <button className="flex items-center gap-2 cursor-pointer">
            <span className="body-lg font-normal text-gray-300">취소</span>
          </button>
        }
      />
      <SubscriptionForm />
    </main>
  );
}
