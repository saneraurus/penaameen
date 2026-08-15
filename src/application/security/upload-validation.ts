export type UploadMetadata = {
  readonly fileName: string;
  readonly mimeType: string;
  readonly contentLength: number;
};

export type UploadPolicy = {
  readonly allowedMimeTypes: ReadonlySet<string>;
  readonly maximumContentLength?: number;
};

export type UploadValidationResult =
  { readonly valid: true } | { readonly valid: false; readonly reason: string };

export function validateUploadMetadata(
  metadata: UploadMetadata,
  policy: UploadPolicy,
): UploadValidationResult {
  if (!policy.allowedMimeTypes.has(metadata.mimeType)) {
    return {
      valid: false,
      reason: "Unsupported media type for the active upload policy.",
    };
  }

  if (metadata.contentLength <= 0) {
    return { valid: false, reason: "Upload content must not be empty." };
  }

  if (
    policy.maximumContentLength !== undefined &&
    metadata.contentLength > policy.maximumContentLength
  ) {
    return { valid: false, reason: "Upload exceeds the active upload policy." };
  }

  if (metadata.fileName.trim().length === 0) {
    return { valid: false, reason: "Upload file name must not be empty." };
  }

  return { valid: true };
}
