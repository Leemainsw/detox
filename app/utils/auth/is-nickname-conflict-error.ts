type NicknameConflictErrorLike = {
  code?: string | null;
  message?: string | null;
  details?: string | null;
  hint?: string | null;
};

const getSafeString = (value: unknown) =>
  typeof value === "string" ? value : "";

export function isNicknameConflictError(error: unknown) {
  if (typeof error !== "object" || error === null) {
    return false;
  }

  const typedError = error as NicknameConflictErrorLike;

  const errorMessage = [
    getSafeString(typedError.message),
    getSafeString(typedError.details),
    getSafeString(typedError.hint),
  ]
    .join(" ")
    .toLowerCase();

  const isUniqueViolation =
    typedError.code === "23505" || errorMessage.includes("duplicate key");

  return isUniqueViolation && errorMessage.includes("nickname");
}
