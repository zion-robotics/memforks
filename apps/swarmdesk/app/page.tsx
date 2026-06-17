'use client';
import { useState } from 'react';
import { useChat } from 'ai/react';

const SEGMENTS = [
  { id: 'main', label: 'Company Memory', color: 'bg-violet-600', light: 'bg-violet-50 text-violet-700' },
  { id: 'billing', label: 'Billing', color: 'bg-blue-600', light: 'bg-blue-50 text-blue-700' },
  { id: 'technical', label: 'Technical', color: 'bg-emerald-600', light: 'bg-emerald-50 text-emerald-700' },
  { id: 'enterprise', label: 'Enterprise', color: 'bg-amber-600', light: 'bg-amber-50 text-amber-700' },
  { id: 'onboarding', label: 'Onboarding', color: 'bg-rose-600', light: 'bg-rose-50 text-rose-700' },
];

const TICKETS = [
  { id: 1, segment: 'billing', user: 'Amara O.', issue: 'I was charged twice for my June subscription.' },
  { id: 2, segment: 'technical', user: 'Chidi N.', issue: 'My API key stopped working after the latest update.' },
  { id: 3, segment: 'enterprise', user: 'Ngozi A.', issue: 'We need our SLA response time confirmed in writing.' },
  { id: 4, segment: 'onboarding', user: 'Emeka B.', issue: 'Do I need a credit card to start the free trial?' },
];

export default function Home() {
  const [branch, setBranch] = useState('support/main');
  const [seeded, setSeeded] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [merging, setMerging] = useState(false);
  const [mergeResult, setMergeResult] = useState('');
  const [activeTicket, setActiveTicket] = useState(null);

  const { messages, input, handleInputChange, handleSubmit, isLoading, setMessages } = useChat({
    api: '/api/chat',
    body: { branch },
  });

  const seg = SEGMENTS.find(s => s.id === branch);

  async function seedBranches() {
    setSeeding(true);
    const res = await fetch('/api/seed', { method: 'POST' });
    const data = await res.json();
    setSeeded(data.success);
    setSeeding(false);
  }

  async function mergeBranch(from) {
    setMerging(true);
    setMergeResult('');
    const res = await fetch('/api/merge', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ from, into: 'support/main' }),
    });
    const data = await res.json();
    setMergeResult(data.success ? from + ' merged into company memory (' + data.merged + ' facts)' : 'Merge failed: ' + data.error);
    setMerging(false);
  }

  function loadTicket(ticket) {
    setBranch(ticket.segment);
    setActiveTicket(ticket.id);
    setMessages([{ id: '1', role: 'user', content: ticket.issue }]);
    setTimeout(() => { const btn = document.getElementById('send-btn'); if(btn) btn.click(); }, 300);
  }

  return (
    <div className='min-h-screen bg-gray-950 text-white font-sans'>
      <header className='border-b border-gray-800 px-6 py-4 flex items-center justify-between'>
        <div className='flex items-center gap-3'>
          <div className='w-8 h-8 rounded-lg bg-violet-600 flex items-center justify-center text-sm font-bold'>S</div>
          <span className='text-lg font-semibold tracking-tight'>SwarmDesk</span>
          <span className='text-xs text-gray-500 ml-2'>AI Support Intelligence</span>
        </div>
        <button onClick={seedBranches} disabled={seeding || seeded}
          className='text-xs px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 disabled:opacity-40 transition'>
          {seeded ? 'Memory Seeded' : seeding ? 'Seeding...' : 'Seed Memory'}
        </button>
      </header>

      <div className='flex h-[calc(100vh-65px)]'>
        <aside className='w-64 border-r border-gray-800 p-4 flex flex-col gap-6'>
          <div>
            <p className='text-xs text-gray-500 uppercase tracking-widest mb-3'>Segments</p>
            {SEGMENTS.map(s => (
              <button key={s.id} onClick={() => { setBranch(s.id); setMessages([]); }}
                className={'w-full text-left px-3 py-2 rounded-lg text-sm mb-1 transition ' + (branch === s.id ? s.color + ' text-white' : 'hover:bg-gray-800 text-gray-400')}>
                {s.label}
              </button>
            ))}
          </div>

          <div>
            <p className='text-xs text-gray-500 uppercase tracking-widest mb-3'>Ticket Inbox</p>
            {TICKETS.map(t => (
              <button key={t.id} onClick={() => loadTicket(t)}
                className={'w-full text-left px-3 py-2 rounded-lg text-xs mb-1 transition border ' + (activeTicket === t.id ? 'border-violet-500 bg-gray-800' : 'border-gray-800 hover:bg-gray-800')}>
                <p className='font-medium text-white'>{t.user}</p>
                <p className='text-gray-400 truncate'>{t.issue}</p>
              </button>
            ))}
          </div>

          <div>
            <p className='text-xs text-gray-500 uppercase tracking-widest mb-3'>Merge to Main</p>
            {SEGMENTS.filter(s => s.id !== 'support/main').map(s => (
              <button key={s.id} onClick={() => mergeBranch(s.id)} disabled={merging}
                className='w-full text-left px-3 py-2 rounded-lg text-xs mb-1 bg-gray-800 hover:bg-gray-700 disabled:opacity-40 transition text-gray-300'>
                Merge {s.label}
              </button>
            ))}
            {mergeResult && <p className='text-xs text-emerald-400 mt-2'>{mergeResult}</p>}
          </div>
        </aside>

        <main className='flex-1 flex flex-col'>
          <div className='px-6 py-3 border-b border-gray-800 flex items-center gap-2'>
            <span className={'text-xs px-2 py-1 rounded-full font-medium ' + seg?.light}>{seg?.label}</span>
            <span className='text-xs text-gray-500 font-mono'>{branch}</span>
          </div>

          <div className='flex-1 overflow-y-auto px-6 py-4 space-y-4'>
            {messages.length === 0 && (
              <div className='text-center text-gray-600 mt-20'>
                <p className='text-4xl mb-3'>🧠</p>
                <p className='text-sm'>Select a ticket or type a support question</p>
              </div>
            )}
            {messages.map(m => (
              <div key={m.id} className={'flex ' + (m.role === 'user' ? 'justify-end' : 'justify-start')}>
                <div className={'max-w-lg px-4 py-3 rounded-2xl text-sm ' + (m.role === 'user' ? 'bg-violet-600 text-white' : 'bg-gray-800 text-gray-100')}>
                  {m.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className='flex justify-start'>
                <div className='bg-gray-800 px-4 py-3 rounded-2xl text-sm text-gray-400'>Thinking...</div>
              </div>
            )}
          </div>

          <form id="chat-form" onSubmit={handleSubmit} className='px-6 py-4 border-t border-gray-800 flex gap-3'>
            <input value={input} onChange={handleInputChange}
              placeholder={'Ask the ' + seg?.label + ' agent...'}
              className='flex-1 bg-gray-800 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-violet-500 placeholder-gray-500' />
            <button id="send-btn" type='submit' disabled={isLoading}
              className='px-5 py-3 bg-violet-600 hover:bg-violet-500 disabled:opacity-40 rounded-xl text-sm font-medium transition'>
              Send
            </button>
          </form>
        </main>
      </div>
    </div>
  );
}
