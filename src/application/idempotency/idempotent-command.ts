import { fail, succeed, type Result } from "@/domain/common/result";

export type IdempotencyError = {
  readonly code: "IDEMPOTENCY_CONFLICT";
  readonly message: string;
};

export type IdempotencyClaim =
  { readonly claimed: true } | { readonly claimed: false };

export interface IdempotencyStore {
  claim(key: string): Promise<IdempotencyClaim>;
  markSucceeded(key: string): Promise<void>;
  markFailed(key: string): Promise<void>;
}

export async function runIdempotentCommand<T>(
  key: string,
  store: IdempotencyStore,
  operation: () => Promise<T>,
): Promise<Result<T, IdempotencyError>> {
  const claim = await store.claim(key);

  if (!claim.claimed) {
    return fail({
      code: "IDEMPOTENCY_CONFLICT",
      message: "This command has already been claimed.",
    });
  }

  try {
    const value = await operation();
    await store.markSucceeded(key);
    return succeed(value);
  } catch (error: unknown) {
    await store.markFailed(key);
    throw error;
  }
}
