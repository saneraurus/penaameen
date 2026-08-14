import type { ResourceId } from "@/domain/common/identifiers";

export type PublicProductSummary = {
  readonly productId: ResourceId;
  readonly slug: string;
  readonly name: string;
  readonly isPublished: boolean;
};

export interface CatalogRepository {
  findPublicProductBySlug(slug: string): Promise<PublicProductSummary | null>;
}

export interface AuditRepository {
  append(event: {
    readonly action: string;
    readonly targetId: ResourceId;
    readonly correlationId: string;
  }): Promise<void>;
}

export interface IdempotencyRepository {
  has(key: string): Promise<boolean>;
  record(key: string): Promise<void>;
}
