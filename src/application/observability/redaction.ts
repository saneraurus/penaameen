const sensitiveKeyPattern =
  /password|secret|token|authorization|cookie|api[-_]?key|credential|card|cvv|address|email|phone/i;

export type SafeLogContext = Readonly<Record<string, unknown>>;

function isRecord(value: unknown): value is Readonly<Record<string, unknown>> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function redactValue(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(redactValue);
  }

  if (isRecord(value)) {
    return redactLogContext(value);
  }

  return value;
}

export function redactLogContext(context: SafeLogContext): SafeLogContext {
  return Object.fromEntries(
    Object.entries(context).map(([key, value]) => {
      if (sensitiveKeyPattern.test(key)) {
        return [key, "[REDACTED]"];
      }

      return [key, redactValue(value)];
    }),
  );
}
