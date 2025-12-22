'use client';

import { useState, useEffect, useRef } from 'react';
import { Header } from './Header';
import { Send, ChevronDown, ChevronUp, Database, Loader2 } from 'lucide-react';
import clsx from 'clsx';

type Message = {
  role: 'user' | 'assistant';
  content: string;
  id: string;
  context?: ContextItem[];
};

// Updated to match new API response
type ContextItem = {
  talk_id: string;
  title: string;
  chunk: string;
  score: number;
};

type Stats = {
  chunk_size: number;
  overlap_ratio: number;
  top_k: number;
};

export default function Home() {
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [expandedSources, setExpandedSources] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    fetch('/api/stats')
      .then(res => res.json())
      .then(data => setStats(data))
      .catch(err => console.error('Failed to load stats', err));
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() || isLoading) return;

    const userMsg: Message = { role: 'user', content: query, id: Date.now().toString() };
    setMessages(prev => [...prev, userMsg]);
    setQuery('');
    setIsLoading(true);

    try {
      // Changed 'prompt' to 'question' to match requirements
      const res = await fetch('/api/prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: query }),
      });

      if (!res.ok) throw new Error(res.statusText);

      const data = await res.json();
      
      const aiMsg: Message = {
        role: 'assistant',
        content: data.response,
        id: (Date.now() + 1).toString(),
        context: data.context // Changed from sources to context
      };
      
      setMessages(prev => [...prev, aiMsg]);
    } catch (error) {
      console.error(error);
      const errorMsg: Message = { 
        role: 'assistant', 
        content: "Sorry, I encountered an error. Please try again.", 
        id: (Date.now() + 1).toString() 
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen font-sans">
      <Header />

      <main className="flex-1 max-w-4xl w-full mx-auto p-4 flex flex-col gap-6">
        <div className="flex-1 space-y-6 pb-4">
          {messages.length === 0 && (
            <div className="text-center text-neutral-500 mt-20">
              <Database className="w-16 h-16 mx-auto mb-4 opacity-20" />
              <p className="text-lg">Ask a question about TED talks</p>
            </div>
          )}
          
          {messages.map((msg) => (
            <div key={msg.id} className={clsx(
              "flex flex-col max-w-[85%]",
              msg.role === 'user' ? "ml-auto items-end" : "mr-auto items-start"
            )}>
              <div className={clsx(
                "px-5 py-3 rounded-2xl text-sm leading-relaxed shadow-md",
                msg.role === 'user' 
                  ? "bg-red-600 text-white rounded-br-none" 
                  : "bg-neutral-800 border border-neutral-700 text-neutral-100 rounded-bl-none"
              )}>
                {msg.content}
              </div>

              {msg.context && msg.context.length > 0 && (
                <div className="mt-3 w-full animate-in fade-in slide-in-from-top-2">
                  <button 
                    onClick={() => setExpandedSources(expandedSources === msg.id ? null : msg.id)}
                    className="text-xs flex items-center gap-1.5 text-neutral-400 hover:text-red-400 transition-colors mb-2 ml-1"
                  >
                    {expandedSources === msg.id ? <ChevronUp className="w-3 h-3"/> : <ChevronDown className="w-3 h-3"/>}
                    {msg.context.length} Sources Retrieved
                  </button>

                  {expandedSources === msg.id && (
                    <div className="grid gap-2">
                      {msg.context.map((item, idx) => (
                        <div key={idx} className="bg-neutral-900 border border-neutral-800 p-3 rounded-lg hover:border-red-900/50 transition-colors">
                          <div className="flex justify-between items-start mb-1">
                            <h4 className="text-xs font-bold text-red-500 truncate pr-2">{item.title}</h4>
                            <span className="text-[10px] bg-neutral-800 px-1.5 py-0.5 rounded text-neutral-400 font-mono">
                              ID: {item.talk_id}
                            </span>
                          </div>
                          <p className="text-xs text-neutral-400 line-clamp-2 italic">
                            "{item.chunk}..."
                          </p>
                          <div className="mt-2 flex items-center gap-2">
                            <div className="h-1 flex-1 bg-neutral-800 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-red-600/50" 
                                style={{ width: `${Math.min(item.score * 100, 100)}%` }}
                              />
                            </div>
                            <span className="text-[10px] text-neutral-500">{item.score.toFixed(3)}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
          {isLoading && (
             <div className="flex items-center gap-2 text-neutral-500 text-sm ml-2">
               <Loader2 className="w-4 h-4 animate-spin" />
               Thinking...
             </div>
          )}
          <div ref={scrollRef} />
        </div>
      </main>

      <footer className="p-4 border-t border-neutral-800 bg-neutral-950/80 backdrop-blur-md sticky bottom-0">
        <div className="max-w-4xl mx-auto">
           {stats && (
            <div className="flex gap-4 text-[10px] text-neutral-600 font-mono mb-2 px-1">
              <span>Chunk: {stats.chunk_size}</span>
              <span>Overlap: {stats.overlap_ratio}</span>
              <span>Top-K: {stats.top_k}</span>
            </div>
           )}
          <form onSubmit={handleSubmit} className="relative flex items-center">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask me anything about the talks..."
              className="w-full bg-neutral-900 text-neutral-100 border border-neutral-700 rounded-xl py-3 pl-4 pr-12 focus:outline-none focus:ring-1 focus:ring-red-600 focus:border-red-600 transition-all placeholder:text-neutral-600 shadow-sm"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={!query.trim() || isLoading}
              className="absolute right-2 p-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:hover:bg-red-600 transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </footer>
    </div>
  );
}