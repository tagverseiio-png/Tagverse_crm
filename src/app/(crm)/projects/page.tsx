'use client';
import React, { useState } from 'react';
import { useWorkspace, Project, Task } from '@/context/WorkspaceContext';
import TaskDetailDrawer from '@/components/workspace/TaskDetailDrawer';
import styles from './projects.module.css';

export default function ProjectsPage() {
  const {
    members,
    projects,
    tasks,
    addProject,
  } = useWorkspace();

  const [selectedProjectId, setSelectedProjectId] = useState<string>('p1');
  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Sort state for List View
  const [sortField, setSortField] = useState<'title' | 'owner' | 'priority' | 'status' | 'due'>('title');
  const [sortAsc, setSortAsc] = useState(true);

  // Drawer states
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [drawerDefaultStatus, setDrawerDefaultStatus] = useState<'To Do' | 'In Progress' | 'Done'>('To Do');

  // Modal states for creating new project
  const [projectModalOpen, setProjectModalOpen] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectColor, setNewProjectColor] = useState('#6366f1');
  const [newProjectEstBudget, setNewProjectEstBudget] = useState('40000');
  const [newProjectActCost, setNewProjectActCost] = useState('0');
  const [newProjectMembers, setNewProjectMembers] = useState<string[]>([]);

  // Calculate task counts and completion progress dynamically
  const getProjectStats = (pId: string) => {
    const projTasks = tasks.filter(t => t.projectId === pId);
    const total = projTasks.length;
    const completed = projTasks.filter(t => t.status === 'Done').length;
    const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);
    return { total, completed, percentage };
  };

  // Filter tasks belonging to current active project and matching search query
  const activeProject = projects.find(p => p.id === selectedProjectId) || projects[0];
  
  const getFilteredTasks = () => {
    if (!activeProject) return [];
    let pTasks = tasks.filter(t => t.projectId === activeProject.id);
    if (searchQuery.trim()) {
      pTasks = pTasks.filter(t =>
        t.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return pTasks;
  };

  const filteredTasks = getFilteredTasks();

  const handleOpenDrawerForEdit = (taskId: string) => {
    setSelectedTaskId(taskId);
    setDrawerOpen(true);
  };

  const handleOpenDrawerForCreate = (colStatus: 'To Do' | 'In Progress' | 'Done') => {
    setSelectedTaskId(null);
    setDrawerDefaultStatus(colStatus);
    setDrawerOpen(true);
  };

  const handleCreateProject = () => {
    if (!newProjectName.trim()) {
      alert('Project Name is required!');
      return;
    }
    addProject({
      name: newProjectName.trim(),
      status: 'Active',
      color: newProjectColor,
      members: newProjectMembers,
      linkedDeal: null,
      budget: {
        est: Number(newProjectEstBudget) || 0,
        actual: Number(newProjectActCost) || 0,
      },
    });
    // Reset forms
    setNewProjectName('');
    setNewProjectMembers([]);
    setProjectModalOpen(false);
  };

  const handleMemberSelectToggle = (memberId: string) => {
    setNewProjectMembers(prev =>
      prev.includes(memberId)
        ? prev.filter(id => id !== memberId)
        : [...prev, memberId]
    );
  };

  // List View Sort Handler
  const handleSort = (field: typeof sortField) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    let aVal: any = a[sortField] || '';
    let bVal: any = b[sortField] || '';

    if (sortField === 'owner') {
      const ownerA = members.find(m => m.id === a.owner);
      const ownerB = members.find(m => m.id === b.owner);
      aVal = ownerA ? ownerA.name : '';
      bVal = ownerB ? ownerB.name : '';
    }

    if (aVal < bVal) return sortAsc ? -1 : 1;
    if (aVal > bVal) return sortAsc ? 1 : -1;
    return 0;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Top action row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ fontSize: '18px', fontWeight: 700, margin: 0 }}>Current Projects</h2>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: '2px 0 0' }}>Select a project to load its corresponding Kanban board</p>
        </div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          {/* Search bar */}
          <div style={{ position: 'relative', width: '220px' }}>
            <span style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', fontSize: '13px' }}>🔍</span>
            <input
              type="text"
              placeholder="Search tasks..."
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

          <button className="btn btn-ghost" onClick={() => setProjectModalOpen(true)}>
            ➕ Create Project
          </button>
        </div>
      </div>

      {/* Projects Cards Row */}
      <div className={styles.projectGrid}>
        {projects.map(p => {
          const isSelected = p.id === selectedProjectId;
          const stats = getProjectStats(p.id);

          return (
            <div
              key={p.id}
              className={isSelected ? styles.activeProjectCard : styles.projectCard}
              style={{ borderLeft: `4px solid ${p.color}` }}
            >
              <div>
                <div className={styles.projectHeader}>
                  <h4 className={styles.projectTitle}>{p.name}</h4>
                  <span className={`${styles.projectStatus} ${p.status === 'Active' ? styles.statusActive : styles.statusPlanning}`}>
                    {p.status}
                  </span>
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
                  Deal ID: {p.linkedDeal || 'Unlinked'}
                </div>
              </div>

              {/* Progress Bar */}
              <div className={styles.progressContainer}>
                <div className={styles.progressInfo}>
                  <span>Tasks Complete</span>
                  <span>{stats.completed}/{stats.total} ({stats.percentage}%)</span>
                </div>
                <div className={styles.progressBar}>
                  <div
                    className={styles.progressFill}
                    style={{ width: `${stats.percentage}%`, backgroundColor: p.color }}
                  />
                </div>
              </div>

              <div className={styles.budgetInfo}>
                <span>Spent: ${p.budget.actual.toLocaleString()}</span>
                <span>Budget: ${p.budget.est.toLocaleString()}</span>
              </div>

              <div className={styles.cardFooter}>
                <div className={styles.avatarGroup}>
                  {p.members.map(mId => {
                    const m = members.find(member => member.id === mId);
                    return m ? (
                      <span key={m.id} title={m.name} className={styles.avatarItem}>
                        {m.avatar}
                      </span>
                    ) : null;
                  })}
                </div>
                <button
                  onClick={() => setSelectedProjectId(p.id)}
                  style={{
                    padding: '4px 10px',
                    fontSize: '11px',
                    fontWeight: 700,
                    borderRadius: '6px',
                    border: '1px solid var(--border)',
                    background: isSelected ? 'var(--purple-dim)' : 'var(--bg-card)',
                    color: isSelected ? 'var(--purple-light)' : 'var(--text-primary)',
                    cursor: 'pointer',
                  }}
                >
                  View Board
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Kanban / List Board Block */}
      {activeProject && (
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)', paddingBottom: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: activeProject.color }} />
              <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 700 }}>
                {activeProject.name} Tasks ({getProjectStats(activeProject.id).percentage}% Complete)
              </h3>
            </div>
            
            <div style={{ display: 'flex', background: 'var(--bg-primary)', border: '1px solid var(--border)', borderRadius: '8px', overflow: 'hidden' }}>
              <button
                onClick={() => setViewMode('kanban')}
                style={{
                  padding: '6px 12px',
                  fontSize: '11px',
                  fontWeight: 600,
                  border: 'none',
                  background: viewMode === 'kanban' ? 'var(--purple-dim)' : 'transparent',
                  color: viewMode === 'kanban' ? 'var(--purple-light)' : 'var(--text-muted)',
                  cursor: 'pointer',
                }}
              >
                Kanban
              </button>
              <button
                onClick={() => setViewMode('list')}
                style={{
                  padding: '6px 12px',
                  fontSize: '11px',
                  fontWeight: 600,
                  border: 'none',
                  background: viewMode === 'list' ? 'var(--purple-dim)' : 'transparent',
                  color: viewMode === 'list' ? 'var(--purple-light)' : 'var(--text-muted)',
                  cursor: 'pointer',
                }}
              >
                List View
              </button>
            </div>
          </div>

          {/* KANBAN VIEW */}
          {viewMode === 'kanban' && (
            <div className={styles.kanbanGrid}>
              {(['To Do', 'In Progress', 'Done'] as const).map(colStatus => {
                const colTasks = sortedTasks.filter(t => t.status === colStatus);
                return (
                  <div key={colStatus} className={styles.kanbanColumn}>
                    <div className={styles.columnHeader}>
                      <span className={styles.columnTitle}>
                        <span
                          style={{
                            width: '8px',
                            height: '8px',
                            borderRadius: '50%',
                            backgroundColor:
                              colStatus === 'To Do'
                                ? 'var(--text-muted)'
                                : colStatus === 'In Progress'
                                ? 'var(--blue)'
                                : 'var(--emerald)',
                          }}
                        />
                        {colStatus}
                      </span>
                      <span className={styles.columnBadge}>{colTasks.length}</span>
                    </div>

                    <div className={styles.kanbanList}>
                      {colTasks.map(t => {
                        const assignee = members.find(m => m.id === t.owner);
                        return (
                          <div
                            key={t.id}
                            className={styles.kanbanCard}
                            onClick={() => handleOpenDrawerForEdit(t.id)}
                          >
                            <h5 className={styles.kanbanCardTitle}>{t.title}</h5>
                            {t.tags.length > 0 && (
                              <div className={styles.tagGroup}>
                                {t.tags.map(tag => (
                                  <span key={tag} className={styles.tagItem}>
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            )}
                            <div className={styles.cardMeta}>
                              <span
                                className={`${styles.priorityBadge} ${
                                  t.priority === 'Urgent'
                                    ? styles.priorityUrgent
                                    : t.priority === 'High'
                                    ? styles.priorityHigh
                                    : t.priority === 'Normal'
                                    ? styles.priorityNormal
                                    : styles.priorityLow
                                }`}
                              >
                                {t.priority}
                              </span>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                                  {t.due}
                                </span>
                                {assignee && (
                                  <span
                                    title={assignee.name}
                                    style={{
                                      width: '18px',
                                      height: '18px',
                                      borderRadius: '50%',
                                      background: 'var(--purple-dim)',
                                      color: 'var(--purple-light)',
                                      fontSize: '8px',
                                      fontWeight: 700,
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      textTransform: 'uppercase',
                                    }}
                                  >
                                    {assignee.avatar}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <button
                      onClick={() => handleOpenDrawerForCreate(colStatus)}
                      style={{
                        marginTop: '12px',
                        width: '100%',
                        padding: '8px',
                        border: '1px dashed var(--border)',
                        background: 'transparent',
                        color: 'var(--text-secondary)',
                        fontSize: '12px',
                        fontWeight: 600,
                        borderRadius: '8px',
                        cursor: 'pointer',
                      }}
                    >
                      + Add Task
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          {/* LIST VIEW */}
          {viewMode === 'list' && (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th style={{ cursor: 'pointer' }} onClick={() => handleSort('title')}>
                      Task Name {sortField === 'title' && (sortAsc ? '▲' : '▼')}
                    </th>
                    <th style={{ cursor: 'pointer' }} onClick={() => handleSort('owner')}>
                      Assignee {sortField === 'owner' && (sortAsc ? '▲' : '▼')}
                    </th>
                    <th style={{ cursor: 'pointer' }} onClick={() => handleSort('priority')}>
                      Priority {sortField === 'priority' && (sortAsc ? '▲' : '▼')}
                    </th>
                    <th style={{ cursor: 'pointer' }} onClick={() => handleSort('status')}>
                      Status {sortField === 'status' && (sortAsc ? '▲' : '▼')}
                    </th>
                    <th style={{ cursor: 'pointer' }} onClick={() => handleSort('due')}>
                      Due Date {sortField === 'due' && (sortAsc ? '▲' : '▼')}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {sortedTasks.map(t => {
                    const assignee = members.find(m => m.id === t.owner);
                    return (
                      <tr
                        key={t.id}
                        onClick={() => handleOpenDrawerForEdit(t.id)}
                        style={{ cursor: 'pointer' }}
                      >
                        <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{t.title}</td>
                        <td>{assignee ? assignee.name : 'Unassigned'}</td>
                        <td>
                          <span
                            className={`badge ${
                              t.priority === 'Urgent'
                                ? 'rose'
                                : t.priority === 'High'
                                ? 'amber'
                                : t.priority === 'Normal'
                                ? 'blue'
                                : 'purple'
                            }`}
                          >
                            {t.priority}
                          </span>
                        </td>
                        <td>
                          <span
                            className={`badge ${
                              t.status === 'Done'
                                ? 'emerald'
                                : t.status === 'In Progress'
                                ? 'blue'
                                : 'purple'
                            }`}
                          >
                            {t.status}
                          </span>
                        </td>
                        <td style={{ color: 'var(--text-muted)' }}>{t.due}</td>
                      </tr>
                    );
                  })}
                  {sortedTasks.length === 0 && (
                    <tr>
                      <td colSpan={5} style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>
                        No tasks found matching this project.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Task Drawer Panel */}
      <TaskDetailDrawer
        isOpen={drawerOpen}
        taskId={selectedTaskId}
        onClose={() => setDrawerOpen(false)}
        defaultStatus={drawerDefaultStatus}
        defaultProjectId={selectedProjectId}
      />

      {/* Modal - Create Project */}
      {projectModalOpen && (
        <div className={styles.modalBackdrop} onClick={() => setProjectModalOpen(false)}>
          <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)', paddingBottom: '10px' }}>
              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700 }}>Create New Project</h3>
              <button onClick={() => setProjectModalOpen(false)} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', fontSize: '18px', cursor: 'pointer' }}>✕</button>
            </div>
            
            <div>
              <label style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Project Name</label>
              <input
                type="text"
                placeholder="e.g. Brand Identity Redesign"
                value={newProjectName}
                onChange={e => setNewProjectName(e.target.value)}
                style={{ width: '100%', padding: '8px 12px', background: 'var(--bg-primary)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text-primary)', outline: 'none', marginTop: '4px' }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Est. Budget ($)</label>
                <input
                  type="number"
                  value={newProjectEstBudget}
                  onChange={e => setNewProjectEstBudget(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', background: 'var(--bg-primary)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text-primary)', outline: 'none', marginTop: '4px' }}
                />
              </div>
              <div>
                <label style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Actual Cost ($)</label>
                <input
                  type="number"
                  value={newProjectActCost}
                  onChange={e => setNewProjectActCost(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', background: 'var(--bg-primary)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text-primary)', outline: 'none', marginTop: '4px' }}
                />
              </div>
            </div>

            <div>
              <label style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Theme Accent Color</label>
              <div style={{ display: 'flex', gap: '8px', marginTop: '4px', alignItems: 'center' }}>
                <input
                  type="color"
                  value={newProjectColor}
                  onChange={e => setNewProjectColor(e.target.value)}
                  style={{ width: '40px', height: '40px', background: 'transparent', border: 'none', cursor: 'pointer' }}
                />
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Choose a badge color for board calendars</span>
              </div>
            </div>

            <div>
              <label style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Team Members Involved</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '6px', maxHeight: '120px', overflowY: 'auto' }}>
                {members.map(m => (
                  <label key={m.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px' }}>
                    <input
                      type="checkbox"
                      checked={newProjectMembers.includes(m.id)}
                      onChange={() => handleMemberSelectToggle(m.id)}
                      style={{ cursor: 'pointer' }}
                    />
                    <span>{m.name} ({m.role})</span>
                  </label>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', borderTop: '1px solid var(--border)', paddingTop: '12px' }}>
              <button className="btn btn-ghost" onClick={() => setProjectModalOpen(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleCreateProject}>Create</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
