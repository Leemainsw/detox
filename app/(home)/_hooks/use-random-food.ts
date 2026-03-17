"use client";

import { useEffect, useState } from "react";
import { getRandomFood, type FoodResult } from "@/app/utils/subscriptions/random-food";

interface Params {
  enabled: boolean;
  totalPrice: number;
}

interface RandomFoodState {
  key: string;
  food: FoodResult | null;
}

interface RandomFoodResult {
  food: FoodResult | null;
  isLoading: boolean;
}

export function useRandomFood({
  enabled,
  totalPrice,
}: Params): RandomFoodResult {
  const requestKey = `${enabled}-${totalPrice}`;
  const [state, setState] = useState<RandomFoodState>({
    key: "",
    food: null,
  });

  useEffect(() => {
    const frameId = window.requestAnimationFrame(() => {
      if (!enabled) {
        return;
      }

      setState({
        key: requestKey,
        food: getRandomFood(totalPrice),
      });
    });

    return () => {
      window.cancelAnimationFrame(frameId);
    };
  }, [enabled, requestKey, totalPrice]);

  if (!enabled) {
    return {
      food: null,
      isLoading: false,
    };
  }

  return {
    food: state.key === requestKey ? state.food : null,
    isLoading: state.key !== requestKey || state.food === null,
  };
}
