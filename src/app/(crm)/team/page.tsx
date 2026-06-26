'use client';
import React from 'react';
import Link from 'next/link';
import { useWorkspace } from '@/context/WorkspaceContext';
import styles from './team.module.css';

export default function TeamPage() {
  const {
    members,
    projects,
    tasks,
  } = useWorkspace();

  // Compute overall stats
  const totalMembers = members.length;
  const activeProjectsCount = projects.filter(p => p.status === 'Active').length;
  const weeklyTasksCount = tasks.length;
  
  const completedTasks = tasks.filter(t => t.status === 'Done').length;
  const completionRate = weeklyTasksCount === 0 ? 0 : Math.round((completedTasks / weeklyTasksCount) * 100);

  const baseLimit = 10; // Base task capacity limit

  const getMemberColorClass = (dept: string) => {
    switch (dept) {
      case 'Management':
        return styles.deptManagement;
      case 'Engineering':
        return styles.deptEngineering;
      case 'Design':
        return styles.deptDesign;
      case 'Marketing':
        return styles.deptMarketing;
      case 'Sales':
        return styles.deptSales;
      default:
        return '';
    }
  };

  const getMemberColorCode = (dept: string) => {
    switch (dept) {
      case 'Management':
        return '#8b5cf6';
      case 'Engineering':
        return '#f59e0b';
      case 'Design':
        return '#ec4899';
      case 'Marketing':
        return '#06b6d4';
      case 'Sales':
        return '#10b981';
      default:
        return '#7c5cbf';
    }
  };

  return (
    <div className={styles.teamLayout}>
      
      {/* Metrics Row */}
      <div className={styles.statsRow}>
        {[
          { label: 'Total Members', value: totalMembers, color: 'purple' },
          { label: 'Active Projects', value: activeProjectsCount, color: 'blue' },
          { label: 'Sprints This Week', value: weeklyTasksCount, color: 'amber' },
          { label: 'Completion Rate', value: `${completionRate}%`, color: 'emerald' },
        ].map(s => (
          <div key={s.label} className={`kpi-card ${s.color}`}>
            <div className="kpi-label" style={{ marginBottom: '8px' }}>{s.label}</div>
            <div className="kpi-value">{s.value}</div>
          </div>
        ))}
      </div>

      {/* Grid: Members Directories */}
      <div>
        <h3 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '14px' }}>
          Team Directory & Workload Summary
        </h3>
        
        <div className={styles.membersGrid}>
          {members.map(m => {
            const memberTasks = tasks.filter(t => t.owner === m.id);
            const activeProjects = projects.filter(p => p.members.includes(m.id));
            const workloadPercent = Math.min(Math.round((memberTasks.length / baseLimit) * 100), 100);
            const deptColor = getMemberColorCode(m.department);

            return (
              <div key={m.id} className={styles.memberCard}>
                <div className={styles.memberHeader}>
                  <span
                    className={styles.memberAvatar}
                    style={{ backgroundColor: deptColor }}
                  >
                    {m.avatar}
                  </span>
                  <div className={styles.memberInfo}>
                    <h4 className={styles.memberName}>{m.name}</h4>
                    <div className={styles.memberSub}>
                      <span className={styles.memberRole}>{m.role}</span>
                      <span className={styles.memberDept}>{m.department}</span>
                    </div>
                    <span className={styles.memberEmail}>{m.email}</span>
                  </div>
                </div>

                {/* Capacity Progress Bar */}
                <div className={styles.workloadContainer}>
                  <div className={styles.workloadLabel}>
                    <span>Weekly Sprints Load</span>
                    <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
                      {memberTasks.length} / {baseLimit} tasks ({workloadPercent}%)
                    </span>
                  </div>
                  <div className={styles.workloadTrack}>
                    <div
                      className={styles.workloadFill}
                      style={{ width: `${workloadPercent}%`, backgroundColor: deptColor }}
                    />
                  </div>
                </div>

                {/* Associated Projects */}
                <div className={styles.projectsContainer}>
                  <span className={styles.projectsLabel}>Associated Projects</span>
                  <div className={styles.projectPills}>
                    {activeProjects.map(p => (
                      <Link href={`/projects`} key={p.id} style={{ textDecoration: 'none' }}>
                        <span
                          className={styles.projectPill}
                          style={{
                            backgroundColor: `${p.color}15`,
                            borderColor: `${p.color}30`,
                            color: p.color,
                          }}
                        >
                          {p.name}
                        </span>
                      </Link>
                    ))}
                    {activeProjects.length === 0 && (
                      <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                        No associated projects
                      </span>
                    )}
                  </div>
                </div>

                {/* View Member Tasks Link */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid var(--border)', paddingTop: '12px' }}>
                  <Link href={`/tasks?memberId=${m.id}`} style={{ fontSize: '12px', color: 'var(--purple-light)', fontWeight: 700, textDecoration: 'none' }}>
                    View Sprints →
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Capacity Horizontal Chart */}
      <div className={styles.workloadChart}>
        <div>
          <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 600 }}>Current Workload Comparison</h3>
          <p style={{ margin: '2px 0 0', fontSize: '11px', color: 'var(--text-muted)' }}>Horizontal metric analysis of relative assigned tasks in active sprints</p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {members.map(m => {
            const memberTasks = tasks.filter(t => t.owner === m.id);
            const deptColor = getMemberColorCode(m.department);
            const percentage = Math.min((memberTasks.length / 10) * 100, 100);

            return (
              <div key={m.id} className={styles.chartRow}>
                <div className={styles.chartLabel}>
                  <span>{m.name} ({m.department})</span>
                  <span>{memberTasks.length} active tasks</span>
                </div>
                <div className={styles.chartTrack}>
                  <div
                    className={styles.chartFill}
                    style={{ width: `${percentage}%`, backgroundColor: deptColor }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
