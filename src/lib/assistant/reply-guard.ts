// Post-generation guard for assistant replies: link allowlisting.
// Extended by P1-3 (fabricated order numbers, forbidden topics, length caps).

const ALLOWED_LINK_PREFIXES = [
  "https://penaameen.com",
  "http://penaameen.com",
  "https://www.penaameen.com",
  "http://www.penaameen.com",
  "https://wa.me/",
  "http://wa.me/",
  "mailto:",
  "tel:",
];

const URL_PATTERN = /(?:https?:\/\/|www\.)[^\s<>"')]+/gi;

export function sanitizeReplyLinks(reply: string): string {
  return reply.replace(URL_PATTERN, (url) => {
    const normalized = url.startsWith("www.")
      ? `https://${url}`
      : url.toLowerCase();
    const isAllowed = ALLOWED_LINK_PREFIXES.some((prefix) =>
      normalized.toLowerCase().startsWith(prefix.toLowerCase()),
    );
    return isAllowed
      ? url
      : "(tautan ini tidak dibagikan; hubungi kami melalui kontak resmi penaameen.com)";
  });
}
