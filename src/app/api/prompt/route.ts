import { NextResponse } from 'next/server';
import { openai } from '@/lib/openai'; // Import the OpenAI client
import { 
  retrieveContext, 
  constructUserPrompt, 
  RAG_CONFIG, 
  SYSTEM_PROMPT 
} from '@/lib/rag';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // Requirement: Input format uses "question" (we also support "prompt" as a fallback)
    const queryText = body.question || body.prompt; 

    if (!queryText) {
      return NextResponse.json({ error: 'Missing question field' }, { status: 400 });
    }

    // 1. Retrieve Context
    // This function handles embedding, Pinecone query, and formatting logic defined in rag.ts
    const context = await retrieveContext(queryText);

    // 2. Construct the Augmented Prompt
    // Combines the user query with the retrieved context chunks
    const finalUserPrompt = constructUserPrompt(queryText, context);

    // 3. Call LLM (Generation)
    const completion = await openai.chat.completions.create({
      model: RAG_CONFIG.chatModel,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: finalUserPrompt }
      ],
      temperature: 1, // IMPORTANT: Must be 1 for LLMOD / newer models to avoid errors
    });

    const answer = completion.choices[0].message.content;

    // 4. Return Strict JSON Response
    // Matches the assignment requirements exactly: "response", "context", "Augmented_prompt"
    return NextResponse.json({
      response: answer,
      context: context, // The structure { talk_id, title, chunk, score } matches requirements
      Augmented_prompt: {
        System: SYSTEM_PROMPT,
        User: finalUserPrompt
      }
    });

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}