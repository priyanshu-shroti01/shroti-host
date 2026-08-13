"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  Bot,
  Check,
  Globe,
  HelpCircle,
  LifeBuoy,
  Sparkles,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Typewriter } from "@/components/ui/typewriter";
import { sharedPlans } from "@/lib/plans";
import { faqs } from "@/components/home/faq";
import { useCurrency } from "@/components/currency-provider";
import { usePrefersReducedMotion } from "@/lib/use-reduced-motion";

const GREETING_STORAGE_KEY = "chatbot-greeting-seen";
const GREETING_DELAY_MS = 6000;

type PlanName = "Launch" | "Grow" | "Scale";

type Question = {
  id: string;
  prompt: string;
  options: { label: string; scores: Record<PlanName, number> }[];
};

const questions: Question[] = [
  {
    id: "building",
    prompt: "What are you building today?",
    options: [
      { label: "Portfolio or blog", scores: { Launch: 2, Grow: 1, Scale: 0 } },
      { label: "Online store", scores: { Launch: 0, Grow: 2, Scale: 1 } },
      { label: "Startup / SaaS", scores: { Launch: 0, Grow: 1, Scale: 2 } },
      { label: "Agency (multiple sites)", scores: { Launch: 0, Grow: 0, Scale: 2 } },
    ],
  },
  {
    id: "websites",
    prompt: "Got it. How many websites will you host?",
    options: [
      { label: "Just 1", scores: { Launch: 2, Grow: 1, Scale: 0 } },
      { label: "2 to 10", scores: { Launch: 0, Grow: 2, Scale: 1 } },
      { label: "More than 10", scores: { Launch: 0, Grow: 0, Scale: 2 } },
    ],
  },
  {
    id: "traffic",
    prompt: "What kind of monthly traffic are you expecting?",
    options: [
      { label: "Under 5,000 visits", scores: { Launch: 2, Grow: 1, Scale: 0 } },
      { label: "5,000 to 50,000 visits", scores: { Launch: 0, Grow: 2, Scale: 1 } },
      { label: "50,000+ visits", scores: { Launch: 0, Grow: 0, Scale: 2 } },
    ],
  },
  {
    id: "budget",
    prompt: "Last one — what's your budget like?",
    options: [
      { label: "Just getting started", scores: { Launch: 2, Grow: 1, Scale: 0 } },
      { label: "Comfortable mid-range", scores: { Launch: 0, Grow: 2, Scale: 1 } },
      { label: "No strict budget", scores: { Launch: 0, Grow: 1, Scale: 2 } },
    ],
  },
];

type HistoryItem = { question: string; answer: string };
type Screen = "menu" | "quiz" | "faq";

export function ChatbotWidget() {
  const [open, setOpen] = useState(false);
  const [screen, setScreen] = useState<Screen>("menu");
  const [step, setStep] = useState(0);
  const [scores, setScores] = useState<Record<PlanName, number>>({ Launch: 0, Grow: 0, Scale: 0 });
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [thinking, setThinking] = useState(false);
  const [promptTyped, setPromptTyped] = useState(false);
  const [faqHistory, setFaqHistory] = useState<HistoryItem[]>([]);
  const [showGreeting, setShowGreeting] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { format } = useCurrency();
  const prefersReducedMotion = usePrefersReducedMotion();

  const isDone = screen === "quiz" && step >= questions.length;
  const recommended = (() => {
    const entries = Object.entries(scores) as [PlanName, number][];
    const max = Math.max(...entries.map(([, v]) => v));
    const tied = entries.filter(([, v]) => v === max).map(([k]) => k);
    if (tied.length > 1 && tied.includes("Grow")) return "Grow";
    return tied[0] ?? "Grow";
  })();
  const tierByRecommendation: Record<PlanName, string> = { Launch: "Bronze", Grow: "Gold", Scale: "Platinum" };
  const plan = sharedPlans.find((p) => p.name === tierByRecommendation[recommended])!;

  useEffect(() => {
    if (!open) return;
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [history, faqHistory, thinking, isDone, screen, open]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // One-time proactive nudge, like Intercom/Crisp's greeting bubble — shown
  // once per browser session, never once the widget's been opened. If the
  // welcome-offer dialog is up when the timer lands, re-arm and try again
  // later — two proactive prompts at once is one too many.
  useEffect(() => {
    if (sessionStorage.getItem(GREETING_STORAGE_KEY)) return;
    let timer: ReturnType<typeof setTimeout>;
    const fire = () => {
      if (document.body.classList.contains("has-welcome-offer")) {
        timer = setTimeout(fire, 4000);
        return;
      }
      sessionStorage.setItem(GREETING_STORAGE_KEY, "1");
      setShowGreeting(true);
    };
    timer = setTimeout(fire, GREETING_DELAY_MS);
    return () => clearTimeout(timer);
  }, []);

  function openChat() {
    setShowGreeting(false);
    setOpen(true);
  }

  function dismissGreeting() {
    setShowGreeting(false);
  }

  function answer(option: Question["options"][number]) {
    setHistory((h) => [...h, { question: questions[step].prompt, answer: option.label }]);
    setScores((prev) => ({
      Launch: prev.Launch + option.scores.Launch,
      Grow: prev.Grow + option.scores.Grow,
      Scale: prev.Scale + option.scores.Scale,
    }));
    setThinking(true);
    setPromptTyped(false);
    setTimeout(() => {
      setThinking(false);
      setStep((s) => s + 1);
    }, 500);
  }

  function goToMenu() {
    setScreen("menu");
  }

  function startQuiz() {
    setScreen("quiz");
    setStep(0);
    setScores({ Launch: 0, Grow: 0, Scale: 0 });
    setHistory([]);
    setPromptTyped(false);
  }

  function startFaq() {
    setScreen("faq");
    setFaqHistory([]);
  }

  function askFaq(question: string, faqAnswer: string) {
    setFaqHistory((h) => [...h, { question, answer: faqAnswer }]);
  }

  function restart() {
    setStep(0);
    setScores({ Launch: 0, Grow: 0, Scale: 0 });
    setHistory([]);
    setPromptTyped(false);
    setFaqHistory([]);
    setScreen("menu");
  }

  return (
    <>
      <div className="group fixed bottom-5 right-5 z-[60] flex items-center transition-[bottom] duration-300 sm:bottom-6 sm:right-6 [.has-mobile-cta_&]:bottom-[4.75rem] lg:[.has-mobile-cta_&]:bottom-6">
        <AnimatePresence>
          {showGreeting && !open && (
            <motion.div
              role="status"
              initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 8, scale: 0.96 }}
              transition={{ duration: 0.25, ease: [0.33, 1, 0.68, 1] }}
              className="absolute bottom-full right-0 mb-3 w-64 rounded-2xl rounded-br-sm border border-border-strong bg-bg p-4 pr-8 shadow-2xl"
            >
              <button
                type="button"
                onClick={dismissGreeting}
                aria-label="Dismiss"
                className="absolute right-2 top-2 inline-flex h-6 w-6 items-center justify-center rounded-full text-text-muted hover:bg-surface-raised hover:text-text-primary"
              >
                <X size={13} aria-hidden="true" />
              </button>
              <button type="button" onClick={openChat} className="block text-left text-sm text-text-primary">
                👋 Need help picking a plan? I can match you to one in a few taps.
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {!open && (
          <span
            className="mr-0 max-w-0 overflow-hidden whitespace-nowrap rounded-full border border-border-strong bg-card py-2.5 text-sm font-medium text-text-primary opacity-0 shadow-lg transition-all duration-300 group-hover:mr-3 group-hover:max-w-[8rem] group-hover:px-4 group-hover:opacity-100 max-md:hidden"
            aria-hidden="true"
          >
            Ask AI
          </span>
        )}

        <AnimatePresence>
          {!open && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 -z-10 rounded-full bg-gradient-to-br from-brand-purple to-brand-blue opacity-40 blur-xl motion-safe:animate-glow-breathe"
              aria-hidden="true"
            />
          )}
        </AnimatePresence>
        <motion.button
          type="button"
          onClick={() => (open ? setOpen(false) : openChat())}
          aria-expanded={open}
          aria-label={open ? "Close chat" : "Open chat with ShrotiHost Assistant"}
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.94 }}
          className="relative inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand-purple to-brand-blue text-white shadow-[0_8px_24px_-6px_rgb(168_16_199/0.55)]"
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={open ? "close" : "chat"}
              initial={{ opacity: 0, rotate: -45, scale: 0.7 }}
              animate={{ opacity: 1, rotate: 0, scale: 1 }}
              exit={{ opacity: 0, rotate: 45, scale: 0.7 }}
              transition={{ duration: 0.18 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              {open ? <X size={22} aria-hidden="true" /> : <Bot size={24} aria-hidden="true" />}
            </motion.span>
          </AnimatePresence>
          {!open && (
            <span
              className="absolute -right-0.5 -top-0.5 h-3 w-3 rounded-full border-2 border-white/90 bg-success"
              aria-hidden="true"
            />
          )}
        </motion.button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="ShrotiHost Assistant"
            onKeyDown={(e) => {
              if (e.key === "Escape") setOpen(false);
            }}
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.96 }}
            transition={{ duration: 0.2, ease: [0.33, 1, 0.68, 1] }}
            className="fixed bottom-24 right-5 z-[60] flex h-[32rem] max-h-[75vh] w-[calc(100vw-2.5rem)] max-w-sm flex-col overflow-hidden rounded-2xl border border-border-strong bg-bg shadow-2xl sm:bottom-28 sm:right-6 [.has-mobile-cta_&]:bottom-[8.5rem] lg:[.has-mobile-cta_&]:bottom-28"
          >
            <div className="flex items-center gap-3 border-b border-border bg-surface px-5 py-4">
              {screen !== "menu" ? (
                <button
                  type="button"
                  onClick={goToMenu}
                  aria-label="Back to menu"
                  className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-text-muted hover:bg-surface-raised hover:text-text-primary"
                >
                  <ArrowLeft size={16} aria-hidden="true" />
                </button>
              ) : (
                <div className="relative inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand-purple to-brand-blue text-white">
                  <Bot size={18} aria-hidden="true" />
                  <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full border-2 border-surface bg-success" />
                </div>
              )}
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-text-primary">ShrotiHost Assistant</p>
                <p className="text-xs text-text-muted">
                  {screen === "quiz" ? "Guided plan recommendation" : screen === "faq" ? "Quick questions" : "How can I help?"}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close chat"
                className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-text-muted hover:bg-surface-raised hover:text-text-primary"
              >
                <X size={16} aria-hidden="true" />
              </button>
            </div>

            {screen === "quiz" && (
              <div className="h-1 w-full shrink-0 bg-border">
                <motion.div
                  className="h-full bg-gradient-to-r from-brand-purple to-brand-blue"
                  initial={false}
                  animate={{ width: `${(Math.min(step, questions.length) / questions.length) * 100}%` }}
                  transition={{ duration: 0.3, ease: [0.33, 1, 0.68, 1] }}
                />
              </div>
            )}

            <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto p-5">
              <div className="flex justify-start">
                <div className="flex items-start gap-2">
                  <ChatAvatar />
                  <div className="rounded-2xl rounded-tl-sm bg-surface px-4 py-2.5 text-sm text-text-primary">
                    Hi 👋 I&apos;m the ShrotiHost assistant. I can help you pick a plan, answer quick
                    questions, or point you to the right place.
                  </div>
                </div>
              </div>

              {screen === "menu" && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex flex-col gap-2 pl-9"
                >
                  <MenuButton icon={Sparkles} label="Help me pick a plan" onClick={startQuiz} />
                  <MenuButton icon={HelpCircle} label="Quick questions" onClick={startFaq} />
                  <MenuButton icon={Globe} label="Check domain pricing" href="/domains" onClick={() => setOpen(false)} />
                  <MenuButton
                    icon={LifeBuoy}
                    label="Talk to support"
                    href="https://portal.shrotihost.in/submitticket.php"
                    onClick={() => setOpen(false)}
                  />
                </motion.div>
              )}

              {screen === "faq" && (
                <>
                  {faqHistory.map((item, i) => (
                    <div key={i} className="space-y-3">
                      <div className="flex justify-end">
                        <div className="rounded-2xl rounded-tr-sm bg-brand-purple px-4 py-2.5 text-sm text-white">
                          {item.question}
                        </div>
                      </div>
                      <div className="flex justify-start">
                        <div className="flex items-start gap-2">
                          <ChatAvatar />
                          <div className="max-w-[85%] rounded-2xl rounded-tl-sm bg-surface px-4 py-2.5 text-sm text-text-primary">
                            {item.answer}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className="flex flex-col items-end gap-2"
                  >
                    {faqs.map((faq) => (
                      <button
                        key={faq.question}
                        type="button"
                        onClick={() => askFaq(faq.question, faq.answer)}
                        className="max-w-[90%] rounded-full border border-border-strong px-3 py-1.5 text-right text-xs font-medium text-text-primary transition-colors hover:border-brand-purple hover:bg-brand-purple/5 sm:text-sm"
                      >
                        {faq.question}
                      </button>
                    ))}
                  </motion.div>
                </>
              )}

              {screen === "quiz" && thinking && (
                <div className="flex justify-start">
                  <div className="flex items-start gap-2">
                    <ChatAvatar />
                    <div className="flex items-center gap-1 rounded-2xl rounded-tl-sm bg-surface px-4 py-3">
                      {[0, 1, 2].map((i) => (
                        <motion.span
                          key={i}
                          className="h-1.5 w-1.5 rounded-full bg-text-muted"
                          animate={{ opacity: [0.3, 1, 0.3] }}
                          transition={{ duration: 1, repeat: Infinity, delay: i * 0.15 }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {history.map((item, i) => (
                <div key={i} className="space-y-3">
                  <div className="flex justify-start">
                    <div className="flex items-start gap-2">
                      <ChatAvatar />
                      <div className="rounded-2xl rounded-tl-sm bg-surface px-4 py-2.5 text-sm text-text-primary">
                        {item.question}
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <div className="rounded-2xl rounded-tr-sm bg-brand-purple px-4 py-2.5 text-sm text-white">
                      {item.answer}
                    </div>
                  </div>
                </div>
              ))}

              {screen === "quiz" && !thinking && !isDone && (
                <AnimatePresence mode="wait">
                  <motion.div
                    key={questions[step].id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25 }}
                    className="space-y-3"
                  >
                    <div className="flex justify-start">
                      <div className="flex items-start gap-2">
                        <ChatAvatar />
                        <div className="min-h-[2.25rem] rounded-2xl rounded-tl-sm bg-surface px-4 py-2.5 text-sm text-text-primary">
                          <Typewriter text={questions[step].prompt} onDone={() => setPromptTyped(true)} />
                        </div>
                      </div>
                    </div>
                    {promptTyped && (
                      <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={{ visible: { transition: { staggerChildren: 0.06 } } }}
                        className="flex flex-wrap gap-2 pl-10"
                      >
                        {questions[step].options.map((option) => (
                          <motion.button
                            key={option.label}
                            type="button"
                            onClick={() => answer(option)}
                            variants={{
                              hidden: { opacity: 0, y: 8 },
                              visible: { opacity: 1, y: 0, transition: { duration: 0.2, ease: [0.33, 1, 0.68, 1] } },
                            }}
                            className="rounded-full border border-border-strong px-3 py-1.5 text-xs font-medium text-text-primary transition-colors hover:border-brand-purple hover:bg-brand-purple/5 sm:text-sm"
                          >
                            {option.label}
                          </motion.button>
                        ))}
                      </motion.div>
                    )}
                  </motion.div>
                </AnimatePresence>
              )}

              {isDone && !thinking && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex justify-start"
                >
                  <div className="flex items-start gap-2">
                    <ChatAvatar />
                    <div className="max-w-xs rounded-2xl rounded-tl-sm bg-surface px-4 py-4">
                      <p className="text-sm text-text-secondary">Based on your answers, I&apos;d recommend</p>
                      <p className="mt-1 text-2xl font-semibold text-brand-purple">{plan.name}</p>
                      <p className="mt-1 text-sm text-text-secondary">{plan.tagline}</p>
                      <p className="mt-2 text-lg font-semibold text-text-primary">
                        {format(plan.monthlyPrice)}
                        <span className="text-xs font-normal text-text-muted">/mo</span>
                      </p>
                      <ul className="mt-3 space-y-1.5">
                        {plan.features.slice(0, 4).map((f) => (
                          <li key={f} className="flex items-center gap-2 text-xs text-text-secondary">
                            <Check size={14} className="shrink-0 text-success" aria-hidden="true" />
                            {f}
                          </li>
                        ))}
                      </ul>
                      <div className="mt-4 flex flex-wrap gap-2">
                        <Button href="/hosting" size="md" onClick={() => setOpen(false)}>
                          Buy Now
                        </Button>
                        <Button href="/hosting#compare" variant="secondary" size="md" onClick={() => setOpen(false)}>
                          Compare Plans
                        </Button>
                      </div>
                      <button
                        type="button"
                        onClick={restart}
                        className="mt-3 text-xs text-text-muted underline underline-offset-4 hover:text-text-secondary"
                      >
                        Start over
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function ChatAvatar() {
  return (
    <div className="mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand-purple to-brand-blue text-white">
      <Bot size={14} aria-hidden="true" />
    </div>
  );
}

function MenuButton({
  icon: Icon,
  label,
  onClick,
  href,
}: {
  icon: typeof Sparkles;
  label: string;
  onClick?: () => void;
  href?: string;
}) {
  const className =
    "flex items-center gap-2.5 rounded-xl border border-border-strong bg-surface px-4 py-2.5 text-left text-sm font-medium text-text-primary transition-colors hover:border-brand-purple hover:bg-brand-purple/5";

  if (href) {
    return (
      <a href={href} onClick={onClick} className={className} target={href.startsWith("http") ? "_blank" : undefined} rel={href.startsWith("http") ? "noopener noreferrer" : undefined}>
        <Icon size={16} className="shrink-0 text-brand-purple" aria-hidden="true" />
        {label}
      </a>
    );
  }

  return (
    <button type="button" onClick={onClick} className={className}>
      <Icon size={16} className="shrink-0 text-brand-purple" aria-hidden="true" />
      {label}
    </button>
  );
}
