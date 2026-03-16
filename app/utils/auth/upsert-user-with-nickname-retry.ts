import { isNicknameConflictError } from "./is-nickname-conflict-error";

type NicknameUpsertError = {
  code?: string | null;
  message?: string | null;
  details?: string | null;
  hint?: string | null;
};

export async function upsertUserWithNicknameRetry<
  TError extends NicknameUpsertError,
>({
  makeNickname,
  tryUpsert,
  maxRetryCount = 5,
  canRetry = () => true,
}: {
  makeNickname: (retryCount: number) => string;
  tryUpsert: (nickname: string) => Promise<{ error: TError | null }>;
  maxRetryCount?: number;
  canRetry?: (params: {
    error: TError;
    nickname: string;
    retryCount: number;
  }) => boolean;
}) {
  let lastError: TError | null = null;

  for (let retryCount = 0; retryCount < maxRetryCount; retryCount++) {
    const nickname = makeNickname(retryCount);
    const { error } = await tryUpsert(nickname);

    if (!error) {
      return;
    }

    lastError = error;

    if (
      !isNicknameConflictError(error) ||
      !canRetry({ error, nickname, retryCount })
    ) {
      throw error;
    }
  }

  throw lastError ?? new Error("사용자 정보 저장에 실패했어요.");
}
