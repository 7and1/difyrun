"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { X, Send, Loader2, Sparkles, MessageCircle } from "lucide-react";
import DOMPurify from "isomorphic-dompurify";
import { Button } from "@/components/ui/button";
import { QUICK_QUESTIONS, WELCOME_MESSAGE } from "@/lib/ai/prompts";
import { cn } from "@/lib/utils";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
}

export function DifyAdvisor() {
  const [isOpen, setIsOpen] = useState(false);
  const [showBubble, setShowBubble] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [lastMessageTime, setLastMessageTime] = useState<number[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Show bubble tip after 20 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isOpen) {
        setShowBubble(true);
      }
    }, 20000);

    return () => clearTimeout(timer);
  }, [isOpen]);

  // Listen for custom event from header
  useEffect(() => {
    const handleOpenChat = () => setIsOpen(true);
    window.addEventListener("open-dify-advisor", handleOpenChat);
    return () =>
      window.removeEventListener("open-dify-advisor", handleOpenChat);
  }, []);

  // Initialize with welcome message
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        {
          id: "welcome",
          role: "assistant",
          content: WELCOME_MESSAGE,
        },
      ]);
    }
  }, [isOpen, messages.length]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Rate limiting: 5 messages per minute
  const checkRateLimit = useCallback(() => {
    const now = Date.now();
    const recentMessages = lastMessageTime.filter((t) => now - t < 60000);
    return recentMessages.length < 5;
  }, [lastMessageTime]);

  const sendMessage = useCallback(
    async (text: string) => {
      if (!text.trim() || isLoading) return;

      // Rate limit check
      if (!checkRateLimit()) {
        setMessages((prev) => [
          ...prev,
          {
            id: crypto.randomUUID(),
            role: "assistant",
            content:
              "⏳ You're sending messages too quickly! Please wait a moment before trying again.",
          },
        ]);
        return;
      }

      const userMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: "user",
        content: text.trim(),
      };

      setMessages((prev) => [...prev, userMessage]);
      setInput("");
      setIsLoading(true);
      setLastMessageTime((prev) => [...prev, Date.now()]);

      try {
        const response = await fetch("/api/ai/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            prompt: text.trim(),
            conversationHistory: messages.slice(-6).map((m) => ({
              role: m.role,
              content: m.content,
            })),
          }),
        });

        const data = await response.json();

        if (data.success && data.message) {
          setMessages((prev) => [...prev, data.message]);
        } else {
          throw new Error("Invalid response");
        }
      } catch (error) {
        console.error("Chat error:", error);
        setMessages((prev) => [
          ...prev,
          {
            id: crypto.randomUUID(),
            role: "assistant",
            content:
              "I'm having trouble connecting. Try downloading a workflow and importing it to Dify by going to Studio → Create from DSL!",
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    },
    [isLoading, checkRateLimit, messages],
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleQuickQuestion = (question: string) => {
    sendMessage(question);
  };

  const openChat = () => {
    setIsOpen(true);
    setShowBubble(false);
  };

  // Format message content with markdown-like styling
  const formatMessage = (content: string) => {
    // First escape HTML entities to prevent XSS
    const escapeHtml = (str: string) => {
      return str
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
    };

    const formatted = content
      .split("\n")
      .map((line, i) => {
        // Escape first
        line = escapeHtml(line);

        // Then apply markdown-style formatting on escaped content
        line = line.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
        line = line.replace(
          /`(.*?)`/g,
          '<code class="bg-muted px-1 py-0.5 rounded text-sm">$1</code>',
        );

        // List items
        if (line.match(/^[-•]\s/)) {
          return `<li class="ml-4">${line.slice(2)}</li>`;
        }
        if (line.match(/^\d+\.\s/)) {
          return `<li class="ml-4 list-decimal">${line.slice(line.indexOf(" ") + 1)}</li>`;
        }
        return line ? `<p>${line}</p>` : "<br/>";
      })
      .join("");

    // Sanitize final output with DOMPurify
    return DOMPurify.sanitize(formatted, {
      ALLOWED_TAGS: ["p", "br", "strong", "code", "li", "ul", "ol"],
      ALLOWED_ATTR: ["class"],
    });
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={openChat}
        className={cn(
          "fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full",
          "bg-gradient-to-br from-blue-600 to-purple-600 text-white shadow-lg",
          "transition-all duration-300 hover:scale-110 hover:shadow-xl",
          !isOpen && "animate-pulse",
          isOpen && "scale-0 opacity-0",
        )}
        aria-label="Open AI Advisor"
      >
        <div className="relative">
          <span className="text-2xl font-bold">D</span>
          <Sparkles className="absolute -right-1 -top-1 h-3 w-3 text-yellow-300" />
        </div>
      </button>

      {/* Bubble Tip */}
      {showBubble && !isOpen && (
        <div
          className={cn(
            "fixed bottom-24 right-6 z-50 max-w-xs rounded-2xl bg-white p-4 shadow-xl",
            "border border-border animate-in slide-in-from-bottom-2 fade-in duration-300",
            "dark:bg-card",
          )}
        >
          <button
            onClick={() => setShowBubble(false)}
            className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-muted text-muted-foreground hover:bg-muted/80"
          >
            <X className="h-3 w-3" />
          </button>
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-purple-600">
              <span className="text-lg font-bold text-white">D</span>
            </div>
            <div>
              <p className="font-medium">Need help with Dify?</p>
              <p className="text-sm text-muted-foreground">
                Ask me about importing workflows, MCP, or RAG pipelines!
              </p>
              <Button
                size="sm"
                onClick={openChat}
                className="mt-2 bg-gradient-to-r from-blue-600 to-purple-600"
              >
                <MessageCircle className="mr-1 h-3 w-3" />
                Chat now
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Chat Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />

          {/* Modal */}
          <div
            className={cn(
              "relative flex h-[600px] w-full max-w-lg flex-col overflow-hidden rounded-3xl",
              "bg-white shadow-2xl dark:bg-card",
              "animate-in zoom-in-95 fade-in duration-200",
            )}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4 text-white">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 backdrop-blur">
                  <span className="text-xl font-bold">D</span>
                </div>
                <div>
                  <h3 className="font-semibold">DifyBot</h3>
                  <p className="text-xs text-white/80">
                    Your Dify Workflow Advisor
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 transition-colors hover:bg-white/30"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    "flex",
                    message.role === "user" ? "justify-end" : "justify-start",
                  )}
                >
                  <div
                    className={cn(
                      "max-w-[85%] rounded-2xl px-4 py-3",
                      message.role === "user"
                        ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                        : "bg-muted",
                    )}
                  >
                    <div
                      className={cn(
                        "prose prose-sm max-w-none",
                        message.role === "user" && "prose-invert",
                        "[&>p]:mb-2 [&>p:last-child]:mb-0",
                        "[&>li]:mb-1",
                      )}
                      dangerouslySetInnerHTML={{
                        __html: formatMessage(message.content),
                      }}
                    />
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex justify-start">
                  <div className="flex items-center gap-2 rounded-2xl bg-muted px-4 py-3">
                    <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      Thinking...
                    </span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Questions */}
            {messages.length <= 1 && (
              <div className="border-t px-4 py-3">
                <p className="mb-2 text-xs font-medium text-muted-foreground">
                  Quick questions:
                </p>
                <div className="flex flex-wrap gap-2">
                  {QUICK_QUESTIONS.slice(0, 3).map((q) => (
                    <button
                      key={q}
                      onClick={() => handleQuickQuestion(q)}
                      className="rounded-full bg-muted px-3 py-1.5 text-xs transition-colors hover:bg-muted/80"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}
            <form onSubmit={handleSubmit} className="border-t p-4">
              <div className="flex gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about Dify workflows..."
                  className={cn(
                    "flex-1 rounded-full border bg-muted/50 px-4 py-2.5 text-sm",
                    "focus:outline-none focus:ring-2 focus:ring-blue-500",
                    "placeholder:text-muted-foreground",
                  )}
                  disabled={isLoading}
                />
                <Button
                  type="submit"
                  size="icon"
                  disabled={!input.trim() || isLoading}
                  className="h-10 w-10 shrink-0 rounded-full bg-gradient-to-r from-blue-600 to-purple-600"
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
