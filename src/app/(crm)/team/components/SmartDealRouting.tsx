'use client';
import React, { useState } from 'react';
import { deals, reps } from '../mockData';
import { Briefcase, ArrowRight, Settings, CheckCircle2 } from 'lucide-react';

export default function SmartDealRouting() {
  const [dealList, setDealList] = useState(deals);

  const getSuggestedRep = (deal: typeof deals[0]) => {
    const candidates = reps.filter(r => r.expertise.some(e => deal.tags.includes(e)));
    if (candidates.length === 0) return reps.sort((a,b) => a.workloadScore - b.workloadScore)[0];
    return candidates.sort((a,b) => a.workloadScore - b.workloadScore)[0];
  };

  const handleAssign = (dealId: string, repId: string) => {
    setDealList(prev => prev.map(d => d.id === dealId ? { ...d, repId, status: 'In Progress' } : d));
  };

  const unassignedDeals = dealList.filter(d => d.repId === null);
  const assignedDeals = dealList.filter(d => d.repId !== null);

  return (
    <div className="space-y-6 animate-in fade-in zoom-in duration-300">
      <div className="flex justify-between items-center">
        <h2 className="section-title flex items-center gap-2">
          <Briefcase className="w-5 h-5 text-[var(--brand-accent)]" />
          Smart Deal Routing
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Unassigned Deals Queue */}
        <div className="space-y-4">
          <h3 className="section-sub uppercase tracking-wider">Incoming Leads ({unassignedDeals.length})</h3>
          {unassignedDeals.length === 0 ? (
            <div className="card text-center text-[var(--text-muted)] border-dashed">
              <CheckCircle2 className="w-8 h-8 mx-auto mb-2 text-green-500 opacity-50" />
              All deals have been assigned.
            </div>
          ) : (
            unassignedDeals.map(deal => {
              const suggestedRep = getSuggestedRep(deal);
              return (
                <div key={deal.id} className="card flex flex-col gap-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-[var(--text-primary)]">{deal.name}</h4>
                      <p className="text-xs text-[var(--text-muted)] mt-1">${deal.value.toLocaleString()} • {deal.lastUpdate}</p>
                    </div>
                    <div className="flex gap-1 flex-wrap justify-end">
                      {deal.tags.map(t => (
                        <span key={t} className="px-2 py-1 bg-[var(--bg-card-hover)] text-[10px] font-semibold uppercase rounded-full text-[var(--text-secondary)] border border-[var(--border)]">{t}</span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="bg-[var(--bg-card-hover)] border border-[var(--border)] p-3 rounded-xl flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ backgroundColor: suggestedRep.color }}>
                        {suggestedRep.avatar}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-[var(--text-primary)]">Suggested: {suggestedRep.name}</p>
                        <p className="text-[10px] text-[var(--text-muted)]">Match: {deal.tags.find(t => suggestedRep.expertise.includes(t))} & Low Workload</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <select 
                        className="text-xs bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--text-primary)] rounded-lg px-2 py-1.5 outline-none"
                        onChange={(e) => handleAssign(deal.id, e.target.value)}
                        defaultValue=""
                      >
                        <option value="" disabled>Override</option>
                        {reps.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                      </select>
                      <button 
                        onClick={() => handleAssign(deal.id, suggestedRep.id)}
                        className="btn btn-primary px-3 py-1.5 text-xs"
                      >
                        Auto-Assign <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Recently Assigned */}
        <div className="space-y-4">
          <h3 className="section-sub uppercase tracking-wider flex justify-between items-center">
            Recently Assigned
            <Settings className="w-4 h-4 text-[var(--text-muted)] cursor-pointer hover:text-[var(--text-primary)] transition-colors" />
          </h3>
          <div className="card !p-0 overflow-hidden flex flex-col">
            {assignedDeals.slice(0, 5).map((deal, i) => {
              const rep = reps.find(r => r.id === deal.repId);
              return (
                <div key={deal.id} className={`p-4 flex items-center justify-between ${i !== assignedDeals.slice(0,5).length - 1 ? 'border-b border-[var(--border)]' : ''} hover:bg-[var(--bg-card-hover)] transition-colors`}>
                  <div>
                    <h4 className="font-semibold text-[var(--text-primary)] text-sm">{deal.name}</h4>
                    <p className="text-xs text-[var(--text-muted)] mt-0.5">${deal.value.toLocaleString()}</p>
                  </div>
                  {rep && (
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-[var(--text-muted)] uppercase font-semibold">Assigned to</span>
                      <div className="w-6 h-6 rounded-full flex items-center justify-center text-white text-[9px] font-bold shadow" style={{ backgroundColor: rep.color }}>
                        {rep.avatar}
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
            {assignedDeals.length === 0 && (
               <div className="p-8 text-center text-[var(--text-muted)] text-sm">
                 No deals assigned yet.
               </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
