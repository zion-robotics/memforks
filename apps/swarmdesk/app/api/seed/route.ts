import { MemForksClient } from '@memfork/core';
import { NextResponse } from 'next/server';

export async function POST() {
  try {
    const client = await MemForksClient.connect({
      treeId: process.env.MEMFORK_TREE_ID as string,
      signer: process.env.MEMFORK_PRIVATE_KEY as string,
      network: (process.env.MEMFORK_NETWORK || "testnet") as "testnet" | "mainnet",
      memwal: {
        accountId: process.env.MEMFORK_MEMWAL_ACCOUNT as string,
        delegateKey: process.env.MEMFORK_MEMWAL_KEY as string,
      },
    });
    await client.commit('main', { facts: ['Refunds under 50 dollars approved without escalation. Enterprise SLA is 4 hours. Always verify customer identity.'], message: 'seed: global policies' });
    await client.commit('billing', { facts: ['Double charges resolved within 24 hours via automatic reversal.'], message: 'seed: billing' });
    await client.commit('technical', { facts: ['API key issues resolved by regenerating from Settings > API in dashboard.'], message: 'seed: technical' });
    await client.commit('enterprise', { facts: ['Enterprise clients get dedicated account manager at enterprise@swarmdesk.io.'], message: 'seed: enterprise' });
    await client.commit('onboarding', { facts: ['New users get 14-day free trial, no credit card required.'], message: 'seed: onboarding' });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}