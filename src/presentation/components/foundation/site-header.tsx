import Link from "next/link";

import { Container } from "@/presentation/components/foundation/container";

export function SiteHeader() {
  return (
    <header>
      <Container>
        <nav aria-label="Primary navigation">
          <ul className="foundation-nav-list">
            <li>
              <Link href="/">Pena Ameen</Link>
            </li>
            <li>
              <Link href="/shop">Shop</Link>
            </li>
            <li>
              <Link href="/education">Education</Link>
            </li>
            <li>
              <Link href="/search">Search</Link>
            </li>
          </ul>
        </nav>
      </Container>
    </header>
  );
}
