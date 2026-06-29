'use client';
import { useState } from 'react';
import { MapPin, Navigation, Package, UserCheck, Activity, BatteryMedium, MessageSquare, CheckCircle, AlertTriangle } from 'lucide-react';
import { fieldMonitoringKpis, fieldMonitoringAgents as agents, fieldMonitoringFeed } from '@/lib/mockData';

const kpiIcons: Record<string, React.ReactNode> = {
  blue: <UserCheck size={20} />,
  emerald: <Navigation size={20} />,
  purple: <Package size={20} />,
  rose: <AlertTriangle size={20} />
};

const feedIcons: Record<string, React.ReactNode> = {
  check: <CheckCircle size={14} color="#10b981" />,
  mapPin: <MapPin size={14} color="#6B00CC" />,
  alert: <AlertTriangle size={14} color="#f43f5e" />,
  package: <Package size={14} color="#8b5cf6" />,
  activity: <Activity size={14} color="#10b981" />
};

const kpis = fieldMonitoringKpis.map(kpi => ({
  ...kpi,
  icon: kpiIcons[kpi.color]
}));

const activityFeed = fieldMonitoringFeed.map(feed => ({
  ...feed,
  icon: feedIcons[feed.iconType]
}));

export default function FieldMonitoringPage() {
  const [filter, setFilter] = useState('All');

  const filteredAgents = filter === 'All' ? agents : agents.filter(a => a.status === filter);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, margin: 0 }}>Field Worker Tracking</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14, margin: '4px 0 0' }}>Monitor FMCG deliveries, check-ins, and agent status.</p>
        </div>
        <button className="btn btn-primary">
          <MessageSquare size={16} /> Broadcast Message
        </button>
      </div>

      {/* KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
        {kpis.map((kpi, i) => (
          <div key={i} className="card" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ width: 36, height: 36, borderRadius: 8, background: `color-mix(in srgb, var(--${kpi.color}-dim) 50%, transparent)`, color: `var(--${kpi.color}-light)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {kpi.icon}
              </div>
            </div>
            <div>
              <div style={{ fontSize: 28, fontWeight: 700 }}>{kpi.value}</div>
              <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{kpi.label}</div>
            </div>
            <div style={{ fontSize: 12, color: `var(--${kpi.color}-light)`, marginTop: 4 }}>
              {kpi.delta}
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20 }}>
        {/* Left Column: Map/Agent List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ padding: 20, borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontSize: 16, fontWeight: 600, margin: 0 }}>Active Field Agents</h2>
              <div style={{ display: 'flex', gap: 8 }}>
                {['All', 'Active', 'On Delivery', 'Idle', 'Offline'].map(f => (
                  <button key={f} className={`btn ${filter === f ? 'btn-primary' : 'btn-ghost'}`} style={{ padding: '4px 10px', fontSize: 12 }} onClick={() => setFilter(f)}>
                    {f}
                  </button>
                ))}
              </div>
            </div>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Agent</th>
                    <th>Status & Location</th>
                    <th>Tasks / Battery</th>
                    <th>Last Update</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAgents.map(agent => (
                    <tr key={agent.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                          <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--blue-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--blue-light)', fontWeight: 600, fontSize: 13 }}>
                            {agent.name.charAt(0)}
                          </div>
                          <div>
                            <div style={{ fontWeight: 500 }}>{agent.name}</div>
                            <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{agent.phone}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                          <span style={{ 
                            fontSize: 11, padding: '2px 8px', borderRadius: 12, width: 'fit-content',
                            background: agent.status === 'Active' ? 'var(--blue-dim)' : agent.status === 'On Delivery' ? 'var(--emerald-dim)' : agent.status === 'Idle' ? 'var(--amber-dim)' : 'var(--border)',
                            color: agent.status === 'Active' ? 'var(--blue-light)' : agent.status === 'On Delivery' ? 'var(--emerald-light)' : agent.status === 'Idle' ? 'var(--amber-light)' : 'var(--text-secondary)'
                          }}>
                            {agent.status}
                          </span>
                          <div style={{ fontSize: 12, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 4 }}>
                            <MapPin size={12} color="var(--text-secondary)" /> {agent.location}
                          </div>
                        </div>
                      </td>
                      <td>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                          <div style={{ fontSize: 13, fontWeight: 500 }}>{agent.tasksCompleted} Completed</div>
                          <div style={{ fontSize: 12, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 4 }}>
                            <BatteryMedium size={14} /> {agent.battery}
                          </div>
                        </div>
                      </td>
                      <td>
                        <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{agent.lastUpdate}</span>
                      </td>
                    </tr>
                  ))}
                  {filteredAgents.length === 0 && (
                    <tr>
                      <td colSpan={4} style={{ textAlign: 'center', padding: 40, color: 'var(--text-secondary)' }}>
                        No agents match this status.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column: Live Feed */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <h2 style={{ fontSize: 16, fontWeight: 600, margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
              <Activity size={18} color="var(--blue-light)" /> WhatsApp Live Feed
            </h2>
            <span style={{ fontSize: 11, background: 'rgba(16, 185, 129, 0.2)', color: '#10b981', padding: '2px 8px', borderRadius: 12, animation: 'pulse 2s infinite' }}>Live</span>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, flex: 1, overflowY: 'auto' }}>
            {activityFeed.map((feed) => (
              <div key={feed.id} style={{ display: 'flex', gap: 12 }}>
                <div style={{ marginTop: 2, background: 'var(--bg-secondary)', width: 28, height: 28, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {feed.icon}
                </div>
                <div style={{ flex: 1, paddingBottom: 16, borderBottom: '1px solid var(--border)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ fontWeight: 500, fontSize: 13 }}>{feed.agent}</span>
                    <span style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{feed.time}</span>
                  </div>
                  <div style={{ fontSize: 13 }}>
                    <span style={{ color: 'var(--text-secondary)' }}>{feed.action}: </span>
                    <span style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{feed.target}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <button className="btn btn-ghost" style={{ marginTop: 16, width: '100%', justifyContent: 'center' }}>
            View Full Log
          </button>
        </div>
      </div>
    </div>
  );
}
