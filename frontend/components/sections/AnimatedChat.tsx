"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Zap, Send } from "lucide-react";

interface ChatMessage {
  id: string;
  sender: "customer" | "bot" | "agent";
  text: string;
}

export function AnimatedChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [typingSender, setTypingSender] = useState<"customer" | "bot" | null>(
    null
  );
  const [typingText, setTypingText] = useState("");
  const [isBotTypingIndicator, setIsBotTypingIndicator] = useState(false);
  const [agentJoined, setAgentJoined] = useState(false);
  const prefersReducedMotion = useReducedMotion();
  const chatBodyRef = useRef<HTMLDivElement>(null);

  // Keep chat scrolled to bottom exclusively inside the chat container
  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [messages, typingText, isBotTypingIndicator, agentJoined]);

  // Main Script Loop
  useEffect(() => {
    let isCancelled = false;

    // Helper: Delay with cancellation guard
    const delay = (ms: number) =>
      new Promise<void>((resolve) => {
        const timer = setTimeout(() => {
          if (!isCancelled) resolve();
        }, ms);
        return () => clearTimeout(timer);
      });

    // Helper: Typewriter effect character by character
    const typeMessage = async (
      sender: "customer" | "bot",
      fullText: string,
      speed = 25
    ) => {
      if (isCancelled) return;
      setTypingSender(sender);
      setTypingText("");

      for (let i = 1; i <= fullText.length; i++) {
        if (isCancelled) return;
        setTypingText(fullText.slice(0, i));
        await delay(speed);
      }

      if (isCancelled) return;
      setMessages((prev) => [
        ...prev,
        { id: Math.random().toString(), sender, text: fullText },
      ]);
      setTypingSender(null);
      setTypingText("");
    };

    const runScript = async () => {
      while (!isCancelled) {
        // Reset to initial state
        setMessages([]);
        setTypingSender(null);
        setTypingText("");
        setIsBotTypingIndicator(false);
        setAgentJoined(false);

        await delay(1200);
        if (isCancelled) break;

        // Message 1: Customer asks question
        await typeMessage(
          "customer",
          "Hi! Can KnowBridge handle multi-tenant setups?"
        );
        await delay(600);
        if (isCancelled) break;

        // Message 2: Bot thinks (3 bouncing dots)
        setIsBotTypingIndicator(true);
        await delay(1400);
        if (isCancelled) break;
        setIsBotTypingIndicator(false);

        // Bot answers
        await typeMessage(
          "bot",
          "Yes! Every tenant has complete data isolation with unique UUIDs. Your data is never mixed."
        );
        await delay(1000);
        if (isCancelled) break;

        // Message 3: Customer follow-up
        await typeMessage(
          "customer",
          "Can I talk to someone about enterprise pricing?"
        );
        await delay(600);
        if (isCancelled) break;

        // Bot responds with handoff trigger
        setIsBotTypingIndicator(true);
        await delay(1200);
        if (isCancelled) break;
        setIsBotTypingIndicator(false);

        await typeMessage(
          "bot",
          "Connecting you with our sales team right now..."
        );
        await delay(800);
        if (isCancelled) break;

        // Handoff: Sarah joins
        setAgentJoined(true);
        await delay(1200);
        if (isCancelled) break;

        // Message 4: Agent greeting
        setMessages((prev) => [
          ...prev,
          {
            id: Math.random().toString(),
            sender: "agent",
            text: "Hi! Sarah here from KnowBridge. I see you're asking about enterprise pricing. Happy to help!",
          },
        ]);

        // Hold completed view before restarting loop
        await delay(5000);
      }
    };

    runScript();

    return () => {
      isCancelled = true;
    };
  }, []);

  return (
    <motion.div
      animate={
        prefersReducedMotion
          ? {}
          : {
              y: [0, -6, 0],
            }
      }
      transition={{
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      className="w-full max-w-[420px] mx-auto rounded-card border border-zinc-200 bg-white shadow-xl shadow-zinc-900/5 overflow-hidden flex flex-col h-[500px]"
    >
      {/* Header Bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-zinc-50 border-b border-zinc-200">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-full bg-zinc-900 flex items-center justify-center">
            <Zap className="w-3.5 h-3.5 text-white" />
          </div>
          <div>
            <div className="text-xs font-semibold text-zinc-900 flex items-center gap-1.5">
              <span>KnowBridge Assistant</span>
            </div>
            <div className="flex items-center gap-1.5 text-[10px] text-zinc-500">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Online · Instant replies</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-700 bg-zinc-100 px-2 py-0.5 rounded-full border border-zinc-200">
            AI + Human
          </span>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div
        ref={chatBodyRef}
        className="flex-1 p-4 overflow-y-auto space-y-3 flex flex-col justify-start scroll-smooth bg-white"
      >
        {messages.map((m) => {
          if (m.sender === "customer") {
            return (
              <div key={m.id} className="flex justify-end">
                <div className="bg-zinc-900 text-white text-xs md:text-sm px-3.5 py-2.5 rounded-2xl rounded-tr-xs max-w-[82%] shadow-xs leading-relaxed font-medium">
                  {m.text}
                </div>
              </div>
            );
          }

          if (m.sender === "bot") {
            return (
              <div key={m.id} className="flex items-start gap-2 justify-start">
                <div className="w-5 h-5 rounded-full bg-zinc-200 flex items-center justify-center shrink-0 mt-1">
                  <Zap className="w-3 h-3 text-zinc-800" />
                </div>
                <div className="bg-zinc-100 text-zinc-800 border border-zinc-200/80 text-xs md:text-sm px-3.5 py-2.5 rounded-2xl rounded-tl-xs max-w-[85%] leading-relaxed">
                  {m.text}
                </div>
              </div>
            );
          }

          // agent
          return (
            <div key={m.id} className="flex items-start gap-2 justify-start">
              <div className="w-5 h-5 rounded-full bg-zinc-900 text-white flex items-center justify-center shrink-0 mt-1 text-[10px] font-bold">
                S
              </div>
              <div className="bg-zinc-100 text-zinc-800 border border-zinc-200 text-xs md:text-sm px-3.5 py-2.5 rounded-2xl rounded-tl-xs max-w-[85%] leading-relaxed">
                <div className="text-[10px] text-zinc-600 font-semibold mb-0.5">
                  Sarah · Live Agent
                </div>
                {m.text}
              </div>
            </div>
          );
        })}

        {/* Active Typing Message Bubble */}
        {typingSender && typingText && (
          <div
            className={`flex ${
              typingSender === "customer" ? "justify-end" : "justify-start gap-2"
            }`}
          >
            {typingSender !== "customer" && (
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-1 ${
                  typingSender === "bot"
                    ? "bg-zinc-200 text-zinc-800"
                    : "bg-zinc-900 text-white text-[10px] font-bold"
                }`}
              >
                {typingSender === "bot" ? (
                  <Zap className="w-3 h-3 text-zinc-800" />
                ) : (
                  "S"
                )}
              </div>
            )}
            <div
              className={`text-xs md:text-sm px-3.5 py-2.5 rounded-2xl leading-relaxed ${
                typingSender === "customer"
                  ? "bg-zinc-900 text-white font-medium rounded-tr-xs max-w-[82%]"
                  : "bg-zinc-100 text-zinc-800 border border-zinc-200/80 rounded-tl-xs max-w-[85%]"
              }`}
            >
              {typingText}
              <span className="inline-block w-1 h-3.5 ml-1 bg-current animate-pulse align-middle" />
            </div>
          </div>
        )}

        {/* Bot Typing Indicator (Bouncing Dots) */}
        {isBotTypingIndicator && (
          <div className="flex items-center gap-2 justify-start">
            <div className="w-5 h-5 rounded-full bg-zinc-200 flex items-center justify-center shrink-0">
              <Zap className="w-3 h-3 text-zinc-800" />
            </div>
            <div className="bg-zinc-100 border border-zinc-200 px-3 py-2 rounded-2xl rounded-tl-xs flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 animate-bounce [animation-delay:-0.3s]" />
              <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 animate-bounce [animation-delay:-0.15s]" />
              <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 animate-bounce" />
            </div>
          </div>
        )}

        {/* Agent Joined Pill Badge */}
        {agentJoined && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="flex justify-center my-1"
          >
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-medium bg-zinc-100 text-zinc-800 border border-zinc-200 shadow-2xs">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Sarah (Support) has joined
            </span>
          </motion.div>
        )}
      </div>

      {/* Mock Footer / Input Area */}
      <div className="p-3 bg-zinc-50 border-t border-zinc-200 flex items-center gap-2">
        <div className="flex-1 bg-white border border-zinc-200 rounded-btn px-3 py-2 text-xs text-zinc-400 flex items-center justify-between">
          <span>Type a message...</span>
        </div>
        <button
          type="button"
          disabled
          aria-label="Send message"
          className="w-8 h-8 rounded-btn bg-zinc-900 text-white flex items-center justify-center cursor-not-allowed"
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </div>
    </motion.div>
  );
}
