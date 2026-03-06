import { create } from "zustand";
import type { SubscriptableBrandType } from "@/app/utils/brand/type";

export interface SubscriptionItem {
  id: number;
  href: string;
  brandType: SubscriptableBrandType;
  name: string;
  price?: number;
  billingCycle: "월간결제" | "연간결제";
  badgeLabel: string;
  badgeVariant: "primary" | "danger";
  group?: boolean;
  groupCount?: number;
}

interface SubscriptionStoreState {
  hasSubscription: boolean;
  setHasSubscription: (value: boolean) => void;
  list: SubscriptionItem[];
  setList: (items: SubscriptionItem[]) => void;
  clear: () => void;
}

export const useSubscriptionStore = create<SubscriptionStoreState>((set) => ({
  hasSubscription: true,
  list: [],
  setHasSubscription: (value) => set({ hasSubscription: value }),
  setList: (items) => set({ list: items }),
  clear: () => set({ hasSubscription: false, list: [] }),
}));
