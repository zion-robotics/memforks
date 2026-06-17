# SwarmDesk

> AI-powered customer support dashboard with branch-aware agent memory, built on [MemForks](https://github.com/memforks-dev/memforks).

## What it does

SwarmDesk is a customer support swarm where specialized AI agents handle different customer segments — each with their own isolated memory branch. When an agent learns something valuable, it can be merged into company-wide memory.

## The MemForks Demo (Acceptance Gate)

1. **Before merge** — ask Company Memory: *"How do I fix an API key issue?"* → generic answer
2. **Merge Technical branch** → technical knowledge flows into company memory
3. **After merge** — ask the same question → specific answer: *"Go to Dashboard > Settings > API > Regenerate Key"*

This proves two branches answer differently, and merge visibly changes what the company memory knows.

## Features

- 🧠 **Branch-aware memory** — each support segment has isolated MemForks memory
- 🔀 **Merge resolutions** — approve high-confidence fixes into company-wide memory
- 🎫 **Ticket inbox** — mock tickets routed to the right segment agent
- 💬 **Real-time chat** — powered by Groq (llama-3.3-70b-versatile) via Vercel AI SDK
- 🔗 **On-chain memory** — all facts committed to Sui testnet via MemForks

## Memory Branches

| Branch | Purpose |
|--------|---------|
| `main` | Company-wide policies and merged resolutions |
| `billing` | Billing disputes, refunds, charge issues |
| `technical` | API, integration, and technical fixes |
| `enterprise` | Enterprise SLA, account management |
| `onboarding` | Trial, signup, and onboarding questions |

## Stack

- **Frontend** — Next.js 15, Tailwind CSS
- **AI** — Groq (llama-3.3-70b-versatile), Vercel AI SDK v4
- **Memory** — MemForks + MemWal on Sui testnet
- **Deployment** — Vercel

## Setup

```bash
git clone https://github.com/zion-robotics/memforks
cd apps/swarmdesk
npm install
```

Copy `.env.local`:
```bash
MEMFORK_TREE_ID=your_tree_id
MEMFORK_PRIVATE_KEY=your_private_key
MEMFORK_MEMWAL_ACCOUNT=your_account_id
MEMFORK_MEMWAL_KEY=your_delegate_key
MEMFORK_NETWORK=testnet
GROQ_API_KEY=your_groq_key
```

Seed memory branches via CLI:
```bash
memfork commit --branch main --facts "Your global policies here" --message "seed"
memfork branch billing --from main
memfork branch technical --from main
memfork branch enterprise --from main
memfork branch onboarding --from main
```

Run:
```bash
npm run dev
```

## Built for

[MemForks Bounty Event](https://github.com/memforks-dev/memforks) — Fork the Memory
