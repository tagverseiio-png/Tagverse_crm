'use client';
import React, { useState } from 'react';
import { activityFeed, reps } from '../mockData';
import { Activity, MessageCircle, Briefcase, CheckSquare, Mail, Filter } from 'lucide-react';

export default function TeamActivityFeed() {
  const [filter, setFilter] = useState('all');
  const [feed, setFeed] = useState(activityFeed);

  const filteredFeed = feed.filter(f => filter === 'all' || f.type === filter);

  const handleAddEmoji = (id: string, emoji: string) => {
    setFeed(prev => prev.map(f => {
      if(f.id === id) {
        return { ...f, emojis: [...f.emojis, emoji] }
      }
      return f;
    }));
  };

  const getIcon = (type: string) => {
    switch(type) {
      case 'deal': return <Briefcase className="w-4 h-4 text-[var(--brand-accent)]" />;
      case 'task': return <CheckSquare className="w-4 h-4 text-blue-500" />;
      case 'email': return <Mail className="w-4 h-4 text-amber-500" />;
      default: return <Activity className="w-4 h-4 text-[var(--text-muted)]" />;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in zoom-in duration-300 max-w-3xl mx-auto">
      <div className="flex justify-between items-center">
        <h2 className="section-title flex items-center gap-2">
          <Activity className="w-5 h-5 text-[var(--brand-accent)]" />
          Live Activity Feed
        </h2>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-[var(--text-muted)]" />
          <select 
            className="text-xs font-semibold uppercase tracking-wider bg-[var(--bg-secondary)] border border-[var(--border)] rounded-full px-3 py-1.5 outline-none text-[var(--text-secondary)]"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">All Activity</option>
            <option value="deal">Deals</option>
            <option value="task">Tasks</option>
            <option value="email">Emails</option>
          </select>
        </div>
      </div>

      <div className="relative before:absolute before:inset-0 before:ml-6 before:-translate-x-px md:before:ml-[2.25rem] before:h-full before:w-px before:bg-[var(--border)] space-y-6">
        {filteredFeed.map(item => {
          const rep = reps.find(r => r.id === item.repId);
          if(!rep) return null;
          
          return (
            <div key={item.id} className="relative flex items-start gap-6 group">
              <div className="absolute left-0 md:left-3 -ml-2.5 w-8 h-8 md:w-12 md:h-12 bg-[var(--bg-primary)] rounded-full border-4 border-[var(--bg-primary)] flex items-center justify-center text-white text-xs md:text-sm font-bold z-10 shadow-sm" style={{ backgroundColor: rep.color }}>
                {rep.avatar}
              </div>
              
              <div className="ml-8 md:ml-16 card w-full hover:-translate-y-0.5 transition-transform">
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <p className="text-sm text-[var(--text-secondary)]">
                      <span className="font-bold text-[var(--text-primary)]">{rep.name}</span> {item.action} <span className="font-bold text-[var(--brand-highlight)]">{item.target}</span>
                    </p>
                    <div className="flex items-center gap-2 mt-1.5">
                      {getIcon(item.type)}
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)]">{item.time}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-2">
                  {item.emojis.length > 0 && (
                    <div className="flex gap-1.5">
                      {Array.from(new Set(item.emojis)).map(emoji => {
                        const count = item.emojis.filter(e => e === emoji).length;
                        return (
                          <button key={emoji} onClick={() => handleAddEmoji(item.id, emoji)} className="px-2 py-1 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-full text-xs hover:bg-[var(--bg-card-hover)] transition-colors flex items-center gap-1">
                            {emoji} {count > 1 && <span className="text-[var(--text-muted)] font-bold">{count}</span>}
                          </button>
                        )
                      })}
                    </div>
                  )}
                  
                  <div className="relative group/emoji">
                    <button className="p-1.5 text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card-hover)] rounded-full transition-all opacity-0 group-hover:opacity-100 focus:opacity-100 border border-transparent hover:border-[var(--border)]">
                      <MessageCircle className="w-4 h-4" />
                    </button>
                    {/* Emoji picker popup */}
                    <div className="absolute left-0 bottom-full mb-2 bg-[var(--bg-card)] border border-[var(--border)] p-2 rounded-xl shadow-[var(--shadow-card)] flex gap-2 hidden group-hover/emoji:flex backdrop-blur-xl">
                      {['🔥', '👍', '🚀', '🎉'].map(emoji => (
                        <button key={emoji} onClick={() => handleAddEmoji(item.id, emoji)} className="hover:scale-125 transition-transform text-lg">
                          {emoji}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
