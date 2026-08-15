const safeIdentifierPattern = /^[A-Za-z0-9._-]{1,128}$/;

export type CorrelationId = string & {
  readonly __brand: "CorrelationId";
};

export type ActorId = string & {
  readonly __brand: "ActorId";
};

export type ResourceId = string & {
  readonly __brand: "ResourceId";
};

function requireSafeIdentifier(value: string, label: string): string {
  if (!safeIdentifierPattern.test(value)) {
    throw new Error(`${label} must contain only safe identifier characters.`);
  }

  return value;
}

export function createCorrelationId(value: string): CorrelationId {
  return requireSafeIdentifier(value, "Correlation ID") as CorrelationId;
}

export function createActorId(value: string): ActorId {
  return requireSafeIdentifier(value, "Actor ID") as ActorId;
}

export function createResourceId(value: string): ResourceId {
  return requireSafeIdentifier(value, "Resource ID") as ResourceId;
}
