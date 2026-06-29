'use client';
import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useWorkspace, Task } from '@/context/WorkspaceContext';
import TaskDetailDrawer from '@/components/workspace/TaskDetailDrawer';
import { List, LayoutGrid } from 'lucide-react';
import styles from './tasks.module.css';

function TasksContent() {
  const {
    members,
    projects,
    tasks,
    addTask,
    toggleTaskDone,
  } = useWorkspace();

  const searchParams = useSearchParams();

  // Filters State
  const [filterOwner, setFilterOwner] = useState<string>('All');
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [filterPriority, setFilterPriority] = useState<string>('All');
  const [filterProjectId, setFilterProjectId] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  // View mode state
  const [viewMode, setViewMode] = useState<'list' | 'kanban'>('list');

  // Handle search parameters on mount/change
  useEffect(() => {
    const memberId = searchParams.get('memberId');
    if (memberId) {
      setFilterOwner(memberId);
    }
  }, [searchParams]);

  // Inline Form State
  const [showInlineAdd, setShowInlineAdd] = useState(false);
  const [inlineTitle, setInlineTitle] = useState('');
  const [inlineProject, setInlineProject] = useState('');
  const [inlineOwner, setInlineOwner] = useState('m1');
  const [inlinePriority, setInlinePriority] = useState<'Low' | 'Normal' | 'High' | 'Urgent'>('Normal');
  const [inlineDue, setInlineDue] = useState('2026-06-25');

  // Edit Drawer State
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);

  // Apply filters
  const getFilteredTasks = () => {
    return tasks.filter(t => {
      if (filterOwner !== 'All' && t.owner !== filterOwner) return false;
      if (filterStatus !== 'All' && t.status !== filterStatus) return false;
      if (filterPriority !== 'All' && t.priority !== filterPriority) return false;
      if (filterProjectId !== 'All' && t.projectId !== filterProjectId) return false;
      if (searchQuery.trim() && !t.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      return true;
    });
  };

  const filteredTasks = getFilteredTasks();

  const handleSaveInlineTask = () => {
    if (!inlineTitle.trim()) {
      alert('Task title is required!');
      return;
    }
    addTask({
      title: inlineTitle.trim(),
      projectId: inlineProject || null,
      owner: inlineOwner,
      status: 'To Do',
      priority: inlinePriority,
      due: inlineDue,
      parentType: inlineProject ? 'project' : null,
      tags: [],
    });
    setInlineTitle('');
    setShowInlineAdd(false);
  };

  const handleOpenEditDrawer = (taskId: string) => {
    setSelectedTaskId(taskId);
    setDrawerOpen(true);
  };

  // Group Priorities order
  const priorityOrder = ['Urgent', 'High', 'Normal', 'Low'] as const;

  const isOverdue = (dateStr: string, status: string) => {
    if (status === 'Done') return false;
    const today = new Date('2026-06-25');
    const dueDate = new Date(dateStr);
    return dueDate < today;
  };

  // Kanban status columns config
  const kanbanColumns: { status: Task['status']; color: string }[] = [
    { status: 'To Do', color: 'var(--blue)' },
    { status: 'In Progress', color: 'var(--amber)' },
    { status: 'Done', color: 'var(--emerald)' },
  ];

  const getPriorityCardClass = (priority: string) => {
    switch (priority) {
      case 'Urgent': return styles.kanbanCardUrgent;
      case 'High': return styles.kanbanCardHigh;
      case 'Normal': return styles.kanbanCardNormal;
      case 'Low': return styles.kanbanCardLow;
      default: return '';
    }
  };

  const getPriorityDotColor = (priority: string) => {
    switch (priority) {
      case 'Urgent': return 'var(--rose)';
      case 'High': return 'var(--amber)';
      case 'Normal': return 'var(--blue)';
      case 'Low': return 'var(--text-muted)';
      default: return 'var(--text-muted)';
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Top action row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ fontSize: '18px', fontWeight: 700, margin: 0 }}>All Workspace Tasks</h2>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: '2px 0 0' }}>Filter, manage, and sprint across different workflows</p>
        </div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          {/* View Toggle */}
          <div className={styles.viewToggle}>
            <button
              className={viewMode === 'list' ? styles.viewToggleBtnActive : styles.viewToggleBtn}
              onClick={() => setViewMode('list')}
              title="List View"
            >
              <List size={14} />
              List
            </button>
            <button
              className={viewMode === 'kanban' ? styles.viewToggleBtnActive : styles.viewToggleBtn}
              onClick={() => setViewMode('kanban')}
              title="Kanban View"
            >
              <LayoutGrid size={14} />
              Board
            </button>
          </div>
          {/* Search bar */}
          <div style={{ position: 'relative', width: '220px' }}>
            <span style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', fontSize: '13px' }}>🔍</span>
            <input
              type="text"
              placeholder="Search by title..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                background: 'var(--bg-card)',
                border: '1px solid var(--border)',
                borderRadius: '8px',
                padding: '6px 10px 6px 30px',
                fontSize: '12px',
                color: 'var(--text-primary)',
                outline: 'none',
              }}
            />
          </div>
          <button className="btn btn-primary" onClick={() => setShowInlineAdd(!showInlineAdd)}>
            {showInlineAdd ? 'Cancel Quick Add' : '⚡ Quick Add'}
          </button>
        </div>
      </div>

      <div className={styles.taskManagerLayout}>
        {/* Left Filters Sidebar */}
        <div className="card" style={{ width: '220px', flexShrink: 0, padding: '16px' }}>
          <div className={styles.filterSidebar}>
            
            {/* Assignee Filter */}
            <div className={styles.filterSection}>
              <span className={styles.filterHeader}>Assignee</span>
              <button
                onClick={() => setFilterOwner('All')}
                className={filterOwner === 'All' ? styles.filterBtnActive : styles.filterBtn}
              >
                All Assignees
              </button>
              {members.map(m => (
                <button
                  key={m.id}
                  onClick={() => setFilterOwner(m.id)}
                  className={filterOwner === m.id ? styles.filterBtnActive : styles.filterBtn}
                >
                  {m.name}
                </button>
              ))}
            </div>

            {/* Status Filter */}
            <div className={styles.filterSection}>
              <span className={styles.filterHeader}>Status</span>
              {['All', 'To Do', 'In Progress', 'Done'].map(st => (
                <button
                  key={st}
                  onClick={() => setFilterStatus(st)}
                  className={filterStatus === st ? styles.filterBtnActive : styles.filterBtn}
                >
                  {st}
                </button>
              ))}
            </div>

            {/* Priority Filter */}
            <div className={styles.filterSection}>
              <span className={styles.filterHeader}>Priority</span>
              {['All', 'Urgent', 'High', 'Normal', 'Low'].map(pr => (
                <button
                  key={pr}
                  onClick={() => setFilterPriority(pr)}
                  className={filterPriority === pr ? styles.filterBtnActive : styles.filterBtn}
                >
                  {pr}
                </button>
              ))}
            </div>

            {/* Project Filter */}
            <div className={styles.filterSection}>
              <span className={styles.filterHeader}>Project</span>
              <button
                onClick={() => setFilterProjectId('All')}
                className={filterProjectId === 'All' ? styles.filterBtnActive : styles.filterBtn}
              >
                All Projects
              </button>
              {projects.map(p => (
                <button
                  key={p.id}
                  onClick={() => setFilterProjectId(p.id)}
                  className={filterProjectId === p.id ? styles.filterBtnActive : styles.filterBtn}
                >
                  {p.name}
                </button>
              ))}
            </div>

          </div>
        </div>

        {/* Right Main Content */}
        <div className={styles.mainContent}>
          {/* Inline Quick Add Form Row */}
          {showInlineAdd && (
            <div className={styles.inlineAddBar}>
              <input
                type="text"
                placeholder="Task title..."
                value={inlineTitle}
                onChange={e => setInlineTitle(e.target.value)}
                className={styles.inputField}
              />
              <select
                value={inlineProject}
                onChange={e => setInlineProject(e.target.value)}
                className={styles.selectField}
              >
                <option value="">No Project</option>
                {projects.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
              <select
                value={inlineOwner}
                onChange={e => setInlineOwner(e.target.value)}
                className={styles.selectField}
              >
                {members.map(m => (
                  <option key={m.id} value={m.id}>
                    {m.name}
                  </option>
                ))}
              </select>
              <select
                value={inlinePriority}
                onChange={e => setInlinePriority(e.target.value as any)}
                className={styles.selectField}
              >
                <option value="Low">Low</option>
                <option value="Normal">Normal</option>
                <option value="High">High</option>
                <option value="Urgent">Urgent</option>
              </select>
              <input
                type="date"
                value={inlineDue}
                onChange={e => setInlineDue(e.target.value)}
                className={styles.selectField}
              />
              <div style={{ display: 'flex', gap: '8px' }}>
                <button className="btn btn-primary" onClick={handleSaveInlineTask}>
                  Save
                </button>
                <button className="btn btn-ghost" onClick={() => setShowInlineAdd(false)}>
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* ===== LIST VIEW ===== */}
          {viewMode === 'list' && (
            <>
              {priorityOrder.map(prio => {
                const categoryTasks = filteredTasks.filter(t => t.priority === prio);
                if (categoryTasks.length === 0) return null;

                return (
                  <div key={prio} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div className={styles.taskGroupHeader}>
                      <span
                        className={`${styles.taskGroupBadge} ${
                          prio === 'Urgent'
                            ? styles.priorityUrgent
                            : prio === 'High'
                            ? styles.priorityHigh
                            : prio === 'Normal'
                            ? styles.priorityNormal
                            : styles.priorityLow
                        }`}
                      >
                        ⚠️ {prio} Priority
                      </span>
                      <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                        ({categoryTasks.length} tasks)
                      </span>
                    </div>

                    <div className={styles.taskList}>
                      {categoryTasks.map(t => {
                        const project = projects.find(p => p.id === t.projectId);
                        const ownerMember = members.find(m => m.id === t.owner);
                        const isTaskOverdue = isOverdue(t.due, t.status);

                        return (
                          <div
                            key={t.id}
                            className={styles.taskItem}
                            onClick={() => handleOpenEditDrawer(t.id)}
                          >
                            <div className={styles.taskLeft}>
                              <input
                                type="checkbox"
                                checked={t.status === 'Done'}
                                onClick={e => e.stopPropagation()}
                                onChange={() => toggleTaskDone(t.id)}
                                className={styles.taskCheckbox}
                              />
                              <span className={t.status === 'Done' ? styles.taskTitleDone : styles.taskTitle}>
                                {t.title}
                              </span>
                            </div>

                            <div className={styles.taskRight}>
                              {project && (
                                <span
                                  className={styles.projectBadge}
                                  style={{
                                    backgroundColor: `${project.color}15`,
                                    color: project.color,
                                  }}
                                >
                                  {project.name}
                                </span>
                              )}

                              <span className={isTaskOverdue ? styles.dueBadgeOverdue : styles.dueBadge}>
                                ⏱️ {t.due}
                              </span>

                              {ownerMember && (
                                <span
                                  title={ownerMember.name}
                                  style={{
                                    width: '24px',
                                    height: '24px',
                                    borderRadius: '50%',
                                    background: 'var(--bg-primary)',
                                    border: '1px solid var(--border)',
                                    fontSize: '9px',
                                    fontWeight: 700,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    textTransform: 'uppercase',
                                    color: 'var(--text-primary)',
                                    flexShrink: 0,
                                  }}
                                >
                                  {ownerMember.avatar}
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </>
          )}

          {/* ===== KANBAN VIEW ===== */}
          {viewMode === 'kanban' && (
            <div className={styles.kanbanBoard}>
              {kanbanColumns.map(col => {
                const columnTasks = filteredTasks.filter(t => t.status === col.status);

                return (
                  <div key={col.status} className={styles.kanbanColumn}>
                    <div className={styles.kanbanColumnHeader}>
                      <span className={styles.kanbanColumnTitle}>
                        <span className={styles.kanbanColumnDot} style={{ background: col.color }} />
                        {col.status}
                      </span>
                      <span className={styles.kanbanColumnCount}>{columnTasks.length}</span>
                    </div>

                    <div className={styles.kanbanCards}>
                      {columnTasks.map(t => {
                        const project = projects.find(p => p.id === t.projectId);
                        const ownerMember = members.find(m => m.id === t.owner);
                        const isTaskOverdue = isOverdue(t.due, t.status);

                        return (
                          <div
                            key={t.id}
                            className={`${styles.kanbanCard} ${getPriorityCardClass(t.priority)}`}
                            onClick={() => handleOpenEditDrawer(t.id)}
                          >
                            <span className={t.status === 'Done' ? styles.kanbanCardTitleDone : styles.kanbanCardTitle}>
                              {t.title}
                            </span>
                            <div className={styles.kanbanCardMeta}>
                              <div className={styles.kanbanCardTags}>
                                <span
                                  className={styles.kanbanPriorityDot}
                                  style={{ background: getPriorityDotColor(t.priority) }}
                                  title={t.priority}
                                />
                                {project && (
                                  <span
                                    className={styles.projectBadge}
                                    style={{
                                      backgroundColor: `${project.color}15`,
                                      color: project.color,
                                    }}
                                  >
                                    {project.name}
                                  </span>
                                )}
                                <span className={isTaskOverdue ? styles.dueBadgeOverdue : styles.dueBadge}>
                                  ⏱️ {t.due}
                                </span>
                              </div>

                              {ownerMember && (
                                <span
                                  title={ownerMember.name}
                                  style={{
                                    width: '22px',
                                    height: '22px',
                                    borderRadius: '50%',
                                    background: 'var(--bg-primary)',
                                    border: '1px solid var(--border)',
                                    fontSize: '9px',
                                    fontWeight: 700,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    textTransform: 'uppercase',
                                    color: 'var(--text-primary)',
                                    flexShrink: 0,
                                  }}
                                >
                                  {ownerMember.avatar}
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })}

                      {columnTasks.length === 0 && (
                        <div style={{
                          padding: '24px 16px',
                          textAlign: 'center',
                          color: 'var(--text-muted)',
                          fontSize: '12px',
                          background: 'var(--bg-card)',
                          border: '1px dashed var(--border)',
                          borderRadius: '12px',
                        }}>
                          No tasks
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {filteredTasks.length === 0 && (
            <div className="card" style={{ padding: '60px 20px', textAlign: 'center', color: 'var(--text-muted)' }}>
              <h3>No tasks found</h3>
              <p>Try modifying your sidebar filter choices or quick-add a new task to get started!</p>
            </div>
          )}
        </div>
      </div>

      {/* Slide-out drawer details panel */}
      <TaskDetailDrawer
        isOpen={drawerOpen}
        taskId={selectedTaskId}
        onClose={() => setDrawerOpen(false)}
      />
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

