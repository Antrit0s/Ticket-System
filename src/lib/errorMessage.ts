type ApiError = { data?: { message?: string } };

export function getErrorMessage(error: unknown): string {
  const err = error as ApiError;
  return err?.data?.message ?? "Something went wrong. Please try again.";
}
