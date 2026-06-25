'use client';
import React, { useState, useEffect } from 'react';
import { useWorkspace, Task } from '@/context/WorkspaceContext';

interface TaskDetailDrawerProps {
  isOpen: boolean;
  taskId: string | null;
  onClose: () => void;
  defaultStatus?: 'To Do' | 'In Progress' | 'Done';
  defaultProjectId?: string | null;
}

export default function TaskDetailDrawer({
  isOpen,
  taskId,
  onClose,
  defaultStatus = 'To Do',
  defaultProjectId = null,
}: TaskDetailDrawerProps) {
  const { members, projects, tasks, addTask, updateTask, deleteTask } = useWorkspace();

  const [title, setTitle] = useState('');
  const [status, setStatus] = useState<'To Do' | 'In Progress' | 'Done'>('To Do');
  const [priority, setPriority] = useState<'Low' | 'Normal' | 'High' | 'Urgent'>('Normal');
  const [owner, setOwner] = useState('m1');
  const [due, setDue] = useState('2026-06-25');
  const [projectId, setProjectId] = useState<string>('');
  const [tags, setTags] = useState('');

  // Populate data when drawer opens or taskId changes
  useEffect(() => {
    if (isOpen) {
      if (taskId) {
        const t = tasks.find(x => x.id === taskId);
        if (t) {
          setTitle(t.title);
          setStatus(t.status);
          setPriority(t.priority);
          setOwner(t.owner);
          setDue(t.due);
          setProjectId(t.projectId || '');
          setTags(t.tags.join(', '));
        }
      } else {
        // Reset to defaults/creation state
        setTitle('');
        setStatus(defaultStatus);
        setPriority('Normal');
        setOwner(members[0]?.id || 'm1');
        setDue('2026-06-25');
        setProjectId(defaultProjectId || '');
        setTags('');
      }
    }
  }, [isOpen, taskId, tasks, defaultStatus, defaultProjectId, members]);

  if (!isOpen) return null;

  const handleSave = () => {
    if (!title.trim()) {
      alert('Task title is required!');
      return;
    }

    const tagList = tags
      ? tags
          .split(',')
          .map(t => t.trim())
          .filter(Boolean)
      : [];

    const taskData = {
      title: title.trim(),
      projectId: projectId || null,
      owner,
      status,
      priority,
      due,
      parentType: (projectId ? 'project' : null) as 'project' | null,
      tags: tagList,
    };

    if (taskId) {
      updateTask({
        ...taskData,
        id: taskId,
      });
    } else {
      addTask(taskData);
    }
    onClose();
  };

  const handleDelete = () => {
    if (taskId) {
      if (confirm('Are you sure you want to delete this task?')) {
        deleteTask(taskId);
        onClose();
      }
    }
  };

  return (
    <>
      {/* Backdrop overlay */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          backdropFilter: 'blur(4px)',
          zIndex: 990,
        }}
      />
      
      {/* Slide-out drawer panel */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          height: '100%',
          width: '380px',
          maxWidth: '100vw',
          backgroundColor: 'var(--bg-secondary)',
          borderLeft: '1px solid var(--border)',
          zIndex: 1000,
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '-10px 0 30px rgba(0,0,0,0.25)',
          color: 'var(--text-primary)',
        }}
      >
        {/* Header */}
        <div style={{ padding: '20px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700 }}>
            {taskId ? '✏️ Edit Task Details' : '➕ Create New Task'}
          </h3>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-muted)',
              fontSize: '20px',
              cursor: 'pointer',
            }}
          >
            ✕
          </button>
        </div>

        {/* Body Form */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Title</label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Task title..."
              style={{
                width: '100%',
                background: 'var(--bg-primary)',
                border: '1px solid var(--border)',
                borderRadius: '8px',
                padding: '10px',
                color: 'var(--text-primary)',
                outline: 'none',
                marginTop: '4px',
              }}
            />
          </div>

          <div>
            <label style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Status</label>
            <select
              value={status}
              onChange={e => setStatus(e.target.value as any)}
              style={{
                width: '100%',
                background: 'var(--bg-primary)',
                border: '1px solid var(--border)',
                borderRadius: '8px',
                padding: '10px',
                color: 'var(--text-primary)',
                outline: 'none',
                marginTop: '4px',
                cursor: 'pointer',
              }}
            >
              <option value="To Do">To Do</option>
              <option value="In Progress">In Progress</option>
              <option value="Done">Done</option>
            </select>
          </div>

          <div>
            <label style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Priority</label>
            <select
              value={priority}
              onChange={e => setPriority(e.target.value as any)}
              style={{
                width: '100%',
                background: 'var(--bg-primary)',
                border: '1px solid var(--border)',
                borderRadius: '8px',
                padding: '10px',
                color: 'var(--text-primary)',
                outline: 'none',
                marginTop: '4px',
                cursor: 'pointer',
              }}
            >
              <option value="Low">Low</option>
              <option value="Normal">Normal</option>
              <option value="High">High</option>
              <option value="Urgent">Urgent</option>
            </select>
          </div>

          <div>
            <label style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Assignee</label>
            <select
              value={owner}
              onChange={e => setOwner(e.target.value)}
              style={{
                width: '100%',
                background: 'var(--bg-primary)',
                border: '1px solid var(--border)',
                borderRadius: '8px',
                padding: '10px',
                color: 'var(--text-primary)',
                outline: 'none',
                marginTop: '4px',
                cursor: 'pointer',
              }}
            >
              {members.map(m => (
                <option key={m.id} value={m.id}>
                  {m.name} ({m.department})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Due Date</label>
            <input
              type="date"
              value={due}
              onChange={e => setDue(e.target.value)}
              style={{
                width: '100%',
                background: 'var(--bg-primary)',
                border: '1px solid var(--border)',
                borderRadius: '8px',
                padding: '10px',
                color: 'var(--text-primary)',
                outline: 'none',
                marginTop: '4px',
              }}
            />
          </div>

          <div>
            <label style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Project Link</label>
            <select
              value={projectId}
              onChange={e => setProjectId(e.target.value)}
              style={{
                width: '100%',
                background: 'var(--bg-primary)',
                border: '1px solid var(--border)',
                borderRadius: '8px',
                padding: '10px',
                color: 'var(--text-primary)',
                outline: 'none',
                marginTop: '4px',
                cursor: 'pointer',
              }}
            >
              <option value="">No Project</option>
              {projects.map(p => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Tags (comma separated)</label>
            <input
              type="text"
              value={tags}
              onChange={e => setTags(e.target.value)}
              placeholder="e.g. design, frontend, documentation"
              style={{
                width: '100%',
                background: 'var(--bg-primary)',
                border: '1px solid var(--border)',
                borderRadius: '8px',
                padding: '10px',
                color: 'var(--text-primary)',
                outline: 'none',
                marginTop: '4px',
              }}
            />
          </div>
        </div>

        {/* Footer actions */}
        <div style={{ padding: '20px', borderTop: '1px solid var(--border)', display: 'flex', gap: '10px', background: 'var(--bg-primary)' }}>
          <button
            onClick={handleSave}
            className="btn btn-primary"
            style={{ flex: 1, justifyContent: 'center' }}
          >
            Save Changes
          </button>
          {taskId && (
            <button
              onClick={handleDelete}
              style={{
                background: 'var(--rose-dim)',
                color: 'var(--rose-light)',
                border: '1px solid var(--rose)',
                padding: '10px 16px',
                borderRadius: '8px',
                cursor: 'pointer',
              }}
            >
              🗑️
            </button>
          )}
        </div>
      </div>
    </>
  );
}
