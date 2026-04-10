"use client";

import { upsertUserWithNicknameRetry } from "@/app/utils/auth/upsert-user-with-nickname-retry";
import {
  useMutation,
  useQuery,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { generateNickname } from "@/app/utils/nickname";
import {
  getCurrentUser,
  getUserProfile,
  revertSoftDeleteUserAccount,
  signInAnonymously,
  signOut,
  signOutWithRetry,
  softDeleteUserAccount,
  updateUserProfile,
  upsertUser,
} from "@/services/users";
import { communityKeys } from "@/query/community-options";

export const usersKeys = {
  all: ["users"],
  auth: () => [...usersKeys.all, "auth"],
  profile: () => [...usersKeys.all, "profile"],
  profileById: (userId: string) => [...usersKeys.profile(), userId],
} as const;

export function useAnonymousLoginMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: [...usersKeys.auth(), "anonymous-login"],
    mutationFn: async () => {
      const { data, error } = await signInAnonymously();

      if (error || !data.user) {
        throw error ?? new Error("로그인에 실패했어요.");
      }

      const user = data.user;
      const userPayload = {
        id: user.id,
        provider: "anonymous",
        provider_id: user.id,
        email: user.email,
        profile_image: null,
        is_anonymous: true,
      };

      try {
        await upsertUserWithNicknameRetry({
          makeNickname: () => generateNickname(),
          tryUpsert: (nickname) =>
            upsertUser({
              ...userPayload,
              nickname,
            }),
        });

        return user;
      } catch (upsertError) {
        const { error: signOutError } = await signOut();

        if (signOutError) {
          console.error(signOutError);
        }

        throw upsertError;
      }
    },
    onSuccess: (user) => {
      queryClient.setQueryData([...usersKeys.auth(), "current-user"], user);
    },
  });
}

export function useLogoutMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: [...usersKeys.auth(), "logout"],
    mutationFn: async () => {
      const { error } = await signOut();

      if (error) {
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.clear();
    },
  });
}

/**
 * 회원 탈퇴(소프트 삭제) 후 세션 종료.
 * signOut을 먼저 할 수 없음 — 세션 없이는 RLS 하에 users.update(탈퇴)가 실패할 수 있음.
 * softDelete 성공 후 signOut만 실패하면 재시도하고, 그래도 실패하면 탈퇴를 롤백한다.
 */
export function useWithdrawAccountMutation(userId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: [...usersKeys.profile(), "withdraw", userId],
    mutationFn: async () => {
      const { error: deleteError } = await softDeleteUserAccount(userId);
      if (deleteError) {
        throw deleteError;
      }

      const { error: signOutError } = await signOutWithRetry();
      if (signOutError) {
        const { error: revertError } =
          await revertSoftDeleteUserAccount(userId);
        if (revertError) {
          throw new Error(
            "탈퇴 처리 후 로그아웃에 실패했고, 탈퇴 취소(복구)도 실패했어요. 고객지원으로 문의해 주세요."
          );
        }
        throw new Error(
          "로그아웃에 실패해 탈퇴 처리를 되돌렸어요. 잠시 후 다시 시도해 주세요."
        );
      }
    },
    onSuccess: () => {
      queryClient.clear();
    },
  });
}

export function useCurrentUserQuery() {
  return useQuery({
    queryKey: [...usersKeys.auth(), "current-user"],
    queryFn: async () => {
      const { data, error } = await getCurrentUser();

      if (error) {
        throw error;
      }

      return data.user;
    },
  });
}

export function useUserProfileQuery(userId?: string) {
  return useQuery({
    queryKey: usersKeys.profileById(userId ?? ""),
    queryFn: async () => {
      if (!userId) {
        return null;
      }

      const { data, error } = await getUserProfile(userId);

      if (error) {
        throw error;
      }

      return data;
    },
    enabled: Boolean(userId),
  });
}

/**
 * 유저 프로필을 조회합니다. (Suspense용)
 */
export function useUserProfileSuspenseQuery(userId: string) {
  return useSuspenseQuery({
    queryKey: usersKeys.profileById(userId),
    queryFn: async () => {
      const { data, error } = await getUserProfile(userId);

      if (error) {
        throw error;
      }

      return data;
    },
  });
}

interface UpdateUserProfileParams {
  nickname?: string;
  profile_image?: string;
}

/**
 * 유저 프로필(닉네임, 프로필 이미지)을 수정합니다.
 */
export function useUpdateUserProfileMutation(userId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: [...usersKeys.profile(), "update", userId],
    mutationFn: async (params: UpdateUserProfileParams) => {
      const { data, error } = await updateUserProfile(userId, params);

      if (error) {
        throw error;
      }

      return data;
    },
    onSuccess: (data) => {
      if (data) {
        queryClient.setQueryData(usersKeys.profileById(userId), data);
      }

      void queryClient.invalidateQueries({
        queryKey: communityKeys.all,
        refetchType: "all",
      });
    },
  });
}
