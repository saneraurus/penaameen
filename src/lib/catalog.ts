import { products as staticProducts } from "@/data/products";

// The static catalog (`src/data/products.ts`) keeps the WordPress-era ids
// ("1".."19"), while the database assigns cuid ids. The slug is the shared
// natural key. Clients may send either a real DB id, a slug, or a static
// catalog id; these helpers normalize any of those forms to candidate keys
// that can be matched against the Product table.
const slugByCatalogId = new Map(staticProducts.map((p) => [p.id, p.slug]));

export function productKeyCandidates(key: string): string[] {
  const candidates = [key];
  const slug = slugByCatalogId.get(key);
  if (slug) candidates.push(slug);
  return candidates;
}
