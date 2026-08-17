"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { useCart } from "@/context/CartContext";
import { useAmeenContext } from "@/context/AmeenContext";

type ChatRole = "user" | "assistant";

interface ChatMessage {
  role: ChatRole;
  content: string;
}

const STORAGE_KEY = "penaameen_ameen_chat";

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

export function AmeenAssistant() {
  const pathname = usePathname();
  const { searchQuery } = useAmeenContext();
  const { isSignedIn, isLoaded } = useAuth();
  const { itemCount } = useCart();

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
    if (isOpen) {
      inputRef.current?.focus();
    }
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
        const res = await fetch("/api/assistant", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: nextMessages.slice(-12).map((m) => ({ role: m.role, content: m.content })),
            pagePath: pathname,
            searchQuery,
            cartItemCount: itemCount,
          }),
        });

        const data = (await res.json()) as { reply?: string; error?: string };

        if (!res.ok || !data.reply) {
          setError(data.error ?? "Maaf, terjadi kendala. Silakan coba lagi.");
        } else {
          setMessages((prev) => [...prev, { role: "assistant", content: data.reply as string }]);
        }
      } catch {
        setError("Maaf, terjadi kendala jaringan. Silakan coba lagi.");
      } finally {
        setIsSending(false);
      }
    },
    [isSending, pathname, searchQuery, itemCount]
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
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-3">
      {isOpen && (
        <section
          role="dialog"
          aria-label="TANYA AMEEN - Customer Service Pena Ameen"
          className="flex w-[calc(100vw-2.5rem)] max-w-[380px] flex-col overflow-hidden rounded-3xl border border-supporting-200 bg-white shadow-2xl shadow-primary-950/20"
        >
          {/* Header */}
          <header className="flex items-center justify-between gap-3 bg-gradient-to-br from-primary-700 to-primary-900 px-4 py-3.5 text-white">
            <div className="flex items-center gap-3 min-w-0">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/15 text-lg font-bold ring-2 ring-white/30">
                A
              </div>
              <div className="min-w-0">
                <p className="truncate font-serif text-base font-bold leading-tight">
                  TANYA AMEEN
                </p>
                <p className="flex items-center gap-1.5 text-[11px] text-primary-100">
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-300" />
                  Customer Service • Online
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={resetChat}
                aria-label="Mulai ulang percakapan"
                className="rounded-full p-1.5 text-primary-100 transition-colors hover:bg-white/15 hover:text-white cursor-pointer"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v6h6M20 20v-6h-6M4 10a8 8 0 0114.9-2M20 14a8 8 0 01-14.9 2" />
                </svg>
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label="Tutup TANYA AMEEN"
                className="rounded-full p-1.5 text-primary-100 transition-colors hover:bg-white/15 hover:text-white cursor-pointer"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </header>

          {/* Messages */}
          <div
            ref={scrollRef}
            className="flex h-[min(60vh,420px)] flex-col gap-3 overflow-y-auto bg-background-100 px-4 py-4"
          >
            {messages.map((message, index) => (
              <div
                key={`${message.role}-${index}`}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] whitespace-pre-line rounded-2xl px-3.5 py-2.5 text-[13px] leading-relaxed ${
                    message.role === "user"
                      ? "rounded-br-md bg-primary-600 text-white"
                      : "rounded-bl-md border border-supporting-200 bg-white text-supporting-800"
                  }`}
                >
                  {message.content}
                </div>
              </div>
            ))}

            {isSending && (
              <div className="flex justify-start">
                <div className="flex items-center gap-1.5 rounded-2xl rounded-bl-md border border-supporting-200 bg-white px-4 py-3">
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary-500 [animation-delay:0ms]" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary-500 [animation-delay:150ms]" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary-500 [animation-delay:300ms]" />
                </div>
              </div>
            )}

            {error && (
              <div className="flex justify-center">
                <p className="rounded-xl bg-red-50 px-3 py-2 text-[12px] text-red-700 border border-red-200">
                  {error}
                </p>
              </div>
            )}
          </div>

          {/* Quick prompts */}
          <div className="flex gap-2 overflow-x-auto border-t border-supporting-100 bg-white px-3 py-2.5 scrollbar-none">
            {QUICK_PROMPTS.map((prompt) => (
              <button
                key={prompt}
                type="button"
                disabled={isSending}
                onClick={() => sendMessage(prompt)}
                className="shrink-0 rounded-full border border-primary-200 bg-primary-50 px-3 py-1.5 text-[11px] font-semibold text-primary-700 transition-colors hover:bg-primary-100 disabled:opacity-50 cursor-pointer"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Input */}
          <form
            className="flex items-center gap-2 border-t border-supporting-100 bg-white px-3 py-3"
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
              placeholder="Tulis pertanyaan Anda..."
              aria-label="Tulis pertanyaan"
              className="min-w-0 flex-1 rounded-xl border border-supporting-200 bg-background-50 px-3.5 py-2.5 text-[13px] text-supporting-800 placeholder:text-supporting-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
            />
            <button
              type="submit"
              disabled={isSending || !input.trim()}
              aria-label="Kirim pesan"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-600 text-white transition-colors hover:bg-primary-700 disabled:opacity-40 cursor-pointer"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 11l18-8-8 18-2-8-8-2z" />
              </svg>
            </button>
          </form>

          {isLoaded && !isSignedIn && (
            <p className="border-t border-supporting-100 bg-background-50 px-4 py-2 text-center text-[10px] text-supporting-500">
              Login untuk cek status pesanan Anda secara real-time via AMEEN.
            </p>
          )}
        </section>
      )}

      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label={isOpen ? "Tutup TANYA AMEEN" : "Buka TANYA AMEEN - Customer Service Pena Ameen"}
        aria-expanded={isOpen}
        className={`flex h-14 w-14 items-center justify-center rounded-full bg-primary-600 text-white shadow-xl shadow-primary-900/30 transition-all hover:bg-primary-700 hover:scale-105 cursor-pointer ${
          isOpen ? "rotate-90" : ""
        }`}
      >
        {isOpen ? (
          <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8-1.036 0-2.039-.132-2.968-.38L3 21l1.286-3.67C3.47 16.103 3 14.107 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        )}
      </button>
    </div>
  );
}
