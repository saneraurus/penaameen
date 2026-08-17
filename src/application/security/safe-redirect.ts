export function isSafeRelativeRedirect(target: string): boolean {
  if (!target.startsWith("/")) {
    return false;
  }

  try {
    const decodedTarget = decodeURIComponent(target);

    if (
      decodedTarget.startsWith("//") ||
      decodedTarget.includes("\\") ||
      decodedTarget.includes("\u0000")
    ) {
      return false;
    }

    const resolvedTarget = new URL(target, "https://foundation.invalid");

    return resolvedTarget.origin === "https://foundation.invalid";
  } catch {
    return false;
  }
}
