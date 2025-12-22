import React from 'react';

export function Header() {
  return (
    <header className="border-b border-neutral-800 bg-neutral-950/80 backdrop-blur-md sticky top-0 z-50 p-6">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight text-red-600">
          TED <span className="text-white">RAG Assistant</span>
        </h1>
        <div className="text-sm font-medium text-neutral-400">
          Individual Assignment <span className="text-red-600 mx-2">•</span> Yuval Margolin
        </div>
      </div>
    </header>
  );
}