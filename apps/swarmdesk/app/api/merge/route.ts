import { MemForksClient } from '@memfork/core';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { from, into } = await req.json();
    const client = await MemForksClient.connect({
      treeId: process.env.MEMFORK_TREE_ID as string,
      signer: process.env.MEMFORK_PRIVATE_KEY as string,
      network: (process.env.MEMFORK_NETWORK || "testnet") as "testnet" | "mainnet",
      memwal: {
        accountId: process.env.MEMFORK_MEMWAL_ACCOUNT as string,
        delegateKey: process.env.MEMFORK_MEMWAL_KEY as string,
      },
    });
    const recalled = await client.recall('support resolution policy answer', { branch: from, limit: 10 });
    for (const fact of recalled) {
      await client.commit(into, { facts: [fact.text], message: 'merge: ' + from + ' into ' + into });
    }
    return NextResponse.json({ success: true, merged: recalled.length });
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}