export const RAG_CONFIG = {
  // Constraints: chunk_size <= 2048, overlap <= 0.3, top_k <= 30
  chunkSize: 1024,
  overlapRatio: 0.2, 
  topK: 15,
  
  // Model Constants
  embeddingModel: "RPRTHPB-text-embedding-3-small", // Maps to RPRTHPB-text-embedding-3-small requirement
  chatModel: "RPRTHPB-gpt-5-mini",
  
  // Pinecone Namespace
  namespace: "ted-talks-en",
  
  // Embedding Dimensions
  dimensions: 1024
};

// Helper to calculate overlap tokens
export const getOverlapTokens = () => Math.floor(RAG_CONFIG.chunkSize * RAG_CONFIG.overlapRatio);