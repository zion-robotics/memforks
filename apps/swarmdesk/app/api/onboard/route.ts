import { NextResponse } from 'next/server';
import { createGroq } from '@ai-sdk/groq';
import { generateText } from 'ai';

const groq = createGroq({ apiKey: process.env.GROQ_API_KEY });

const SYSTEM = `You are SwarmDesk's onboarding guide. Be concise — max 3 short paragraphs or 4 bullet points. Never write walls of text.

SwarmDesk is an AI customer support dashboard where each segment (Billing, Technical, Enterprise, Onboarding) has its own isolated memory branch powered by MemForks on Sui blockchain.

Key facts:
- Click a segment in the sidebar to switch agents
- Each agent only knows its own branch memory
- Click "Merge X" to push branch knowledge into Company Memory
- The magic: ask a question before and after merge — the answer improves
- Seed Memory button (top right) loads initial knowledge
- Click tickets in Ticket Inbox to load real customer issues

Keep answers short, friendly, and direct. Use simple language.`;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    const { text } = await generateText({
      model: groq('llama-3.3-70b-versatile'),
      system: SYSTEM,
      messages,
      maxTokens: 200,
    });
    return NextResponse.json({ text });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
