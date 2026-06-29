'use client';
import React from 'react';
import { reps } from '../mockData';
import { Trophy, Zap, Target } from 'lucide-react';

export default function GamifiedLeaderboard() {
  const sortedReps = [...reps].sort((a,b) => b.points - a.points);
  
  return (
    <div className="space-y-6 animate-in fade-in zoom-in duration-300 max-w-4xl mx-auto">
      <div className="flex justify-between items-center text-center w-full">
        <h2 className="section-title flex justify-center items-center gap-2 w-full">
          <Trophy className="w-6 h-6 text-yellow-500" />
          Weekly Leaderboard
        </h2>
      </div>

      <div className="card !p-0 overflow-hidden">
        {/* Header */}
        <div className="bg-[var(--bg-secondary)] p-4 grid grid-cols-12 gap-4 text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider border-b border-[var(--border)]">
          <div className="col-span-1 text-center">Rank</div>
          <div className="col-span-4">Rep</div>
          <div className="col-span-3">Badges</div>
          <div className="col-span-2 text-right">Points</div>
          <div className="col-span-2 text-right">Level</div>
        </div>

        {/* List */}
        <div className="divide-y divide-[var(--border)]">
          {sortedReps.map((rep, idx) => (
            <div key={rep.id} className={`p-4 grid grid-cols-12 gap-4 items-center transition-colors hover:bg-[var(--bg-card-hover)] ${idx === 0 ? 'bg-[var(--brand-glow)]/10' : ''}`}>
              <div className="col-span-1 text-center font-bold text-lg font-outfit">
                {idx === 0 ? <span className="text-yellow-400">1</span> : 
                 idx === 1 ? <span className="text-gray-300">2</span> : 
                 idx === 2 ? <span className="text-amber-600">3</span> : 
                 <span className="text-[var(--text-muted)]">{idx + 1}</span>}
              </div>
              
              <div className="col-span-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-md" style={{ backgroundColor: rep.color }}>
                  {rep.avatar}
                </div>
                <div>
                  <h4 className="font-semibold text-[var(--text-primary)]">{rep.name}</h4>
                  <p className="text-[10px] text-[var(--text-muted)] font-medium uppercase mt-0.5">{rep.dealsClosed} deals closed</p>
                </div>
              </div>

              <div className="col-span-3 flex gap-2 flex-wrap">
                {idx === 0 && <span className="px-2 py-1 bg-yellow-500/20 text-yellow-300 border border-yellow-500/30 text-[10px] uppercase rounded-full flex items-center gap-1 font-bold"><Trophy className="w-3 h-3"/> Top Closer</span>}
                {rep.tasksDone > 80 && <span className="px-2 py-1 bg-blue-500/20 text-blue-300 border border-blue-500/30 text-[10px] uppercase rounded-full flex items-center gap-1 font-bold"><Zap className="w-3 h-3"/> Task Master</span>}
                {rep.revenue > 100000 && <span className="px-2 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] uppercase rounded-full flex items-center gap-1 font-bold"><Target className="w-3 h-3"/> Big Hitter</span>}
              </div>

              <div className="col-span-2 text-right font-bold text-[var(--brand-highlight)] text-xl font-outfit">
                {rep.points.toLocaleString()}
              </div>

              <div className="col-span-2">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="font-bold text-[var(--text-secondary)]">Lvl {rep.level}</span>
                  <span className="text-[var(--text-muted)] text-[10px] font-semibold">{(rep.points % 1000) / 10}%</span>
                </div>
                <div className="w-full bg-[var(--bg-secondary)] border border-[var(--border)] rounded-full h-1.5 overflow-hidden">
                  <div className="bg-[var(--brand-accent)] h-full rounded-full transition-all duration-1000 ease-out" style={{ width: `${(rep.points % 1000) / 10}%` }}></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
