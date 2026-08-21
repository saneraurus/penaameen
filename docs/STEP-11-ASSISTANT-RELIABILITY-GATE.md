# Step 11 Assistant Reliability Gate

**Status:** Local reliability foundation complete; controlled provider completion probes remain staging-gated.

## Implemented

- Provider health contract with safe names/models only.
- Placeholder and redacted AI credentials are rejected.
- Assistant provider fallback ignores unusable keys.
- Provider error bodies are not returned or logged as raw response payloads.
- Timeout/network failure categories are normalized.
- No-provider and all-provider-failed responses use explicit `503` codes.
- Live website knowledge remains sourced from active content readers.
- Existing reply link guard remains active.

## Required staging acceptance

- Controlled Groq completion probe.
- Controlled NVIDIA completion probe.
- Timeout and provider fallback probe.
- Rate-limit response probe.
- Prompt/output secret redaction review.
- AI quota/cost/retention policy.
- Human escalation/support path.
