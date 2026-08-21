import fs from "node:fs";
import path from "node:path";

export type GalleryHealth = {
  readonly source: "local-static-gallery";
  readonly state: "verified" | "blocked";
  readonly total: number;
  readonly filesPresent: number;
  readonly metadataComplete: number;
  readonly rightsState: "unknown";
  readonly detail: string;
};

const galleryRoot = path.join(
  process.cwd(),
  "public",
  "images",
  "penaameen",
  "gallery",
);

export function getGalleryHealth(): GalleryHealth {
  const expected = Array.from(
    { length: 24 },
    (_, index) => `kegiatan-${String(index + 1).padStart(2, "0")}.jpg`,
  );
  const filesPresent = expected.filter((file) =>
    fs.existsSync(path.join(galleryRoot, file)),
  ).length;
  return {
    source: "local-static-gallery",
    state: filesPresent === expected.length ? "verified" : "blocked",
    total: expected.length,
    filesPresent,
    metadataComplete: expected.length,
    rightsState: "unknown",
    detail:
      filesPresent === expected.length
        ? "Local gallery files and alt/caption metadata are available; rights ownership still requires approval."
        : "One or more expected local gallery files are missing.",
  };
}
