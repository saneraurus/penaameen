import type {
  IdempotencyClaim,
  IdempotencyStore,
} from "@/application/idempotency/idempotent-command";

export class InMemoryIdempotencyStore implements IdempotencyStore {
  private readonly claimedKeys = new Set<string>();
  private readonly succeededKeys = new Set<string>();
  private readonly failedKeys = new Set<string>();

  async claim(key: string): Promise<IdempotencyClaim> {
    if (this.claimedKeys.has(key)) {
      return { claimed: false };
    }

    this.claimedKeys.add(key);
    return { claimed: true };
  }

  async markSucceeded(key: string): Promise<void> {
    this.succeededKeys.add(key);
  }

  async markFailed(key: string): Promise<void> {
    this.failedKeys.add(key);
  }

  wasMarkedSucceeded(key: string): boolean {
    return this.succeededKeys.has(key);
  }

  wasMarkedFailed(key: string): boolean {
    return this.failedKeys.has(key);
  }
}
