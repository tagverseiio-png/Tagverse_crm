'use client';

import React, { useState } from 'react';
import { Video, CheckSquare, AlertTriangle, Calendar, ChevronRight, ChevronDown } from 'lucide-react';
import { store, getCompanyById, getMemberById } from '@/lib/mockData';
import styles from './activity.module.css';

export default function ActivityPage() {
  const [filter, setFilter] = useState('all');
  const [completedExpanded, setCompletedExpanded] = useState(false);

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
            <h3 className={styles.timelineTitle}>Chronological Feed</h3>

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
                            <button className={styles.viewBtn}>
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
              <Calendar size={16} color="var(--blue-light)" />
              <h3 className={styles.upcomingTitle}>Coming Up</h3>
            </div>

            <div className={styles.upcomingGroup}>
              <p className={styles.upcomingGroupTitle}>Tomorrow</p>
              
              <div className={styles.upcomingEvent}>
                <div className={styles.eventDot} style={{ background: 'var(--blue-light)' }}></div>
                <div>
                  <p className={styles.eventTitle}>Onboarding Call — BrightWave Team</p>
                  <div className={styles.eventMeta}>
                    <span className={styles.eventTime}>09:30 AM</span>
                    <span>Owner: Priya N.</span>
                  </div>
                </div>
              </div>

              <div className={styles.upcomingEvent}>
                <div className={styles.eventDot} style={{ background: 'var(--rose-light)' }}></div>
                <div>
                  <p className={styles.eventTitle}>Quarterly Review Deadline</p>
                  <div className={styles.eventMeta}>
                    <span className={styles.eventTime}>16:00 PM</span>
                    <span>Owner: Arjun S.</span>
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.upcomingGroup}>
              <p className={styles.upcomingGroupTitle}>Day After Tomorrow</p>
              
              <div className={styles.upcomingEvent}>
                <div className={styles.eventDot} style={{ background: 'var(--amber-light)' }}></div>
                <div>
                  <p className={styles.eventTitle}>Strategic alignment with Acme CMO</p>
                  <div className={styles.eventMeta}>
                    <span className={styles.eventTime}>11:00 AM</span>
                    <span>Owner: Arjun S.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.insightsCard}>
            <h4 className={styles.insightsTitle}>Productivity Tracker</h4>
            <p className={styles.insightsText}>You completed {completedActivities.length} crucial pipeline workflows today. Keep up the high momentum with the team!</p>
            <div>
              <div className={styles.progressLabel}>
                <span>Daily Goal Target</span>
                <span>75% Achieved</span>
              </div>
              <div className={styles.progressBar}>
                <div className={styles.progressFill} style={{ width: '75%' }}></div>
              </div>
            </div>
          </div>

        </div>

      </section>
    </div>
  );
}
