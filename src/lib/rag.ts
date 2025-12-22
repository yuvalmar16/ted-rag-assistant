import { openai } from './openai';
import { pinecone } from './pinecone';

// --- Configuration ---
export const RAG_CONFIG = {
  chunkSize: 1024,
  overlap: 0.2,
  topK: 15,
  namespace: '', 
  // Updated model names to match your specific API Key permissions:
  chatModel: 'RPRTHPB-gpt-5-mini', 
  embeddingModel: 'RPRTHPB-text-embedding-3-small',
  dimensions: 1024
};

// --- System Prompt ---
export const SYSTEM_PROMPT = `You are a TED Talk assistant that answers questions strictly and only based on the TED dataset context provided to you (metadata and transcript passages).
You must not use any external knowledge, the open internet, or information that is not explicitly contained in the retrieved context.
If the answer cannot be determined from the provided context, respond: "I don't know based on the provided TED data."
Always explain your answer using the given context, quoting or paraphrasing the relevant transcript or metadata when helpful.`;

// --- Types ---
export interface RetrievedContext {
  talk_id: string;
  title: string;
  chunk: string;
  score: number;
}

// --- Main Logic ---

export async function retrieveContext(query: string): Promise<RetrievedContext[]> {
  // 1. Embed Query
  const embedding = await openai.embeddings.create({
    model: RAG_CONFIG.embeddingModel,
    input: query,
    dimensions: RAG_CONFIG.dimensions,
  });

  // 2. Query Pinecone
  const indexName = process.env.PINECONE_INDEX_NAME!; 
  const index = pinecone.index(indexName);
  
  const searchResult = await index.namespace(RAG_CONFIG.namespace).query({
    vector: embedding.data[0].embedding,
    topK: RAG_CONFIG.topK,
    includeMetadata: true,
  });

  // 3. Format Results
  const matches = searchResult.matches || [];
  
  return matches.map(match => ({
    talk_id: (match.metadata?.talk_id as string) || 'unknown',
    title: (match.metadata?.title as string) || 'Untitled',
    chunk: (match.metadata?.text as string) || '',
    score: match.score || 0
  }));
}

export function constructUserPrompt(question: string, context: RetrievedContext[]): string {
  const contextText = context.map((c, i) => `
[${i+1}] Title: ${c.title} (ID: ${c.talk_id})
Content: ${c.chunk}
`).join('\n---\n');

  return `Question: ${question}\n\nStrict Context from Database:\n${contextText}`;
}