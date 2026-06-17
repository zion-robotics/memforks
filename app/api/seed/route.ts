import { MemForksClient } from "@memfork/core";
import { NextResponse } from "next/server";

const client = new MemForksClient({
  treeId: process.env.MEMFORK_TREE_ID!,
  signer: process.env.MEMFORK_PRIVATE_KEY!,
  memwal: {
    accountId: process.env.MEMFORK_MEMWAL_ACCOUNT!,
    delegateKey: process.env.MEMFORK_MEMWAL_KEY!,
  },
});

export async function POST() {
  try {
    // Seed main branch with global policies
    await client.commit("support/main", {
      facts: "Refunds under $50 can be approved by support agents without escalation.",
      message: "seed: refund policy",
    });
    await client.commit("support/main", {
      facts: "Enterprise SLA is 4 hours response time guaranteed.",
      message: "seed: enterprise SLA",
    });
    await client.commit("support/main", {
      facts: "All support agents must verify customer identity before discussing account details.",
      message: "seed: identity verification policy",
    });

    // Create segment branches
    const branches = ["support/billing", "support/technical", "support/enterprise", "support/onboarding"];
    for (const branch of branches) {
      await client.branch(branch, { from: "support/main" });
    }

    // Seed each branch with segment-specific knowledge
    await client.commit("support/billing", {
      facts: "Double charges are resolved within 24 hours via automatic reversal.",
      message: "seed: billing double charge policy",
    });
    await client.commit("support/technical", {
      facts: "API key issues are resolved by regenerating from the dashboard under Settings > API.",
      message: "seed: technical api key fix",
    });
    await client.commit("support/enterprise", {
      facts: "Enterprise clients get a dedicated account manager reachable at enterprise@swarmdesk.io.",
      message: "seed: enterprise account manager",
    });
    await client.commit("support/onboarding", {
      facts: "New users get a 14-day free trial with full feature access, no credit card required.",
      message: "seed: onboarding trial policy",
    });

    return NextResponse.json({ success: true, message: "Branches seeded successfully" });
  } catch (error) {
    console.error("Seed error:", error);
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}
