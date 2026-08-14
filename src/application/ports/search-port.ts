import type { Result } from "@/domain/common/result";

export type SearchScope = "products" | "education" | "all";

export type SearchQuery = {
  readonly text: string;
  readonly scope: SearchScope;
};

export type SearchResult = {
  readonly targetType:
    "product" | "category" | "article" | "education" | "branch" | "help";
  readonly targetReference: string;
  readonly title: string;
};

export interface SearchPort {
  search(
    query: SearchQuery,
  ): Promise<Result<readonly SearchResult[], { readonly message: string }>>;
}
