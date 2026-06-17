import { createGroq } from "@ai-sdk/groq";
import { streamText } from "ai";
import { MemForksClient } from "@memfork/core";

const groq = createGroq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req: Request) {
  const { messages, branch = "main" } = await req.json();

  const client = await MemForksClient.connect({
    treeId: process.env.MEMFORK_TREE_ID as string,
    signer: process.env.MEMFORK_PRIVATE_KEY as string,
    network: process.env.MEMFORK_NETWORK as string,
    memwal: {
      accountId: process.env.MEMFORK_MEMWAL_ACCOUNT as string,
      delegateKey: process.env.MEMFORK_MEMWAL_KEY as string,
    },
  });

  const lastMessage = messages[messages.length - 1]?.content || "";
  const recalled = await client.recall(lastMessage, { branch, limit: 5 });
  const memoryContext = recalled.map((r: any) => r.text).filter(Boolean).join(". ");

  const systemPrompt = "You are a customer support agent for SwarmDesk on the " + branch + " branch. Memory: " + (memoryContext || "none") + ". Be concise and specific.";

  const result = streamText({
    model: groq("llama-3.3-70b-versatile"),
    system: systemPrompt,
    messages,
  });

  return result.toDataStreamResponse();
}