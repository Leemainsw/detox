"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export function useCurrentAuthUser() {
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadCurrentUser = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (!isMounted) {
        return;
      }

      if (error) {
        console.error(error);
        setIsError(true);
        setIsPending(false);
        return;
      }

      setCurrentUserId(user?.id ?? null);
      setIsPending(false);
    };

    void loadCurrentUser();

    return () => {
      isMounted = false;
    };
  }, []);

  return {
    currentUserId,
    isPending,
    isError,
  };
}
