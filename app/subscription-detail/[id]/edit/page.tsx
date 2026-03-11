import { Suspense } from "react";
import EditPageContent from "./_components/edit-page-content";
import LoadingScreen from "@/app/components/loading-screen";

export default function Page() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <EditPageContent />
    </Suspense>
  );
}
