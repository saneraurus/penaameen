import { Container } from "@/presentation/components/foundation/container";
import { StatusMessage } from "@/presentation/components/foundation/status-message";
import { createFoundationMetadata } from "@/presentation/foundation-metadata";

export const metadata = createFoundationMetadata("Shop foundation");

export default function ShopFoundationPage() {
  return (
    <Container>
      <div className="foundation-stack">
        <section>
          <p>Shop route boundary</p>
          <h1>Shop</h1>
          <p>
            Product discovery is intentionally awaiting approved catalog, SKU,
            inventory, media, pricing, taxonomy, and migration data.
          </p>
        </section>
        <StatusMessage kind="unavailable" title="Catalog data deferred">
          <p>
            No products, prices, inventory values, categories, or commercial
            claims are rendered by the foundation.
          </p>
        </StatusMessage>
      </div>
    </Container>
  );
}
