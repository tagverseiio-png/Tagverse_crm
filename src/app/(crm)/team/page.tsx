'use client';
import React, { useState } from 'react';
import { Trophy, Shield, Activity, Users } from 'lucide-react';

// ─── Design tokens — mapped to CRM CSS variables ──────────────────
const T = {
  accent:      'var(--brand-accent)',       // #7B2FFF
  accentBg:    'var(--bg-glass)',            // rgba(107,0,204,0.18)
  accentHover: 'var(--bg-card-hover)',       // rgba(255,255,255,0.10)
  surface:     'var(--bg-primary)',          // #1A001F
  surfaceEl:   'var(--bg-secondary)',        // #22003A
  surfaceHover:'var(--bg-card)',             // rgba(255,255,255,0.06)
  border:      '1px solid var(--border)',    // rgba(155,48,255,0.18)
  radius:      12,
  radiusSm:    8,
  text:        'var(--text-primary)',        // #FFFFFF
  textSub:     'var(--text-secondary)',      // #E0D0FF
  textMuted:   'var(--text-muted)',          // rgba(224,208,255,0.5)
  font:        "'Inter', sans-serif",
};

// ─── Mock data ────────────────────────────────────────────────────
const REPS = [
  { id:'1', name:'Alex Johnson', email:'alex.j@tagverse.com', initials:'AJ', color:'#10b981', role:'Admin', status:'Active', lastActive:'2m ago', dealsClosed:42, revenue:125000, responseTime:'1.2h', points:4200, level:5 },
  { id:'2', name:'Sarah Miller', email:'sarah.m@tagverse.com', initials:'SM', color:'#f59e0b', role:'Sales Rep', status:'Active', lastActive:'1h ago', dealsClosed:28, revenue:84000, responseTime:'2.5h', points:2850, level:4 },
  { id:'3', name:'Mike Davis', email:'mike.d@tagverse.com', initials:'MD', color:'#3b82f6', role:'Sales Rep', status:'Invited', lastActive:'-', dealsClosed:35, revenue:95000, responseTime:'1.8h', points:3500, level:4 },
  { id:'4', name:'Elena Rodriguez', email:'elena.r@tagverse.com', initials:'ER', color:'#8b5cf6', role:'Viewer', status:'Inactive', lastActive:'3d ago', dealsClosed:15, revenue:30000, responseTime:'4.1h', points:2100, level:3 },
  { id:'5', name:'David Chen', email:'david.c@tagverse.com', initials:'DC', color:'#ec4899', role:'Manager', status:'Active', lastActive:'15m ago', dealsClosed:20, revenue:75000, responseTime:'0.8h', points:2600, level:3 },
  { id:'6', name:'Lisa Taylor', email:'lisa.t@tagverse.com', initials:'LT', color:'#06b6d4', role:'Admin', status:'Active', lastActive:'1d ago', dealsClosed:5, revenue:250000, responseTime:'3.2h', points:5500, level:6 },
];

const FEED = [
  { id:'a1', repId:'1', action:'updated permissions for', target:'Sarah Miller', time:'10m ago' },
  { id:'a2', repId:'4', action:'logged in from', target:'new device', time:'45m ago' },
  { id:'a3', repId:'2', action:'exported', target:'Q3 Sales Report', time:'2h ago' },
  { id:'a4', repId:'6', action:'invited', target:'Mike Davis', time:'5h ago' },
  { id:'a5', repId:'3', action:'changed role to', target:'Sales Rep', time:'1d ago' },
  { id:'a6', repId:'5', action:'removed access for', target:'Contracts Module', time:'1d ago' },
];

const ROLES_INIT = [
  { id:'r1', name:'Admin', modules:{ contracts:{v:true,e:true,d:true}, payments:{v:true,e:true,d:true}, marketing:{v:true,e:true,d:true}, workspace:{v:true,e:true,d:true}, analytics:{v:true,e:true,d:true} }},
  { id:'r2', name:'Manager', modules:{ contracts:{v:true,e:true,d:false}, payments:{v:true,e:true,d:false}, marketing:{v:true,e:true,d:false}, workspace:{v:true,e:false,d:false}, analytics:{v:true,e:true,d:false} }},
  { id:'r3', name:'Sales Rep', modules:{ contracts:{v:true,e:false,d:false}, payments:{v:true,e:false,d:false}, marketing:{v:true,e:true,d:false}, workspace:{v:false,e:false,d:false}, analytics:{v:true,e:false,d:false} }},
  { id:'r4', name:'Viewer', modules:{ contracts:{v:true,e:false,d:false}, payments:{v:false,e:false,d:false}, marketing:{v:true,e:false,d:false}, workspace:{v:false,e:false,d:false}, analytics:{v:true,e:false,d:false} }},
];

// ─── Shared primitives ────────────────────────────────────────────
function Avatar({ rep, size = 34 }: { rep: typeof REPS[0]; size?: number }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: rep.color, flexShrink: 0,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: '#fff', fontWeight: 700, fontSize: size * 0.35, fontFamily: T.font,
      letterSpacing: 0.5,
    }}>{rep.initials}</div>
  );
}

function Tag({ label, color = T.accent }: { label: string; color?: string }) {
  return (
    <span style={{
      padding: '2px 8px', borderRadius: 6, fontSize: 11, fontWeight: 600,
      fontFamily: T.font, background: `${color}18`, color,
      border: `0.5px solid ${color}40`,
    }}>{label}</span>
  );
}

function Card({ children, style = {} }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{
      background: T.surfaceEl, border: T.border, borderRadius: T.radius,
      padding: 16, ...style,
    }}>{children}</div>
  );
}

// ─── MEMBERS TAB ──────────────────────────────────────────────────
function MembersTab() {
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('All Roles');
  const [statusFilter, setStatusFilter] = useState('All Statuses');

  const filtered = REPS.filter(r => {
    if (search && !r.name.toLowerCase().includes(search.toLowerCase()) && !r.email.toLowerCase().includes(search.toLowerCase())) return false;
    if (roleFilter !== 'All Roles' && r.role !== roleFilter) return false;
    if (statusFilter !== 'All Statuses' && r.status !== statusFilter) return false;
    return true;
  });

  const statusColor = (s: string) => s === 'Active' ? '#10b981' : s === 'Invited' ? '#f59e0b' : T.textMuted;

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto' }}>
      <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
        <input 
          placeholder="Search members..." 
          value={search} onChange={e => setSearch(e.target.value)}
          style={{ flex: 1, background: T.surfaceEl, border: T.border, borderRadius: T.radiusSm, padding: '10px 14px', color: T.text, fontSize: 13, fontFamily: T.font, outline: 'none' }}
        />
        <select value={roleFilter} onChange={e => setRoleFilter(e.target.value)} style={{ background: T.surfaceEl, border: T.border, borderRadius: T.radiusSm, padding: '10px 14px', color: T.text, fontSize: 13, fontFamily: T.font, outline: 'none', cursor: 'pointer' }}>
          <option>All Roles</option>
          <option>Admin</option>
          <option>Manager</option>
          <option>Sales Rep</option>
          <option>Viewer</option>
        </select>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} style={{ background: T.surfaceEl, border: T.border, borderRadius: T.radiusSm, padding: '10px 14px', color: T.text, fontSize: 13, fontFamily: T.font, outline: 'none', cursor: 'pointer' }}>
          <option>All Statuses</option>
          <option>Active</option>
          <option>Invited</option>
          <option>Inactive</option>
        </select>
      </div>

      <Card style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.5fr 1fr 1fr 80px', gap: 16, padding: '12px 20px', borderBottom: T.border, background: T.surface }}>
          {['Member', 'Role', 'Status', 'Last Active', 'Actions'].map(h => (
            <span key={h} style={{ fontSize: 11, fontWeight: 700, color: T.textMuted, textTransform: 'uppercase', letterSpacing: 0.8, fontFamily: T.font }}>{h}</span>
          ))}
        </div>
        
        {filtered.map(rep => (
          <div key={rep.id} style={{ display: 'grid', gridTemplateColumns: '2fr 1.5fr 1fr 1fr 80px', gap: 16, padding: '14px 20px', borderBottom: T.border, alignItems: 'center', transition: 'background 0.15s' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <Avatar rep={rep} size={36} />
              <div style={{ minWidth: 0 }}>
                <p style={{ fontSize: 14, fontWeight: 600, color: T.text, fontFamily: T.font, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{rep.name}</p>
                <p style={{ fontSize: 12, color: T.textMuted, fontFamily: T.font, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{rep.email}</p>
              </div>
            </div>
            
            <div>
              <select defaultValue={rep.role} style={{ background: 'transparent', border: `0.5px solid ${T.textMuted}40`, borderRadius: 6, padding: '4px 8px', color: T.text, fontSize: 12, fontFamily: T.font, outline: 'none', cursor: 'pointer' }}>
                <option>Admin</option>
                <option>Manager</option>
                <option>Sales Rep</option>
                <option>Viewer</option>
              </select>
            </div>
            
            <div>
              <span style={{ fontSize: 11, fontWeight: 700, color: statusColor(rep.status), background: `${statusColor(rep.status)}15`, padding: '4px 8px', borderRadius: 99, border: `0.5px solid ${statusColor(rep.status)}40` }}>{rep.status}</span>
            </div>
            
            <span style={{ fontSize: 13, color: T.textMuted, fontFamily: T.font }}>{rep.lastActive}</span>
            
            <div style={{ display: 'flex', gap: 16 }}>
              <button style={{ background: 'transparent', border: 'none', color: T.textMuted, cursor: 'pointer', fontSize: 16 }} title="Edit">✎</button>
              <button style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: 16 }} title="Remove">✕</button>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div style={{ padding: 40, textAlign: 'center', color: T.textMuted, fontSize: 14, fontFamily: T.font }}>No members found.</div>
        )}
      </Card>
    </div>
  );
}

// ─── ROLES MATRIX ─────────────────────────────────────────────────
function RolesMatrix() {
  const [matrix, setMatrix] = useState(ROLES_INIT);
  const [selectedRoleId, setSelectedRoleId] = useState(ROLES_INIT[0].id);
  const [status, setStatus] = useState<'idle'|'saving'|'saved'>('idle');

  const selectedRole = matrix.find(r => r.id === selectedRoleId) || matrix[0];

  const toggle = (mod: string, perm: 'v'|'e'|'d') => {
    setMatrix(prev => prev.map(r =>
      r.id === selectedRoleId
        ? { ...r, modules: { ...r.modules, [mod]: { ...r.modules[mod as keyof typeof r.modules], [perm]: !r.modules[mod as keyof typeof r.modules][perm] } } }
        : r
    ));
    setStatus('idle');
  };

  const save = () => {
    setStatus('saving');
    setTimeout(() => { setStatus('saved'); setTimeout(() => setStatus('idle'), 2000); }, 700);
  };

  const MODULES = ['contracts', 'payments', 'marketing', 'workspace', 'analytics'];
  const PERMS: { key:'v'|'e'|'d'; label:string }[] = [
    { key:'v', label:'View' }, { key:'e', label:'Edit' }, { key:'d', label:'None' }, // Using 'None' instead of Delete to match prompt access levels
  ];

  const CheckBtn = ({ on, onClick, label }: { on: boolean; onClick: () => void; label: string }) => (
    <button
      onClick={onClick}
      style={{
        width: '100%', padding: '8px', borderRadius: T.radiusSm, border: T.border, cursor: 'pointer',
        background: on ? T.accent : T.surfaceHover,
        color: on ? '#fff' : T.textMuted,
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        fontSize: 12, fontWeight: 600, transition: 'all 0.15s',
        fontFamily: T.font,
      }}
    >
      <span style={{ fontSize: 14 }}>{on ? '✓' : '–'}</span> {label}
    </button>
  );

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', display: 'flex', gap: 32, height: '100%', alignItems: 'flex-start' }}>
      {/* Left: Role List */}
      <div style={{ width: 240, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: T.text, fontFamily: T.font }}>Roles</h2>
          <button style={{ background: T.surfaceHover, border: T.border, borderRadius: 6, color: T.text, padding: '4px 10px', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>+ Add</button>
        </div>
        
        <Card style={{ padding: 8, display: 'flex', flexDirection: 'column', gap: 4 }}>
          {matrix.map(role => (
            <button
              key={role.id}
              onClick={() => setSelectedRoleId(role.id)}
              style={{
                textAlign: 'left', padding: '10px 14px', borderRadius: T.radiusSm, border: 'none', cursor: 'pointer',
                background: selectedRoleId === role.id ? T.accentBg : 'transparent',
                color: selectedRoleId === role.id ? T.accent : T.text,
                fontWeight: selectedRoleId === role.id ? 700 : 500,
                fontSize: 14, fontFamily: T.font, transition: 'background 0.15s',
                borderLeft: selectedRoleId === role.id ? `3px solid ${T.accent}` : '3px solid transparent'
              }}
            >
              {role.name}
            </button>
          ))}
        </Card>
      </div>

      {/* Right: Permission Matrix */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: T.text, fontFamily: T.font }}>{selectedRole.name} Permissions</h2>
            <p style={{ fontSize: 12, color: T.textMuted, marginTop: 4 }}>Configure access levels for each module.</p>
          </div>
          <button
            onClick={save}
            disabled={status === 'saving'}
            style={{
              padding: '8px 22px', borderRadius: T.radiusSm, border: 'none', cursor: 'pointer',
              background: status === 'saved' ? '#10b981' : T.accent,
              color: '#fff', fontWeight: 700, fontSize: 13, fontFamily: T.font, transition: 'all 0.2s',
            }}
          >
            {status === 'saving' ? 'Saving…' : status === 'saved' ? '✓ Saved' : 'Save changes'}
          </button>
        </div>

        <Card style={{ padding: 0, overflow: 'hidden' }}>
          {MODULES.map((mod, idx) => {
            const m = selectedRole.modules[mod as keyof typeof selectedRole.modules];
            return (
              <div key={mod} style={{ padding: '16px 20px', borderBottom: idx < MODULES.length - 1 ? T.border : 'none' }}>
                <p style={{ fontSize: 14, fontWeight: 700, color: T.text, textTransform: 'capitalize', fontFamily: T.font, marginBottom: 12 }}>{mod}</p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
                  {PERMS.map(p => (
                    <CheckBtn key={p.key} label={p.label} on={m[p.key]} onClick={() => toggle(mod, p.key)} />
                  ))}
                </div>
              </div>
            );
          })}
        </Card>
      </div>
    </div>
  );
}

// ─── ACTIVITY FEED ────────────────────────────────────────────────
function ActivityFeed() {
  const [memberFilter, setMemberFilter] = useState('All');

  const filtered = memberFilter === 'All' ? FEED : FEED.filter(f => f.repId === memberFilter);

  return (
    <div style={{ maxWidth: 700, margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: T.text, fontFamily: T.font }}>Activity log</h2>
          <p style={{ fontSize: 13, color: T.textMuted, marginTop: 3 }}>Live stream of team actions</p>
        </div>
        <select value={memberFilter} onChange={e => setMemberFilter(e.target.value)} style={{ background: T.surfaceEl, border: T.border, borderRadius: T.radiusSm, padding: '8px 12px', color: T.text, fontSize: 13, fontFamily: T.font, outline: 'none', cursor: 'pointer' }}>
          <option value="All">All Members</option>
          {REPS.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
        </select>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {filtered.map(item => {
          const rep = REPS.find(r => r.id === item.repId) || REPS[0];
          return (
            <Card key={item.id} style={{ display: 'flex', gap: 12, alignItems: 'center', padding: '14px 16px' }}>
              <Avatar rep={rep} size={36} />
              <div style={{ flex: 1, minWidth: 0, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <p style={{ fontSize: 14, color: T.text, fontFamily: T.font }}>
                  <span style={{ fontWeight: 700 }}>{rep.name}</span>
                  {' '}<span style={{ color: T.textSub }}>{item.action}</span>
                  {' '}<span style={{ fontWeight: 700, color: T.accent }}>{item.target}</span>
                </p>
                <span style={{ fontSize: 11, color: T.textMuted, fontFamily: T.font, flexShrink: 0 }}>{item.time}</span>
              </div>
            </Card>
          );
        })}
        {filtered.length === 0 && (
          <div style={{ padding: 40, textAlign: 'center', color: T.textMuted, fontSize: 14, fontFamily: T.font }}>No activity found for this member.</div>
        )}
      </div>
    </div>
  );
}

// ─── LEADERBOARD ──────────────────────────────────────────────────
function Leaderboard() {
  const sorted = [...REPS].sort((a, b) => b.points - a.points);

  const BADGE = (rep: typeof REPS[0], rank: number) => {
    const badges: { label:string; color:string }[] = [];
    if (rank === 0) badges.push({ label:'🏆 Top closer', color:'#f59e0b' });
    if (rep.revenue > 100000) badges.push({ label:'💰 Big hitter', color:'#10b981' });
    if (parseFloat(rep.responseTime) < 1.5) badges.push({ label:'⚡ Fast Replier', color:T.accent });
    return badges;
  };

  const NEXT_LEVEL_PTS = 1000;

  return (
    <div style={{ maxWidth: 940, margin: '0 auto' }}>
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, color: T.text, fontFamily: T.font }}>Weekly leaderboard</h2>
        <p style={{ fontSize: 13, color: T.textMuted, marginTop: 3 }}>Points from closed deals, follow-ups and tasks</p>
      </div>

      <Card style={{ padding: 0, overflow: 'hidden' }}>
        {/* Table header */}
        <div style={{ display: 'grid', gridTemplateColumns: '48px 1fr 200px 100px 100px 140px', gap: 0, padding: '12px 20px', borderBottom: T.border, background: T.surface }}>
          {['#','Rep','Badges','Response','Points','Level'].map(h => (
            <span key={h} style={{ fontSize: 11, fontWeight: 700, color: T.textMuted, textTransform: 'uppercase', letterSpacing: 0.8, fontFamily: T.font }}>{h}</span>
          ))}
        </div>

        {sorted.map((rep, idx) => {
          const badges = BADGE(rep, idx);
          const pct = (rep.points % NEXT_LEVEL_PTS) / NEXT_LEVEL_PTS * 100;
          const rankColor = idx === 0 ? '#f59e0b' : idx === 1 ? '#94a3b8' : idx === 2 ? '#cd7c2f' : T.textMuted;

          return (
            <div
              key={rep.id}
              style={{
                display: 'grid', gridTemplateColumns: '48px 1fr 200px 100px 100px 140px',
                gap: 0, padding: '14px 20px', borderBottom: T.border, alignItems: 'center',
                background: idx === 0 ? 'rgba(245,158,11,0.04)' : 'transparent',
                transition: 'background 0.15s',
              }}
            >
              {/* Rank */}
              <span style={{ fontSize: 16, fontWeight: 800, color: rankColor, fontFamily: T.font }}>{idx + 1}</span>

              {/* Rep */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <Avatar rep={rep} size={36} />
                <div style={{ minWidth: 0 }}>
                  <p style={{ fontSize: 14, fontWeight: 600, color: T.text, fontFamily: T.font, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{rep.name}</p>
                  <p style={{ fontSize: 11, color: T.textMuted, fontFamily: T.font }}>{rep.role} · {rep.dealsClosed} deals</p>
                </div>
              </div>

              {/* Badges */}
              <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', paddingRight: 10 }}>
                {badges.map(b => <Tag key={b.label} label={b.label} color={b.color} />)}
              </div>

              {/* Response */}
              <span style={{ fontSize: 14, fontWeight: 600, color: T.textSub, fontFamily: T.font }}>{rep.responseTime}</span>

              {/* Points */}
              <span style={{ fontSize: 18, fontWeight: 800, color: T.accent, fontFamily: T.font }}>{rep.points.toLocaleString()}</span>

              {/* Level + progress */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: T.textSub, fontFamily: T.font }}>Lv {rep.level}</span>
                  <span style={{ fontSize: 11, color: T.textMuted, fontFamily: T.font }}>{Math.round(pct)}%</span>
                </div>
                <div style={{ height: 4, background: T.surfaceHover, borderRadius: 99, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${pct}%`, background: T.accent, borderRadius: 99, transition: 'width 0.6s ease' }} />
                </div>
              </div>
            </div>
          );
        })}
      </Card>
    </div>
  );
}

// ─── NAV SHELL ────────────────────────────────────────────────────
const VIEWS = [
  { id: 'members',     label: 'Members',             icon: Users,    component: MembersTab },
  { id: 'roles',       label: 'Roles & Permissions', icon: Shield,   component: RolesMatrix },
  { id: 'activity',    label: 'Activity Log',        icon: Activity, component: ActivityFeed },
  { id: 'leaderboard', label: 'Leaderboard',         icon: Trophy,   component: Leaderboard },
];

export default function TeamPage() {
  const [view, setView] = useState('members');
  const ActiveView = VIEWS.find(v => v.id === view)?.component || MembersTab;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden', background: T.surface, fontFamily: T.font }}>

      {/* ── Header ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 24px', borderBottom: T.border, background: T.surface }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: T.text, margin: 0, fontFamily: T.font }}>Team</h1>
          <Tag label={`${REPS.length} Members`} color={T.accent} />
        </div>
        <button style={{ display: 'flex', alignItems: 'center', gap: 8, background: T.accent, color: '#fff', border: 'none', borderRadius: T.radiusSm, padding: '10px 18px', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: T.font, transition: 'background 0.2s' }}>
          + Invite Member
        </button>
      </div>

      {/* ── Body ── */}
      <div style={{ display: 'flex', flex: 1, minHeight: 0, overflow: 'hidden' }}>
        {/* Sidebar */}
        <nav style={{ width: 200, flexShrink: 0, borderRight: T.border, background: T.surfaceEl, padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: 4 }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: T.textMuted, letterSpacing: 1.2, textTransform: 'uppercase', padding: '4px 10px 12px', marginBottom: 2 }}>Management</p>
          {VIEWS.map(v => {
            const Icon = v.icon;
            const active = view === v.id;
            return (
              <button
                key={v.id}
                onClick={() => setView(v.id)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '10px 12px', borderRadius: 10, border: 'none', cursor: 'pointer',
                  background: active ? T.accentBg : 'transparent',
                  color: active ? T.accent : T.textMuted,
                  fontSize: 14, fontWeight: active ? 700 : 500,
                  fontFamily: T.font, transition: 'all 0.15s', textAlign: 'left',
                  borderLeft: active ? `3px solid ${T.accent}` : '3px solid transparent',
                }}
              >
                <Icon size={16} style={{ flexShrink: 0 }} />
                {v.label}
              </button>
            );
          })}
        </nav>

        {/* Content */}
        <div style={{ flex: 1, overflow: 'auto', padding: '24px 32px' }}>
          <ActiveView />
        </div>
      </div>
    </div>
  );
}
