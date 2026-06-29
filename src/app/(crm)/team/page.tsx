'use client';
import React, { useState } from 'react';
import PerformanceDashboard from './components/PerformanceDashboard';
import SmartDealRouting from './components/SmartDealRouting';
import DealWarRoom from './components/DealWarRoom';
import GamifiedLeaderboard from './components/GamifiedLeaderboard';
import RolePermissionBuilder from './components/RolePermissionBuilder';
import TeamActivityFeed from './components/TeamActivityFeed';
import { BarChart3, Briefcase, MessageSquare, Trophy, Shield, Activity } from 'lucide-react';

export default function TeamPage() {
  const [activeTab, setActiveTab] = useState('performance');

  const tabs = [
    { id: 'performance', label: 'Performance', icon: BarChart3, component: PerformanceDashboard },
    { id: 'routing', label: 'Deal Routing', icon: Briefcase, component: SmartDealRouting },
    { id: 'warroom', label: 'War Room', icon: MessageSquare, component: DealWarRoom },
    { id: 'leaderboard', label: 'Leaderboard', icon: Trophy, component: GamifiedLeaderboard },
    { id: 'roles', label: 'Roles Matrix', icon: Shield, component: RolePermissionBuilder },
    { id: 'activity', label: 'Activity Feed', icon: Activity, component: TeamActivityFeed },
  ];

  const ActiveComponent = tabs.find(t => t.id === activeTab)?.component || PerformanceDashboard;

  return (
    <div className="page-content bg-[var(--bg-primary)] min-h-screen text-[var(--text-primary)]">
      <div className="mb-6">
        <h1 className="text-3xl font-bold font-playfair mb-1">Team Hub</h1>
        <p className="text-sm text-[var(--text-muted)] font-inter">Manage performance, active deals, team roles, and collaborative spaces.</p>
      </div>

      {/* Tabs Navigation */}
      <div className="flex overflow-x-auto gap-2 border-b border-[var(--border)] mb-8 pb-0 custom-scrollbar">
        {tabs.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-3 text-sm font-semibold transition-all relative whitespace-nowrap outline-none
                ${isActive ? 'text-[var(--brand-highlight)]' : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)] hover:bg-[var(--bg-card-hover)] rounded-t-xl'}`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-[var(--brand-highlight)]' : 'text-[var(--text-muted)]'}`} />
              {tab.label}
              {isActive && (
                <div className="absolute bottom-0 left-0 w-full h-[3px] bg-[var(--brand-highlight)] rounded-t-full shadow-[var(--shadow-glow-purple)]" />
              )}
            </button>
          );
        })}
      </div>

      {/* Main Content Area */}
      <div className="bg-transparent">
        <ActiveComponent />
      </div>
    </div>
  );
}
