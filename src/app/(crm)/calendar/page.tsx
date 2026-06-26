'use client';
import React, { useState, useRef, useEffect } from 'react';
import { useWorkspace, CalendarEvent, Task } from '@/context/WorkspaceContext';
import styles from './calendar.module.css';

// ─── Constants ─────────────────────────────────────────────────────────────────
const MAX_VISIBLE_PILLS = 3;
const TODAY = '2026-06-25';

const HOURS: string[] = [];
for (let h = 8; h <= 20; h++) {
  const ampm = h < 12 ? 'AM' : 'PM';
  const disp = h <= 12 ? h : h - 12;
  HOURS.push(`${String(disp).padStart(2, '0')}:00 ${ampm}`);
}

type ViewMode = 'day' | 'week' | 'month';

const WEEK_DAYS_SHORT = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const MONTHS_SHORT = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

// ─── Helpers ───────────────────────────────────────────────────────────────────
function toDateStr(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function weekStart(dateStr: string): Date {
  const d = new Date(dateStr);
  const diff = (d.getDay() + 6) % 7;
  d.setDate(d.getDate() - diff);
  return d;
}

function getWeekDays(anchorDate: string) {
  const monday = weekStart(anchorDate);
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return { dateStr: toDateStr(d), dayNum: d.getDate(), dayLabel: WEEK_DAYS_SHORT[i], isWeekend: i >= 5 };
  });
}

function eventHour(time: string): number {
  return parseInt(time.split(':')[0], 10);
}

function formatDisplayTime(time: string): string {
  if (!time) return '';
  const [hStr, mStr] = time.split(':');
  const h = parseInt(hStr, 10);
  const m = mStr || '00';
  const ampm = h < 12 ? 'AM' : 'PM';
  const disp = h === 0 ? 12 : h > 12 ? h - 12 : h;
  return `${String(disp).padStart(2, '0')}:${m} ${ampm}`;
}

// ─── Sub-components ────────────────────────────────────────────────────────────

/** Event detail popup shown when an event pill/block is clicked */
function EventDetailPopup({
  event,
  members,
  projects,
  onClose,
  onReschedule,
  onDelete,
}: {
  event: CalendarEvent;
  members: ReturnType<typeof useWorkspace>['members'];
  projects: ReturnType<typeof useWorkspace>['projects'];
  onClose: () => void;
  onReschedule: () => void;
  onDelete: () => void;
}) {
  const linkedProject = event.linkedRecord?.type === 'project'
    ? projects.find(p => p.id === event.linkedRecord?.id)
    : null;

  const attendeeMembers = event.attendees
    .map(id => members.find(m => m.id === id))
    .filter(Boolean) as typeof members;

  // Format date nicely
  const dateObj = new Date(event.date);
  const dateFormatted = dateObj.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div className={styles.popupBackdrop} onClick={onClose}>
      <div className={styles.popupCard} onClick={e => e.stopPropagation()}>
        {/* Gradient accent bar */}
        <div className={styles.popupAccentBar} style={{ background: `linear-gradient(90deg, ${event.color}, ${event.color}aa)` }} />

        {/* Header */}
        <div className={styles.popupHeader}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, flexWrap: 'wrap' }}>
              <span className={styles.popupBadge} style={{ background: `${event.color}18`, color: event.color, borderColor: `${event.color}40` }}>
                <svg width={10} height={10} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
                </svg>
                Event
              </span>
              {linkedProject && (
                <span className={styles.popupBadge} style={{ background: `${linkedProject.color}15`, color: linkedProject.color, borderColor: `${linkedProject.color}35` }}>
                  <svg width={10} height={10} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
                  </svg>
                  {linkedProject.name}
                </span>
              )}
            </div>
            <h2 className={styles.popupTitle}>{event.title}</h2>
          </div>
          <button className={styles.popupClose} onClick={onClose} aria-label="Close">
            <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* Details grid */}
        <div className={styles.popupDetails}>
          {/* Date */}
          <div className={styles.popupDetailRow}>
            <span className={styles.popupDetailIcon}>
              <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke={event.color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
            </span>
            <div>
              <div className={styles.popupDetailLabel}>Date</div>
              <div className={styles.popupDetailValue}>{dateFormatted}</div>
            </div>
          </div>
          {/* Time */}
          <div className={styles.popupDetailRow}>
            <span className={styles.popupDetailIcon}>
              <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke={event.color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
              </svg>
            </span>
            <div>
              <div className={styles.popupDetailLabel}>Time</div>
              <div className={styles.popupDetailValue}>{formatDisplayTime(event.time)}</div>
            </div>
          </div>
          {/* Linked project */}
          {linkedProject && (
            <div className={styles.popupDetailRow}>
              <span className={styles.popupDetailIcon}>
                <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke={linkedProject.color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
                </svg>
              </span>
              <div>
                <div className={styles.popupDetailLabel}>Linked Project</div>
                <div className={styles.popupDetailValue} style={{ color: linkedProject.color }}>{linkedProject.name}</div>
              </div>
            </div>
          )}
          {/* Attendees */}
          <div className={styles.popupDetailRow} style={{ alignItems: 'flex-start' }}>
            <span className={styles.popupDetailIcon} style={{ marginTop: 2 }}>
              <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke={event.color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
              </svg>
            </span>
            <div style={{ flex: 1 }}>
              <div className={styles.popupDetailLabel} style={{ marginBottom: 8 }}>
                Attendees
                <span style={{ marginLeft: 6, background: `${event.color}22`, color: event.color, border: `1px solid ${event.color}40`, borderRadius: 20, padding: '1px 7px', fontSize: 9, fontWeight: 700 }}>
                  {attendeeMembers.length}
                </span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {attendeeMembers.map(m => (
                  <div key={m.id} className={styles.popupAttendee}>
                    <span className={styles.popupAvatar} style={{ background: event.color + '20', color: event.color }}>{m.avatar}</span>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 13, color: 'var(--text-primary)' }}>{m.name}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 1 }}>{m.role} · {m.department}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className={styles.popupFooter}>
          <button className={styles.popupDeleteBtn} onClick={onDelete}>
            <svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/>
            </svg>
            Delete
          </button>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className={styles.popupCancelBtn} onClick={onClose}>Close</button>
            <button className={styles.popupRescheduleBtn} style={{ background: `linear-gradient(135deg, ${event.color}, ${event.color}cc)` }} onClick={onReschedule}>
              <svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/>
                <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
              </svg>
              Reschedule
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/** Edit/Reschedule modal — pre-filled with existing event data */
function RescheduleModal({
  event,
  members,
  projects,
  onSave,
  onCancel,
}: {
  event: CalendarEvent;
  members: ReturnType<typeof useWorkspace>['members'];
  projects: ReturnType<typeof useWorkspace>['projects'];
  onSave: (updated: CalendarEvent) => void;
  onCancel: () => void;
}) {
  const [title, setTitle] = useState(event.title);
  const [date, setDate] = useState(event.date);
  const [time, setTime] = useState(event.time);
  const [color, setColor] = useState(event.color);
  const [linkedProject, setLinkedProject] = useState(event.linkedRecord?.id ?? '');
  const [attendees, setAttendees] = useState<string[]>(event.attendees);

  const toggleAttendee = (id: string) =>
    setAttendees(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

  const handleSave = () => {
    if (!title.trim()) { alert('Title is required'); return; }
    const proj = projects.find(p => p.id === linkedProject);
    onSave({
      ...event,
      title: title.trim(),
      date,
      time,
      color: proj ? proj.color : color,
      attendees,
      linkedRecord: linkedProject ? { type: 'project', id: linkedProject } : null,
    });
  };

  const PRESET_COLORS = ['#7c5cbf', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#6366f1', '#ec4899'];

  return (
    <div className={styles.popupBackdrop} onClick={onCancel}>
      <div className={styles.editModal} onClick={e => e.stopPropagation()}>
        {/* Modal header */}
        <div className={styles.editModalHeader}>
          <div>
            <h3 className={styles.editModalTitle}>Reschedule Event</h3>
            <p className={styles.editModalSub}>Edit the details and save to update the calendar.</p>
          </div>
          <button className={styles.popupClose} onClick={onCancel}>✕</button>
        </div>

        <div className={styles.editModalBody}>
          {/* Title */}
          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel}>Event Title</label>
            <input
              className={styles.fieldInput}
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Event title…"
            />
          </div>

          {/* Date + Time row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel}>Date</label>
              <input className={styles.fieldInput} type="date" value={date} onChange={e => setDate(e.target.value)} />
            </div>
            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel}>Time</label>
              <input className={styles.fieldInput} type="time" value={time} onChange={e => setTime(e.target.value)} />
            </div>
          </div>

          {/* Link Project */}
          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel}>Link to Project</label>
            <select
              className={styles.fieldSelect}
              value={linkedProject}
              onChange={e => {
                setLinkedProject(e.target.value);
                const p = projects.find(x => x.id === e.target.value);
                if (p) setColor(p.color);
              }}
            >
              <option value="">No Project</option>
              {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>

          {/* Color picker (only if no project linked) */}
          {!linkedProject && (
            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel}>Event Color</label>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 4 }}>
                {PRESET_COLORS.map(c => (
                  <button
                    key={c}
                    onClick={() => setColor(c)}
                    style={{
                      width: 28, height: 28, borderRadius: '50%', background: c, border: 'none',
                      cursor: 'pointer', outline: color === c ? `3px solid ${c}` : '3px solid transparent',
                      outlineOffset: 2, transition: 'outline 0.15s',
                    }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Attendees */}
          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel}>Attendees</label>
            <div className={styles.attendeeList}>
              {members.map(m => (
                <label key={m.id} className={styles.attendeeRow}>
                  <input
                    type="checkbox"
                    checked={attendees.includes(m.id)}
                    onChange={() => toggleAttendee(m.id)}
                    className={styles.attendeeCheck}
                  />
                  <span className={styles.popupAvatar} style={{ background: '#7c5cbf22', color: '#7c5cbf', fontSize: 10 }}>{m.avatar}</span>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 13 }}>{m.name}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{m.role}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className={styles.editModalFooter}>
          <button className={styles.popupCancelBtn} onClick={onCancel}>Cancel</button>
          <button
            className={styles.popupRescheduleBtn}
            style={{ background: color }}
            onClick={handleSave}
          >
            ✓ Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────
export default function CalendarPage() {
  const { members, projects, tasks, events, addEvent, updateEvent, deleteEvent } = useWorkspace();

  const [viewMode, setViewMode] = useState<ViewMode>('month');
  const [calendarYear, setCalendarYear] = useState(2026);
  const [calendarMonth, setCalendarMonth] = useState(5);
  const [selectedDate, setSelectedDate] = useState(TODAY);

  // Event detail popup
  const [detailEvent, setDetailEvent] = useState<CalendarEvent | null>(null);
  // Reschedule modal (set when user clicks "Reschedule" in detail popup)
  const [rescheduleEvent, setRescheduleEvent] = useState<CalendarEvent | null>(null);

  // Create event modal
  const [createOpen, setCreateOpen] = useState(false);
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventDate, setNewEventDate] = useState(TODAY);
  const [newEventTime, setNewEventTime] = useState('10:00');
  const [newEventProject, setNewEventProject] = useState('');
  const [newEventAttendees, setNewEventAttendees] = useState<string[]>([]);

  // ── Handlers ──
  const openDetail = (ev: CalendarEvent, e: React.MouseEvent) => {
    e.stopPropagation();
    setDetailEvent(ev);
  };

  const closeDetail = () => setDetailEvent(null);

  const handleReschedule = () => {
    if (detailEvent) {
      setRescheduleEvent(detailEvent);
      setDetailEvent(null);
    }
  };

  const handleSaveReschedule = (updated: CalendarEvent) => {
    updateEvent(updated);
    setRescheduleEvent(null);
  };

  const handleDeleteEvent = () => {
    if (detailEvent) {
      deleteEvent(detailEvent.id);
      setDetailEvent(null);
    }
  };

  // ── Navigation ──
  const handleNavigate = (dir: number) => {
    if (viewMode === 'month') {
      let m = calendarMonth + dir, y = calendarYear;
      if (m < 0) { m = 11; y--; } else if (m > 11) { m = 0; y++; }
      setCalendarMonth(m); setCalendarYear(y);
    } else if (viewMode === 'week') {
      const d = new Date(selectedDate); d.setDate(d.getDate() + dir * 7);
      setSelectedDate(toDateStr(d)); setCalendarMonth(d.getMonth()); setCalendarYear(d.getFullYear());
    } else {
      const d = new Date(selectedDate); d.setDate(d.getDate() + dir);
      setSelectedDate(toDateStr(d)); setCalendarMonth(d.getMonth()); setCalendarYear(d.getFullYear());
    }
  };

  const handleToday = () => { setCalendarYear(2026); setCalendarMonth(5); setSelectedDate(TODAY); };

  const getHeaderLabel = () => {
    if (viewMode === 'month') return `${MONTHS[calendarMonth]} ${calendarYear}`;
    if (viewMode === 'week') {
      const days = getWeekDays(selectedDate);
      const fd = new Date(days[0].dateStr), ld = new Date(days[6].dateStr);
      return `${String(fd.getDate()).padStart(2,'0')} ${MONTHS_SHORT[fd.getMonth()]} ${fd.getFullYear()} – ${String(ld.getDate()).padStart(2,'0')} ${MONTHS_SHORT[ld.getMonth()]} ${ld.getFullYear()}`;
    }
    const d = new Date(selectedDate);
    return `${String(d.getDate()).padStart(2,'0')} ${MONTHS_SHORT[d.getMonth()]} ${d.getFullYear()}`;
  };

  // ── Month grid ──
  const getCalendarDays = () => {
    const firstDay = new Date(calendarYear, calendarMonth, 1);
    const mondayOffset = (firstDay.getDay() + 6) % 7;
    const totalDays = new Date(calendarYear, calendarMonth + 1, 0).getDate();
    const prevDays = new Date(calendarYear, calendarMonth, 0).getDate();
    const days: { dayNum: number; dateStr: string; isCurrentMonth: boolean }[] = [];
    for (let i = mondayOffset - 1; i >= 0; i--) {
      const n = prevDays - i;
      const pm = calendarMonth === 0 ? 11 : calendarMonth - 1;
      const py = calendarMonth === 0 ? calendarYear - 1 : calendarYear;
      days.push({ dayNum: n, dateStr: `${py}-${String(pm+1).padStart(2,'0')}-${String(n).padStart(2,'0')}`, isCurrentMonth: false });
    }
    for (let d = 1; d <= totalDays; d++)
      days.push({ dayNum: d, dateStr: `${calendarYear}-${String(calendarMonth+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`, isCurrentMonth: true });
    const remaining = 42 - days.length;
    for (let d = 1; d <= remaining; d++) {
      const nm = calendarMonth === 11 ? 0 : calendarMonth + 1;
      const ny = calendarMonth === 11 ? calendarYear + 1 : calendarYear;
      days.push({ dayNum: d, dateStr: `${ny}-${String(nm+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`, isCurrentMonth: false });
    }
    return days;
  };

  const calendarDays = getCalendarDays();

  // ── Create event ──
  const handleCreateEvent = () => {
    if (!newEventTitle.trim()) { alert('Event title is required!'); return; }
    if (newEventAttendees.length === 0) { alert('Select at least one attendee!'); return; }
    const proj = projects.find(p => p.id === newEventProject);
    addEvent({ title: newEventTitle.trim(), date: newEventDate, time: newEventTime, attendees: newEventAttendees, linkedRecord: newEventProject ? { type: 'project', id: newEventProject } : null, color: proj?.color ?? '#7c5cbf' });
    setNewEventTitle(''); setNewEventAttendees([]); setCreateOpen(false);
  };

  // ── Side panel ──
  const dayEvents = events.filter(e => e.date === selectedDate);
  const dayTasks = tasks.filter(t => t.due === selectedDate);

  const getUpcomingEvents = () => {
    const list: { dateLabel: string; event: CalendarEvent }[] = [];
    const base = new Date(TODAY);
    for (let i = 0; i < 7; i++) {
      const d = new Date(base); d.setDate(base.getDate() + i);
      const s = toDateStr(d);
      const label = d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
      events.filter(e => e.date === s).forEach(ev => list.push({ dateLabel: label, event: ev }));
    }
    return list;
  };

  // ── Week/Day columns ──
  const timeCols = viewMode === 'week' ? getWeekDays(selectedDate) :
    viewMode === 'day' ? [{ dateStr: selectedDate, dayNum: new Date(selectedDate).getDate(), dayLabel: WEEK_DAYS_SHORT[(new Date(selectedDate).getDay() + 6) % 7], isWeekend: [5,6].includes((new Date(selectedDate).getDay() + 6) % 7) }] : [];

  const eventsForSlot = (dateStr: string, hourLabel: string) => {
    const h = parseInt(hourLabel.split(':')[0], 10);
    const hour24 = hourLabel.includes('PM') && h !== 12 ? h + 12 : (hourLabel.includes('AM') && h === 12 ? 0 : h);
    return events.filter(e => e.date === dateStr && eventHour(e.time) === hour24);
  };

  const allDayForDate = (dateStr: string) => tasks.filter(t => t.due === dateStr);
  const totalAllDay = timeCols.reduce((acc, col) => acc + allDayForDate(col.dateStr).length, 0);

  // ─────────────────────────────────────────────────────────────────────────────
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

      {/* ── Top Bar ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ fontSize: '18px', fontWeight: 700, margin: 0 }}>Calendar Agenda</h2>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: '2px 0 0' }}>Track schedules, meetings, and milestone due dates</p>
        </div>

        {/* Day / Week / Month toggle */}
        <div className={styles.viewToggle}>
          {(['day', 'week', 'month'] as ViewMode[]).map(v => (
            <button
              key={v}
              className={viewMode === v ? styles.viewToggleBtnActive : styles.viewToggleBtn}
              onClick={() => setViewMode(v)}
            >
              {v.charAt(0).toUpperCase() + v.slice(1)}
            </button>
          ))}
        </div>

        <button className="btn btn-primary" onClick={() => { setNewEventDate(selectedDate); setCreateOpen(true); }}>
          + Schedule Event
        </button>
      </div>

      {/* ── Main Calendar + Side Panel ── */}
      <div className={styles.calendarLayout}>

        {/* ════ Left: Calendar ════ */}
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>

          {/* Sub-header */}
          <div className={styles.monthHeader} style={{ padding: '14px 20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 16 }}>🗓</span>
              <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700 }}>{getHeaderLabel()}</h3>
            </div>
            <div className={styles.navigationControls}>
              <button className={styles.navBtn} onClick={() => handleNavigate(-1)}>← Prev</button>
              <button className={styles.navBtn} onClick={handleToday}>Today</button>
              <button className={styles.navBtn} onClick={() => handleNavigate(1)}>Next →</button>
            </div>
          </div>

          {/* ════ MONTH VIEW ════ */}
          {viewMode === 'month' && (<>
            <div className={styles.gridHeader}>
              {WEEK_DAYS_SHORT.map((d, i) => (
                <div key={d} className={styles.gridHeaderCell} style={i >= 5 ? { color: '#e05252' } : undefined}>{d}</div>
              ))}
            </div>
            <div className={styles.daysGrid}>
              {calendarDays.map(({ dayNum, dateStr, isCurrentMonth }, idx) => {
                const isSelected = dateStr === selectedDate;
                const isToday = dateStr === TODAY;
                const cellEvents = events.filter(e => e.date === dateStr);
                const cellTasks = tasks.filter(t => t.due === dateStr);
                const allItems = [
                  ...cellEvents.map(e => ({ type: 'event' as const, data: e })),
                  ...cellTasks.map(t => ({ type: 'task' as const, data: t })),
                ];
                const visible = allItems.slice(0, MAX_VISIBLE_PILLS);
                const hidden = allItems.length - visible.length;
                const col = idx % 7;
                const isWeekend = col === 5 || col === 6;

                let cls = styles.cell;
                if (isSelected) cls = styles.cellActive;
                else if (!isCurrentMonth) cls = styles.cellOutside;

                return (
                  <div key={idx} onClick={() => setSelectedDate(dateStr)} className={cls}>
                    <div className={styles.cellDateRow}>
                      {isToday
                        ? <span className={styles.todayNum}>{dayNum}</span>
                        : <span className={isCurrentMonth ? styles.cellNum : styles.cellNumOutside}
                            style={isWeekend && isCurrentMonth ? { color: '#e05252' } : undefined}>{dayNum}</span>
                      }
                    </div>
                    <div className={styles.indicatorList}>
                      {visible.map(({ type, data }) =>
                        type === 'event' ? (
                          <div
                            key={(data as CalendarEvent).id}
                            className={styles.eventPill}
                            title={`${(data as CalendarEvent).title} — ${(data as CalendarEvent).time}`}
                            onClick={e => openDetail(data as CalendarEvent, e)}
                          >
                            <span className={styles.pillDot} style={{ backgroundColor: (data as CalendarEvent).color }} />
                            <span className={styles.pillLabel}>{(data as CalendarEvent).title}</span>
                            {(data as CalendarEvent).time && <span className={styles.pillTime}>{formatDisplayTime((data as CalendarEvent).time)}</span>}
                          </div>
                        ) : (
                          <div key={(data as Task).id} className={styles.taskPill} title={`Task: ${(data as Task).title}`}>
                            <span className={styles.pillDot} style={{ backgroundColor: '#3b82f6' }} />
                            <span className={styles.pillLabel}>{(data as Task).title}</span>
                          </div>
                        )
                      )}
                      {hidden > 0 && (
                        <span className={styles.moreLink} onClick={e => { e.stopPropagation(); setSelectedDate(dateStr); }}>
                          {hidden} More ▾
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </>)}

          {/* ════ WEEK / DAY VIEW ════ */}
          {(viewMode === 'week' || viewMode === 'day') && (
            <div className={styles.timeGrid}>
              {/* Column headers */}
              <div className={styles.timeGridHeader}>
                <div className={styles.timeGutter} />
                {timeCols.map(col => (
                  <div
                    key={col.dateStr}
                    className={styles.timeColHeader}
                    onClick={() => setSelectedDate(col.dateStr)}
                    style={col.isWeekend ? { color: '#e05252' } : undefined}
                  >
                    <span className={styles.timeColDay}>{col.dayLabel}</span>
                    <span className={col.dateStr === TODAY ? styles.todayNumSm : styles.timeColNum}
                      style={col.dateStr === selectedDate && col.dateStr !== TODAY ? { background: 'var(--purple-dim)', borderRadius: '50%', padding: '1px 5px' } : undefined}>
                      {col.dayNum}
                    </span>
                  </div>
                ))}
              </div>

              {/* All-Day row */}
              <div className={styles.timeGridAllDay}>
                <div className={styles.timeGutterLabel}>All-Day ({totalAllDay})</div>
                {timeCols.map(col => (
                  <div key={col.dateStr} className={styles.timeAllDayCell}>
                    {allDayForDate(col.dateStr).map(t => (
                      <div key={t.id} className={styles.taskPill} style={{ marginBottom: 2 }}>
                        <span className={styles.pillDot} style={{ backgroundColor: '#3b82f6' }} />
                        <span className={styles.pillLabel}>{t.title}</span>
                      </div>
                    ))}
                  </div>
                ))}
              </div>

              {/* Time slots */}
              <div className={styles.timeSlotScroll}>
                {HOURS.map(hourLabel => (
                  <div key={hourLabel} className={styles.timeRow}>
                    <div className={styles.timeGutterLabel}>{hourLabel}</div>
                    {timeCols.map(col => {
                      const slotEvents = eventsForSlot(col.dateStr, hourLabel);
                      return (
                        <div
                          key={col.dateStr}
                          className={styles.timeSlotCell}
                          onClick={() => { setSelectedDate(col.dateStr); setNewEventDate(col.dateStr); setNewEventTime(`${hourLabel.split(':')[0].padStart(2,'0')}:00`); setCreateOpen(true); }}
                        >
                          {slotEvents.map(ev => (
                            <div
                              key={ev.id}
                              className={styles.timeEventBlock}
                              style={{ borderLeftColor: ev.color, background: `${ev.color}18` }}
                              onClick={e => openDetail(ev, e)}
                              title={`${ev.title} — ${formatDisplayTime(ev.time)}`}
                            >
                              <span style={{ fontWeight: 700, fontSize: 11, color: ev.color, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{ev.title}</span>
                              <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>{formatDisplayTime(ev.time)}</span>
                            </div>
                          ))}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ════ Right: Side Panel ════ */}
        <div className={styles.agendaPanel}>
          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: 10 }}>
              <h4 style={{ margin: 0, fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>🗓️ Selected Day</h4>
              <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{selectedDate}</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxHeight: 220, overflowY: 'auto' }}>
              {dayEvents.map(ev => (
                <div
                  key={ev.id}
                  className={styles.agendaItem}
                  style={{ borderLeftColor: ev.color, cursor: 'pointer' }}
                  onClick={() => setDetailEvent(ev)}
                >
                  <span className={styles.agendaTitle}>{ev.title}</span>
                  <span className={styles.agendaMeta}>⏱ {formatDisplayTime(ev.time)}</span>
                  <div style={{ display: 'flex', gap: 4, marginTop: 4 }}>
                    {ev.attendees.map(aId => {
                      const m = members.find(x => x.id === aId);
                      return m ? <span key={aId} title={m.name} style={{ width: 16, height: 16, borderRadius: '50%', background: ev.color + '20', border: `1px solid ${ev.color}40`, fontSize: 8, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', color: ev.color }}>{m.avatar}</span> : null;
                    })}
                  </div>
                </div>
              ))}
              {dayTasks.map(tk => (
                <div key={tk.id} className={styles.agendaItem} style={{ borderLeftColor: 'var(--blue)' }}>
                  <span className={styles.agendaTitle}>✓ {tk.title}</span>
                  <span className={styles.agendaMeta}>Task Due</span>
                </div>
              ))}
              {dayEvents.length === 0 && dayTasks.length === 0 && (
                <p style={{ margin: 0, fontSize: 12, color: 'var(--text-muted)', fontStyle: 'italic', textAlign: 'center', padding: '16px 0' }}>No events scheduled.</p>
              )}
            </div>
          </div>

          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <h4 style={{ margin: 0, fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>📅 Upcoming 7 Days</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxHeight: 260, overflowY: 'auto' }}>
              {getUpcomingEvents().map(({ dateLabel, event }) => (
                <div
                  key={event.id}
                  className={styles.agendaItem}
                  style={{ borderLeftColor: event.color, cursor: 'pointer' }}
                  onClick={() => setDetailEvent(event)}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--text-muted)' }}>
                    <span>{dateLabel}</span><span>{formatDisplayTime(event.time)}</span>
                  </div>
                  <span className={styles.agendaTitle}>{event.title}</span>
                </div>
              ))}
              {getUpcomingEvents().length === 0 && (
                <p style={{ margin: 0, fontSize: 12, color: 'var(--text-muted)', fontStyle: 'italic', textAlign: 'center', padding: '16px 0' }}>No upcoming events.</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Event Detail Popup ── */}
      {detailEvent && !rescheduleEvent && (
        <EventDetailPopup
          event={detailEvent}
          members={members}
          projects={projects}
          onClose={closeDetail}
          onReschedule={handleReschedule}
          onDelete={handleDeleteEvent}
        />
      )}

      {/* ── Reschedule Modal ── */}
      {rescheduleEvent && (
        <RescheduleModal
          event={rescheduleEvent}
          members={members}
          projects={projects}
          onSave={handleSaveReschedule}
          onCancel={() => setRescheduleEvent(null)}
        />
      )}

      {/* ── Create Event Modal ── */}
      {createOpen && (
        <div className={styles.popupBackdrop} onClick={() => setCreateOpen(false)}>
          <div className={styles.editModal} onClick={e => e.stopPropagation()}>
            <div className={styles.editModalHeader}>
              <div>
                <h3 className={styles.editModalTitle}>Schedule New Event</h3>
                <p className={styles.editModalSub}>Add a new event to the calendar.</p>
              </div>
              <button className={styles.popupClose} onClick={() => setCreateOpen(false)}>✕</button>
            </div>
            <div className={styles.editModalBody}>
              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel}>Event Title</label>
                <input className={styles.fieldInput} type="text" placeholder="e.g. Design review…" value={newEventTitle} onChange={e => setNewEventTitle(e.target.value)} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div className={styles.fieldGroup}>
                  <label className={styles.fieldLabel}>Date</label>
                  <input className={styles.fieldInput} type="date" value={newEventDate} onChange={e => setNewEventDate(e.target.value)} />
                </div>
                <div className={styles.fieldGroup}>
                  <label className={styles.fieldLabel}>Time</label>
                  <input className={styles.fieldInput} type="time" value={newEventTime} onChange={e => setNewEventTime(e.target.value)} />
                </div>
              </div>
              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel}>Link to Project</label>
                <select className={styles.fieldSelect} value={newEventProject} onChange={e => setNewEventProject(e.target.value)}>
                  <option value="">No Project</option>
                  {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              </div>
              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel}>Attendees</label>
                <div className={styles.attendeeList}>
                  {members.map(m => (
                    <label key={m.id} className={styles.attendeeRow}>
                      <input type="checkbox" checked={newEventAttendees.includes(m.id)} onChange={() => setNewEventAttendees(p => p.includes(m.id) ? p.filter(x => x !== m.id) : [...p, m.id])} className={styles.attendeeCheck} />
                      <span className={styles.popupAvatar} style={{ background: '#7c5cbf22', color: '#7c5cbf', fontSize: 10 }}>{m.avatar}</span>
                      <div><div style={{ fontWeight: 600, fontSize: 13 }}>{m.name}</div><div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{m.role}</div></div>
                    </label>
                  ))}
                </div>
              </div>
            </div>
            <div className={styles.editModalFooter}>
              <button className={styles.popupCancelBtn} onClick={() => setCreateOpen(false)}>Cancel</button>
              <button className={styles.popupRescheduleBtn} style={{ background: '#7c5cbf' }} onClick={handleCreateEvent}>+ Schedule</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
