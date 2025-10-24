
"use client";

import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import styles from "./ChatWidget.module.css";

/**
 * ChatWidget
 * Props:
 *  - apiBase: base URL for your backend (default: process.env.NEXT_PUBLIC_CHAT_API or http://localhost:4000/api)
 *  - logoSrc: path to the chat logo image in /public (default: /chatbot-logo.png)
 */
export default function ChatWidget({
  apiBase = process.env.NEXT_PUBLIC_CHAT_API || "http://localhost:4000/api",
  logoSrc = "/chatbot-logo.png",
}) {
  const apiBaseClean =
    (apiBase || "").trim().replace(/\/+$/, "") || "http://localhost:4000/api";

  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hi 👋 — ask me about my boss projects or background." },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const scrollRef = useRef(null);
  const inputRef = useRef(null);

  // Only render on client to avoid SSR/portal mismatch
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    function handleOpen() {
      setOpen(true);
      setTimeout(() => inputRef.current?.focus(), 120);
    }
    window.addEventListener("openChat", handleOpen);
    return () => window.removeEventListener("openChat", handleOpen);
  }, []);

  // Auto-scroll when new message appears
  useEffect(() => {
    if (!open || !scrollRef.current) return;
    const t = setTimeout(() => {
      try {
        scrollRef.current.scrollTo({
          top: scrollRef.current.scrollHeight,
          behavior: "smooth",
        });
      } catch {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      }
    }, 80);
    return () => clearTimeout(t);
  }, [messages, open]);

  function toggle() {
    setOpen((v) => !v);
    if (!open) setTimeout(() => inputRef.current?.focus(), 120);
  }

  async function send() {
    const text = input.trim();
    if (!text) return;

    setMessages((m) => [...m, { role: "user", content: text }]);
    setInput("");
    setLoading(true);

    try {
      const resp = await fetch(`${apiBaseClean}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, sessionId: "visitor" }),
      });
      if (!resp.ok) {
        const txt = await resp.text().catch(() => "");
        throw new Error(`Server ${resp.status}${txt ? `: ${txt}` : ""}`);
      }
      const json = await resp.json();
      const answer = json?.answer || json?.reply || json?.message || "Sorry — no response.";
      setMessages((m) => [...m, { role: "assistant", content: String(answer) }]);
    } catch (err) {
      console.error("Chat send error:", err);
      setMessages((m) => [
        ...m,
        { role: "assistant", content: "⚠️ Network error — please try again." },
      ]);
    } finally {
      setLoading(false);
      setOpen(true);
      setTimeout(() => inputRef.current?.focus(), 80);
    }
  }

  if (!mounted) return null;

  // Render to body so it's independent of page containers/scroll/transform
  return createPortal(
    <div className={styles.container} aria-live="polite">
      {/* Minimized launcher */}
      {!open && (
        <div className={styles.minimizedGroup}>
          <button
            className={styles.ctaPill}
            onClick={() => {
              setOpen(true);
              setTimeout(() => inputRef.current?.focus(), 120);
            }}
            aria-label="Open chat"
            title="Open chat"
          >
            <span className={styles.ctaText}>Welcome! I'm Chitti</span>
            <span className={styles.ctaCursor}> ▍</span>
          </button>

          <button
            aria-label="Open chat"
            className={styles.bubble}
            onClick={() => {
              setOpen(true);
              setTimeout(() => inputRef.current?.focus(), 120);
            }}
            title="Chat with me"
          >
            <img
              src={logoSrc}
              alt="Chatbot logo"
              className={styles.chatLogo}
              width={42}
              height={42}
            />
          </button>
        </div>
      )}

      {/* Panel */}
      {open && (
        <div className={styles.panel} role="dialog" aria-label="Portfolio Chat">
          <div className={styles.header}>
            <div className={styles.headerLeft}>
              <img
                src={logoSrc}
                alt="Bot"
                className={styles.headerLogo}
                width={22}
                height={22}
              />
              <div className={styles.title}>Portfolio Chat</div>
            </div>
            <button className={styles.minBtn} onClick={toggle} aria-label="Minimize">
              ✕
            </button>
          </div>

          <div className={styles.messages} ref={scrollRef}>
            {messages.map((m, i) => (
              <div
                key={i}
                className={m.role === "assistant" ? styles.msgAssistant : styles.msgUser}
              >
                <div className={styles.msgText}>{m.content}</div>
              </div>
            ))}
          </div>

          <div className={styles.footer}>
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  send();
                }
              }}
              placeholder="Ask about my projects, skills..."
              className={styles.input}
              disabled={loading}
            />
            <button
              onClick={send}
              disabled={loading || !input.trim()}
              className={styles.sendBtn}
              title="Send"
            >
              {loading ? "..." : "↵"}
            </button>
          </div>
        </div>
      )}
    </div>,
    document.body
  );
}
