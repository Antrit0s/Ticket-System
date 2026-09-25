// RTK Query errors bury the message in data.message — surface it.
export function getErrorMessage(error: unknown): string {
  if (error && typeof error === "object" && "data" in error) {
    const data = (error as { data?: unknown }).data;
    if (data && typeof data === "object" && "message" in data) {
      const message = (data as { message?: unknown }).message;
      if (typeof message === "string") return message;
    }
  }
  return "Something went wrong. Please try again.";
}
