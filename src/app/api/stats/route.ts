import { NextResponse } from 'next/server';
import { RAG_CONFIG } from '@/lib/rag';

export async function GET() {
  // Requirement: Strict JSON format matching specific field names
  return NextResponse.json({
    chunk_size: RAG_CONFIG.chunkSize,
    overlap_ratio: RAG_CONFIG.overlap,
    top_k: RAG_CONFIG.topK
  });
}