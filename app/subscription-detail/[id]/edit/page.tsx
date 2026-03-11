import { Suspense } from "react";
import EditPageContent from "./_components/edit-page-content";

export default function Page() {
  return (
    <Suspense fallback={<></>}>
      <EditPageContent />
    </Suspense>
  );
}
