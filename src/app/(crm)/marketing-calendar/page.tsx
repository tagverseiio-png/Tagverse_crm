'use client';
import { useState, useMemo } from 'react';

// === MOCK DATA FOR SCHEDULING CALENDAR ===
const MOCK_EVENTS = [
  { id: 1, date: 5, title: 'Product Launch Teaser', channel: 'LinkedIn', time: '9:00 AM', type: 'Social', author: 'Priya S.', badgeChannel: 'blue', badgeStatus: 'emerald', status: 'Published', color: 'var(--blue)' },
  { id: 2, date: 10, title: 'Summer Sale Announce', channel: 'Twitter', time: '11:00 AM', type: 'Social', author: 'Anita K.', badgeChannel: 'blue', badgeStatus: 'emerald', status: 'Published', color: 'var(--blue)' },
  { id: 3, date: 12, title: 'Mid-Month Newsletter', channel: 'Email', time: '8:00 AM', type: 'Email', author: 'Rohan M.', badgeChannel: 'purple', badgeStatus: 'emerald', status: 'Published', color: 'var(--purple)' },
  { id: 4, date: 16, title: 'Feature Spotlight Video', channel: 'YouTube', time: '3:00 PM', type: 'Video', author: 'Priya S.', badgeChannel: 'rose', badgeStatus: 'amber', status: 'Scheduled', color: 'var(--rose)' },
  { id: 5, date: 18, title: 'Customer Success Story', channel: 'Blog', time: '10:00 AM', type: 'Content', author: 'Anita K.', badgeChannel: 'emerald', badgeStatus: 'amber', status: 'Scheduled', color: 'var(--emerald)' },
  { id: 6, date: 20, title: 'Webinar Invite', channel: 'Email', time: '9:00 AM', type: 'Email', author: 'Rohan M.', badgeChannel: 'purple', badgeStatus: 'amber', status: 'Scheduled', color: 'var(--purple)' },
  { id: 7, date: 24, title: 'LinkedIn post — case study', channel: 'LinkedIn', time: '10:00 AM', type: 'Social', author: 'Priya S.', badgeChannel: 'blue', badgeStatus: 'amber', status: 'Scheduled', color: 'var(--blue)' },
  { id: 8, date: 24, title: 'Q3 Goals Overview', channel: 'Blog', time: '2:00 PM', type: 'Content', author: 'Anita K.', badgeChannel: 'emerald', badgeStatus: 'amber', status: 'Scheduled', color: 'var(--emerald)' },
  { id: 9, date: 25, title: 'Partner Announcement', channel: 'Twitter', time: '12:00 PM', type: 'Social', author: 'Rohan M.', badgeChannel: 'blue', badgeStatus: 'amber', status: 'Scheduled', color: 'var(--blue)' },
  { id: 10, date: 26, title: 'June Newsletter', channel: 'Email', time: '9:00 AM', type: 'Email', author: 'Rohan M.', badgeChannel: 'purple', badgeStatus: 'amber', status: 'Scheduled', color: 'var(--purple)' },
  { id: 11, date: 28, title: 'Instagram reel — product demo', channel: 'Instagram', time: '3:00 PM', type: 'Social', author: 'Anita K.', badgeChannel: 'rose', badgeStatus: 'amber', status: 'Scheduled', color: 'var(--rose)' },
  { id: 12, date: 30, title: 'Blog: Q3 outlook', channel: 'Blog', time: '8:00 AM', type: 'Content', author: 'Priya S.', badgeChannel: 'emerald', badgeStatus: 'amber', status: 'Scheduled', color: 'var(--emerald)' },
];

// === MOCK DATA FOR CONTENT / STORY CALENDAR ===
const TIMELINE_STORIES = [
  { id: 1, title: 'Q1 Re-engagement', start: '2025-01-01', end: '2025-03-15', color: 'var(--amber)', label: 'Email Drip', description: 'Targeting users who haven\'t logged in for 30+ days with a 3-part email sequence and promotional offer.', owner: 'Anita K.', budget: '$2,500', channels: ['Email'] },
  { id: 2, title: 'Customer Stories Series', start: '2025-02-10', end: '2025-05-20', color: 'var(--rose)', label: 'Content Series', description: 'Publishing 5 high-quality case studies and associated video testimonials from enterprise clients.', owner: 'Priya S.', budget: '$12,000', channels: ['Blog', 'YouTube', 'LinkedIn'] },
  { id: 3, title: 'Spring Promo', start: '2025-04-01', end: '2025-04-30', color: 'var(--blue)', label: 'Promo Strategy', description: 'Site-wide 20% discount promotion for the spring season. Includes influencer partnerships.', owner: 'Rohan M.', budget: '$15,000', channels: ['Instagram', 'Twitter', 'Email'] },
  { id: 4, title: 'Summer Campaign', start: '2025-05-15', end: '2025-08-31', color: 'var(--emerald)', label: 'Brand Awareness', description: 'Major brand awareness push focusing on outdoor use-cases. Includes out-of-home and digital video.', owner: 'Anita K.', budget: '$45,000', channels: ['YouTube', 'Instagram', 'OOH'] },
  { id: 5, title: 'June Flash Sale', start: '2025-06-20', end: '2025-06-26', color: 'var(--rose)', label: 'Promo Strategy', description: 'Mid-summer 48-hour flash sale to boost end-of-quarter numbers.', owner: 'Priya S.', budget: '$5,000', channels: ['Email', 'Twitter'] },
  { id: 6, title: 'Q3 Product Launch', start: '2025-07-01', end: '2025-09-30', color: 'var(--blue)', label: 'Product & Social', description: 'Launch of the new AI module. Cross-channel campaign coordinated with PR release.', owner: 'Rohan M.', budget: '$60,000', channels: ['PR', 'LinkedIn', 'Webinar', 'Email'] },
  { id: 7, title: 'Holiday Prep & Sales', start: '2025-10-01', end: '2025-12-31', color: 'var(--purple)', label: 'Sales & Marketing', description: 'Black Friday and holiday gifting season campaigns.', owner: 'Priya S.', budget: '$80,000', channels: ['All Channels'] },
  { id: 8, title: 'Mid-Year Webinar', start: '2025-06-25', end: '2025-06-26', color: 'var(--amber)', label: 'Live Event', description: 'Live state-of-the-industry webinar hosted by the CEO.', owner: 'Anita K.', budget: '$1,000', channels: ['LinkedIn', 'Email'] },
];

export default function MarketingCalendarPage() {
  // Common State
  const [activeView, setActiveView] = useState<'Scheduling' | 'Content'>('Scheduling');

  // Scheduling View State
  const [selectedDate, setSelectedDate] = useState<number>(24);
  const [currentMonth] = useState('June 2025');

  // Story / Content View State
  const [timeRange, setTimeRange] = useState<'1 Week' | '1 Month' | '3 Months' | '6 Months' | '1 Year'>('6 Months');
  const [selectedStoryId, setSelectedStoryId] = useState<number | null>(null);

  // === Scheduling View Logic ===
  const daysInMonth = 30;
  const firstDayOfMonth = 0; // June 2025 starts on Sunday
  const days = [];
  for (let i = 0; i < firstDayOfMonth; i++) days.push({ empty: true });
  for (let i = 1; i <= daysInMonth; i++) {
    days.push({ empty: false, day: i, isToday: i === 24, events: MOCK_EVENTS.filter(e => e.date === i) });
  }
  const selectedEvents = MOCK_EVENTS.filter(e => e.date === selectedDate);
  const allScheduled = MOCK_EVENTS.filter(e => e.status === 'Scheduled');

  // === Story / Content View Logic ===
  const timelineData = useMemo(() => {
    const baseDate = new Date('2025-06-24T00:00:00Z');
    let start = new Date(baseDate);
    let end = new Date(baseDate);
    let columns: { label: string, flex: number }[] = [];

    if (timeRange === '1 Week') {
      start = new Date('2025-06-23T00:00:00Z');
      end = new Date('2025-06-29T23:59:59Z');
      columns = ['Mon 23', 'Tue 24', 'Wed 25', 'Thu 26', 'Fri 27', 'Sat 28', 'Sun 29'].map(l => ({ label: l, flex: 1 }));
    } else if (timeRange === '1 Month') {
      start = new Date('2025-06-01T00:00:00Z');
      end = new Date('2025-06-30T23:59:59Z');
      columns = [
        { label: 'Week 1', flex: 7 }, { label: 'Week 2', flex: 7 }, { label: 'Week 3', flex: 7 }, { label: 'Week 4', flex: 9 },
      ];
    } else if (timeRange === '3 Months') {
      start = new Date('2025-05-01T00:00:00Z');
      end = new Date('2025-07-31T23:59:59Z');
      columns = [{ label: 'May', flex: 31 }, { label: 'June', flex: 30 }, { label: 'July', flex: 31 }];
    } else if (timeRange === '6 Months') {
      start = new Date('2025-04-01T00:00:00Z');
      end = new Date('2025-09-30T23:59:59Z');
      columns = [{ label: 'Apr', flex: 30 }, { label: 'May', flex: 31 }, { label: 'Jun', flex: 30 }, { label: 'Jul', flex: 31 }, { label: 'Aug', flex: 31 }, { label: 'Sep', flex: 30 }];
    } else if (timeRange === '1 Year') {
      start = new Date('2025-01-01T00:00:00Z');
      end = new Date('2025-12-31T23:59:59Z');
      columns = [{ label: 'Jan', flex: 31 }, { label: 'Feb', flex: 28 }, { label: 'Mar', flex: 31 }, { label: 'Apr', flex: 30 }, { label: 'May', flex: 31 }, { label: 'Jun', flex: 30 }, { label: 'Jul', flex: 31 }, { label: 'Aug', flex: 31 }, { label: 'Sep', flex: 30 }, { label: 'Oct', flex: 31 }, { label: 'Nov', flex: 30 }, { label: 'Dec', flex: 31 }];
    }

    const startTs = start.getTime();
    const endTs = end.getTime();
    const totalDuration = endTs - startTs;

    const visibleStories = TIMELINE_STORIES.map(story => {
      const sTs = new Date(story.start + 'T00:00:00Z').getTime();
      const eTs = new Date(story.end + 'T23:59:59Z').getTime();

      if (eTs < startTs || sTs > endTs) return null;

      const clampedStart = Math.max(sTs, startTs);
      const clampedEnd = Math.min(eTs, endTs);

      const leftPct = ((clampedStart - startTs) / totalDuration) * 100;
      const widthPct = ((clampedEnd - clampedStart) / totalDuration) * 100;

      return { ...story, left: leftPct, width: widthPct, isCutLeft: sTs < startTs, isCutRight: eTs > endTs };
    }).filter(Boolean);

    return { columns, stories: visibleStories };
  }, [timeRange]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div className="section-title" style={{ fontSize: 24, display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 40, height: 40, borderRadius: 10, background: 'linear-gradient(135deg, var(--purple-dim), var(--blue-dim))', color: 'var(--purple-light)' }}>
              <i className={activeView === 'Scheduling' ? "ti ti-calendar-event" : "ti ti-layout-kanban"} style={{ fontSize: 24 }}></i>
            </div>
            {activeView === 'Scheduling' ? 'Scheduling Calendar' : 'Content & Story Calendar'}
          </div>
          <div className="section-sub" style={{ fontSize: 14, marginTop: 6, marginLeft: 50 }}>
            {activeView === 'Scheduling'
              ? 'Plan and coordinate granular posts across all marketing channels.'
              : 'High-level visual roadmap for major content pieces and campaigns.'}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          {/* Toggle Switch */}
          <div style={{ display: 'flex', background: 'var(--bg-card)', padding: 4, borderRadius: 10, border: '1px solid var(--border)', boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.1)' }}>
            <button
              onClick={() => setActiveView('Scheduling')}
              style={{
                padding: '8px 16px',
                fontSize: 13,
                fontWeight: 600,
                border: 'none',
                background: activeView === 'Scheduling' ? 'var(--bg-secondary)' : 'transparent',
                color: activeView === 'Scheduling' ? 'var(--text-primary)' : 'var(--text-muted)',
                borderRadius: 8,
                cursor: 'pointer',
                boxShadow: activeView === 'Scheduling' ? '0 2px 4px rgba(0,0,0,0.2)' : 'none',
                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                display: 'flex',
                alignItems: 'center',
                gap: 6
              }}
            >
              <i className="ti ti-calendar"></i> Scheduling
            </button>
            <button
              onClick={() => setActiveView('Content')}
              style={{
                padding: '8px 16px',
                fontSize: 13,
                fontWeight: 600,
                border: 'none',
                background: activeView === 'Content' ? 'var(--bg-secondary)' : 'transparent',
                color: activeView === 'Content' ? 'var(--text-primary)' : 'var(--text-muted)',
                borderRadius: 8,
                cursor: 'pointer',
                boxShadow: activeView === 'Content' ? '0 2px 4px rgba(0,0,0,0.2)' : 'none',
                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                display: 'flex',
                alignItems: 'center',
                gap: 6
              }}
            >
              <i className="ti ti-layout-kanban"></i> Content
            </button>
          </div>

          <button className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', borderRadius: 8 }}>
            <i className="ti ti-plus"></i> Schedule Post
          </button>
        </div>
      </div>

      {activeView === 'Scheduling' ? (
        <>
          {/* Two Column Layout for Calendar & Day View */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 420px', gap: 24 }}>
            {/* Calendar Card */}
            <div className="card" style={{ padding: 24, display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
                <button className="btn btn-ghost" style={{ padding: '8px', borderRadius: '50%' }}><i className="ti ti-chevron-left" style={{ fontSize: 18 }}></i></button>
                <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', margin: 0, letterSpacing: '0.5px' }}>{currentMonth}</h2>
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
                    <div
                      key={i}
                      className="cal-day-item"
                      onClick={() => setSelectedDate(d.day!)}
                      style={{
                        position: 'relative',
                        height: 90,
                        padding: '10px',
                        borderRadius: 12,
                        cursor: 'pointer',
                        border: isSelected ? '2px solid var(--purple)' : '1px solid var(--border)',
                        background: isSelected ? 'linear-gradient(145deg, var(--purple-dim), rgba(124, 92, 191, 0.05))' : d.isToday ? 'var(--bg-secondary)' : 'var(--bg-card)',
                        boxShadow: isSelected ? '0 4px 12px rgba(124, 92, 191, 0.15)' : 'none',
                        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                      }}
                    >
                      <span style={{
                        fontSize: 14,
                        fontWeight: isSelected || d.isToday ? 700 : 600,
                        color: isSelected ? 'var(--purple-light)' : (d.isToday ? 'var(--text-primary)' : 'var(--text-secondary)'),
                        background: d.isToday && !isSelected ? 'var(--border)' : 'transparent',
                        padding: d.isToday && !isSelected ? '2px 8px' : '0',
                        borderRadius: 12,
                      }}>
                        {d.day}
                      </span>

                      {/* Event Indicators */}
                      {d.events && d.events.length > 0 && (
                        <div style={{ marginTop: 'auto', display: 'flex', flexWrap: 'wrap', gap: 4, width: '100%' }}>
                          {d.events.slice(0, 3).map((evt, idx) => (
                            <div key={idx} style={{
                              height: 6,
                              flex: 1,
                              minWidth: 10,
                              background: evt.color,
                              borderRadius: 4,
                              opacity: evt.status === 'Published' ? 0.4 : 1,
                              boxShadow: evt.status === 'Scheduled' ? `0 0 8px ${evt.color}40` : 'none'
                            }} title={evt.title} />
                          ))}
                          {d.events.length > 3 && (
                            <span style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 700, marginLeft: 2 }}>+{d.events.length - 3}</span>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              <div style={{ marginTop: 24, padding: '16px', background: 'var(--bg-secondary)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 20, fontSize: 12, color: 'var(--text-secondary)', fontWeight: 600 }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--blue)', boxShadow: '0 0 8px var(--blue)' }} /> Social
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--purple)', boxShadow: '0 0 8px var(--purple)' }} /> Email
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--emerald)', boxShadow: '0 0 8px var(--emerald)' }} /> Content
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--rose)', boxShadow: '0 0 8px var(--rose)' }} /> Video
                </span>
              </div>
            </div>

            {/* Selected Day View */}
            <div className="card" style={{ padding: 24, display: 'flex', flexDirection: 'column', height: '100%', background: 'linear-gradient(180deg, var(--bg-card) 0%, rgba(20,20,20,0.2) 100%)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: 'var(--text-primary)' }}>
                    {currentMonth.split(' ')[0]} {selectedDate}
                  </h3>
                  <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>Daily Schedule</div>
                </div>
                <span className="badge" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>{selectedEvents.length} items</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 14, overflowY: 'auto', flex: 1, paddingRight: 8 }} className="scrollbar-thin">
                {selectedEvents.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)', border: '2px dashed var(--border)', borderRadius: 16, background: 'rgba(255,255,255,0.02)' }}>
                    <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                      <i className="ti ti-calendar-off" style={{ fontSize: 32, opacity: 0.5 }}></i>
                    </div>
                    <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)' }}>Nothing scheduled</div>
                    <div style={{ fontSize: 13, marginTop: 6 }}>No campaigns or content planned for this date.</div>
                    <button className="btn btn-ghost" style={{ marginTop: 20, fontSize: 13, color: 'var(--purple)', fontWeight: 600 }}>+ Schedule Item</button>
                  </div>
                ) : (
                  selectedEvents.map(evt => (
                    <div key={evt.id} style={{
                      padding: 18,
                      background: 'var(--bg-card)',
                      border: '1px solid var(--border)',
                      borderRadius: 14,
                      position: 'relative',
                      overflow: 'hidden',
                      transition: 'transform 0.2s, box-shadow 0.2s',
                      cursor: 'pointer'
                    }} className="hover-lift">
                      <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 4, background: evt.color }} />
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                        <span className={`badge ${evt.badgeChannel}`} style={{ fontSize: 11, fontWeight: 600 }}>{evt.channel}</span>
                        <span style={{ fontSize: 12, fontWeight: 700, color: evt.status === 'Published' ? 'var(--emerald)' : 'var(--amber)' }}>
                          {evt.status === 'Published' && <i className="ti ti-check" style={{ marginRight: 4 }}></i>}
                          {evt.status}
                        </span>
                      </div>
                      <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 10 }}>{evt.title}</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 16, fontSize: 13, color: 'var(--text-secondary)' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 500 }}><i className="ti ti-clock" style={{ color: 'var(--text-muted)' }}></i> {evt.time}</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 500 }}>
                          <div style={{ width: 18, height: 18, borderRadius: '50%', background: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, color: 'var(--text-primary)' }}><i className="ti ti-user"></i></div>
                          {evt.author}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Upcoming List (Table) */}
          <div className="card table-wrap" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-card)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--blue-dim)', color: 'var(--blue-light)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <i className="ti ti-list-details" style={{ fontSize: 18 }}></i>
                </div>
                <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: 'var(--text-primary)' }}>All Upcoming Scheduled</h3>
              </div>
              <button className="btn btn-ghost" style={{ fontSize: 13, fontWeight: 600 }}>View All <i className="ti ti-arrow-right"></i></button>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead style={{ background: 'var(--bg-secondary)', textAlign: 'left', fontSize: 12, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                <tr>
                  <th style={{ padding: '16px 24px', fontWeight: 700 }}>Content Title</th>
                  <th style={{ padding: '16px 24px', fontWeight: 700 }}>Channel</th>
                  <th style={{ padding: '16px 24px', fontWeight: 700 }}>Scheduled For</th>
                  <th style={{ padding: '16px 24px', fontWeight: 700 }}>Author</th>
                  <th style={{ padding: '16px 24px', fontWeight: 700 }}>Status</th>
                  <th style={{ padding: '16px 24px', fontWeight: 700 }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {allScheduled.map((s, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid var(--border)', transition: 'background 0.2s' }} className="hover-bg-secondary">
                    <td style={{ padding: '16px 24px', fontWeight: 600, color: 'var(--text-primary)' }}>{s.title}</td>
                    <td style={{ padding: '16px 24px' }}><span className={`badge ${s.badgeChannel}`} style={{ fontWeight: 600 }}>{s.channel}</span></td>
                    <td style={{ padding: '16px 24px', color: 'var(--text-secondary)', fontSize: 14, fontWeight: 500 }}>
                      <span style={{ color: 'var(--text-primary)' }}>June {s.date}</span>, {s.time}
                    </td>
                    <td style={{ padding: '16px 24px', color: 'var(--text-secondary)', fontSize: 14 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'linear-gradient(135deg, var(--purple), var(--blue))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, color: '#fff' }}>
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
                        <button className="btn btn-ghost" style={{ padding: '8px', fontSize: 16, borderRadius: 8, color: 'var(--text-secondary)' }} title="Edit"><i className="ti ti-edit"></i></button>
                        <button className="btn btn-ghost" style={{ padding: '8px', fontSize: 16, borderRadius: 8, color: 'var(--rose)' }} title="Delete"><i className="ti ti-trash"></i></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        /* Content / Story Timeline View */
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div className="card" style={{ padding: '32px 24px', overflowX: 'auto', display: 'flex', flexDirection: 'column' }}>

            {/* Timeline Filter Controls */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: 'var(--emerald-dim)', color: 'var(--emerald)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <i className="ti ti-timeline" style={{ fontSize: 24 }}></i>
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: 'var(--text-primary)' }}>Campaign Timeline</h3>
                  <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>Visualize marketing efforts over time</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8, background: 'var(--bg-secondary)', padding: 4, borderRadius: 12, border: '1px solid var(--border)' }}>
                {['1 Week', '1 Month', '3 Months', '6 Months', '1 Year'].map(rng => (
                  <button
                    key={rng}
                    onClick={() => setTimeRange(rng as any)}
                    style={{
                      padding: '6px 14px',
                      borderRadius: 8,
                      fontSize: 13,
                      fontWeight: 600,
                      border: 'none',
                      background: timeRange === rng ? 'var(--bg-card)' : 'transparent',
                      color: timeRange === rng ? 'var(--text-primary)' : 'var(--text-secondary)',
                      boxShadow: timeRange === rng ? '0 2px 6px rgba(0,0,0,0.1)' : 'none',
                      cursor: 'pointer',
                      transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
                    }}
                  >{rng}</button>
                ))}
              </div>
            </div>

            <div style={{ minWidth: 800 }}>
              {/* Gantt Header */}
              <div style={{ display: 'flex', borderBottom: '2px solid var(--border)', paddingBottom: 16, marginBottom: 24 }}>
                <div style={{ width: 240, flexShrink: 0, fontSize: 13, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Campaigns</div>
                <div style={{ flex: 1, display: 'flex' }}>
                  {timelineData.columns.map((col, idx) => (
                    <div key={idx} style={{ flex: col.flex, textAlign: 'center', fontSize: 13, fontWeight: 700, color: 'var(--text-secondary)', borderLeft: idx === 0 ? 'none' : '1px solid var(--border-bright)', paddingLeft: 8 }}>
                      {col.label}
                    </div>
                  ))}
                </div>
              </div>

              {/* Gantt Rows */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 24, position: 'relative' }}>

                {/* Faint background grid lines corresponding to columns */}
                <div style={{ position: 'absolute', top: 0, bottom: 0, left: 240, right: 0, display: 'flex', pointerEvents: 'none' }}>
                  {timelineData.columns.map((col, i) => (
                    <div key={i} style={{ flex: col.flex, borderLeft: i === 0 ? 'none' : '1px dashed rgba(255,255,255,0.05)', height: '100%' }} />
                  ))}
                </div>

                {timelineData.stories.length === 0 ? (
                  <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-muted)', fontSize: 15, fontWeight: 500 }}>No campaigns found in this time range.</div>
                ) : (
                  timelineData.stories.map((evt, idx) => !evt ? null : (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', position: 'relative', zIndex: 1 }} className="timeline-row">
                      <div style={{ width: 240, flexShrink: 0, paddingRight: 20 }}>
                        <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4 }}>{evt.title}</div>
                        <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{evt.owner}</div>
                      </div>

                      <div style={{ flex: 1, position: 'relative', height: 42 }}>
                        <div className="hover-lift" onClick={() => setSelectedStoryId(evt.id)} style={{
                          position: 'absolute',
                          left: `${evt.left}%`,
                          width: `${evt.width}%`,
                          background: evt.color,
                          height: '100%',
                          borderRadius: evt.isCutLeft && evt.isCutRight ? 6 : (evt.isCutLeft ? '0 21px 21px 0' : (evt.isCutRight ? '21px 0 0 21px' : 21)),
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#fff',
                          fontSize: 13,
                          fontWeight: 600,
                          boxShadow: `0 4px 12px rgba(0,0,0,0.15)`,
                          cursor: 'pointer',
                          padding: '0 16px',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          opacity: (evt.isCutLeft || evt.isCutRight) ? 0.85 : 1,
                          border: selectedStoryId === evt.id ? '2px solid #fff' : 'none',
                          outline: selectedStoryId === evt.id ? `2px solid ${evt.color}` : 'none',
                          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
                        }}>
                          {evt.label}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {selectedStoryId && TIMELINE_STORIES.find(s => s.id === selectedStoryId) && (() => {
            const story = TIMELINE_STORIES.find(s => s.id === selectedStoryId)!;
            return (
              <div className="card" style={{ padding: 32, display: 'flex', flexDirection: 'column', gap: 20, borderTop: `4px solid ${story.color}`, background: 'linear-gradient(180deg, var(--bg-card) 0%, rgba(20,20,20,0.3) 100%)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                      <span className="badge" style={{ background: 'var(--bg-secondary)', color: story.color, border: `1px solid ${story.color}`, padding: '6px 12px', fontSize: 12 }}>{story.label}</span>
                      <span style={{ fontSize: 14, color: 'var(--text-secondary)', fontWeight: 600 }}><i className="ti ti-calendar" style={{ marginRight: 6 }}></i> {story.start} — {story.end}</span>
                    </div>
                    <h3 style={{ margin: 0, fontSize: 24, fontWeight: 800, color: 'var(--text-primary)' }}>{story.title}</h3>
                  </div>
                  <button onClick={() => setSelectedStoryId(null)} className="btn btn-ghost" style={{ padding: 8, borderRadius: '50%', background: 'var(--bg-secondary)' }}><i className="ti ti-x" style={{ fontSize: 20 }}></i></button>
                </div>

                <p style={{ margin: 0, fontSize: 15, color: 'var(--text-secondary)', lineHeight: 1.6, maxWidth: '800px', fontWeight: 500 }}>
                  {story.description}
                </p>

                <div style={{ display: 'flex', gap: 40, marginTop: 12, padding: '24px', background: 'var(--bg-secondary)', borderRadius: 16, border: '1px solid var(--border)' }}>
                  <div>
                    <div style={{ fontSize: 12, textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700, marginBottom: 8, letterSpacing: '0.5px' }}>Owner</div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--purple-dim)', color: 'var(--purple)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><i className="ti ti-user"></i></div>
                      {story.owner}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: 12, textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700, marginBottom: 8, letterSpacing: '0.5px' }}>Budget</div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--emerald-dim)', color: 'var(--emerald)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><i className="ti ti-currency-dollar"></i></div>
                      {story.budget}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: 12, textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700, marginBottom: 8, letterSpacing: '0.5px' }}>Channels</div>
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                      {story.channels.map(c => <span key={c} className="badge" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', fontSize: 12, color: 'var(--text-primary)', padding: '6px 12px' }}>{c}</span>)}
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* Inline styles */}
      <style dangerouslySetInnerHTML={{
        __html: `
        .cal-day-item:hover { border-color: var(--purple) !important; background: linear-gradient(145deg, rgba(124, 92, 191, 0.1), rgba(124, 92, 191, 0.05)) !important; transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
        .hover-lift:hover { transform: translateY(-4px) !important; box-shadow: 0 8px 24px rgba(0,0,0,0.15) !important; filter: brightness(1.1); z-index: 10; }
        .hover-bg-secondary:hover { background: var(--bg-card) !important; }
        .timeline-row:hover { background: rgba(255,255,255,0.02); border-radius: 8px; }
        .scrollbar-thin::-webkit-scrollbar { width: 6px; }
        .scrollbar-thin::-webkit-scrollbar-track { background: transparent; }
        .scrollbar-thin::-webkit-scrollbar-thumb { background: var(--border); border-radius: 4px; }
        .scrollbar-thin::-webkit-scrollbar-thumb:hover { background: var(--text-muted); }
      `}} />
    </div>
  );
}
