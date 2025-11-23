"use client";
import { useState } from 'react';

export default function AiAssistant() {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [reply, setReply] = useState('');

  async function send() {
    if (!prompt) return;
    setLoading(true);
    setReply('');
    try {
      const res = await fetch('/api/ai/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });
      const json = await res.json();
      if (json.reply) setReply(json.reply);
      else setReply(json.error || 'No reply');
    } catch (err) {
      setReply(String(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-4 border rounded bg-white shadow-sm">
      <h3 className="text-xl font-semibold mb-3 text-black">AI Assistant</h3>
      
      <textarea
        className="w-full p-3 border rounded text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
        rows={5}
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Ask about inventory, e.g. 'Show low stock items'"
      />
      
      <div className="flex gap-3 mt-3">
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          onClick={send}
          disabled={loading}
        >
          {loading ? 'Thinking...' : 'Send'}
        </button>
        <button
          className="px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400"
          onClick={() => { setPrompt(''); setReply(''); }}
        >
          Clear
        </button>
      </div>
      
      <div className="mt-4">
        <div className="font-medium mb-1 text-black">Reply:</div>
        <pre className="whitespace-pre-wrap p-3 bg-gray-100 border rounded text-black">{reply}</pre>
      </div>
    </div>
  );
}
