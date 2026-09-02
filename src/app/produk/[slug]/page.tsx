import ProductDetailClient from "./ProductDetail";

export const dynamic = "force-dynamic";

export default async function ProdukDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <ProductDetailClient slug={slug} />;
}
