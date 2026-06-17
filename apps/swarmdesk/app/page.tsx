'use client';
import { useState, useEffect } from 'react';
import { useChat } from 'ai/react';
import { motion, AnimatePresence } from 'framer-motion';

const SEGMENTS = [
  { id: 'main', label: 'Company Memory', icon: '🏢', gradient: 'from-teal-500 to-cyan-400' },
  { id: 'billing', label: 'Billing', icon: '💳', gradient: 'from-blue-500 to-teal-400' },
  { id: 'technical', label: 'Technical', icon: '⚙️', gradient: 'from-cyan-500 to-teal-400' },
  { id: 'enterprise', label: 'Enterprise', icon: '🏆', gradient: 'from-teal-600 to-emerald-400' },
  { id: 'onboarding', label: 'Onboarding', icon: '🚀', gradient: 'from-emerald-500 to-teal-400' },
];

const TICKETS = [
  { id: 1, segment: 'billing', user: 'Amara O.', avatar: 'AO', issue: 'I was charged twice for my June subscription.', time: '2m ago' },
  { id: 2, segment: 'technical', user: 'Chidi N.', avatar: 'CN', issue: 'My API key stopped working after the latest update.', time: '8m ago' },
  { id: 3, segment: 'enterprise', user: 'Ngozi A.', avatar: 'NA', issue: 'We need our SLA response time confirmed in writing.', time: '15m ago' },
  { id: 4, segment: 'onboarding', user: 'Emeka B.', avatar: 'EB', issue: 'Do I need a credit card to start the free trial?', time: '22m ago' },
];

export default function Home() {
  const [branch, setBranch] = useState('main');
  const [dark, setDark] = useState(true);
  const [seeded, setSeeded] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [merging, setMerging] = useState(false);
  const [mergeResult, setMergeResult] = useState('');
  const [activeTicket, setActiveTicket] = useState<number | null>(null);

  const seg = SEGMENTS.find(s => s.id === branch)!;

  const { messages, input, handleInputChange, handleSubmit, isLoading, setMessages, append } = useChat({
    api: '/api/chat',
    body: { branch },
  });

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [dark]);

  async function seedBranches() {
    setSeeding(true);
    const res = await fetch('/api/seed', { method: 'POST' });
    const data = await res.json();
    setSeeded(data.success);
    setSeeding(false);
  }

  async function mergeBranch(from: string) {
    setMerging(true);
    setMergeResult('');
    const res = await fetch('/api/merge', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ from, into: 'main' }),
    });
    const data = await res.json();
    setMergeResult(data.success ? from + ' merged into company memory' : 'Failed: ' + data.error);
    setMerging(false);
  }

  function loadTicket(ticket: any) {
    setBranch(ticket.segment);
    setActiveTicket(ticket.id);
    setMessages([]);
    setTimeout(() => {
      append({ role: 'user', content: ticket.issue });
    }, 100);
  }

  const d = dark;

  return (
    <div className={`min-h-screen transition-colors duration-300 ${d ? 'bg-[#050d0d] text-white' : 'bg-[#f0fafa] text-gray-900'}`}>
      {/* Ambient background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className={`absolute -top-40 -left-40 w-96 h-96 rounded-full blur-3xl opacity-20 ${d ? 'bg-teal-500' : 'bg-teal-300'}`} />
        <div className={`absolute top-1/2 -right-40 w-80 h-80 rounded-full blur-3xl opacity-10 ${d ? 'bg-cyan-400' : 'bg-cyan-200'}`} />
        <div className={`absolute bottom-0 left-1/3 w-64 h-64 rounded-full blur-3xl opacity-10 ${d ? 'bg-teal-600' : 'bg-teal-200'}`} />
      </div>

      {/* Header */}
      <header className={`relative z-10 border-b px-6 py-4 flex items-center justify-between backdrop-blur-sm ${d ? 'border-teal-900/40 bg-[#050d0d]/80' : 'border-teal-200/60 bg-white/80'}`}>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-teal-400 to-cyan-500 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-teal-500/30">
            S
          </div>
          <div>
            <span className="text-base font-bold tracking-tight">SwarmDesk</span>
            <span className={`text-xs ml-2 ${d ? 'text-teal-400' : 'text-teal-600'}`}>AI Support Intelligence</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={seedBranches}
            disabled={seeding || seeded}
            className={`text-xs px-4 py-2 rounded-lg font-medium transition border ${seeded ? (d ? 'border-teal-700 text-teal-400 bg-teal-900/20' : 'border-teal-300 text-teal-600 bg-teal-50') : (d ? 'border-teal-600 text-white bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-500 hover:to-cyan-500 shadow-lg shadow-teal-900/40' : 'border-teal-400 text-white bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 shadow-lg shadow-teal-200/60')} disabled:opacity-40`}>
            {seeded ? '✓ Memory Seeded' : seeding ? 'Seeding...' : 'Seed Memory'}
          </motion.button>
          <button
            onClick={() => setDark(!d)}
            className={`w-9 h-9 rounded-lg flex items-center justify-center transition ${d ? 'bg-teal-900/40 hover:bg-teal-800/40 text-teal-300' : 'bg-teal-100 hover:bg-teal-200 text-teal-700'}`}>
            {d ? '☀️' : '🌙'}
          </button>
        </div>
      </header>

      <div className="flex h-[calc(100vh-65px)] relative z-10">
        {/* Sidebar */}
        <aside className={`w-64 border-r flex flex-col gap-4 p-4 overflow-y-auto ${d ? 'border-teal-900/40 bg-[#050d0d]/60' : 'border-teal-200/60 bg-white/60'} backdrop-blur-sm`}>
          {/* Segments */}
          <div>
            <p className={`text-[10px] font-semibold uppercase tracking-widest mb-3 ${d ? 'text-teal-500' : 'text-teal-600'}`}>Segments</p>
            <div className="space-y-1">
              {SEGMENTS.map(s => (
                <motion.button
                  key={s.id}
                  whileHover={{ x: 3 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => { setBranch(s.id); setMessages([]); setActiveTicket(null); }}
                  className={`w-full text-left px-3 py-2.5 rounded-xl text-sm flex items-center gap-2.5 transition-all ${branch === s.id
                    ? `bg-gradient-to-r ${s.gradient} text-white shadow-lg shadow-teal-900/30`
                    : d ? 'hover:bg-teal-900/30 text-gray-400 hover:text-white' : 'hover:bg-teal-50 text-gray-500 hover:text-gray-900'
                  }`}>
                  <span className="text-base">{s.icon}</span>
                  <span className="font-medium">{s.label}</span>
                  {branch === s.id && (
                    <motion.span layoutId="activeDot" className="ml-auto w-1.5 h-1.5 rounded-full bg-white/80" />
                  )}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Tickets */}
          <div>
            <p className={`text-[10px] font-semibold uppercase tracking-widest mb-3 ${d ? 'text-teal-500' : 'text-teal-600'}`}>Ticket Inbox</p>
            <div className="space-y-2">
              {TICKETS.map(t => {
                const ts = SEGMENTS.find(s => s.id === t.segment);
                return (
                  <motion.button
                    key={t.id}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => loadTicket(t)}
                    className={`w-full text-left px-3 py-2.5 rounded-xl text-xs transition-all border ${activeTicket === t.id
                      ? d ? 'border-teal-500/50 bg-teal-900/30' : 'border-teal-400/50 bg-teal-50'
                      : d ? 'border-teal-900/30 hover:border-teal-700/50 hover:bg-teal-900/20' : 'border-teal-200/50 hover:border-teal-300 hover:bg-teal-50/50'
                    }`}>
                    <div className="flex items-center gap-2 mb-1">
                      <div className={`w-6 h-6 rounded-lg bg-gradient-to-br ${ts?.gradient} flex items-center justify-center text-white text-[9px] font-bold`}>
                        {t.avatar}
                      </div>
                      <span className={`font-semibold ${d ? 'text-white' : 'text-gray-800'}`}>{t.user}</span>
                      <span className={`ml-auto ${d ? 'text-gray-600' : 'text-gray-400'}`}>{t.time}</span>
                    </div>
                    <p className={`truncate ${d ? 'text-gray-400' : 'text-gray-500'}`}>{t.issue}</p>
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Merge */}
          <div>
            <p className={`text-[10px] font-semibold uppercase tracking-widest mb-3 ${d ? 'text-teal-500' : 'text-teal-600'}`}>Merge to Main</p>
            <div className="space-y-1">
              {SEGMENTS.filter(s => s.id !== 'main').map(s => (
                <motion.button
                  key={s.id}
                  whileHover={{ x: 3 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => mergeBranch(s.id)}
                  disabled={merging}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium flex items-center gap-2 transition-all border disabled:opacity-40 ${d ? 'border-teal-900/30 hover:border-teal-600/50 hover:bg-teal-900/20 text-gray-400 hover:text-teal-300' : 'border-teal-200/50 hover:border-teal-400 hover:bg-teal-50 text-gray-500 hover:text-teal-700'}`}>
                  <span>↗</span> Merge {s.label}
                </motion.button>
              ))}
            </div>
            <AnimatePresence>
              {mergeResult && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className={`text-xs mt-2 px-2 py-1.5 rounded-lg ${d ? 'text-teal-400 bg-teal-900/30' : 'text-teal-700 bg-teal-50'}`}>
                  ✓ {mergeResult}
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        </aside>

        {/* Chat area */}
        <main className="flex-1 flex flex-col">
          {/* Branch bar */}
          <div className={`px-6 py-3 border-b flex items-center gap-3 ${d ? 'border-teal-900/40 bg-[#050d0d]/40' : 'border-teal-200/40 bg-white/40'} backdrop-blur-sm`}>
            <span className={`text-xs px-3 py-1 rounded-full font-semibold bg-gradient-to-r ${seg.gradient} text-white shadow-sm`}>
              {seg.icon} {seg.label}
            </span>
            <span className={`text-xs font-mono ${d ? 'text-teal-600' : 'text-teal-500'}`}>{branch}</span>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4">
            <AnimatePresence>
              {messages.length === 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center mt-24">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center text-3xl mx-auto mb-4 shadow-xl shadow-teal-900/30`}>
                    🧠
                  </div>
                  <p className={`text-sm font-medium ${d ? 'text-gray-400' : 'text-gray-500'}`}>Select a ticket or ask a support question</p>
                  <p className={`text-xs mt-1 ${d ? 'text-gray-600' : 'text-gray-400'}`}>Memory scoped to <span className="text-teal-500 font-mono">{branch}</span></p>
                </motion.div>
              )}
              {messages.map((m, i) => (
                <motion.div
                  key={m.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.02 }}
                  className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-lg px-4 py-3 rounded-2xl text-sm leading-relaxed ${m.role === 'user'
                    ? 'bg-gradient-to-br from-teal-500 to-cyan-500 text-white shadow-lg shadow-teal-900/30'
                    : d ? 'bg-[#0a1a1a] border border-teal-900/40 text-gray-200' : 'bg-white border border-teal-200/60 text-gray-700 shadow-sm'
                  }`}>
                    {m.content}
                  </div>
                </motion.div>
              ))}
              {isLoading && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                  <div className={`px-4 py-3 rounded-2xl text-sm ${d ? 'bg-[#0a1a1a] border border-teal-900/40 text-teal-400' : 'bg-white border border-teal-200/60 text-teal-600'}`}>
                    <span className="inline-flex gap-1">
                      <span className="w-1.5 h-1.5 bg-teal-400 rounded-full animate-bounce" style={{animationDelay:'0ms'}} />
                      <span className="w-1.5 h-1.5 bg-teal-400 rounded-full animate-bounce" style={{animationDelay:'150ms'}} />
                      <span className="w-1.5 h-1.5 bg-teal-400 rounded-full animate-bounce" style={{animationDelay:'300ms'}} />
                    </span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Input */}
          <form onSubmit={handleSubmit} className={`px-6 py-4 border-t flex gap-3 items-center ${d ? 'border-teal-900/40 bg-[#050d0d]/60' : 'border-teal-200/40 bg-white/60'} backdrop-blur-sm`}>
            <input
              value={input}
              onChange={handleInputChange}
              placeholder={`Ask the ${seg.label} agent...`}
              className={`flex-1 rounded-xl px-4 py-3 text-sm outline-none transition border ${d
                ? 'bg-[#0a1a1a] border-teal-900/40 text-white placeholder-gray-600 focus:border-teal-500/60 focus:ring-1 focus:ring-teal-500/20'
                : 'bg-white border-teal-200/60 text-gray-900 placeholder-gray-400 focus:border-teal-400 focus:ring-1 focus:ring-teal-200'
              }`}
            />
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              type="submit"
              disabled={isLoading || !input.trim()}
              className="px-5 py-3 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 disabled:opacity-40 rounded-xl text-sm font-semibold text-white transition shadow-lg shadow-teal-900/30">
              Send
            </motion.button>
          </form>
        </main>
      </div>
    </div>
  );
}
