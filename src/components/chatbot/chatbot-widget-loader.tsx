"use client";

import dynamic from "next/dynamic";

// Fixed-position floating widget with no SEO/LCP relevance — loading it
// client-only, off the initial bundle, keeps its ~480-line component (plus
// framer-motion, faqs data, plans data) out of every route's first load JS.
// `ssr: false` requires this dynamic() call to live in a Client Component.
const ChatbotWidget = dynamic(
  () => import("./chatbot-widget").then((m) => m.ChatbotWidget),
  { ssr: false },
);

export function ChatbotWidgetLoader() {
  return <ChatbotWidget />;
}
