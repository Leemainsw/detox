import type { Tables } from "@/types/supabase.types";

export default function getNotificationTitle(
  type: Tables<"notification">["type"],
  title: string
): React.ReactNode {
  switch (type) {
    case "payment_due":
      return (
        <span className="body-md font-bold text-state-danger">{title}</span>
      );
    case "trial_ending":
      return (
        <span className="body-md font-bold text-brand-primary">{title}</span>
      );
    case "community_comment":
      return <span className="body-md font-bold text-gray-400">{title}</span>;
    case "community_like":
      return <span className="body-md font-bold text-gray-400">{title}</span>;
  }
}
