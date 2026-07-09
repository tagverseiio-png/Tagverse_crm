'use client';
import React, { useState, useEffect } from 'react';
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

const ROLES_INIT = [
  { id:'r1', name:'Admin', modules:{ contracts:{v:true,e:true,d:true}, payments:{v:true,e:true,d:true}, marketing:{v:true,e:true,d:true}, workspace:{v:true,e:true,d:true}, analytics:{v:true,e:true,d:true} }},
  { id:'r2', name:'Manager', modules:{ contracts:{v:true,e:true,d:false}, payments:{v:true,e:true,d:false}, marketing:{v:true,e:true,d:false}, workspace:{v:true,e:false,d:false}, analytics:{v:true,e:true,d:false} }},
  { id:'r3', name:'Sales Rep', modules:{ contracts:{v:true,e:false,d:false}, payments:{v:true,e:false,d:false}, marketing:{v:true,e:true,d:false}, workspace:{v:false,e:false,d:false}, analytics:{v:true,e:false,d:false} }},
  { id:'r4', name:'Viewer', modules:{ contracts:{v:true,e:false,d:false}, payments:{v:false,e:false,d:false}, marketing:{v:true,e:false,d:false}, workspace:{v:false,e:false,d:false}, analytics:{v:true,e:false,d:false} }},
];

// ─── Shared primitives ────────────────────────────────────────────
function Avatar({ rep, size = 34 }: { rep: any; size?: number }) {
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
function MembersTab({ reps }: { reps: any[] }) {
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('All Roles');
  const [statusFilter, setStatusFilter] = useState('All Statuses');

  const filtered = reps.filter(r => {
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
function ActivityFeed({ reps, feed }: { reps: any[], feed: any[] }) {
  const [filter, setFilter] = useState('All Activity');

  const filtered = feed.filter(f => {
    if (filter !== 'All Activity' && f.action !== filter) return false;
    return true;
  });

  return (
    <div style={{ maxWidth: 800, margin: '0 auto' }}>
      <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
        <select value={filter} onChange={e => setFilter(e.target.value)} style={{ background: T.surfaceEl, border: T.border, borderRadius: T.radiusSm, padding: '10px 14px', color: T.text, fontSize: 13, fontFamily: T.font, outline: 'none', cursor: 'pointer' }}>
          <option>All Activity</option>
          <option>updated permissions for</option>
          <option>logged in from</option>
          <option>exported</option>
          <option>invited</option>
          <option>changed role to</option>
          <option>removed access for</option>
        </select>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {filtered.map(item => {
          const rep = reps.find(r => r.id === item.repId);
          if (!rep) return null;
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


// ─── NAV SHELL ────────────────────────────────────────────────────
const VIEWS = [
  { id: 'members',     label: 'Members',             icon: Users,    component: MembersTab },
  { id: 'roles',       label: 'Roles & Permissions', icon: Shield,   component: RolesMatrix },
  { id: 'activity',    label: 'Activity Log',        icon: Activity, component: ActivityFeed },
];

export default function TeamPage() {
  const [view, setView] = useState('members');
  const [reps, setReps] = useState<any[]>([]);
  const [feed, setFeed] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/team')
      .then(res => res.json())
      .then(data => {
        setReps(data.reps || []);
        setFeed(data.feed || []);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const ActiveView = VIEWS.find(v => v.id === view)?.component || MembersTab;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden', background: T.surface, fontFamily: T.font }}>

      {/* ── Header ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 24px', borderBottom: T.border, background: T.surface }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: T.text, margin: 0, fontFamily: T.font }}>Team</h1>
          {!loading && <Tag label={`${reps.length} Members`} color={T.accent} />}
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
        <div style={{ flex: 1, position: 'relative', overflowY: 'auto' }}>
          {loading ? (
             <div style={{ padding: 40, textAlign: 'center', color: T.textMuted }}>Loading team data...</div>
          ) : (
            <div style={{ position: 'absolute', inset: 0, padding: 32, overflowY: 'auto' }}>
              <ActiveView reps={reps} feed={feed} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
