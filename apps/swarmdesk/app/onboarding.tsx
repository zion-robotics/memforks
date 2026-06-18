
'use client';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const TOUR_STEPS = [
  {
    title: 'Welcome to SwarmDesk 👋',
    content: 'SwarmDesk is an AI-powered customer support dashboard where specialized agents handle different customer segments — each with their own isolated memory branch.',
    icon: '🧠',
  },
  {
    title: 'Branch-Aware Memory',
    content: 'Each segment (Billing, Technical, Enterprise, Onboarding) has its own memory branch powered by MemForks on the Sui blockchain. Agents only know what their branch knows.',
    icon: '🌿',
  },
  {
    title: 'Ticket Inbox',
    content: 'Click any ticket in the left sidebar to load a real customer issue. The agent for that segment will automatically respond using its branch memory.',
    icon: '🎫',
  },
  {
    title: 'The Magic — Merge',
    content: 'When an agent learns something valuable, scroll down in the sidebar and click Merge to push that knowledge into Company Memory. Ask the same question before and after — watch it improve!',
    icon: '🔀',
  },
  {
    title: 'You are ready! 🚀',
    content: 'Start by clicking Seed Memory (top right), then pick a segment or ticket. Use the chat bubble anytime to ask questions about SwarmDesk.',
    icon: '✅',
  },
];

export function TourModal({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState(0);
  const current = TOUR_STEPS[step];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-[#050d0d] border border-teal-800/50 rounded-2xl p-6 max-w-md w-full shadow-2xl shadow-teal-900/40">
        <div className="flex justify-between items-start mb-4">
          <div className="flex gap-1">
            {TOUR_STEPS.map((_, i) => (
              <div key={i} className={`h-1 rounded-full transition-all ${i === step ? 'w-6 bg-teal-400' : 'w-2 bg-teal-900'}`} />
            ))}
          </div>
          <button onClick={onClose} className="text-gray-600 hover:text-gray-400 text-sm">✕</button>
        </div>
        <div className="text-4xl mb-4">{current.icon}</div>
        <h2 className="text-lg font-bold text-white mb-2">{current.title}</h2>
        <p className="text-sm text-gray-400 leading-relaxed mb-6">{current.content}</p>
        <div className="flex gap-3">
          {step > 0 && (
            <button onClick={() => setStep(step - 1)} className="flex-1 py-2.5 rounded-xl border border-teal-900/40 text-sm text-gray-400 hover:text-white hover:border-teal-700 transition">
              Back
            </button>
          )}
          <button
            onClick={() => step === TOUR_STEPS.length - 1 ? onClose() : setStep(step + 1)}
            className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 text-white text-sm font-semibold hover:from-teal-400 hover:to-cyan-400 transition shadow-lg shadow-teal-900/30">
            {step === TOUR_STEPS.length - 1 ? 'Start Using SwarmDesk' : 'Next'}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export function ChatBubble({ dark }: { dark: boolean }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([
    { role: 'assistant', content: 'Hi! I am the SwarmDesk guide 👋 Ask me anything about how to use this app.' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  async function send() {
    if (!input.trim() || loading) return;
    const userMsg = { role: 'user', content: input };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');
    setLoading(true);
    try {
      const res = await fetch('/api/onboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages }),
      });
      const data = await res.json();
      setMessages([...newMessages, { role: 'assistant', content: data.text }]);
    } catch {
      setMessages([...newMessages, { role: 'assistant', content: 'Sorry, something went wrong. Try again!' }]);
    }
    setLoading(false);
  }

  const d = dark;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className={`w-80 rounded-2xl border shadow-2xl overflow-hidden ${d ? 'bg-[#050d0d] border-teal-800/50 shadow-teal-900/40' : 'bg-white border-teal-200/60 shadow-teal-200/40'}`}>
            <div className="px-4 py-3 bg-gradient-to-r from-teal-600 to-cyan-600 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-lg">🧠</span>
                <div>
                  <p className="text-white text-sm font-semibold">SwarmDesk Guide</p>
                  <p className="text-teal-200 text-[10px]">Ask me anything</p>
                </div>
              </div>
              <button onClick={() => setOpen(false)} className="text-white/70 hover:text-white text-sm">✕</button>
            </div>
            <div className="h-64 overflow-y-auto p-3 space-y-3">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] px-3 py-2 rounded-xl text-xs leading-relaxed ${m.role === 'user'
                    ? 'bg-gradient-to-br from-teal-500 to-cyan-500 text-white'
                    : d ? 'bg-teal-900/30 border border-teal-800/40 text-gray-300' : 'bg-teal-50 border border-teal-200/50 text-gray-700'}`}>
                    {m.content}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className={`px-3 py-2 rounded-xl ${d ? 'bg-teal-900/30 border border-teal-800/40' : 'bg-teal-50 border border-teal-200/50'}`}>
                    <span className="inline-flex gap-1">
                      <span className="w-1.5 h-1.5 bg-teal-400 rounded-full animate-bounce" style={{animationDelay:'0ms'}} />
                      <span className="w-1.5 h-1.5 bg-teal-400 rounded-full animate-bounce" style={{animationDelay:'150ms'}} />
                      <span className="w-1.5 h-1.5 bg-teal-400 rounded-full animate-bounce" style={{animationDelay:'300ms'}} />
                    </span>
                  </div>
                </div>
              )}
              <div ref={endRef} />
            </div>
            <div className={`p-3 border-t flex gap-2 ${d ? 'border-teal-900/40' : 'border-teal-200/40'}`}>
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && send()}
                placeholder="Ask about SwarmDesk..."
                className={`flex-1 text-xs px-3 py-2 rounded-lg outline-none border ${d ? 'bg-teal-900/20 border-teal-800/40 text-white placeholder-gray-600 focus:border-teal-600' : 'bg-teal-50 border-teal-200 text-gray-800 placeholder-gray-400 focus:border-teal-400'}`} />
              <button onClick={send} disabled={loading || !input.trim()}
                className="px-3 py-2 bg-gradient-to-r from-teal-500 to-cyan-500 text-white text-xs rounded-lg disabled:opacity-40 font-medium">
                →
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpen(!open)}
        className="w-12 h-12 rounded-full bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center text-white shadow-xl shadow-teal-900/40 text-xl">
        {open ? '✕' : '💬'}
      </motion.button>
    </div>
  );
}
