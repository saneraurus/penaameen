"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { useCart } from "@/context/CartContext";
import { useAmeenContext } from "@/context/AmeenContext";
import { AmeenAvatar } from "./AmeenAvatar";
import { PenIcon } from "./PenIcon";

type ChatRole = "user" | "assistant";

interface ChatMessage {
  role: ChatRole;
  content: string;
}

const STORAGE_KEY = "penaameen_ameen_chat";
const SESSION_KEY = "penaameen_ameen_session";

const WELCOME_MESSAGE: ChatMessage = {
  role: "assistant",
  content:
    "Assalamu'alaikum! Saya AMEEN, customer service Pena Ameen. Saya bisa bantu soal produk, metode belajar (AL-BARQY & ACM), status pesanan, pengiriman, pembayaran, dan info lainnya. Ada yang bisa saya bantu?",
};

const QUICK_PROMPTS = [
  "Cek status pesanan saya",
  "Info metode AL-BARQY",
  "Info metode ACM",
  "Metode pembayaran apa saja?",
  "Di mana lokasi Pena Ameen?",
];

function loadHistory(): ChatMessage[] {
  if (typeof window === "undefined") return [WELCOME_MESSAGE];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [WELCOME_MESSAGE];
    const parsed = JSON.parse(raw) as ChatMessage[];
    if (!Array.isArray(parsed) || parsed.length === 0) return [WELCOME_MESSAGE];
    return parsed;
  } catch {
    return [WELCOME_MESSAGE];
  }
}

function getSessionId(): string {
  if (typeof window === "undefined") return "";
  try {
    let sessionId = localStorage.getItem(SESSION_KEY);
    if (!sessionId) {
      sessionId = crypto.randomUUID();
      localStorage.setItem(SESSION_KEY, sessionId);
    }
    return sessionId;
  } catch {
    return "";
  }
}

function storeSessionId(sessionId: string): void {
  if (!sessionId) return;
  try {
    localStorage.setItem(SESSION_KEY, sessionId);
  } catch {
    // storage unavailable - ignore
  }
}

export function AmeenAssistant() {
  const pathname = usePathname();
  const { searchQuery } = useAmeenContext();
  const { isSignedIn, isLoaded } = useAuth();
  const { itemCount, items: cartItems, total: cartTotal } = useCart();

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(loadHistory);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const scrollRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const messagesRef = useRef<ChatMessage[]>(messages);

  useEffect(() => {
    messagesRef.current = messages;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messagesRef.current));
    } catch {
      // storage unavailable - ignore
    }
  }, [messages]);

  useEffect(() => {
    if (!isOpen) return;
    const t = setTimeout(() => inputRef.current?.focus(), 120);
    return () => clearTimeout(t);
  }, [isOpen]);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, isSending, isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen]);

  const sendMessage = useCallback(
    async (rawContent: string) => {
      const content = rawContent.trim();
      if (!content || isSending) return;

      const userMessage: ChatMessage = { role: "user", content };
      const nextMessages = [...messagesRef.current, userMessage];
      setMessages(nextMessages);
      setInput("");
      setError(null);
      setIsSending(true);

      try {
        const cartSnapshot =
          cartItems?.slice(0, 8).map((it) => ({
            name: it.product.name,
            qty: it.quantity,
            price: it.product.price,
          })) ?? [];
        const pageTitle = typeof document !== "undefined" ? document.title : "";
        const pageUrl =
          typeof window !== "undefined" ? window.location.href : "";

        const res = await fetch("/api/assistant", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: nextMessages
              .slice(-12)
              .map((m) => ({ role: m.role, content: m.content })),
            pagePath: pathname,
            pageTitle,
            pageUrl,
            searchQuery,
            cartItemCount: itemCount,
            cartSnapshot,
            cartTotal,
            sessionId: getSessionId(),
          }),
        });

        const data = (await res.json()) as {
          reply?: string;
          error?: string;
          sessionId?: string;
        };

        if (data.sessionId) {
          storeSessionId(data.sessionId);
        }

        if (!res.ok || !data.reply) {
          setError(data.error ?? "Maaf, terjadi kendala. Silakan coba lagi.");
        } else {
          setMessages((prev) => [
            ...prev,
            { role: "assistant", content: data.reply as string },
          ]);
        }
      } catch {
        setError("Maaf, terjadi kendala jaringan. Silakan coba lagi.");
      } finally {
        setIsSending(false);
      }
    },
    [isSending, pathname, searchQuery, itemCount, cartItems, cartTotal],
  );

  const resetChat = () => {
    setMessages([WELCOME_MESSAGE]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
    setError(null);
  };

  return (
    <div className="pointer-events-none fixed bottom-3 right-3 z-[70] flex flex-col items-end gap-2.5 sm:bottom-4 sm:right-4">
      {isOpen && (
        <section
          role="dialog"
          aria-label="TANYA AMEEN - Customer Service Pena Ameen"
          className="pointer-events-auto animate-chat-panel-in flex w-[min(92vw,340px)] flex-col overflow-hidden rounded-[20px] border border-supporting-200/70 bg-white shadow-[0_20px_48px_-20px_rgba(16,24,16,0.32),0_8px_16px_-8px_rgba(16,24,16,0.12)] max-h-[min(66dvh,500px)] sm:max-h-[520px]"
        >
          {/* Header — compact, no overflow */}
          <header className="relative flex shrink-0 items-center justify-between gap-2 bg-gradient-to-br from-primary-700 via-primary-800 to-primary-950 px-3 py-2.5 text-white">
            <div className="flex min-w-0 items-center gap-2.5">
              <AmeenAvatar className="h-8 w-8 shrink-0 rounded-full ring-1 ring-white/15" />
              <div className="min-w-0 leading-none">
                <p className="truncate text-[13px] font-bold tracking-[0.01em]">
                  TANYA AMEEN
                </p>
                <p className="mt-0.5 flex items-center gap-1 text-[10px] font-medium leading-none text-primary-100/90">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-300 opacity-70" />
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-300" />
                  </span>
                  Customer Service • Online
                </p>
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-0.5">
              <button
                type="button"
                onClick={resetChat}
                aria-label="Mulai ulang percakapan"
                className="inline-flex h-7 w-7 items-center justify-center rounded-full text-white/80 transition-colors hover:bg-white/10 hover:text-white cursor-pointer"
              >
                <svg
                  className="h-3.5 w-3.5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 4v6h6M20 20v-6h-6M4 10a8 8 0 0114.9-2M20 14a8 8 0 01-14.9 2"
                  />
                </svg>
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label="Tutup TANYA AMEEN"
                className="inline-flex h-7 w-7 items-center justify-center rounded-full text-white/80 transition-colors hover:bg-white/10 hover:text-white cursor-pointer"
              >
                <svg
                  className="h-3.5 w-3.5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </header>

          {/* Messages — tighter, smaller */}
          <div
            ref={scrollRef}
            className="flex min-h-0 flex-1 flex-col gap-2.5 overflow-y-auto bg-[#fafaf8] px-3 py-3"
          >
            {messages.map((message, index) => (
              <div
                key={`${message.role}-${index}`}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {message.role === "assistant" && (
                  <AmeenAvatar className="mr-2 mt-1 h-5 w-5 shrink-0" />
                )}
                <div
                  className={`max-w-[78%] whitespace-pre-line rounded-2xl px-3 py-2 text-[12px] leading-[1.6] shadow-sm ${
                    message.role === "user"
                      ? "rounded-br-[6px] bg-primary-700 text-white"
                      : "rounded-bl-[6px] border border-supporting-200/80 bg-white text-supporting-800"
                  }`}
                >
                  {message.content}
                </div>
              </div>
            ))}

            {isSending && (
              <div className="flex justify-start">
                <AmeenAvatar className="mr-2 mt-1 h-5 w-5 shrink-0" />
                <div
                  role="status"
                  aria-live="polite"
                  className="inline-flex items-center gap-2 rounded-2xl rounded-bl-[6px] border border-supporting-200/80 bg-white px-3 py-2 shadow-sm"
                >
                  <PenIcon className="animate-spin-slow h-3.5 w-3.5 text-primary-600" />
                  <span className="text-[11px] font-medium text-supporting-600">
                    Ameen mengetik…
                  </span>
                </div>
              </div>
            )}

            {error && (
              <div className="flex justify-center">
                <p className="rounded-lg bg-red-50 px-2.5 py-1.5 text-center text-[11px] leading-snug text-red-700 border border-red-200/70">
                  {error}
                </p>
              </div>
            )}
          </div>

          {/* Quick prompts — single row, scroll, faded */}
          <div className="relative shrink-0 border-t border-supporting-100 bg-white">
            <div
              className="pointer-events-none absolute inset-y-0 right-0 w-6 bg-gradient-to-l from-white to-transparent"
              aria-hidden="true"
            />
            <div className="flex gap-1.5 overflow-x-auto px-2.5 py-2 scrollbar-none scroll-smooth">
              {QUICK_PROMPTS.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  disabled={isSending}
                  onClick={() => sendMessage(prompt)}
                  className="shrink-0 whitespace-nowrap rounded-full border border-primary-200/70 bg-primary-50/80 px-2.5 py-1 text-[10px] font-semibold leading-none text-primary-700 transition-colors hover:bg-primary-100 disabled:opacity-40 cursor-pointer"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>

          {/* Input — compact single line */}
          <form
            className="flex shrink-0 items-center gap-2 border-t border-supporting-100 bg-white px-2.5 py-2"
            onSubmit={(event) => {
              event.preventDefault();
              void sendMessage(input);
            }}
          >
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Tulis pertanyaan..."
              aria-label="Tulis pertanyaan"
              className="min-w-0 flex-1 rounded-full border border-supporting-200 bg-background-50 px-3.5 py-2 text-[12px] leading-none text-supporting-800 placeholder:text-supporting-400 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500/20"
            />
            <button
              type="submit"
              disabled={isSending || !input.trim()}
              aria-label="Kirim pesan"
              className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-700 text-white shadow-sm transition-colors hover:bg-primary-800 disabled:opacity-40 disabled:shadow-none cursor-pointer"
            >
              <svg
                className="h-3.5 w-3.5 translate-x-[0.5px]"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"
                />
              </svg>
            </button>
          </form>

          {isLoaded && !isSignedIn && (
            <p className="shrink-0 border-t border-supporting-100 bg-background-50 px-3 py-1.5 text-center text-[9px] leading-none tracking-wide text-supporting-500">
              Login untuk cek pesanan real-time via AMEEN
            </p>
          )}
        </section>
      )}

      <div className="pointer-events-auto relative">
        {!isOpen && (
          <span
            aria-hidden="true"
            className="animate-ping-slow absolute inset-0 rounded-full bg-primary-500/30"
          />
        )}
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          aria-label={
            isOpen
              ? "Tutup TANYA AMEEN"
              : "Buka TANYA AMEEN - Customer Service Pena Ameen"
          }
          aria-expanded={isOpen}
          className={`relative inline-flex h-[52px] w-[52px] items-center justify-center rounded-full bg-gradient-to-br from-primary-600 to-primary-800 text-white shadow-[0_8px_20px_-8px_rgba(16,24,16,0.5),0_4px_10px_-4px_rgba(16,24,16,0.3)] ring-1 ring-white/10 transition-all duration-200 hover:scale-[1.03] hover:shadow-[0_12px_28px_-12px_rgba(16,24,16,0.5)] cursor-pointer sm:h-[52px] sm:w-[52px] ${
            isOpen ? "rotate-90" : ""
          }`}
        >
          {isOpen ? (
            <svg
              className="h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : (
            <svg
              className="h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8-1.036 0-2.039-.132-2.968-.38L3 21l1.286-3.67C3.47 16.103 3 14.107 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}
