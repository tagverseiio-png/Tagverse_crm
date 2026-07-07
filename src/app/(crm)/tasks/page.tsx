'use client';
import React, { useState, useEffect, Suspense, useMemo, useCallback } from 'react';
import { List, LayoutGrid, Activity, Calendar, Layout, Plus, CheckCircle2, Circle, AlertCircle, Clock, X, Bell, Trash2, Edit2 } from 'lucide-react';
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
  const [tasks, setTasks] = useState<any[]>(() => INITIAL_TASKS.map(t => {
    const deal = DEALS.find(d => d.id === t.dealId);
    return { ...t, stage: deal?.stage || 'Lead' };
  }));
  const [deals, setDeals] = useState(DEALS);
  const [stages, setStages] = useState(STAGES);
  const [viewMode, setViewMode] = useState<'kanban'>('kanban');
  
  const [addingColumn, setAddingColumn] = useState(false);
  const [newColumnLabel, setNewColumnLabel] = useState('');
  const [activeColumn, setActiveColumn] = useState<string | null>(null);
  const [columnToDelete, setColumnToDelete] = useState<string | null>(null);
  
  const handleAddStage = () => {
    if (newColumnLabel.trim()) {
      setStages(prev => [...prev, newColumnLabel.trim()]);
      setAddingColumn(false);
      setNewColumnLabel('');
    }
  };

  const handleRenameStage = (oldName: string) => {
    const newName = window.prompt('Rename column:', oldName);
    if (!newName || !newName.trim() || newName.trim() === oldName) return;
    
    const trimmed = newName.trim();
    setStages(prev => prev.map(s => s === oldName ? trimmed : s));
    setTasks(prev => prev.map(t => t.stage === oldName ? { ...t, stage: trimmed } : t));
    
    if (activeColumn === oldName) {
      setActiveColumn(trimmed);
    }
  };
  
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
      lastActivity: 0,
      stage: 'Lead'
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
            <button className={`${styles.tab} ${viewMode === 'kanban' ? styles.tabActive : ''}`} onClick={() => setViewMode('kanban')}>
              <Layout size={16} /> Kanban
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
          


          {/* KANBAN VIEW */}
          {viewMode === 'kanban' && (
            <div style={{ display: 'flex', gap: 16, overflowX: 'auto', paddingBottom: 16, height: '100%' }} className="scrollbar-thin">
              {stages.map(stage => {
                const stageTasks = tasks.filter(t => t.stage === stage);
                
                return (
                  <div
                    key={stage}
                    style={{
                      width: 300,
                      flexShrink: 0,
                      display: 'flex',
                      flexDirection: 'column',
                    }}
                    onDragOver={onDragOver}
                    onDrop={(e) => {
                       e.preventDefault();
                       const taskId = e.dataTransfer.getData('taskId');
                       setTasks(prev => prev.map(t => t.id === taskId ? { ...t, stage } : t));
                    }}
                  >
                    <div style={{
                      background: 'var(--bg-card)',
                      border: '1px solid var(--border)',
                      borderTop: '3px solid var(--purple)',
                      borderRadius: '10px 10px 0 0',
                      padding: '12px 16px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      cursor: 'pointer'
                    }} onClick={() => setActiveColumn(activeColumn === stage ? null : stage)}>
                      <div style={{ fontWeight: 600, fontSize: 13, color: 'var(--text-primary)' }}>{stage}</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{
                          fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)',
                          background: 'var(--bg-secondary)', padding: '2px 8px', borderRadius: 12,
                          border: '1px solid var(--border)'
                        }}>{stageTasks.length}</span>
                        {activeColumn === stage && (
                          <div style={{ display: 'flex', gap: 4 }}>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRenameStage(stage);
                              }}
                              style={{
                                background: 'transparent',
                                border: 'none',
                                color: 'var(--text-muted)',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                padding: 4
                              }}
                              title="Rename Column"
                            >
                              <Edit2 size={16} />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setColumnToDelete(stage);
                              }}
                              style={{
                                background: 'transparent',
                                border: 'none',
                                color: 'var(--rose)',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                padding: 4
                              }}
                              title="Delete Column"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    <div style={{
                      background: 'var(--bg-secondary)',
                      borderLeft: '1px solid var(--border)',
                      borderRight: '1px solid var(--border)',
                      borderBottom: '1px solid var(--border)',
                      borderRadius: '0 0 10px 10px',
                      padding: '12px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 12,
                      overflowY: 'auto',
                      flex: 1,
                      minHeight: 120
                    }} className="scrollbar-thin">
                      {stageTasks.map(t => {
                        const deal = deals.find(d => d.id === t.dealId);
                        return (
                          <div
                            key={t.id}
                            draggable
                            onDragStart={(e) => onDragStart(e, t.id)}
                            style={{
                              background: 'var(--bg-card)',
                              border: '1px solid var(--border)',
                              borderRadius: 8,
                              padding: 16,
                              cursor: 'grab',
                              boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
                            }}
                          >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                              <span className="badge purple" style={{ fontSize: 11, padding: '3px 8px' }}>
                                {deal?.title}
                              </span>
                              <input 
                                type="checkbox" 
                                checked={t.done} 
                                onChange={() => toggleTask(t.id)} 
                                onClick={e => e.stopPropagation()}
                              />
                            </div>
                            <div style={{ fontSize: 14, fontWeight: 600, color: t.done ? 'var(--text-muted)' : 'var(--text-primary)', textDecoration: t.done ? 'line-through' : 'none', marginBottom: 14, lineHeight: 1.4 }}>
                              {t.title}
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border)', paddingTop: 12, marginTop: 4 }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                <Clock size={14} color="var(--text-muted)" />
                                <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{t.due}</span>
                              </div>
                              <div style={{ width: 22, height: 22, borderRadius: '50%', background: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontWeight: 700 }}>
                                {REPS.find(r => r.id === t.rep)?.avatar || '??'}
                              </div>
                            </div>
                          </div>
                        )
                      })}
                      {stageTasks.length === 0 && (
                        <div style={{ padding: 24, textAlign: 'center', color: 'var(--text-muted)', fontSize: 13, border: '1px dashed var(--border)', borderRadius: 8 }}>
                          No tasks
                        </div>
                      )}
                      
                      <button
                        style={{
                          border: '1px dashed var(--border)', borderRadius: 8,
                          padding: '10px', fontSize: 12, fontWeight: 500,
                          color: 'var(--text-muted)', background: 'transparent',
                          cursor: 'pointer', transition: 'all 0.2s', marginTop: 4,
                        }}
                        onClick={() => setShowCreateModal(true)}
                      >+ Add Task</button>
                    </div>
                  </div>
                )
              })}

              {/* Add Column */}
              <div style={{ width: 300, flexShrink: 0 }}>
                {addingColumn ? (
                  <div style={{
                    background: 'var(--bg-card)', border: '1px solid var(--border)',
                    borderRadius: 10, padding: 10, display: 'flex', flexDirection: 'column', gap: 8,
                  }}>
                    <input
                      autoFocus
                      value={newColumnLabel}
                      onChange={e => setNewColumnLabel(e.target.value)}
                      onKeyDown={e => {
                        if (e.key === 'Enter') handleAddStage();
                        if (e.key === 'Escape') { setAddingColumn(false); setNewColumnLabel(''); }
                      }}
                      placeholder="Column name..."
                      style={{
                        width: '100%', boxSizing: 'border-box', padding: '8px 10px',
                        background: 'var(--bg-secondary)', border: '1px solid var(--border)',
                        borderRadius: 8, color: 'var(--text-primary)', fontSize: 13,
                        outline: 'none', fontFamily: 'Inter, sans-serif',
                      }}
                    />
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button onClick={handleAddStage} style={{ flex: 1, padding: '6px', background: 'var(--purple)', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}>Add</button>
                      <button onClick={() => { setAddingColumn(false); setNewColumnLabel(''); }} style={{ flex: 1, padding: '6px', background: 'transparent', color: 'var(--text-primary)', border: '1px solid var(--border)', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}>Cancel</button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setAddingColumn(true)}
                    style={{
                      width: '100%', height: 52, border: '1px dashed var(--border)',
                      borderRadius: 10, background: 'transparent', color: 'var(--text-muted)',
                      cursor: 'pointer', fontSize: 13, fontWeight: 600,
                      fontFamily: 'Inter, sans-serif', transition: 'all 0.2s',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                    }}
                  >
                    <Plus size={16} /> Add Column
                  </button>
                )}
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
                  lastActivity: 0,
                  stage: 'Lead'
                };
                setTasks(prev => [createdTask as any, ...prev]);
                setShowCreateModal(false);
                setNewTask({ title: '', dealId: '', due: '', description: '' });
              }}>Create Task</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Column Confirmation Modal */}
      {columnToDelete && (
        <div className={styles.quickCaptureOverlay} onClick={() => setColumnToDelete(null)}>
          <div className={styles.createTaskModal} style={{ maxWidth: 400 }} onClick={e => e.stopPropagation()}>
            <div className={styles.createTaskHeader}>
              <h2 style={{ margin: 0, fontSize: '18px', color: 'var(--rose)' }}>Delete Column</h2>
              <button onClick={() => setColumnToDelete(null)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                <X size={20} />
              </button>
            </div>
            <div className={styles.createTaskBody} style={{ padding: '24px 20px' }}>
              <p style={{ margin: 0, fontSize: '14px', color: 'var(--text-primary)', lineHeight: 1.5 }}>
                Are you sure you want to delete the <strong>"{columnToDelete}"</strong> column and all its contents? This action cannot be undone.
              </p>
            </div>
            <div className={styles.createTaskFooter}>
              <button className={styles.toastBtnSecondary} onClick={() => setColumnToDelete(null)}>Cancel</button>
              <button className={styles.toastBtnPrimary} style={{ background: 'var(--rose)', border: '1px solid var(--rose)' }} onClick={() => {
                setStages(prev => prev.filter(s => s !== columnToDelete));
                setActiveColumn(null);
                setColumnToDelete(null);
              }}>Delete</button>
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
