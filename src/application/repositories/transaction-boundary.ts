export interface TransactionBoundary {
  withinTransaction<T>(operation: () => Promise<T>): Promise<T>;
}
