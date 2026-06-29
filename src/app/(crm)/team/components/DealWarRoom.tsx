'use client';
import React, { useState } from 'react';
import { deals, reps } from '../mockData';
import { MessageSquare, Pin, CheckSquare, Send } from 'lucide-react';

export default function DealWarRoom() {
  const [selectedDeal, setSelectedDeal] = useState(deals[0]);
  const [chat, setChat] = useState([
    { id: 1, user: '1', text: 'Just had a call with them, they are interested in the enterprise tier.', time: '10:30 AM' },
    { id: 2, user: '6', text: '@Alex Johnson great job. Make sure to highlight our new security features.', time: '10:45 AM' }
  ]);
  const [inputText, setInputText] = useState('');

  const handleSend = () => {
    if(!inputText.trim()) return;
    setChat([...chat, { id: Date.now(), user: '1', text: inputText, time: 'Just now' }]);
    setInputText('');
  };

  return (
    <div className="card !p-0 flex h-[600px] overflow-hidden animate-in fade-in zoom-in duration-300">
      {/* Sidebar: Deals */}
      <div className="w-1/3 bg-[var(--bg-secondary)] border-r border-[var(--border)] flex flex-col">
        <div className="p-4 border-b border-[var(--border)]">
          <h3 className="section-title text-base !mb-0">Active Deals</h3>
        </div>
        <div className="flex-1 overflow-y-auto">
          {deals.slice(0,6).map(deal => (
            <div 
              key={deal.id} 
              onClick={() => setSelectedDeal(deal)}
              className={`p-4 border-b border-[var(--border)] cursor-pointer transition-colors ${selectedDeal.id === deal.id ? 'bg-[var(--bg-card-hover)] border-l-4 border-l-[var(--brand-accent)]' : 'hover:bg-[var(--bg-card-hover)]'}`}
            >
              <h4 className="font-semibold text-sm text-[var(--text-primary)]">{deal.name}</h4>
              <p className="text-xs text-[var(--text-muted)] mt-1">${deal.value.toLocaleString()} • {deal.status}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Main Panel: War Room */}
      <div className="flex-1 flex flex-col">
        <div className="p-4 border-b border-[var(--border)] flex justify-between items-center bg-[var(--bg-card-hover)]">
          <div>
            <h2 className="section-title text-lg !mb-1">{selectedDeal.name}</h2>
            <p className="text-xs text-[var(--text-muted)] font-medium">Value: ${selectedDeal.value.toLocaleString()} • Tags: {selectedDeal.tags.join(', ')}</p>
          </div>
          <div className="flex -space-x-2">
            {reps.slice(0,3).map(r => (
              <div key={r.id} className="w-8 h-8 rounded-full border-2 border-[var(--bg-card)] flex items-center justify-center text-white text-xs font-bold shadow" style={{ backgroundColor: r.color }} title={r.name}>
                {r.avatar}
              </div>
            ))}
          </div>
        </div>

        <div className="flex-1 flex overflow-hidden">
          {/* Chat Area */}
          <div className="flex-1 flex flex-col border-r border-[var(--border)]">
            <div className="flex-1 p-4 overflow-y-auto space-y-4">
              {chat.map(msg => {
                const rep = reps.find(r => r.id === msg.user) || reps[0];
                return (
                  <div key={msg.id} className="flex gap-3">
                    <div className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-white text-xs font-bold shadow" style={{ backgroundColor: rep.color }}>
                      {rep.avatar}
                    </div>
                    <div>
                      <div className="flex items-baseline gap-2">
                        <span className="font-semibold text-sm text-[var(--text-primary)]">{rep.name}</span>
                        <span className="text-[10px] text-[var(--text-muted)] font-medium">{msg.time}</span>
                      </div>
                      <p className="text-sm text-[var(--text-secondary)] mt-1 bg-[var(--bg-card-hover)] border border-[var(--border)] p-3 rounded-xl rounded-tl-sm inline-block">
                        {msg.text.split(/(@\w+\s\w+)/g).map((part, i) => 
                          part.startsWith('@') ? <span key={i} className="text-[var(--brand-highlight)] font-semibold">{part}</span> : part
                        )}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
            <div className="p-4 border-t border-[var(--border)] bg-[var(--bg-secondary)]">
              <div className="flex items-center gap-2 bg-[var(--bg-card)] p-2 rounded-xl border border-[var(--border)]">
                <input 
                  type="text" 
                  value={inputText}
                  onChange={e => setInputText(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSend()}
                  placeholder="Type a message or @mention..." 
                  className="flex-1 bg-transparent border-none outline-none text-sm px-2 text-[var(--text-primary)] placeholder-[var(--text-muted)]"
                />
                <button onClick={handleSend} className="btn btn-primary !p-2 !rounded-lg">
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Right Panel: Notes & Tasks */}
          <div className="w-64 flex flex-col p-4 space-y-6 bg-[var(--bg-secondary)]">
            <div>
              <h3 className="section-sub uppercase flex items-center gap-2 mb-3 font-bold text-[var(--text-secondary)]">
                <Pin className="w-3 h-3" /> Pinned Notes
              </h3>
              <div className="bg-amber-500/10 border border-amber-500/30 p-3 rounded-lg text-amber-200 text-xs shadow-sm font-medium">
                Decision maker is Jane Doe. Budget approval needed by Friday.
              </div>
            </div>
            <div>
              <h3 className="section-sub uppercase flex items-center gap-2 mb-3 font-bold text-[var(--text-secondary)]">
                <CheckSquare className="w-3 h-3" /> Shared Tasks
              </h3>
              <div className="space-y-3">
                <label className="flex items-start gap-2 text-sm text-[var(--text-secondary)] cursor-pointer group">
                  <input type="checkbox" className="mt-1 rounded border-[var(--border)] bg-transparent text-[var(--brand-accent)] focus:ring-[var(--brand-accent)] focus:ring-offset-0" defaultChecked />
                  <span className="line-through opacity-50 group-hover:opacity-75 transition-opacity">Send pitch deck</span>
                </label>
                <label className="flex items-start gap-2 text-sm text-[var(--text-secondary)] cursor-pointer group">
                  <input type="checkbox" className="mt-1 rounded border-[var(--border)] bg-transparent text-[var(--brand-accent)] focus:ring-[var(--brand-accent)] focus:ring-offset-0" />
                  <span className="group-hover:text-[var(--text-primary)] transition-colors">Schedule technical demo</span>
                </label>
                <label className="flex items-start gap-2 text-sm text-[var(--text-secondary)] cursor-pointer group">
                  <input type="checkbox" className="mt-1 rounded border-[var(--border)] bg-transparent text-[var(--brand-accent)] focus:ring-[var(--brand-accent)] focus:ring-offset-0" />
                  <span className="group-hover:text-[var(--text-primary)] transition-colors">Prepare pricing proposal</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
