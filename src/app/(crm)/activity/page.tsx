'use client';

import React, { useState } from 'react';
// ── Inline SVG icons (no lucide-react dependency needed) ─────────────────────
const Video = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="23 7 16 12 23 17 23 7" /><rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
  </svg>
);
const CheckSquare = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 11 12 14 22 4" /><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
  </svg>
);
const AlertTriangle = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);
const Calendar = ({ size = 16, color }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color ?? 'currentColor'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);
const Plus = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);
const ChevronRight = ({ size = 16, color }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color ?? 'currentColor'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6" />
  </svg>
);
const ChevronDown = ({ size = 16, color }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color ?? 'currentColor'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9" />
  </svg>
);
import { store, getCompanyById, getMemberById } from '@/lib/mockData';
import styles from './activity.module.css';

const { upcomingEvents, productivityTracker } = store;

export default function ActivityPage() {
  const [filter, setFilter] = useState('all');
  const [completedExpanded, setCompletedExpanded] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<any>(null);
  const [isRescheduling, setIsRescheduling] = useState(false);

  const meetingsCount = store.activities.filter(a => a.type === 'meeting' && a.status !== 'done').length;
  const tasksCount = store.activities.filter(a => a.type === 'task' && a.status !== 'done').length;
  const deadlinesCount = store.activities.filter(a => a.type === 'deadline' && a.status !== 'done').length;

  const filteredActivities = store.activities.filter(a => {
    if (a.status === 'done') return false;
    if (filter === 'all') return true;
    return a.type === filter;
  });

  const completedActivities = store.activities.filter(a => a.status === 'done');

  return (
    <div className={styles.container}>
      
      {/* SECTION A: Day Header Banner */}
      <section className={styles.headerBanner}>
        <div>
          <div className={styles.headerTag}>TODAY'S SCHEDULE</div>
          <h2 className={styles.headerTitle}>Today</h2>
          <p className={styles.headerSub}>Friday, 27 June 2026</p>
        </div>

        {/* Overview Count Badges */}
        <div className={styles.badgesContainer}>
          <div className={styles.badge}>
            <div className={`${styles.badgeIcon} ${styles.badgeIconBlue}`}>
              <Video size={16} />
            </div>
            <div>
              <p className={styles.badgeLabel}>Meetings</p>
              <p className={styles.badgeValue}>{meetingsCount}</p>
            </div>
          </div>

          <div className={styles.badge}>
            <div className={`${styles.badgeIcon} ${styles.badgeIconAmber}`}>
              <CheckSquare size={16} />
            </div>
            <div>
              <p className={styles.badgeLabel}>Tasks</p>
              <p className={styles.badgeValue}>{tasksCount}</p>
            </div>
          </div>

          <div className={styles.badge}>
            <div className={`${styles.badgeIcon} ${styles.badgeIconRose}`}>
              <AlertTriangle size={16} />
            </div>
            <div>
              <p className={styles.badgeLabel}>Deadlines</p>
              <p className={styles.badgeValue}>{deadlinesCount}</p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION B & C: Filter Tabs & Split Grid */}
      <section className={styles.mainLayout}>
        
        {/* LEFT Main Timeline Container */}
        <div className={styles.leftCol}>
          
          {/* Filters segment */}
          <div className={styles.filtersCard}>
            <div className={styles.filtersGroup}>
              {['all', 'meeting', 'task', 'deadline', 'followup'].map(f => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`${styles.filterBtn} ${filter === f ? styles.filterBtnActive : ''}`}
                >
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                  {f === 'all' ? '' : 's'}
                </button>
              ))}
            </div>
            <span className={styles.filterRef}>Current Reference: 11:15 AM</span>
          </div>

          {/* Active Timeline Column Card */}
          <div className={styles.timelineCard}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h3 className={styles.timelineTitle} style={{ margin: 0 }}>Chronological Feed</h3>
              <button style={{ padding: '8px 16px', background: 'var(--brand-accent, var(--purple))', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600, fontSize: 13, transition: 'all 0.2s' }} onClick={() => setShowAddModal(true)}>
                <Plus size={16} /> Add Activity
              </button>
            </div>

            <div className={styles.timelineWrapper}>
              <div className={styles.timelineGuideline}></div>

              <div>
                {filteredActivities.map(activity => {
                  const member = getMemberById(activity.owner);
                  const company = activity.company ? getCompanyById(activity.company) : null;
                  
                  let icon = <CheckSquare size={16} />;
                  let iconClass = styles.badgeIconAmber;
                  
                  if (activity.type === 'meeting') { icon = <Video size={16} />; iconClass = styles.badgeIconBlue; }
                  if (activity.type === 'deadline') { icon = <AlertTriangle size={16} />; iconClass = styles.badgeIconRose; }

                  return (
                    <div key={activity.id} className={styles.timelineItem}>
                      <div className={styles.timeCol}>
                        <span className={styles.timeText}>{activity.time}</span>
                      </div>
                      
                      <div className={styles.iconCol}>
                        <div className={`${styles.timelineIcon} ${iconClass}`}>
                          {icon}
                        </div>
                      </div>

                      <div className={styles.timelineContent}>
                        <div className={styles.contentHeader}>
                          <div>
                            <h4 className={styles.activityTitle}>{activity.title}</h4>
                            <div className={styles.metaRow}>
                              {company && (
                                <span className={styles.companyTag}>{company.name}</span>
                              )}
                              {activity.duration && <span>{activity.duration}</span>}
                              {activity.priority && (
                                <span className={`${styles.priorityTag} ${activity.priority === 'urgent' || activity.priority === 'high' ? styles.priorityUrgent : styles.priorityNormal}`}>
                                  {activity.priority}
                                </span>
                              )}
                            </div>
                          </div>
                          
                          <div className={styles.actionsRow}>
                            <div style={{ display: 'flex' }}>
                              {member && (
                                <div className={styles.ownerAvatar} style={{ backgroundColor: member.color }} title={member.name}>
                                  {member.avatar}
                                </div>
                              )}
                            </div>
                            <button className={styles.viewBtn} onClick={() => setSelectedActivity(activity)}>
                              View
                            </button>
                          </div>
                        </div>
                        {activity.note && (
                          <p className={styles.noteText}>{activity.note}</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* SECTION D: Completed Section */}
          <div className={styles.completedSection}>
            <button onClick={() => setCompletedExpanded(!completedExpanded)} className={styles.completedToggle}>
              <div className={styles.toggleLeft}>
                {completedExpanded ? <ChevronDown size={16} color="var(--text-secondary)" /> : <ChevronRight size={16} color="var(--text-secondary)" />}
                <span className={styles.toggleTitle}>Completed Today ({completedActivities.length})</span>
              </div>
              <span className={styles.toggleSub}>Expand and audit closed workflows</span>
            </button>

            {completedExpanded && (
              <div className={styles.completedContent}>
                <div className={styles.timelineWrapper}>
                  <div className={styles.timelineGuideline}></div>
                  
                  <div>
                    {completedActivities.map(activity => (
                      <div key={activity.id} className={`${styles.timelineItem} ${styles.completedItem}`}>
                        <div className={styles.timeCol}>
                          <span className={styles.timeText}>{activity.time}</span>
                        </div>
                        
                        <div className={styles.iconCol}>
                          <div className={styles.timelineIcon} style={{ background: 'var(--bg-glass)', color: 'var(--text-secondary)' }}>
                            <CheckSquare size={16} />
                          </div>
                        </div>

                        <div style={{ flex: 1, padding: '0.5rem 0' }}>
                          <h4 className={styles.activityTitle}>{activity.title}</h4>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

        </div>

        {/* RIGHT 35% Upcoming & Sticky Pane */}
        <div className={styles.rightCol}>
          
          <div className={styles.upcomingCard}>
            <div className={styles.upcomingHeader}>
              <Calendar size={16} color="var(--brand-accent)" />
              <h3 className={styles.upcomingTitle}>Coming Up</h3>
            </div>

            {upcomingEvents.map((group) => (
              <div key={group.group} className={styles.upcomingGroup}>
                <p className={styles.upcomingGroupTitle}>{group.group}</p>
                {group.events.map((ev) => (
                  <div key={ev.title} className={styles.upcomingEvent}>
                    <div className={styles.eventDot} style={{ background: ev.color }}></div>
                    <div>
                      <p className={styles.eventTitle}>{ev.title}</p>
                      <div className={styles.eventMeta}>
                        <span className={styles.eventTime}>{ev.time}</span>
                        <span>Owner: {ev.owner}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>

          <div className={styles.insightsCard}>
            <h4 className={styles.insightsTitle}>Productivity Tracker</h4>
            <p className={styles.insightsText}>You completed {completedActivities.length} crucial pipeline workflows today. Keep up the high momentum with the team!</p>
            <div>
              <div className={styles.progressLabel}>
                <span>{productivityTracker.label}</span>
                <span>{productivityTracker.dailyGoalPct}% Achieved</span>
              </div>
              <div className={styles.progressBar}>
                <div className={styles.progressFill} style={{ width: `${productivityTracker.dailyGoalPct}%` }}></div>
              </div>
            </div>
          </div>

        </div>

      </section>

      {/* Add Activity Modal */}
      {showAddModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }} onClick={() => setShowAddModal(false)}>
          <div style={{ background: 'var(--bg-card, #fff)', border: '1px solid var(--border, #eaeaea)', borderRadius: 20, padding: 32, width: '100%', maxWidth: 520, boxShadow: '0 24px 64px rgba(0,0,0,0.4)' }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
              <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: 'var(--text-primary)' }}>Add New Activity</h2>
              <button onClick={() => setShowAddModal(false)} style={{ background: 'var(--bg-secondary)', width: 32, height: 32, borderRadius: '50%', border: 'none', cursor: 'pointer', fontSize: 16, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 6 }}>Activity Title</label>
                <input type="text" placeholder="e.g. Acme Corp Contract Review" style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1px solid var(--border)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', outline: 'none', fontSize: 14 }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 6 }}>Type</label>
                  <select style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1px solid var(--border)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', outline: 'none', fontSize: 14 }}>
                    <option>Meeting</option>
                    <option>Task</option>
                    <option>Deadline</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 6 }}>Date & Time</label>
                  <input type="datetime-local" style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1px solid var(--border)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', outline: 'none', fontSize: 14 }} />
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 32, paddingTop: 20, borderTop: '1px solid var(--border)' }}>
              <button style={{ padding: '10px 16px', borderRadius: 10, background: 'transparent', border: 'none', cursor: 'pointer', fontWeight: 600, color: 'var(--text-muted)', fontSize: 13 }} onClick={() => setShowAddModal(false)}>Cancel</button>
              <button style={{ padding: '10px 18px', borderRadius: 10, background: 'var(--text-primary)', color: 'var(--bg-card)', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: 13 }} onClick={() => setShowAddModal(false)}>Schedule Activity</button>
            </div>
          </div>
        </div>
      )}

      {/* View Activity Modal */}
      {selectedActivity && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }} onClick={() => { setSelectedActivity(null); setIsRescheduling(false); }}>
          <div style={{ background: 'var(--bg-card, #fff)', border: '1px solid var(--border, #eaeaea)', borderRadius: 20, padding: 32, width: '100%', maxWidth: 520, boxShadow: '0 24px 64px rgba(0,0,0,0.4)' }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
              <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: 'var(--text-primary)' }}>Activity Details</h2>
              <button onClick={() => { setSelectedActivity(null); setIsRescheduling(false); }} style={{ background: 'var(--bg-secondary)', width: 32, height: 32, borderRadius: '50%', border: 'none', cursor: 'pointer', fontSize: 16, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
            </div>
            
            <div style={{ fontSize: '15px', color: 'var(--text-primary)', marginBottom: '8px', fontWeight: 600 }}>
              {selectedActivity.title}
            </div>
            <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
              Time: {selectedActivity.time}
            </div>
            {selectedActivity.note && (
              <div style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '24px', lineHeight: '1.5' }}>
                {selectedActivity.note}
              </div>
            )}
            
            {isRescheduling ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 24, paddingTop: 20, borderTop: '1px solid var(--border)' }}>
                <div>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 6 }}>Select New Time</label>
                  <input type="datetime-local" style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1px solid var(--border)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', outline: 'none', fontSize: 14 }} />
                </div>
                <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
                  <button className="btn" style={{ flex: 1, padding: '12px', borderRadius: 10, background: 'var(--brand-accent)', color: 'white', border: 'none', fontWeight: 600, cursor: 'pointer' }} onClick={() => { alert('Rescheduled'); setSelectedActivity(null); setIsRescheduling(false); }}>
                    Confirm Reschedule
                  </button>
                  <button className="btn btn-ghost" style={{ flex: 1, padding: '12px', borderRadius: 10, background: 'var(--bg-secondary)', color: 'var(--text-primary)', border: 'none', fontWeight: 600, cursor: 'pointer' }} onClick={() => setIsRescheduling(false)}>
                    Back
                  </button>
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', gap: 12, marginTop: 32, paddingTop: 20, borderTop: '1px solid var(--border)' }}>
                <button className="btn" style={{ flex: 1, padding: '12px', borderRadius: 10, background: 'var(--emerald, #10b981)', color: 'white', border: 'none', fontWeight: 600, cursor: 'pointer' }} onClick={() => { alert('Marked as completed'); setSelectedActivity(null); }}>
                  Mark as Completed
                </button>
                <button className="btn" style={{ flex: 1, padding: '12px', borderRadius: 10, background: 'var(--bg-secondary)', color: 'var(--text-primary)', border: '1px solid var(--border)', fontWeight: 600, cursor: 'pointer' }} onClick={() => setIsRescheduling(true)}>
                  Reschedule
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
