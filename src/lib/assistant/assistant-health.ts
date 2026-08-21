const PLACEHOLDER_KEY = /^(?:\.\.\.|.*REDACTED.*|.*placeholder.*|.*your_.*)$/i;

export function isUsableAssistantKey(
  value: string | undefined,
): value is string {
  const trimmed = value?.trim() ?? "";
  return Boolean(trimmed) && !PLACEHOLDER_KEY.test(trimmed);
}

export function getAssistantHealth() {
  const providers = [
    {
      name: "nvidia",
      configured: isUsableAssistantKey(process.env.NVIDIA_API_KEY),
      model: process.env.NVIDIA_MODEL ?? null,
    },
    {
      name: "nvidia-backup",
      configured: isUsableAssistantKey(process.env.NVIDIA_API_KEY_FALLBACK),
      model: process.env.NVIDIA_MODEL ?? null,
    },
    {
      name: "groq",
      configured: isUsableAssistantKey(process.env.GROQ_API_KEY),
      model: process.env.GROQ_MODEL ?? null,
    },
  ];
  return {
    state: providers.some((provider) => provider.configured)
      ? ("configured" as const)
      : ("blocked" as const),
    providers,
    detail: providers.some((provider) => provider.configured)
      ? "Provider credentials present; live completion health still requires a controlled probe."
      : "No usable AI provider credential is configured.",
  };
}
