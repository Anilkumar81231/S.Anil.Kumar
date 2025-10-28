

"use client";

import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import styles from "./ChatWidget.module.css";

/** Renders structured projects array (no slicing) */
function ProjectsRenderer({ items }) {
  if (!Array.isArray(items) || !items.length) return null;

  return (
    <section className={styles.projectsGrid} style={{ marginBottom: 8 }}>
      {items.map((p) => (
        <article key={p.name} className={styles.projectCard}>
          <header style={{ marginBottom: 6 }}>
            <h3 style={{ fontSize: 14, fontWeight: 600, margin: 0 }}>{p.name}</h3>
            {p.link ? (
              <div>
                <a href={p.link} target="_blank" rel="noreferrer" style={{ fontSize: 12, textDecoration: "underline" }}>
                  Visit
                </a>
              </div>
            ) : null}
          </header>
          {p.about ? (
            <p style={{ fontSize: 13, opacity: 0.85, margin: "6px 0 8px" }}>
              {p.about}
            </p>
          ) : null}
          {Array.isArray(p.stack) && p.stack.length > 0 ? (
            <ul style={{ display: "flex", flexWrap: "wrap", gap: 6, padding: 0, margin: 0, listStyle: "none" }}>
              {p.stack.map((s) => (
                <li
                  key={`${p.name}-${s}`}
                  style={{ fontSize: 11, padding: "3px 8px", border: "1px solid #e5e7eb", borderRadius: 999 }}
                >
                  {s}
                </li>
              ))}
            </ul>
          ) : null}
        </article>
      ))}
    </section>
  );
}

/**
 * ChatWidget
 * Props:
 *  - apiBase: base URL for backend (default: env or http://localhost:4000/api)
 *  - logoSrc: path to /public image (default: /chatbot-logo.png)
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

  // auto-scroll on new messages
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
      const projects = Array.isArray(json?.projects) ? json.projects : null;

      setMessages((m) => [...m, { role: "assistant", content: String(answer), projects }]);
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

          <div className={styles.messages} ref={scrollRef} style={{ overflowY: "auto" }}>
            {messages.map((m, i) => (
              <div
                key={i}
                className={m.role === "assistant" ? styles.msgAssistant : styles.msgUser}
              >
                {/* Structured projects grid (all items) */}
                {Array.isArray(m.projects) && m.projects.length > 0 && (
                  <ProjectsRenderer items={m.projects} />
                )}
                {/* Textual content (with preserved line breaks via CSS) */}
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
