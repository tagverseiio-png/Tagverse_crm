'use client';
import React, { useState } from 'react';
import { useWorkspace, CalendarEvent, Task } from '@/context/WorkspaceContext';
import styles from './calendar.module.css';

export default function CalendarPage() {
  const {
    members,
    projects,
    tasks,
    events,
    addEvent,
  } = useWorkspace();

  // Current calendar view state
  const [calendarYear, setCalendarYear] = useState(2026);
  const [calendarMonth, setCalendarMonth] = useState(5); // June (0-indexed)
  const [selectedDate, setSelectedDate] = useState('2026-06-25');

  // Modal State
  const [eventModalOpen, setEventModalOpen] = useState(false);
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventDate, setNewEventDate] = useState('2026-06-25');
  const [newEventTime, setNewEventTime] = useState('10:00');
  const [newEventProject, setNewEventProject] = useState('');
  const [newEventAttendees, setNewEventAttendees] = useState<string[]>([]);

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Navigate Months
  const handleMonthChange = (direction: number) => {
    let nextMonth = calendarMonth + direction;
    let nextYear = calendarYear;

    if (nextMonth < 0) {
      nextMonth = 11;
      nextYear--;
    } else if (nextMonth > 11) {
      nextMonth = 0;
      nextYear++;
    }

    setCalendarMonth(nextMonth);
    setCalendarYear(nextYear);
  };

  const handleResetToday = () => {
    setCalendarYear(2026);
    setCalendarMonth(5);
    setSelectedDate('2026-06-25');
  };

  // Generate calendar days
  const getCalendarDays = () => {
    const firstDayIndex = new Date(calendarYear, calendarMonth, 1).getDay();
    const totalDaysInMonth = new Date(calendarYear, calendarMonth + 1, 0).getDate();
    const prevMonthDays = new Date(calendarYear, calendarMonth, 0).getDate();

    const days: { dayNum: number; dateStr: string; isCurrentMonth: boolean }[] = [];

    // Prev month padding cells
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      const dayNum = prevMonthDays - i;
      const prevMonth = calendarMonth === 0 ? 11 : calendarMonth - 1;
      const prevYear = calendarMonth === 0 ? calendarYear - 1 : calendarYear;
      const dateStr = `${prevYear}-${String(prevMonth + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
      days.push({ dayNum, dateStr, isCurrentMonth: false });
    }

    // Current month cells
    for (let day = 1; day <= totalDaysInMonth; day++) {
      const dateStr = `${calendarYear}-${String(calendarMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      days.push({ dayNum: day, dateStr, isCurrentMonth: true });
    }

    // Next month padding cells to complete grid
    const totalSlots = 42; // 6 rows * 7 days
    const remainingSlots = totalSlots - days.length;
    for (let day = 1; day <= remainingSlots; day++) {
      const nextMonth = calendarMonth === 11 ? 0 : calendarMonth + 1;
      const nextYear = calendarMonth === 11 ? calendarYear + 1 : calendarYear;
      const dateStr = `${nextYear}-${String(nextMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      days.push({ dayNum: day, dateStr, isCurrentMonth: false });
    }

    return days;
  };

  const calendarDays = getCalendarDays();

  // Create Event action
  const handleScheduleEvent = () => {
    if (!newEventTitle.trim()) {
      alert('Event Title is required!');
      return;
    }
    if (newEventAttendees.length === 0) {
      alert('Please select at least one attendee!');
      return;
    }

    const linkedProj = projects.find(p => p.id === newEventProject);
    const color = linkedProj ? linkedProj.color : '#7c5cbf';

    addEvent({
      title: newEventTitle.trim(),
      date: newEventDate,
      time: newEventTime,
      attendees: newEventAttendees,
      linkedRecord: newEventProject ? { type: 'project', id: newEventProject } : null,
      color,
    });

    setNewEventTitle('');
    setNewEventAttendees([]);
    setEventModalOpen(false);
  };

  const handleAttendeeToggle = (memberId: string) => {
    setNewEventAttendees(prev =>
      prev.includes(memberId)
        ? prev.filter(id => id !== memberId)
        : [...prev, memberId]
    );
  };

  // Filter items for selected date inspector
  const dayEvents = events.filter(e => e.date === selectedDate);
  const dayTasks = tasks.filter(t => t.due === selectedDate);

  // Compute upcoming 7 days starting from fixed mock date 2026-06-25
  const getUpcomingEvents = () => {
    const upcomingList: { dateLabel: string; event: CalendarEvent }[] = [];
    const baseDate = new Date('2026-06-25');
    
    for (let i = 0; i < 7; i++) {
      const walkDate = new Date(baseDate);
      walkDate.setDate(baseDate.getDate() + i);
      const walkStr = walkDate.toISOString().split('T')[0];
      const matchEvents = events.filter(e => e.date === walkStr);
      
      const dateLabel = walkDate.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
      });

      matchEvents.forEach(ev => {
        upcomingList.push({ dateLabel, event: ev });
      });
    }
    return upcomingList;
  };

  const upcoming7Days = getUpcomingEvents();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Top action row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ fontSize: '18px', fontWeight: 700, margin: 0 }}>Calendar Agenda</h2>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: '2px 0 0' }}>Track schedules, alignment sync meetings, and milestone due dates</p>
        </div>
        <button className="btn btn-primary" onClick={() => { setNewEventDate(selectedDate); setEventModalOpen(true); }}>
          📅 Schedule Event
        </button>
      </div>

      <div className={styles.calendarLayout}>
        {/* Left: Monthly Grid Calendar */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
          <div className={styles.monthHeader}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700 }}>
                {months[calendarMonth]} {calendarYear}
              </h3>
              <span className="badge blue">Month View</span>
            </div>

            <div className={styles.navigationControls}>
              <button className={styles.navBtn} onClick={() => handleMonthChange(-1)}>
                ◀ Prev
              </button>
              <button className={styles.navBtn} onClick={handleResetToday}>
                Today
              </button>
              <button className={styles.navBtn} onClick={() => handleMonthChange(1)}>
                Next ▶
              </button>
            </div>
          </div>

          {/* Calendar Grid Header */}
          <div className={styles.gridHeader}>
            <div>SUN</div>
            <div>MON</div>
            <div>TUE</div>
            <div>WED</div>
            <div>THU</div>
            <div>FRI</div>
            <div>SAT</div>
          </div>

          {/* Calendar Cells */}
          <div className={styles.daysGrid}>
            {calendarDays.map(({ dayNum, dateStr, isCurrentMonth }, idx) => {
              const isSelected = dateStr === selectedDate;
              const isToday = dateStr === '2026-06-25'; // Mock today anchor

              const cellEvents = events.filter(e => e.date === dateStr);
              const cellTasks = tasks.filter(t => t.due === dateStr);

              return (
                <div
                  key={idx}
                  onClick={() => setSelectedDate(dateStr)}
                  className={isSelected ? styles.cellActive : styles.cell}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    {isToday ? (
                      <span className={styles.todayNum}>{dayNum}</span>
                    ) : (
                      <span className={isCurrentMonth ? styles.cellNum : styles.cellNumOutside}>
                        {dayNum}
                      </span>
                    )}
                    {(cellEvents.length + cellTasks.length > 0) && (
                      <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--purple)' }} />
                    )}
                  </div>

                  <div className={styles.indicatorList}>
                    {cellEvents.map(e => (
                      <div
                        key={e.id}
                        title={`Event: ${e.title}`}
                        className={styles.eventPill}
                        style={{ borderLeftColor: e.color, color: e.color }}
                      >
                        {e.title}
                      </div>
                    ))}
                    {cellTasks.map(t => (
                      <div
                        key={t.id}
                        title={`Task Due: ${t.title}`}
                        className={styles.taskPill}
                      >
                        ✓ {t.title}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Selected Day Inspector & Upcoming Timeline */}
        <div className={styles.agendaPanel}>
          {/* Day Inspector */}
          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: '10px' }}>
              <h4 style={{ margin: 0, fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>
                🗓️ Selected Day Schedules
              </h4>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{selectedDate}</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '200px', overflowY: 'auto' }}>
              {dayEvents.map(ev => (
                <div
                  key={ev.id}
                  className={styles.agendaItem}
                  style={{ borderLeftColor: ev.color }}
                >
                  <span className={styles.agendaTitle}>{ev.title}</span>
                  <span className={styles.agendaMeta}>⏱️ {ev.time}</span>
                  <div style={{ display: 'flex', gap: '4px', marginTop: '4px' }}>
                    {ev.attendees.map(aId => {
                      const m = members.find(x => x.id === aId);
                      return m ? (
                        <span
                          key={aId}
                          title={m.name}
                          style={{
                            width: '16px',
                            height: '16px',
                            borderRadius: '50%',
                            background: 'var(--bg-primary)',
                            border: '1px solid var(--border)',
                            fontSize: '8px',
                            fontWeight: 700,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            textTransform: 'uppercase',
                          }}
                        >
                          {m.avatar}
                        </span>
                      ) : null;
                    })}
                  </div>
                </div>
              ))}

              {dayTasks.map(tk => (
                <div
                  key={tk.id}
                  className={styles.agendaItem}
                  style={{ borderLeftColor: 'var(--blue)' }}
                >
                  <span className={styles.agendaTitle}>✓ {tk.title}</span>
                  <span className={styles.agendaMeta}>Task Milestone Due</span>
                </div>
              ))}

              {dayEvents.length === 0 && dayTasks.length === 0 && (
                <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-muted)', fontStyle: 'italic', textAlign: 'center', padding: '16px 0' }}>
                  No meetings or tasks scheduled for this day.
                </p>
              )}
            </div>
          </div>

          {/* Upcoming 7 Days Agenda */}
          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <h4 style={{ margin: 0, fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>
              📅 Upcoming 7 Days
            </h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', maxHeight: '250px', overflowY: 'auto' }}>
              {upcoming7Days.map(({ dateLabel, event }) => (
                <div
                  key={event.id}
                  className={styles.agendaItem}
                  style={{ borderLeftColor: event.color }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-muted)' }}>
                    <span>{dateLabel}</span>
                    <span>{event.time}</span>
                  </div>
                  <span className={styles.agendaTitle}>{event.title}</span>
                </div>
              ))}

              {upcoming7Days.length === 0 && (
                <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-muted)', fontStyle: 'italic', textAlign: 'center', padding: '16px 0' }}>
                  No upcoming meetings over the next week.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal - Create Event */}
      {eventModalOpen && (
        <div className={styles.modalBackdrop} onClick={() => setEventModalOpen(false)}>
          <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)', paddingBottom: '10px' }}>
              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700 }}>Schedule New Event</h3>
              <button onClick={() => setEventModalOpen(false)} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', fontSize: '18px', cursor: 'pointer' }}>✕</button>
            </div>

            <div>
              <label style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Event Title</label>
              <input
                type="text"
                placeholder="e.g. Design review alignment"
                value={newEventTitle}
                onChange={e => setNewEventTitle(e.target.value)}
                style={{ width: '100%', padding: '8px 12px', background: 'var(--bg-primary)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text-primary)', outline: 'none', marginTop: '4px' }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Date</label>
                <input
                  type="date"
                  value={newEventDate}
                  onChange={e => setNewEventDate(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', background: 'var(--bg-primary)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text-primary)', outline: 'none', marginTop: '4px' }}
                />
              </div>
              <div>
                <label style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Time</label>
                <input
                  type="time"
                  value={newEventTime}
                  onChange={e => setNewEventTime(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', background: 'var(--bg-primary)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text-primary)', outline: 'none', marginTop: '4px' }}
                />
              </div>
            </div>

            <div>
              <label style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Link To Project</label>
              <select
                value={newEventProject}
                onChange={e => setNewEventProject(e.target.value)}
                style={{ width: '100%', padding: '8px 12px', background: 'var(--bg-primary)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text-primary)', outline: 'none', marginTop: '4px', cursor: 'pointer' }}
              >
                <option value="">No Project Link</option>
                {projects.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Attendees (Select multiple)</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '6px', maxHeight: '120px', overflowY: 'auto' }}>
                {members.map(m => (
                  <label key={m.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px' }}>
                    <input
                      type="checkbox"
                      checked={newEventAttendees.includes(m.id)}
                      onChange={() => handleAttendeeToggle(m.id)}
                      style={{ cursor: 'pointer' }}
                    />
                    <span>{m.name} ({m.role})</span>
                  </label>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', borderTop: '1px solid var(--border)', paddingTop: '12px' }}>
              <button className="btn btn-ghost" onClick={() => setEventModalOpen(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleScheduleEvent}>Schedule</button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
