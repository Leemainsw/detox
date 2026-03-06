"use client";
import CommunityList from "./_components/community-list";
import BrandTabs from "./_components/brand-tabs";
import Header from "../components/header";
import BottomNav from "../components/bottom-nav";
import { mockCommunityItems } from "./_data/mock-community";

export default function CommunityListPage() {
  return (
    <div className="bg-gray-100 pb-15">
      <Header variant="text" leftText="커뮤니티" rightContent="알람" />
      <main className="">
        <BrandTabs />
        <section className="px-6">
          <CommunityList items={mockCommunityItems} />
        </section>
      </main>
      <BottomNav />
    </div>
  );
}
