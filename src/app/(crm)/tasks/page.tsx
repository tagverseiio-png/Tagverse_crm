'use client';
import React, { useState, useEffect, Suspense, useMemo, useCallback } from 'react';
import { List, LayoutGrid, Activity, Calendar, Layout, Plus, CheckCircle2, Circle, AlertCircle, Clock, X, Bell } from 'lucide-react';
import styles from './tasks.module.css';

import { REPS, STAGES, DEALS, INITIAL_TASKS, TODAY } from './mockData';

// --- HELPER FUNCTIONS ---
function formatCurrency(val: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);
}

function calculateTaskScore(task: any, deal: any) {
  if (task.done) return 0;
  
  const dealScore = deal.value / 1000 * 0.4;
  
  const dueDate = new Date(task.due);
  const diffTime = dueDate.getTime() - TODAY.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  let deadlineScore = 0;
  if (diffDays < 0) deadlineScore = 50; // Overdue is high priority
  else if (diffDays === 0) deadlineScore = 40;
  else if (diffDays <= 3) deadlineScore = 30;
  else if (diffDays <= 7) deadlineScore = 15;
  else deadlineScore = 5;

  let activityScore = 0;
  if (task.lastActivity === 0) activityScore = 20; // Very recent
  else if (task.lastActivity <= 2) activityScore = 15;
  else if (task.lastActivity > 5) activityScore = 5;

  return Math.round(dealScore + deadlineScore + activityScore);
}

// --- MAIN COMPONENT ---
function TasksContent() {
  const [tasks, setTasks] = useState(INITIAL_TASKS);
  const [deals, setDeals] = useState(DEALS);
  const [viewMode, setViewMode] = useState<'list' | 'timeline' | 'heatmap'>('list');
  
  // Nudge Engine State
  const [toasts, setToasts] = useState<any[]>([]);

  // Quick Capture State
  const [showQuickCapture, setShowQuickCapture] = useState(false);
  const [qcInput, setQcInput] = useState('');
  const [qcSelectedDeal, setQcSelectedDeal] = useState<string | null>(null);

  // Create Task Modal State
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', dealId: '', due: '', description: '' });

  // --- Feature 1: AI Task Prioritizer ---
  const topTasks = useMemo(() => {
    const scoredTasks = tasks
      .filter(t => !t.done)
      .map(t => {
        const deal = deals.find(d => d.id === t.dealId);
        return {
          ...t,
          dealName: deal?.title || 'Unknown Deal',
          score: calculateTaskScore(t, deal)
        };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);
    return scoredTasks;
  }, [tasks, deals]);

  // --- Feature 6: Task Health Score ---
  const getDealHealth = useCallback((dealId: string) => {
    const dealTasks = tasks.filter(t => t.dealId === dealId);
    if (dealTasks.length === 0) return { score: 100, status: 'green' };
    const doneTasks = dealTasks.filter(t => t.done).length;
    const pct = Math.round((doneTasks / dealTasks.length) * 100);
    let status = 'green';
    if (pct < 50) status = 'red';
    else if (pct <= 80) status = 'amber';
    return { score: pct, status };
  }, [tasks]);

  // --- Feature 3: Smart Nudge Engine ---
  useEffect(() => {
    const newToasts: any[] = [];
    
    // 1. Overdue tasks
    const overdue = tasks.filter(t => {
      if (t.done) return false;
      const dueDate = new Date(t.due);
      return dueDate < TODAY;
    });

    if (overdue.length > 0) {
      newToasts.push({
        id: 'nudge-overdue',
        title: `${overdue.length} Overdue Task${overdue.length > 1 ? 's' : ''}`,
        desc: 'Tasks are past their deadline. Review and prioritize.',
        type: 'alert'
      });
    }

    // 2. No client reply > 3 days (stalled)
    const stalledTasks = tasks.filter(t => !t.done && t.lastActivity > 3);
    if (stalledTasks.length > 0) {
      newToasts.push({
        id: 'nudge-stalled',
        title: 'Stalled Deals Detected',
        desc: `${stalledTasks.length} tasks have had no client activity in 3+ days.`,
        type: 'warning'
      });
    }

    setToasts(newToasts);
  }, [tasks]);

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // --- Feature 5: Quick Capture (Cmd+K) ---
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setShowQuickCapture(prev => !prev);
        setQcInput('');
      }
      if (e.key === 'Escape' && showQuickCapture) {
        setShowQuickCapture(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showQuickCapture]);

  const filteredDealsForQc = useMemo(() => {
    if (!qcInput) return deals;
    return deals.filter(d => d.title.toLowerCase().includes(qcInput.toLowerCase()));
  }, [qcInput, deals]);

  const handleCreateQuickTask = (dealId: string) => {
    if (!qcInput.trim()) return;
    const newTask = {
      id: 't' + Date.now(),
      title: qcInput,
      dealId: dealId,
      rep: 'r1', // default to current user
      due: '2026-06-29', // default today
      done: false,
      lastActivity: 0
    };
    setTasks(prev => [newTask, ...prev]);
    setShowQuickCapture(false);
    setQcInput('');
  };

  // Drag and drop for timeline
  const onDragStart = (e: React.DragEvent, taskId: string) => {
    e.dataTransfer.setData('taskId', taskId);
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const onDrop = (e: React.DragEvent, dealId: string, stage: string) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('taskId');
    
    // In our simplified mock, we update the DEAL's stage if a task is moved to a new stage cell, 
    // to simulate advancing the deal. Or we can just advance the deal stage directly.
    setDeals(prev => prev.map(d => {
      if (d.id === dealId) {
        return { ...d, stage };
      }
      return d;
    }));
  };

  const toggleTask = (id: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t));
  };

  return (
    <div className={styles.container}>
      
      {/* Header */}
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>CRM Task Manager</h1>
          <p className={styles.subtitle}>Manage priorities, track deal timelines, and balance workload.</p>
        </div>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <div className={styles.tabs}>
            <button className={`${styles.tab} ${viewMode === 'list' ? styles.tabActive : ''}`} onClick={() => setViewMode('list')}>
              <List size={16} /> List
            </button>
            <button className={`${styles.tab} ${viewMode === 'timeline' ? styles.tabActive : ''}`} onClick={() => setViewMode('timeline')}>
              <LayoutGrid size={16} /> Timeline
            </button>
            <button className={`${styles.tab} ${viewMode === 'heatmap' ? styles.tabActive : ''}`} onClick={() => setViewMode('heatmap')}>
              <Activity size={16} /> Heatmap
            </button>
          </div>
          <button className={styles.createTaskBtn} onClick={() => setShowCreateModal(true)}>
            <Plus size={16} /> Create Task
          </button>
        </div>
      </div>

      <div className={styles.mainLayout}>
        
        {/* Feature 1: AI Task Prioritizer Sidebar */}
        <div className={styles.sidebar}>
          <div className={styles.sidebarHeader}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AlertCircle size={16} color="var(--purple)" />
              Top 5 Today
            </span>
          </div>
          <div className={styles.prioritizerList}>
            {topTasks.map((t, index) => {
              const badges = ['🥇', '🥈', '🥉', '4️⃣', '5️⃣'];
              return (
                <div key={t.id} className={styles.prioritizerCard} onClick={() => toggleTask(t.id)}>
                  <div className={styles.rankBadge}>{badges[index]}</div>
                  <div className={styles.prioritizerContent}>
                    <div className={styles.prioritizerTitle}>{t.title}</div>
                    <div className={styles.prioritizerMeta}>
                      <span>{t.dealName}</span>
                      <span className={styles.scoreBadge}>{t.score} pts</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Content Area */}
        <div className={styles.contentArea}>
          
          {/* LIST VIEW */}
          {viewMode === 'list' && (
            <div className={styles.listView}>
              {deals.map(deal => {
                const dealTasks = tasks.filter(t => t.dealId === deal.id);
                if (dealTasks.length === 0) return null;
                const health = getDealHealth(deal.id);
                
                return (
                  <div key={deal.id} className={styles.dealGroup}>
                    <div className={styles.dealGroupHeader}>
                      <span className={styles.dealName}>{deal.title}</span>
                      <span className={`${styles.healthBadge} ${
                        health.status === 'green' ? styles.healthGreen : 
                        health.status === 'amber' ? styles.healthAmber : styles.healthRed
                      }`}>
                        Health: {health.score}%
                      </span>
                    </div>
                    {dealTasks.map(t => {
                      const isOverdue = !t.done && new Date(t.due) < TODAY;
                      return (
                        <div key={t.id} className={styles.taskRow}>
                          <input 
                            type="checkbox" 
                            className={styles.taskCheckbox} 
                            checked={t.done} 
                            onChange={() => toggleTask(t.id)} 
                          />
                          <span className={styles.taskTitle} style={{ textDecoration: t.done ? 'line-through' : 'none', color: t.done ? 'var(--text-muted)' : 'inherit' }}>
                            {t.title}
                          </span>
                          <span className={`${styles.taskDue} ${isOverdue ? styles.taskDueOverdue : ''}`}>
                            <Clock size={12} /> {t.due}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                )
              })}
            </div>
          )}

          {/* TIMELINE / SWIMLANE VIEW (Feature 2) */}
          {viewMode === 'timeline' && (
            <div className={styles.timelineView}>
              <div className={styles.swimlaneGrid}>
                {/* Header Row */}
                <div className={styles.swimlaneHeader}>
                  <div className={styles.swimlaneHeaderCell} style={{ borderRight: '1px solid var(--border)' }}>Deals</div>
                  {STAGES.map(stage => (
                    <div key={stage} className={styles.swimlaneHeaderCell}>{stage}</div>
                  ))}
                </div>

                {/* Body Rows */}
                {deals.map(deal => {
                  const health = getDealHealth(deal.id);
                  const dealTasks = tasks.filter(t => t.dealId === deal.id);

                  return (
                    <div key={deal.id} className={styles.swimlaneRow}>
                      <div className={styles.swimlaneRowHeader}>
                        <div style={{ fontWeight: 600, fontSize: '13px' }}>{deal.title}</div>
                        <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{formatCurrency(deal.value)}</div>
                        <span className={`${styles.healthBadge} ${
                          health.status === 'green' ? styles.healthGreen : 
                          health.status === 'amber' ? styles.healthAmber : styles.healthRed
                        }`} style={{ alignSelf: 'flex-start' }}>
                          Health: {health.score}%
                        </span>
                      </div>
                      
                      {STAGES.map(stage => (
                        <div 
                          key={stage} 
                          className={styles.swimlaneCell}
                          onDragOver={onDragOver}
                          onDrop={(e) => onDrop(e, deal.id, stage)}
                          style={{ background: deal.stage === stage ? 'var(--bg-card-hover)' : 'var(--bg-primary)' }}
                        >
                          {deal.stage === stage && dealTasks.map(t => (
                            <div 
                              key={t.id} 
                              className={styles.timelineCard}
                              draggable
                              onDragStart={(e) => onDragStart(e, t.id)}
                            >
                              <div className={styles.timelineCardTitle} style={{ textDecoration: t.done ? 'line-through' : 'none' }}>
                                {t.title}
                              </div>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{t.due}</span>
                                {t.done ? <CheckCircle2 size={12} color="var(--emerald)" /> : <Circle size={12} color="var(--text-muted)" />}
                              </div>
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* HEATMAP VIEW (Feature 4) */}
          {viewMode === 'heatmap' && (
            <div className={styles.heatmapView}>
              <div style={{ marginBottom: '16px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 600, margin: '0 0 4px 0' }}>Team Workload Heatmap</h3>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: 0 }}>Task density per rep over the next 7 days.</p>
              </div>
              <div className={styles.heatmapGrid}>
                {/* Header Row */}
                <div className={styles.heatmapHeaderCell}>Rep</div>
                {[0, 1, 2, 3, 4, 5, 6].map(offset => {
                  const d = new Date(TODAY);
                  d.setDate(d.getDate() + offset);
                  return (
                    <div key={offset} className={styles.heatmapHeaderCell}>
                      {d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                    </div>
                  );
                })}

                {/* Grid Rows */}
                {REPS.map(rep => {
                  return (
                    <React.Fragment key={rep.id}>
                      <div className={styles.heatmapRowHeader}>
                        <div className={styles.repAvatar} style={{ marginRight: '8px' }}>{rep.avatar}</div>
                        {rep.name}
                      </div>
                      
                      {[0, 1, 2, 3, 4, 5, 6].map(offset => {
                        const d = new Date(TODAY);
                        d.setDate(d.getDate() + offset);
                        const dateStr = d.toISOString().split('T')[0];
                        
                        // Count tasks for this rep on this date
                        const dayTasks = tasks.filter(t => t.rep === rep.id && t.due === dateStr);
                        const count = dayTasks.length;
                        
                        // Color intensity based on count
                        let bg = 'rgba(99, 102, 241, 0.05)';
                        if (count === 1) bg = 'rgba(99, 102, 241, 0.3)';
                        if (count === 2) bg = 'rgba(99, 102, 241, 0.6)';
                        if (count >= 3) bg = 'rgba(99, 102, 241, 1)';
                        
                        return (
                          <div 
                            key={offset} 
                            className={styles.heatmapCell}
                            style={{ background: bg, border: count === 0 ? '1px dashed var(--border)' : 'none' }}
                            title={`${count} tasks for ${rep.name} on ${dateStr}`}
                          >
                            {count > 0 ? count : ''}
                          </div>
                        )
                      })}
                    </React.Fragment>
                  )
                })}
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Feature 3: Smart Nudge Toasts */}
      <div className={styles.toastContainer}>
        {toasts.map(toast => (
          <div key={toast.id} className={styles.toast} style={{ borderLeftColor: toast.type === 'alert' ? 'var(--rose)' : 'var(--amber)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <Bell size={16} color={toast.type === 'alert' ? 'var(--rose)' : 'var(--amber)'} />
                <span className={styles.toastTitle}>{toast.title}</span>
              </div>
              <button onClick={() => removeToast(toast.id)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                <X size={14} />
              </button>
            </div>
            <div className={styles.toastDesc}>{toast.desc}</div>
            <div className={styles.toastActions}>
              <button className={styles.toastBtnSecondary} onClick={() => removeToast(toast.id)}>Snooze</button>
              <button className={styles.toastBtnPrimary} onClick={() => removeToast(toast.id)}>View Tasks</button>
            </div>
          </div>
        ))}
      </div>

      {/* Feature 5: Quick Capture Bar (Cmd+K) */}
      {showQuickCapture && (
        <div className={styles.quickCaptureOverlay} onClick={() => setShowQuickCapture(false)}>
          <div className={styles.quickCaptureModal} onClick={e => e.stopPropagation()}>
            <input 
              type="text" 
              className={styles.quickCaptureInput}
              placeholder="Type a task name, press Enter to link to a deal..."
              value={qcInput}
              onChange={e => setQcInput(e.target.value)}
              autoFocus
            />
            {qcInput && (
              <div className={styles.quickCaptureResults}>
                <div style={{ padding: '0 24px', fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase' }}>
                  Link to Deal
                </div>
                {filteredDealsForQc.map((deal, idx) => (
                  <div 
                    key={deal.id} 
                    className={`${styles.quickCaptureItem} ${idx === 0 ? styles.quickCaptureItemActive : ''}`}
                    onClick={() => handleCreateQuickTask(deal.id)}
                  >
                    <div className={styles.quickCaptureItemTitle}>{deal.title}</div>
                    <div className={styles.quickCaptureItemDesc}>Stage: {deal.stage} • Value: {formatCurrency(deal.value)}</div>
                  </div>
                ))}
                {filteredDealsForQc.length === 0 && (
                  <div style={{ padding: '12px 24px', color: 'var(--text-muted)' }}>No deals match.</div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Create Task Modal */}
      {showCreateModal && (
        <div className={styles.quickCaptureOverlay} onClick={() => setShowCreateModal(false)}>
          <div className={styles.createTaskModal} onClick={e => e.stopPropagation()}>
            <div className={styles.createTaskHeader}>
              <h2 style={{ margin: 0, fontSize: '18px' }}>Create New Task</h2>
              <button onClick={() => setShowCreateModal(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                <X size={20} />
              </button>
            </div>
            <div className={styles.createTaskBody}>
              <div className={styles.formGroup}>
                <label>Task Title</label>
                <input 
                  type="text" 
                  value={newTask.title} 
                  onChange={e => setNewTask({...newTask, title: e.target.value})} 
                  placeholder="E.g., Send follow-up email"
                  autoFocus
                />
              </div>
              <div className={styles.formGroup}>
                <label>Related Deal</label>
                <select value={newTask.dealId} onChange={e => setNewTask({...newTask, dealId: e.target.value})}>
                  <option value="">Select a deal...</option>
                  {deals.map(d => <option key={d.id} value={d.id}>{d.title}</option>)}
                </select>
              </div>
              <div className={styles.formGroup}>
                <label>Due Date</label>
                <input 
                  type="date" 
                  value={newTask.due} 
                  onChange={e => setNewTask({...newTask, due: e.target.value})} 
                />
              </div>
              <div className={styles.formGroup}>
                <label>Description</label>
                <textarea 
                  value={newTask.description} 
                  onChange={e => setNewTask({...newTask, description: e.target.value})} 
                  placeholder="Task details..."
                  rows={3}
                />
              </div>
            </div>
            <div className={styles.createTaskFooter}>
              <button className={styles.toastBtnSecondary} onClick={() => setShowCreateModal(false)}>Cancel</button>
              <button className={styles.toastBtnPrimary} onClick={() => {
                if (!newTask.title || !newTask.dealId) {
                  alert('Title and Deal are required.');
                  return;
                }
                const createdTask = {
                  id: 't' + Date.now(),
                  title: newTask.title,
                  dealId: newTask.dealId,
                  rep: 'r1',
                  due: newTask.due || TODAY.toISOString().split('T')[0],
                  done: false,
                  lastActivity: 0
                };
                setTasks(prev => [createdTask as any, ...prev]);
                setShowCreateModal(false);
                setNewTask({ title: '', dealId: '', due: '', description: '' });
              }}>Create Task</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default function TasksPage() {
  return (
    <Suspense fallback={<div>Loading tasks...</div>}>
      <TasksContent />
    </Suspense>
  );
}
