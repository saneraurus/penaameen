import { Container } from "@/presentation/components/foundation/container";

export default function Loading() {
  return (
    <Container>
      <div aria-live="polite" className="foundation-stack" role="status">
        <p>Loading foundation content…</p>
      </div>
    </Container>
  );
}
