
// frontend/components/ChatWidgetWrapper.client.jsx
"use client";

import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";

// Dynamically load ChatWidget only in browser (no SSR)
const ChatWidget = dynamic(() => import("./ChatWidget"), { ssr: false });

export default function ChatWidgetWrapper() {
  const pathname = usePathname();       // e.g., "/", "/about", "/projects"
  const onHome = pathname === "/";      // show only on home. Remove this line & the check below to show on all pages.

  if (!onHome) return null;

  // NOTE:
  // - We DO NOT add any scroll listener here.
  // - The widget's own CSS (position: fixed) keeps it visible while scrolling.
  // - If you’ve set right/left/bottom in ChatWidget.module.css, it will pin correctly.

  return <ChatWidget />;
}
