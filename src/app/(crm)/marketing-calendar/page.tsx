'use client';
import { useState } from 'react';
import {
  type ScheduledEvent,
  marketingCalendarChannelColor as CHANNEL_COLOR,
  marketingCalendarChannelBadge as CHANNEL_BADGE,
  marketingCalendarAuthors as AUTHORS,
  marketingCalendarEvents,
} from '@/lib/mockData';

// ─── Modal ────────────────────────────────────────────────────────────────────
function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24
    }} onClick={onClose}>
      <div style={{
        background: 'var(--bg-card)', border: '1px solid var(--border)',
        borderRadius: 20, padding: 32, width: '100%', maxWidth: 520,
        boxShadow: '0 24px 64px rgba(0,0,0,0.4)'
      }} onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
          <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: 'var(--text-primary)' }}>{title}</h2>
          <button onClick={onClose} style={{ background: 'var(--bg-secondary)', border: 'none', borderRadius: '50%', width: 32, height: 32, cursor: 'pointer', color: 'var(--text-muted)', fontSize: 18, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
        </div>
        {children}
      </div>
    </div>
  );
}

function Toast({ message, color = 'var(--emerald)', onClose }: { message: string; color?: string; onClose: () => void }) {
  return (
    <div style={{
      position: 'fixed', bottom: 32, right: 32, zIndex: 2000,
      background: color, color: '#fff',
      padding: '14px 20px', borderRadius: 12, fontWeight: 600, fontSize: 14,
      boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
      display: 'flex', alignItems: 'center', gap: 10, animation: 'fadeIn 0.3s ease'
    }}>
      <i className="ti ti-check-circle" style={{ fontSize: 20 }}></i>
      {message}
      <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', marginLeft: 8 }}>✕</button>
    </div>
  );
}

const inputStyle = {
  width: '100%', padding: '10px 14px', borderRadius: 10,
  border: '1px solid var(--border)', background: 'var(--bg-secondary)',
  color: 'var(--text-primary)', fontSize: 14, outline: 'none',
  boxSizing: 'border-box' as const,
};
const labelStyle = {
  display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--text-muted)',
  textTransform: 'uppercase' as const, letterSpacing: '0.5px', marginBottom: 6,
};

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function MarketingCalendarPage() {
  const [currentMonth] = useState('June 2026');
  const [selectedDate, setSelectedDate] = useState<number>(24);

  const [events, setEvents] = useState<ScheduledEvent[]>(marketingCalendarEvents);

  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState<ScheduledEvent | null>(null);
  const [toast, setToast] = useState('');
  const [toastColor, setToastColor] = useState('var(--emerald)');
  const [detailsEvent, setDetailsEvent] = useState<ScheduledEvent | null>(null);

  const POST_COLORS = ['#6366f1','#3b82f6','#10b981','#f59e0b','#ef4444','#ec4899','#8b5cf6','#06b6d4','#84cc16','#f97316'];
  const blankForm = { title: '', channel: 'LinkedIn', date: `2026-06-${String(selectedDate).padStart(2, '0')}`, time: '09:00', author: 'Priya S.', type: 'Social', company: '', client: '', color: '#6366f1' };

  const [form, setForm] = useState(blankForm);

  const showToast = (msg: string, color = 'var(--emerald)') => {
    setToast(msg); setToastColor(color); setTimeout(() => setToast(''), 3000);
  };

  // Calendar data
  const daysInMonth = 30;
  const firstDayOfMonth = 0;
  const days: { empty: boolean; day?: number; isToday?: boolean; evts?: ScheduledEvent[] }[] = [];
  for (let i = 0; i < firstDayOfMonth; i++) days.push({ empty: true });
  for (let i = 1; i <= daysInMonth; i++) {
    days.push({ empty: false, day: i, isToday: i === 24, evts: events.filter(e => {
      if (typeof e.date === 'number') return e.date === i;
      if (typeof e.date === 'string') return e.date.startsWith('2026-06-') && Number(e.date.split('-')[2]) === i;
      return false;
    })});
  }
  const selectedEvents = events.filter(e => {
    if (typeof e.date === 'number') return e.date === selectedDate;
    if (typeof e.date === 'string') return e.date.startsWith('2026-06-') && Number(e.date.split('-')[2]) === selectedDate;
    return false;
  });
  const allScheduled = events.filter(e => e.status === 'Scheduled');

  // Convert 24h "HH:MM" to display "H:MM AM/PM"
  const to12h = (t: string) => {
    const [h, m] = t.split(':').map(Number);
    const ampm = h >= 12 ? 'PM' : 'AM';
    return `${h % 12 || 12}:${String(m).padStart(2, '0')} ${ampm}`;
  };

  const handleSchedule = () => {
    if (!form.title.trim()) return;
    const newEvt: ScheduledEvent = {
      id: Date.now(), date: form.date, title: form.title,
      channel: form.channel, time: to12h(form.time), type: form.type || form.channel,
      author: form.author, company: form.company, client: form.client,
      badgeChannel: CHANNEL_BADGE[form.channel] || 'blue',
      badgeStatus: 'amber', status: 'Scheduled',
      color: form.color,
    };
    setEvents(prev => [...prev, newEvt]);
    setSelectedDate(typeof form.date === 'string' && form.date.startsWith('2026-06-') ? Number(form.date.split('-')[2]) : selectedDate);
    setShowScheduleModal(false);
    showToast('Post scheduled successfully!');
    setForm({ ...blankForm, date: form.date });
  };

  const openEdit = (evt: ScheduledEvent) => {
    setEditingEvent(evt);
    // Convert display time back to 24h for input
    const to24h = (t: string) => {
      const [time, ampm] = t.split(' ');
      const [h, m] = time.split(':').map(Number);
      const h24 = ampm === 'PM' ? (h === 12 ? 12 : h + 12) : (h === 12 ? 0 : h);
      return `${String(h24).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
    };
    setForm({ title: evt.title, channel: evt.channel, date: typeof evt.date === 'number' ? `2026-06-${String(evt.date).padStart(2, '0')}` : String(evt.date), time: to24h(evt.time), author: evt.author, type: evt.type || evt.channel, company: evt.company || '', client: evt.client || '', color: evt.color || '#6366f1' });
    setShowEditModal(true);
  };

  const handleSaveEdit = () => {
    if (!editingEvent || !form.title.trim()) return;
    setEvents(prev => prev.map(e => e.id === editingEvent.id ? {
      ...e, title: form.title, channel: form.channel, date: form.date,
      time: to12h(form.time), type: form.type || form.channel, author: form.author,
      company: form.company, client: form.client,
      badgeChannel: CHANNEL_BADGE[form.channel] || 'blue',
      color: form.color,
    } : e));
    setShowEditModal(false);
    showToast('Post updated!');
  };

  const handleDelete = (id: number) => {
    setEvents(prev => prev.filter(e => e.id !== id));
    showToast('Post removed.', 'var(--rose)');
  };

  const EventForm = ({ forDate = true }: { forDate?: boolean }) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div>
        <label style={labelStyle}>Post Title</label>
        <input style={inputStyle} placeholder="e.g. Q3 Product Launch Post" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <div>
          <label style={labelStyle}>Company</label>
          <input style={inputStyle} placeholder="e.g. Acme Corp" value={form.company} onChange={e => setForm(f => ({ ...f, company: e.target.value }))} />
        </div>
        <div>
          <label style={labelStyle}>Client</label>
          <input style={inputStyle} placeholder="e.g. Jane Doe" value={form.client} onChange={e => setForm(f => ({ ...f, client: e.target.value }))} />
        </div>
      </div>
      <div>
        <label style={labelStyle}>Channel</label>
        <select style={inputStyle} value={form.channel} onChange={e => setForm(f => ({ ...f, channel: e.target.value }))}>
          {['LinkedIn', 'Twitter', 'Instagram', 'Email', 'Blog', 'YouTube'].map(c => <option key={c}>{c}</option>)}
        </select>
      </div>
      <div>
        <label style={labelStyle}>Colour</label>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', paddingTop: 4 }}>
          {POST_COLORS.map(c => (
            <button
              key={c}
              type="button"
              title={c}
              onClick={() => setForm(f => ({ ...f, color: c }))}
              style={{
                width: 30, height: 30, borderRadius: '50%', background: c,
                border: form.color === c ? '3px solid var(--text-primary)' : '3px solid transparent',
                outline: form.color === c ? `2px solid ${c}` : 'none',
                outlineOffset: 2,
                cursor: 'pointer', padding: 0, flexShrink: 0,
                boxShadow: '0 1px 4px rgba(0,0,0,0.2)',
                transition: 'transform 0.15s',
              }}
            />
          ))}
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: forDate ? '1fr 1fr' : '1fr 1fr', gap: 12 }}>
        {forDate && (
          <div>
            <label style={labelStyle}>Date</label>
            <input type="date" style={inputStyle} value={form.date}
              onChange={e => setForm(f => ({ ...f, date: e.target.value }))} />
          </div>
        )}
        <div>
          <label style={labelStyle}>Time</label>
          <input type="time" style={inputStyle} value={form.time} onChange={e => setForm(f => ({ ...f, time: e.target.value }))} />
        </div>
        {!forDate && <div />}
      </div>
      <div>
        <label style={labelStyle}>Author</label>
        <select style={inputStyle} value={form.author} onChange={e => setForm(f => ({ ...f, author: e.target.value }))}>
          {AUTHORS.map(a => <option key={a}>{a}</option>)}
        </select>
      </div>
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div className="section-title" style={{ fontSize: 24, display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 40, height: 40, borderRadius: 10, background: 'linear-gradient(135deg, var(--purple-dim), var(--blue-dim))', color: 'var(--purple-light)' }}>
              <i className="ti ti-calendar-event" style={{ fontSize: 24 }}></i>
            </div>
            Scheduling Calendar
          </div>
          <div className="section-sub" style={{ fontSize: 14, marginTop: 6, marginLeft: 50 }}>
            Plan and coordinate granular posts across all marketing channels.
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '10px 18px', borderRadius: 10 }}
            onClick={() => { setForm({ ...blankForm, date: `2026-06-${String(selectedDate).padStart(2, '0')}` }); setShowScheduleModal(true); }}>
            <i className="ti ti-plus"></i> Schedule Post
          </button>
        </div>
      </div>

      {/* Calendar + Day View */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 420px', gap: 24 }}>
        {/* Calendar */}
        <div className="card" style={{ padding: 24, display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
            <button className="btn btn-ghost" style={{ padding: '8px', borderRadius: '50%' }}><i className="ti ti-chevron-left" style={{ fontSize: 18 }}></i></button>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>{currentMonth}</h2>
            <button className="btn btn-ghost" style={{ padding: '8px', borderRadius: '50%' }}><i className="ti ti-chevron-right" style={{ fontSize: 18 }}></i></button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 10, flex: 1 }}>
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
              <div key={d} style={{ fontSize: 12, color: 'var(--text-muted)', textAlign: 'center', fontWeight: 700, paddingBottom: 12, textTransform: 'uppercase', letterSpacing: '1px' }}>{d}</div>
            ))}
            {days.map((d, i) => {
              if (d.empty) return <div key={i} />;
              const isSelected = selectedDate === d.day;
              return (
                <div key={i} className="cal-day-item" onClick={() => setSelectedDate(d.day!)} style={{
                  position: 'relative', height: 90, padding: '10px', borderRadius: 12, cursor: 'pointer',
                  border: isSelected ? '2px solid var(--purple)' : '1px solid var(--border)',
                  background: isSelected ? 'linear-gradient(145deg, var(--purple-dim), rgba(124,92,191,0.05))' : d.isToday ? 'var(--bg-secondary)' : 'var(--bg-card)',
                  boxShadow: isSelected ? '0 4px 12px rgba(124,92,191,0.15)' : 'none',
                  transition: 'all 0.2s cubic-bezier(0.4,0,0.2,1)',
                  display: 'flex', flexDirection: 'column', alignItems: 'flex-start',
                }}>
                  <span style={{
                    fontSize: 14, fontWeight: isSelected || d.isToday ? 700 : 600,
                    color: isSelected ? 'var(--purple-light)' : d.isToday ? 'var(--text-primary)' : 'var(--text-secondary)',
                    background: d.isToday && !isSelected ? 'var(--border)' : 'transparent',
                    padding: d.isToday && !isSelected ? '2px 8px' : '0', borderRadius: 12,
                  }}>{d.day}</span>
                  {d.evts && d.evts.length > 0 && (
                    <div style={{ marginTop: 'auto', display: 'flex', flexWrap: 'wrap', gap: 4, width: '100%' }}>
                      {d.evts.slice(0, 3).map((evt, idx) => (
                        <div key={idx} style={{ height: 6, flex: 1, minWidth: 10, background: evt.color, borderRadius: 4, opacity: evt.status === 'Published' ? 0.4 : 1, boxShadow: evt.status === 'Scheduled' ? `0 0 8px ${evt.color}40` : 'none' }} title={evt.title} />
                      ))}
                      {d.evts.length > 3 && <span style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 700, marginLeft: 2 }}>+{d.evts.length - 3}</span>}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div style={{ marginTop: 24, padding: '16px', background: 'var(--bg-secondary)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 20, fontSize: 12, color: 'var(--text-secondary)', fontWeight: 600 }}>
            {[['var(--blue)', 'Acme Corp'], ['var(--purple)', 'Globex'], ['var(--emerald)', 'Soylent'], ['var(--rose)', 'Initech']].map(([clr, lbl]) => (
              <span key={lbl} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ width: 10, height: 10, borderRadius: '50%', background: clr, boxShadow: `0 0 8px ${clr}` }} /> {lbl}
              </span>
            ))}
          </div>
        </div>

        {/* Day View */}
        <div className="card" style={{ padding: 24, display: 'flex', flexDirection: 'column', height: '100%', background: 'linear-gradient(180deg, var(--bg-card) 0%, rgba(20,20,20,0.2) 100%)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
            <div>
              <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: 'var(--text-primary)' }}>
                {currentMonth.split(' ')[0]} {selectedDate}
              </h3>
              <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>Daily Schedule</div>
            </div>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <span className="badge" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>{selectedEvents.length} items</span>
              <button className="btn btn-ghost" style={{ padding: '6px 10px', fontSize: 12, color: 'var(--purple)' }}
                onClick={() => { setForm({ ...blankForm, date: `2026-06-${String(selectedDate).padStart(2, '0')}` }); setShowScheduleModal(true); }}>
                <i className="ti ti-plus"></i>
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, overflowY: 'auto', flex: 1, paddingRight: 8 }} className="scrollbar-thin">
            {selectedEvents.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '50px 20px', color: 'var(--text-muted)', border: '2px dashed var(--border)', borderRadius: 16, background: 'rgba(255,255,255,0.02)' }}>
                <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                  <i className="ti ti-calendar-off" style={{ fontSize: 32, opacity: 0.5 }}></i>
                </div>
                <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)' }}>Nothing scheduled</div>
                <div style={{ fontSize: 13, marginTop: 6 }}>No posts planned for this date.</div>
                <button className="btn btn-ghost" style={{ marginTop: 20, fontSize: 13, color: 'var(--purple)', fontWeight: 600 }}
                  onClick={() => { setForm({ ...blankForm, date: `2026-06-${String(selectedDate).padStart(2, '0')}` }); setShowScheduleModal(true); }}>
                  + Schedule Item
                </button>
              </div>
            ) : (
              selectedEvents.map(evt => (
                <div key={evt.id} style={{ padding: 18, background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 14, position: 'relative', overflow: 'hidden', transition: 'transform 0.2s, box-shadow 0.2s', cursor: 'pointer' }} className="hover-lift" onClick={() => setDetailsEvent(evt)}>
                  <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 4, background: evt.color }} />
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                    <span className={`badge ${evt.badgeChannel}`} style={{ fontSize: 11, fontWeight: 600 }}>{evt.channel}</span>
                    <span style={{ fontSize: 12, fontWeight: 700, color: evt.status === 'Published' ? 'var(--emerald)' : 'var(--amber)' }}>
                      {evt.status === 'Published' && <i className="ti ti-check" style={{ marginRight: 4 }}></i>}
                      {evt.status}
                    </span>
                  </div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 10 }}>{evt.title}</div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16, fontSize: 13, color: 'var(--text-secondary)' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 500 }}><i className="ti ti-clock" style={{ color: 'var(--text-muted)' }}></i> {evt.time}</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 500 }}>
                        <div style={{ width: 18, height: 18, borderRadius: '50%', background: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10 }}><i className="ti ti-user"></i></div>
                        {evt.author}
                      </span>
                    </div>
                    {evt.status !== 'Published' && (
                      <div style={{ display: 'flex', gap: 4 }}>
                        <button className="btn btn-ghost" style={{ padding: '4px 8px', fontSize: 13 }} onClick={(e) => { e.stopPropagation(); openEdit(evt); }} title="Edit">
                          <i className="ti ti-edit"></i>
                        </button>
                        <button className="btn btn-ghost" style={{ padding: '4px 8px', fontSize: 13, color: 'var(--rose)' }} onClick={(e) => { e.stopPropagation(); handleDelete(evt.id); }} title="Delete">
                          <i className="ti ti-trash"></i>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Upcoming Table */}
      <div className="card table-wrap" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-card)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--blue-dim)', color: 'var(--blue-light)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <i className="ti ti-list-details" style={{ fontSize: 18 }}></i>
            </div>
            <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: 'var(--text-primary)' }}>
              All Upcoming Scheduled
              <span className="badge" style={{ marginLeft: 10, background: 'var(--purple-dim)', color: 'var(--purple-light)', fontSize: 12 }}>{allScheduled.length}</span>
            </h3>
          </div>
          <button className="btn btn-ghost" style={{ fontSize: 13, fontWeight: 600 }}>
            View All <i className="ti ti-arrow-right"></i>
          </button>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ background: 'var(--bg-secondary)', textAlign: 'left', fontSize: 12, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            <tr>
              <th style={{ padding: '16px 24px', fontWeight: 700 }}>Company / Client</th>
              <th style={{ padding: '16px 24px', fontWeight: 700 }}>Content Title</th>
              <th style={{ padding: '16px 24px', fontWeight: 700 }}>Channel</th>
              <th style={{ padding: '16px 24px', fontWeight: 700 }}>Scheduled For</th>
              <th style={{ padding: '16px 24px', fontWeight: 700 }}>Author</th>
              <th style={{ padding: '16px 24px', fontWeight: 700 }}>Status</th>
              <th style={{ padding: '16px 24px', fontWeight: 700 }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {allScheduled.length === 0 ? (
              <tr><td colSpan={7} style={{ textAlign: 'center', padding: 32, color: 'var(--text-muted)' }}>No scheduled posts.</td></tr>
            ) : allScheduled.map((s) => (
              <tr key={s.id} style={{ borderBottom: '1px solid var(--border)', transition: 'background 0.2s', cursor: 'pointer' }} className="hover-bg-secondary" onClick={() => setDetailsEvent(s)}>
                <td style={{ padding: '16px 24px', color: 'var(--text-secondary)' }}>{s.company || '-'}</td>
                <td style={{ padding: '16px 24px', fontWeight: 600, color: 'var(--text-primary)' }}>{s.title}</td>
                <td style={{ padding: '16px 24px' }}><span className={`badge ${s.badgeChannel}`} style={{ fontWeight: 600 }}>{s.channel}</span></td>
                <td style={{ padding: '16px 24px', color: 'var(--text-secondary)', fontSize: 14, fontWeight: 500 }}>
                  <span style={{ color: 'var(--text-primary)' }}>
                    {typeof s.date === 'number' ? `June ${s.date}` : new Date(s.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                  </span>, {s.time}
                </td>
                <td style={{ padding: '16px 24px', color: 'var(--text-secondary)', fontSize: 14 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'linear-gradient(135deg, var(--purple), var(--blue))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, color: '#ffffff' }}>
                      {s.author.split(' ')[0][0]}{s.author.split(' ')[1][0]}
                    </div>
                    <span style={{ fontWeight: 500 }}>{s.author}</span>
                  </div>
                </td>
                <td style={{ padding: '16px 24px' }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 600, color: 'var(--amber)', background: 'var(--amber-dim)', padding: '4px 10px', borderRadius: 8 }}>
                    <span className="live-dot" style={{ background: 'var(--amber)' }} /> {s.status}
                  </span>
                </td>
                <td style={{ padding: '16px 24px' }}>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button className="btn btn-ghost" style={{ padding: '6px 10px', fontSize: 14, borderRadius: 8, color: 'var(--text-secondary)' }} title="Edit" onClick={(e) => { e.stopPropagation(); openEdit(s); }}>
                      <i className="ti ti-edit"></i>
                    </button>
                    <button className="btn btn-ghost" style={{ padding: '6px 10px', fontSize: 14, borderRadius: 8, color: 'var(--rose)' }} title="Delete" onClick={(e) => { e.stopPropagation(); handleDelete(s.id); }}>
                      <i className="ti ti-trash"></i>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Schedule Post Modal */}
      {showScheduleModal && (
        <Modal title="Schedule New Post" onClose={() => setShowScheduleModal(false)}>
          <EventForm forDate={true} />
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 24 }}>
            <button className="btn btn-ghost" onClick={() => setShowScheduleModal(false)}>Cancel</button>
            <button className="btn btn-primary" onClick={handleSchedule} disabled={!form.title.trim()}>
              <i className="ti ti-calendar"></i> Schedule Post
            </button>
          </div>
        </Modal>
      )}

      {/* Edit Post Modal */}
      {showEditModal && (
        <Modal title="Edit Scheduled Post" onClose={() => setShowEditModal(false)}>
          <EventForm forDate={false} />
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 24 }}>
            <button className="btn btn-ghost" onClick={() => setShowEditModal(false)}>Cancel</button>
            <button className="btn btn-primary" onClick={handleSaveEdit}>Save Changes</button>
          </div>
        </Modal>
      )}

      {/* Details Modal */}
      {detailsEvent && (
        <Modal title={detailsEvent.title} onClose={() => setDetailsEvent(null)}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
              <div>
                <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 6 }}>Date</div>
                <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <i className="ti ti-calendar" style={{ color: 'var(--text-muted)', fontSize: 16 }}></i>
                  {typeof detailsEvent.date === 'number' ? `June ${detailsEvent.date}, 2026` : new Date(detailsEvent.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </div>
              </div>
              <div>
                <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 6 }}>Time</div>
                <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <i className="ti ti-clock" style={{ color: 'var(--text-muted)', fontSize: 16 }}></i> {detailsEvent.time}
                </div>
              </div>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
              <div>
                <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 6 }}>Channel</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, fontWeight: 500, color: 'var(--text-primary)' }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: detailsEvent.color }}></div>
                  {detailsEvent.channel}
                </div>
              </div>
              <div>
                <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 6 }}>Status</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, fontWeight: 500, color: 'var(--text-primary)' }}>
                  <i className={detailsEvent.status === 'Published' ? "ti ti-circle-check" : "ti ti-clock-hour-4"} style={{ color: detailsEvent.status === 'Published' ? 'var(--emerald)' : 'var(--amber)', fontSize: 16 }}></i>
                  {detailsEvent.status}
                </div>
              </div>
            </div>

            <div>
              <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 6 }}>Assignee</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, border: '1px solid var(--border)', padding: '12px 16px', borderRadius: 8 }}>
                <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--bg-secondary)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 600, color: 'var(--text-primary)' }}>
                  {detailsEvent.author.split(' ')[0][0]}{detailsEvent.author.split(' ')[1]?.[0] || ''}
                </div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>{detailsEvent.author}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Content Creator</div>
                </div>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 32, paddingTop: 20, borderTop: '1px solid var(--border)' }}>
            <button className="btn btn-ghost" style={{ color: 'var(--text-muted)', fontSize: 13, fontWeight: 500 }} onClick={() => { handleDelete(detailsEvent.id); setDetailsEvent(null); }}>
              Delete Post
            </button>
            <div style={{ display: 'flex', gap: 10 }}>
              {detailsEvent.status === 'Scheduled' && (
                <button className="btn btn-ghost" style={{ border: '1px solid var(--border)', fontSize: 13, fontWeight: 500, color: 'var(--text-primary)' }} onClick={() => {
                  setEvents(prev => prev.map(e => e.id === detailsEvent.id ? { ...e, status: 'Published', badgeStatus: 'emerald' } : e));
                  setDetailsEvent(null);
                  showToast('Post marked as Published!');
                }}>
                  Mark as Published
                </button>
              )}
              <button className="btn btn-primary" style={{ fontSize: 13, fontWeight: 500, padding: '8px 16px', background: 'var(--text-primary)', color: 'var(--bg-card)' }} onClick={() => { setDetailsEvent(null); openEdit(detailsEvent); }}>
                Reschedule
              </button>
            </div>
          </div>
        </Modal>
      )}

      {toast && <Toast message={toast} color={toastColor} onClose={() => setToast('')} />}

      <style dangerouslySetInnerHTML={{ __html: `
        .cal-day-item:hover { border-color: var(--purple) !important; background: linear-gradient(145deg, rgba(124,92,191,0.1), rgba(124,92,191,0.05)) !important; transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
        .hover-lift:hover { transform: translateY(-3px) !important; box-shadow: 0 8px 24px rgba(0,0,0,0.15) !important; }
        .hover-bg-secondary:hover { background: var(--bg-card) !important; }
        .scrollbar-thin::-webkit-scrollbar { width: 6px; }
        .scrollbar-thin::-webkit-scrollbar-track { background: transparent; }
        .scrollbar-thin::-webkit-scrollbar-thumb { background: var(--border); border-radius: 4px; }
        .scrollbar-thin::-webkit-scrollbar-thumb:hover { background: var(--text-muted); }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}} />
    </div>
  );
}
