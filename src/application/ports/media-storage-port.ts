import type { Result } from "@/domain/common/result";
import type { ResourceId } from "@/domain/common/identifiers";

export type MediaUploadMetadata = {
  readonly mediaId: ResourceId;
  readonly fileName: string;
  readonly mimeType: string;
  readonly contentLength: number;
};

export interface MediaStoragePort {
  store(
    metadata: MediaUploadMetadata,
  ): Promise<
    Result<{ readonly storageReference: string }, { readonly message: string }>
  >;
}
