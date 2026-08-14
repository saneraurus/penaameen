export type RateLimitDecision =
  | { readonly allowed: true }
  | {
      readonly allowed: false;
      readonly retryAfterSeconds?: number;
    };

export interface RateLimitPort {
  check(input: {
    readonly scope: string;
    readonly subject: string;
  }): Promise<RateLimitDecision>;
}
