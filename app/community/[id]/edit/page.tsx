import CommunityForm from "../../_components/community-form";
import Header from "@/app/components/header";
import BrandTabs from "../../_components/brand-tabs";
import Button from "@/app/components/button";

export default function CommunityEditPage() {
  return (
    <>
      <Header variant="back" title="게시글 수정하기" />
      <BrandTabs />
      <main className="px-6">
        <CommunityForm />
      </main>
      <div className="btn-wrap px-5 py-6">
        <Button variant="primary" size="lg" disabled>
          수정 하기
        </Button>
      </div>
    </>
  );
}
