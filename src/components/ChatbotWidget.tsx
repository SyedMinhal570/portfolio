"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Bot, MessageCircle, Send, Sparkles, X } from "lucide-react";
import { easeOutExpo } from "@/lib/motion";

type ChatRole = "user" | "model";

interface ChatMessage {
  id: number;
  role: ChatRole;
  text: string;
  starter?: boolean;
}

const STARTER_MESSAGE: ChatMessage = {
  id: 0,
  role: "model",
  text: "Hi! Ask me anything about Minhal's skills, projects, or experience 👋",
  starter: true,
};

const suggestions = [
  "What are his skills?",
  "Tell me about FasalGuard",
  "What projects has he built?",
  "What's his experience?",
];

const FALLBACK_MESSAGE =
  "Sorry, I'm having trouble right now — feel free to reach out via the Contact form instead.";

export default function ChatbotWidget() {
  const pathname = usePathname();
  const reduced = useReducedMotion();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([STARTER_MESSAGE]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const nextId = useRef(1);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const isExcludedRoute =
    pathname === "/login" || pathname.startsWith("/dashboard");

  useEffect(() => {
    if (!isOpen) return;
    messagesEndRef.current?.scrollIntoView({
      behavior: reduced ? "auto" : "smooth",
    });
  }, [isOpen, isLoading, messages, reduced]);

  useEffect(() => {
    if (isOpen) inputRef.current?.focus();
  }, [isOpen]);

  if (isExcludedRoute) return null;

  async function sendMessage(rawMessage: string) {
    const message = rawMessage.trim();
    if (!message || isLoading) return;

    const history = messages
      .filter((entry) => !entry.starter)
      .map(({ role, text }) => ({ role, text }));

    const userMessage: ChatMessage = {
      id: nextId.current++,
      role: "user",
      text: message,
    };

    setMessages((current) => [...current, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, history }),
      });

      const data = (await response.json().catch(() => null)) as
        | { reply?: string; error?: string }
        | null;

      const reply =
        response.ok && data?.reply
          ? data.reply
          : data?.error || FALLBACK_MESSAGE;

      setMessages((current) => [
        ...current,
        { id: nextId.current++, role: "model", text: reply },
      ]);
    } catch {
      setMessages((current) => [
        ...current,
        { id: nextId.current++, role: "model", text: FALLBACK_MESSAGE },
      ]);
    } finally {
      setIsLoading(false);
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void sendMessage(input);
  }

  const hasVisitorMessage = messages.some((message) => message.role === "user");

  return (
    <div className="fixed bottom-5 right-5 z-[70] sm:bottom-6 sm:right-6">
      <AnimatePresence>
        {isOpen && (
          <motion.section
            key="chat-panel"
            initial={reduced ? false : { opacity: 0, y: 20, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.97 }}
            transition={{ duration: 0.28, ease: easeOutExpo }}
            className="fixed inset-x-0 bottom-0 flex h-[78dvh] max-h-[560px] flex-col overflow-hidden rounded-t-2xl border border-white/10 bg-surface shadow-2xl sm:inset-auto sm:bottom-24 sm:right-6 sm:h-[480px] sm:w-[360px] sm:rounded-2xl"
            aria-label="Ask about Minhal chatbot"
          >
            <header className="flex items-center justify-between border-b border-white/10 bg-background/70 px-4 py-3 backdrop-blur-md">
              <div className="flex min-w-0 items-center gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-accent text-white shadow-glow">
                  <Bot size={20} aria-hidden="true" />
                </span>
                <div className="min-w-0">
                  <h2 className="truncate font-heading text-sm font-semibold text-white">
                    Ask about Minhal
                  </h2>
                  <p className="flex items-center gap-1.5 text-xs text-zinc-400">
                    <span
                      className="h-1.5 w-1.5 rounded-full bg-emerald-400"
                      aria-hidden="true"
                    />
                    Portfolio assistant
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-zinc-400 transition-colors hover:bg-white/5 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-cyan"
                aria-label="Close chatbot"
              >
                <X size={20} aria-hidden="true" />
              </button>
            </header>

            <div
              className="flex-1 space-y-3 overflow-y-auto px-4 py-4"
              aria-live="polite"
            >
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                      message.role === "user"
                        ? "rounded-br-md bg-gradient-accent text-white"
                        : "rounded-bl-md border border-white/10 bg-background text-zinc-300"
                    }`}
                  >
                    {message.text}
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex justify-start">
                  <div className="flex items-center gap-1 rounded-2xl rounded-bl-md border border-white/10 bg-background px-4 py-3">
                    {[0, 1, 2].map((index) => (
                      <motion.span
                        key={index}
                        className="h-1.5 w-1.5 rounded-full bg-accent-cyan"
                        animate={
                          reduced
                            ? undefined
                            : { opacity: [0.3, 1, 0.3], y: [0, -3, 0] }
                        }
                        transition={{
                          duration: 0.9,
                          repeat: Infinity,
                          delay: index * 0.15,
                        }}
                      />
                    ))}
                    <span className="sr-only">Minhal&apos;s assistant is typing</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="border-t border-white/10 bg-background/60 p-3">
              {!hasVisitorMessage && (
                <div className="mb-3 flex gap-2 overflow-x-auto pb-1">
                  {suggestions.map((suggestion) => (
                    <button
                      key={suggestion}
                      type="button"
                      onClick={() => void sendMessage(suggestion)}
                      disabled={isLoading}
                      className="shrink-0 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-zinc-300 transition-colors hover:border-accent-purple/40 hover:text-white disabled:opacity-50"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              )}

              <form onSubmit={handleSubmit} className="flex items-center gap-2">
                <label htmlFor="chatbot-message" className="sr-only">
                  Ask about Minhal
                </label>
                <input
                  ref={inputRef}
                  id="chatbot-message"
                  type="text"
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  disabled={isLoading}
                  maxLength={1_000}
                  placeholder="Ask about skills, projects..."
                  autoComplete="off"
                  className="min-w-0 flex-1 rounded-xl border border-white/10 bg-surface px-3.5 py-2.5 text-sm text-white placeholder-zinc-500 transition-colors focus:border-accent-purple focus:outline-none focus:ring-2 focus:ring-accent-purple/20 disabled:opacity-60"
                />
                <button
                  type="submit"
                  disabled={isLoading || input.trim().length === 0}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-accent text-white shadow-glow transition-all hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
                  aria-label="Send message"
                >
                  <Send size={17} aria-hidden="true" />
                </button>
              </form>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {!isOpen && (
          <motion.button
            key="chat-button"
            type="button"
            onClick={() => setIsOpen(true)}
            initial={reduced ? false : { opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            whileHover={reduced ? undefined : { scale: 1.06 }}
            whileTap={reduced ? undefined : { scale: 0.96 }}
            transition={{ duration: 0.25, ease: easeOutExpo }}
            className="group relative flex h-14 w-14 items-center justify-center rounded-full bg-gradient-accent text-white shadow-[0_0_30px_rgba(139,92,246,0.35)] focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-cyan focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            aria-label="Open portfolio chatbot"
          >
            <span
              className="absolute inset-0 rounded-full bg-gradient-accent opacity-0 blur-md transition-opacity group-hover:opacity-60"
              aria-hidden="true"
            />
            <MessageCircle size={24} className="relative z-10" aria-hidden="true" />
            <Sparkles
              size={12}
              className="absolute right-1.5 top-1.5 z-10"
              aria-hidden="true"
            />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
