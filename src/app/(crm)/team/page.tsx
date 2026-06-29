'use client';
import React, { useState } from 'react';
import { MessageSquare, Trophy, Shield, Activity } from 'lucide-react';

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
  { id:'1', name:'Alex Johnson',   initials:'AJ', color:'#10b981', role:'Senior Rep',  dealsClosed:42, revenue:125000, tasksDone:85,  points:4200, level:5, expertise:['Enterprise','Tech'] },
  { id:'2', name:'Sarah Miller',   initials:'SM', color:'#f59e0b', role:'Sales Rep',    dealsClosed:28, revenue:84000,  tasksDone:62,  points:2850, level:4, expertise:['SMB','Retail'] },
  { id:'3', name:'Mike Davis',     initials:'MD', color:'#3b82f6', role:'Sales Rep',    dealsClosed:35, revenue:95000,  tasksDone:70,  points:3500, level:4, expertise:['Mid-Market','Finance'] },
  { id:'4', name:'Elena Rodriguez',initials:'ER', color:'#8b5cf6', role:'SDR',          dealsClosed:15, revenue:30000,  tasksDone:110, points:2100, level:3, expertise:['Outbound'] },
  { id:'5', name:'David Chen',     initials:'DC', color:'#ec4899', role:'Account Exec', dealsClosed:20, revenue:75000,  tasksDone:45,  points:2600, level:3, expertise:['Renewals','Tech'] },
  { id:'6', name:'Lisa Taylor',    initials:'LT', color:'#06b6d4', role:'VP Sales',     dealsClosed:5,  revenue:250000, tasksDone:20,  points:5500, level:6, expertise:['Strategic','Enterprise'] },
];

const DEALS = [
  { id:'d1', name:'Acme Corp Upgrade',    value:25000, status:'In Progress', repId:'1' },
  { id:'d2', name:'TechStart License',    value:8500,  status:'New',         repId:null },
  { id:'d3', name:'Global Retail Pos',    value:45000, status:'In Progress', repId:'2' },
  { id:'d4', name:'FinServe Cloud',       value:60000, status:'New',         repId:null },
  { id:'d5', name:'Local Shop POS',       value:3000,  status:'In Progress', repId:'4' },
  { id:'d6', name:'MegaBank System',      value:120000,status:'Won',         repId:'6' },
];

const FEED = [
  { id:'a1', repId:'1', type:'deal',  action:'moved',    target:'Acme Corp Upgrade',  detail:'to Negotiation',  time:'10m ago' },
  { id:'a2', repId:'4', type:'task',  action:'completed',target:'Call 10 leads',      detail:'',                time:'45m ago' },
  { id:'a3', repId:'2', type:'email', action:'sent proposal to',target:'Global Retail Pos',detail:'',           time:'2h ago'  },
  { id:'a4', repId:'6', type:'deal',  action:'closed won',target:'MegaBank System',   detail:'$120k',           time:'5h ago'  },
  { id:'a5', repId:'3', type:'task',  action:'added note to',target:'EduTech Platform',detail:'',              time:'1d ago'  },
  { id:'a6', repId:'5', type:'deal',  action:'updated',  target:'AutoParts CRM',     detail:'new contact added',time:'1d ago' },
];

const ROLES_INIT = [
  { id:'r1', name:'Admin',    modules:{ deals:{v:true,e:true,d:true},  contacts:{v:true,e:true,d:true},  reports:{v:true,e:true,d:true},  settings:{v:true,e:true,d:true}  }},
  { id:'r2', name:'Manager',  modules:{ deals:{v:true,e:true,d:false}, contacts:{v:true,e:true,d:false}, reports:{v:true,e:false,d:false}, settings:{v:false,e:false,d:false}}},
  { id:'r3', name:'Sales rep',modules:{ deals:{v:true,e:true,d:false}, contacts:{v:true,e:true,d:false}, reports:{v:false,e:false,d:false},settings:{v:false,e:false,d:false}}},
  { id:'r4', name:'Viewer',   modules:{ deals:{v:true,e:false,d:false},contacts:{v:true,e:false,d:false},reports:{v:true,e:false,d:false}, settings:{v:false,e:false,d:false}}},
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

// ─── WAR ROOM ─────────────────────────────────────────────────────
function WarRoom() {
  const [selectedDeal, setSelectedDeal] = useState(DEALS[0]);
  const [messages, setMessages] = useState([
    { id:1, repId:'1', text:'Just spoke to their CTO — budget confirmed for Q3.', time:'10:30' },
    { id:2, repId:'6', text:'@Alex great. Loop in legal by Thursday for the SLA review.', time:'10:48' },
    { id:3, repId:'3', text:'I can handle the technical questions — added to the thread.', time:'11:02' },
  ]);
  const [input, setInput] = useState('');

  const send = () => {
    if (!input.trim()) return;
    setMessages(m => [...m, { id: Date.now(), repId:'1', text: input, time: 'now' }]);
    setInput('');
  };

  const statusColor = (s: string) => s === 'Won' ? '#10b981' : s === 'New' ? '#f59e0b' : T.accent;

  return (
    <div style={{ display:'flex', gap:0, height:'100%', overflow:'hidden' }}>

      {/* Col 1 — Deal list */}
      <div style={{ width:220, flexShrink:0, borderRight:T.border, overflowY:'auto', padding:'8px 0' }}>
        <p style={{ fontSize:11, fontWeight:700, color:T.textMuted, padding:'0 14px 8px', letterSpacing:1, textTransform:'uppercase' }}>Deals</p>
        {DEALS.map(deal => {
          const active = selectedDeal.id === deal.id;
          return (
            <div
              key={deal.id}
              onClick={() => setSelectedDeal(deal)}
              style={{
                padding:'10px 14px', cursor:'pointer', transition:'background 0.15s',
                borderLeft: active ? `3px solid ${T.accent}` : '3px solid transparent',
                background: active ? T.accentBg : 'transparent',
              }}
            >
              <p style={{ fontSize:13, fontWeight:600, color:T.text, marginBottom:3 }}>{deal.name}</p>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                <span style={{ fontSize:11, color:T.textMuted }}>${deal.value.toLocaleString()}</span>
                <span style={{ fontSize:10, fontWeight:700, color:statusColor(deal.status), background:`${statusColor(deal.status)}15`, padding:'1px 7px', borderRadius:99 }}>{deal.status}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Col 2 — Chat */}
      <div style={{ flex:1, display:'flex', flexDirection:'column', borderRight:T.border, overflow:'hidden' }}>
        {/* Chat header */}
        <div style={{ padding:'14px 18px', borderBottom:T.border, background:T.surfaceEl }}>
          <p style={{ fontWeight:700, fontSize:15, color:T.text }}>{selectedDeal.name}</p>
          <p style={{ fontSize:11, color:T.textMuted, marginTop:2 }}>${selectedDeal.value.toLocaleString()} · {selectedDeal.status}</p>
        </div>

        {/* Messages */}
        <div style={{ flex:1, overflowY:'auto', padding:'16px 18px', display:'flex', flexDirection:'column', gap:16 }}>
          {messages.map(msg => {
            const rep = REPS.find(r => r.id === msg.repId) || REPS[0];
            return (
              <div key={msg.id} style={{ display:'flex', gap:10 }}>
                <Avatar rep={rep} size={30} />
                <div>
                  <div style={{ display:'flex', alignItems:'baseline', gap:8, marginBottom:4 }}>
                    <span style={{ fontSize:13, fontWeight:700, color:T.text }}>{rep.name}</span>
                    <span style={{ fontSize:11, color:T.textMuted }}>{msg.time}</span>
                  </div>
                  <div style={{
                    background:T.surfaceHover, border:T.border,
                    borderRadius:`0 ${T.radius}px ${T.radius}px ${T.radius}px`,
                    padding:'9px 13px', fontSize:13, color:T.textSub, lineHeight:1.55,
                  }}>
                    {msg.text.split(/(@\S+)/g).map((part, i) =>
                      part.startsWith('@')
                        ? <span key={i} style={{ color:T.accent, fontWeight:600 }}>{part}</span>
                        : part
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Input */}
        <div style={{ padding:'12px 18px', borderTop:T.border, background:T.surfaceEl }}>
          <div style={{ display:'flex', gap:8, alignItems:'center', background:T.surfaceHover, border:T.border, borderRadius:T.radiusSm, padding:'6px 10px 6px 14px' }}>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && send()}
              placeholder="Message or @mention…"
              style={{ flex:1, background:'transparent', border:'none', outline:'none', fontSize:13, color:T.text, fontFamily:T.font }}
            />
            <button
              onClick={send}
              style={{ background:T.accent, border:'none', borderRadius:6, color:'#fff', padding:'6px 14px', fontWeight:600, fontSize:12, cursor:'pointer', fontFamily:T.font }}
            >Send</button>
          </div>
        </div>
      </div>

      {/* Col 3 — Notes + tasks */}
      <div style={{ width:240, flexShrink:0, overflowY:'auto', padding:16, display:'flex', flexDirection:'column', gap:16 }}>
        <div>
          <p style={{ fontSize:11, fontWeight:700, color:T.textMuted, letterSpacing:1, textTransform:'uppercase', marginBottom:10 }}>📌 Pinned note</p>
          <div style={{ background:'rgba(245,158,11,0.08)', border:'0.5px solid rgba(245,158,11,0.3)', borderRadius:T.radius, padding:'10px 12px', fontSize:13, color:'#fbbf24', lineHeight:1.6 }}>
            Decision maker is Jane Doe. Budget approved — needs legal sign-off by Fri.
          </div>
        </div>

        <div>
          <p style={{ fontSize:11, fontWeight:700, color:T.textMuted, letterSpacing:1, textTransform:'uppercase', marginBottom:10 }}>✅ Shared tasks</p>
          <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
            {[
              { label:'Send pitch deck', done:true },
              { label:'Schedule technical demo', done:false },
              { label:'Prepare pricing proposal', done:false },
              { label:'Legal SLA review', done:false },
            ].map((task, i) => (
              <label key={i} style={{ display:'flex', alignItems:'flex-start', gap:9, cursor:'pointer' }}>
                <input
                  type="checkbox"
                  defaultChecked={task.done}
                  style={{ marginTop:2, accentColor:T.accent }}
                />
                <span style={{ fontSize:13, color: task.done ? T.textMuted : T.textSub, textDecoration: task.done ? 'line-through' : 'none', lineHeight:1.4 }}>
                  {task.label}
                </span>
              </label>
            ))}
          </div>
        </div>
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
    if (rep.tasksDone > 80) badges.push({ label:'⚡ Task master', color:T.accent });
    if (rep.revenue > 100000) badges.push({ label:'💰 Big hitter', color:'#10b981' });
    return badges;
  };

  const NEXT_LEVEL_PTS = 1000;

  return (
    <div style={{ maxWidth:860, margin:'0 auto' }}>
      <div style={{ marginBottom:20 }}>
        <h2 style={{ fontSize:18, fontWeight:700, color:T.text, fontFamily:T.font }}>Weekly leaderboard</h2>
        <p style={{ fontSize:13, color:T.textMuted, marginTop:3 }}>Points from closed deals, follow-ups and tasks</p>
      </div>

      <Card style={{ padding:0, overflow:'hidden' }}>
        {/* Table header */}
        <div style={{ display:'grid', gridTemplateColumns:'48px 1fr 200px 100px 160px', gap:0, padding:'12px 20px', borderBottom:T.border, background:T.surface }}>
          {['#','Rep','Badges','Points','Level'].map(h => (
            <span key={h} style={{ fontSize:11, fontWeight:700, color:T.textMuted, textTransform:'uppercase', letterSpacing:0.8, fontFamily:T.font }}>{h}</span>
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
                display:'grid', gridTemplateColumns:'48px 1fr 200px 100px 160px',
                gap:0, padding:'14px 20px', borderBottom:T.border, alignItems:'center',
                background: idx === 0 ? 'rgba(245,158,11,0.04)' : 'transparent',
                transition:'background 0.15s',
              }}
            >
              {/* Rank */}
              <span style={{ fontSize:16, fontWeight:800, color:rankColor, fontFamily:T.font }}>{idx + 1}</span>

              {/* Rep */}
              <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                <Avatar rep={rep} size={36} />
                <div>
                  <p style={{ fontSize:14, fontWeight:600, color:T.text, fontFamily:T.font }}>{rep.name}</p>
                  <p style={{ fontSize:11, color:T.textMuted, fontFamily:T.font }}>{rep.role} · {rep.dealsClosed} deals</p>
                </div>
              </div>

              {/* Badges */}
              <div style={{ display:'flex', gap:4, flexWrap:'wrap' }}>
                {badges.map(b => <Tag key={b.label} label={b.label} color={b.color} />)}
              </div>

              {/* Points */}
              <span style={{ fontSize:18, fontWeight:800, color:T.accent, fontFamily:T.font }}>{rep.points.toLocaleString()}</span>

              {/* Level + progress */}
              <div>
                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:5 }}>
                  <span style={{ fontSize:12, fontWeight:700, color:T.textSub, fontFamily:T.font }}>Lv {rep.level}</span>
                  <span style={{ fontSize:11, color:T.textMuted, fontFamily:T.font }}>{Math.round(pct)}%</span>
                </div>
                <div style={{ height:4, background:T.surfaceHover, borderRadius:99, overflow:'hidden' }}>
                  <div style={{ height:'100%', width:`${pct}%`, background:T.accent, borderRadius:99, transition:'width 0.6s ease' }} />
                </div>
              </div>
            </div>
          );
        })}
      </Card>
    </div>
  );
}

// ─── ROLES MATRIX ─────────────────────────────────────────────────
function RolesMatrix() {
  const [matrix, setMatrix] = useState(ROLES_INIT);
  const [status, setStatus] = useState<'idle'|'saving'|'saved'>('idle');

  const toggle = (rId: string, mod: string, perm: 'v'|'e'|'d') => {
    setMatrix(prev => prev.map(r =>
      r.id === rId
        ? { ...r, modules: { ...r.modules, [mod]: { ...r.modules[mod as keyof typeof r.modules], [perm]: !r.modules[mod as keyof typeof r.modules][perm] } } }
        : r
    ));
    setStatus('idle');
  };

  const save = () => {
    setStatus('saving');
    setTimeout(() => { setStatus('saved'); setTimeout(() => setStatus('idle'), 2000); }, 700);
  };

  const MODULES = ['deals', 'contacts', 'reports', 'settings'];
  const PERMS: { key:'v'|'e'|'d'; label:string }[] = [
    { key:'v', label:'View' }, { key:'e', label:'Edit' }, { key:'d', label:'Delete' },
  ];

  const CheckBtn = ({ on, onClick }: { on: boolean; onClick: () => void }) => (
    <button
      onClick={onClick}
      style={{
        width:28, height:28, borderRadius:T.radiusSm, border:T.border, cursor:'pointer',
        background: on ? T.accent : T.surfaceHover,
        color: on ? '#fff' : T.textMuted,
        display:'flex', alignItems:'center', justifyContent:'center',
        fontSize:13, fontWeight:700, transition:'all 0.15s',
        fontFamily:T.font,
      }}
    >{on ? '✓' : '–'}</button>
  );

  return (
    <div style={{ maxWidth:880, margin:'0 auto' }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-end', marginBottom:20 }}>
        <div>
          <h2 style={{ fontSize:18, fontWeight:700, color:T.text, fontFamily:T.font }}>Role & permission builder</h2>
          <p style={{ fontSize:13, color:T.textMuted, marginTop:3 }}>Toggle access per role and module. Changes auto-save.</p>
        </div>
        <button
          onClick={save}
          disabled={status === 'saving'}
          style={{
            padding:'8px 22px', borderRadius:T.radiusSm, border:'none', cursor:'pointer',
            background: status === 'saved' ? '#10b981' : T.accent,
            color:'#fff', fontWeight:700, fontSize:13, fontFamily:T.font, transition:'all 0.2s',
          }}
        >
          {status === 'saving' ? 'Saving…' : status === 'saved' ? '✓ Saved' : 'Save changes'}
        </button>
      </div>

      <Card style={{ padding:0, overflow:'hidden' }}>
        {/* Header */}
        <div style={{ display:'grid', gridTemplateColumns:`160px repeat(${MODULES.length}, 1fr)`, borderBottom:T.border, background:T.surface }}>
          <div style={{ padding:'12px 16px' }}/>
          {MODULES.map(mod => (
            <div key={mod} style={{ padding:'12px 8px', textAlign:'center', borderLeft:T.border }}>
              <p style={{ fontSize:12, fontWeight:700, color:T.text, textTransform:'capitalize', fontFamily:T.font }}>{mod}</p>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:4, marginTop:6 }}>
                {PERMS.map(p => (
                  <span key={p.key} style={{ fontSize:10, color:T.textMuted, textAlign:'center', fontFamily:T.font }}>{p.label}</span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Rows */}
        {matrix.map(role => (
          <div key={role.id} style={{ display:'grid', gridTemplateColumns:`160px repeat(${MODULES.length}, 1fr)`, borderBottom:T.border, alignItems:'center' }}>
            <div style={{ padding:'14px 16px' }}>
              <p style={{ fontSize:13, fontWeight:700, color:T.text, fontFamily:T.font }}>{role.name}</p>
            </div>
            {MODULES.map(mod => {
              const m = role.modules[mod as keyof typeof role.modules];
              return (
                <div key={mod} style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:6, padding:'12px 8px', borderLeft:T.border, justifyItems:'center' }}>
                  {PERMS.map(p => (
                    <CheckBtn key={p.key} on={m[p.key]} onClick={() => toggle(role.id, mod, p.key)} />
                  ))}
                </div>
              );
            })}
          </div>
        ))}
      </Card>
    </div>
  );
}

// ─── ACTIVITY FEED ────────────────────────────────────────────────
function ActivityFeed() {
  const [filter, setFilter] = useState('all');
  const [reactions, setReactions] = useState<Record<string, string[]>>({});

  const typeColor = (t: string) => t === 'deal' ? T.accent : t === 'task' ? '#10b981' : '#f59e0b';
  const typeIcon  = (t: string) => t === 'deal' ? '💼' : t === 'task' ? '✅' : '📧';

  const filtered = filter === 'all' ? FEED : FEED.filter(f => f.type === filter);

  const addReaction = (id: string, emoji: string) => {
    setReactions(prev => ({ ...prev, [id]: [...(prev[id] || []), emoji] }));
  };

  return (
    <div style={{ maxWidth:700, margin:'0 auto' }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20 }}>
        <div>
          <h2 style={{ fontSize:18, fontWeight:700, color:T.text, fontFamily:T.font }}>Activity feed</h2>
          <p style={{ fontSize:13, color:T.textMuted, marginTop:3 }}>Live stream of team actions</p>
        </div>
        <div style={{ display:'flex', gap:4 }}>
          {['all','deal','task','email'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                padding:'5px 13px', borderRadius:99, fontSize:12, fontWeight:600, cursor:'pointer',
                border: filter === f ? 'none' : T.border,
                background: filter === f ? T.accent : T.surfaceHover,
                color: filter === f ? '#fff' : T.textMuted,
                fontFamily:T.font, transition:'all 0.15s', textTransform:'capitalize',
              }}
            >{f}</button>
          ))}
        </div>
      </div>

      <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
        {filtered.map(item => {
          const rep = REPS.find(r => r.id === item.repId) || REPS[0];
          const rxns = reactions[item.id] || [];
          const rxnCounts: Record<string, number> = {};
          rxns.forEach(e => rxnCounts[e] = (rxnCounts[e] || 0) + 1);
          const col = typeColor(item.type);

          return (
            <Card key={item.id} style={{ display:'flex', gap:12, alignItems:'flex-start', padding:'14px 16px' }}>
              {/* Type stripe */}
              <div style={{ width:3, alignSelf:'stretch', borderRadius:99, background:col, flexShrink:0 }} />

              {/* Avatar */}
              <Avatar rep={rep} size={36} />

              {/* Content */}
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline' }}>
                  <p style={{ fontSize:14, color:T.text, fontFamily:T.font }}>
                    <span style={{ fontWeight:700 }}>{rep.name}</span>
                    {' '}<span style={{ color:T.textSub }}>{item.action}</span>
                    {' '}<span style={{ fontWeight:700, color:T.accent }}>{item.target}</span>
                    {item.detail && <span style={{ color:T.textMuted }}> · {item.detail}</span>}
                  </p>
                  <span style={{ fontSize:11, color:T.textMuted, fontFamily:T.font, flexShrink:0, marginLeft:12 }}>{item.time}</span>
                </div>

                <div style={{ display:'flex', alignItems:'center', gap:6, marginTop:8 }}>
                  <span style={{ fontSize:12, color:col }}>{typeIcon(item.type)} {item.type}</span>

                  {Object.entries(rxnCounts).map(([emoji, count]) => (
                    <button
                      key={emoji}
                      onClick={() => addReaction(item.id, emoji)}
                      style={{ padding:'2px 8px', borderRadius:99, background:T.surfaceHover, border:T.border, fontSize:12, cursor:'pointer', color:T.textSub, fontFamily:T.font }}
                    >{emoji} {count}</button>
                  ))}

                  {/* Emoji picker */}
                  {['🔥','👍','🚀','🎉'].map(e => (
                    <button
                      key={e}
                      onClick={() => addReaction(item.id, e)}
                      style={{ padding:'1px 5px', background:'transparent', border:'none', fontSize:13, cursor:'pointer', opacity:0.5, transition:'opacity 0.15s' }}
                      title={`React with ${e}`}
                    >{e}</button>
                  ))}
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

// ─── NAV SHELL ────────────────────────────────────────────────────
const VIEWS = [
  { id:'warroom',    label:'War room',      icon:MessageSquare, component:WarRoom      },
  { id:'leaderboard',label:'Leaderboard',   icon:Trophy,        component:Leaderboard  },
  { id:'roles',      label:'Roles matrix',  icon:Shield,        component:RolesMatrix  },
  { id:'activity',   label:'Activity feed', icon:Activity,      component:ActivityFeed },
];

export default function TeamPage() {
  const [view, setView] = useState('warroom');
  const ActiveView = VIEWS.find(v => v.id === view)?.component || WarRoom;
  const activeLabel = VIEWS.find(v => v.id === view)?.label || '';

  return (
    <div style={{ display:'flex', flexDirection:'column', height:'100%', overflow:'hidden', background:T.surface, fontFamily:T.font }}>

      {/* ── Body ── */}
      <div style={{ display:'flex', flex:1, minHeight:0, overflow:'hidden' }}>

        {/* Sidebar */}
        <nav style={{ width:180, flexShrink:0, borderRight:T.border, background:T.surfaceEl, padding:'12px 8px', display:'flex', flexDirection:'column', gap:2 }}>
          <p style={{ fontSize:10, fontWeight:700, color:T.textMuted, letterSpacing:1.2, textTransform:'uppercase', padding:'4px 8px 10px', marginBottom:2 }}>Navigation</p>
          {VIEWS.map(v => {
            const Icon = v.icon;
            const active = view === v.id;
            return (
              <button
                key={v.id}
                onClick={() => setView(v.id)}
                style={{
                  display:'flex', alignItems:'center', gap:9,
                  padding:'9px 10px', borderRadius:10, border:'none', cursor:'pointer',
                  background: active ? T.accentBg : 'transparent',
                  color: active ? T.accent : T.textMuted,
                  fontSize:13, fontWeight: active ? 700 : 500,
                  fontFamily:T.font, transition:'all 0.15s', textAlign:'left',
                  borderLeft: active ? `3px solid ${T.accent}` : '3px solid transparent',
                }}
              >
                <Icon size={15} style={{ flexShrink:0 }} />
                {v.label}
              </button>
            );
          })}
        </nav>

        {/* Content */}
        <div style={{ flex:1, overflow:'auto', padding: view === 'warroom' ? 0 : '24px 28px' }}>
          <ActiveView />
        </div>
      </div>
    </div>
  );
}
