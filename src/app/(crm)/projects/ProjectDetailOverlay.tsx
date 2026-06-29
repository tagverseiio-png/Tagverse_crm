'use client';
import React, { useState } from 'react';
import { useWorkspace, Project, Member, Task } from '@/context/WorkspaceContext';

interface ProjectDetailOverlayProps {
  isOpen: boolean;
  projectId: string | null;
  onClose: () => void;
}

const PHASES = ['Kick-off', 'Planning', 'Implementation', 'Review', 'Closing'] as const;

export default function ProjectDetailOverlay({ isOpen, projectId, onClose }: ProjectDetailOverlayProps) {
  const { projects, members, tasks, addTask, toggleTaskDone } = useWorkspace();
  const [activeTab, setActiveTab] = useState<'Plan' | 'Files' | 'Notes' | 'Emails' | 'Documents'>('Plan');
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskPhase, setNewTaskPhase] = useState<string | null>(null);

  // Files tab state
  const [fileSubFilter, setFileSubFilter] = useState<'All' | 'Deal files' | 'Project files'>('All');
  const [expandFiles, setExpandFiles] = useState(false);
  const [isDraggingOver, setIsDraggingOver] = useState(false);

  // Notes tab state
  const [noteText, setNoteText] = useState('');
  const [notes, setNotes] = useState<Array<{ id: string; text: string; author: string; date: string; type: 'deal' | 'project' }>>([]);
  const [noteSubFilter, setNoteSubFilter] = useState<'All' | 'Deal notes' | 'Project notes'>('All');
  const [expandNotes, setExpandNotes] = useState(false);

  // Emails tab state
  const [emailInput, setEmailInput] = useState('');
  const [emailSubFilter, setEmailSubFilter] = useState<'All' | 'Deal emails' | 'Project emails'>('All');
  const [expandEmails, setExpandEmails] = useState(false);

  // Documents tab state
  const [docSubTab, setDocSubTab] = useState<'Documents' | 'Templates'>('Documents');

  const handleAddNote = () => {
    if (!noteText.trim()) return;
    setNotes(prev => [...prev, {
      id: Date.now().toString(),
      text: noteText.trim(),
      author: 'Joseline Esther',
      date: new Date().toLocaleDateString(),
      type: 'project',
    }]);
    setNoteText('');
  };

  if (!isOpen || !projectId) return null;

  const project = projects.find(p => p.id === projectId);
  if (!project) return null;

  const projectTasks = tasks.filter(t => t.projectId === project.id);

  const assignees = members.filter(m => project.members.includes(m.id));

  const handleAddTask = (phase: string) => {
    if (!newTaskTitle.trim()) return;
    addTask({
      title: newTaskTitle.trim(),
      projectId: project.id,
      owner: members[0]?.id || 'm1',
      status: 'To Do',
      priority: 'Normal',
      due: new Date().toISOString().split('T')[0],
      parentType: 'project',
      tags: [],
      phase,
    });
    setNewTaskTitle('');
    setNewTaskPhase(null);
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', justifyContent: 'center', alignItems: 'center',
      background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)'
    }}>
      <div style={{
        width: '90%', height: '90%', background: 'var(--bg-primary)', borderRadius: '16px',
        display: 'flex', overflow: 'hidden', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
      }}>
        
        {/* LEFT SIDEBAR */}
        <div style={{
          width: '320px', background: 'var(--bg-card)', borderRight: '1px solid var(--border)',
          display: 'flex', flexDirection: 'column'
        }}>
          <div style={{ padding: '24px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '32px' }}>{project.emoji || '📁'}</span>
              <div>
                <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 700 }}>{project.name}</h2>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{project.status}</div>
              </div>
            </div>
            <button onClick={onClose} style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '20px', color: 'var(--text-muted)' }}>×</button>
          </div>

          <div style={{ padding: '24px', flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Progress Bar */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '8px', fontWeight: 600 }}>
                <span>Progress</span>
                <span>{project.progress}%</span>
              </div>
              <div style={{ height: '8px', background: 'var(--border)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${project.progress}%`, background: project.color || 'var(--blue)' }} />
              </div>
            </div>

            {/* Dates */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Start Date</span>
                <span style={{ fontWeight: 600 }}>{project.startDate || 'Not set'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Due Date</span>
                <span style={{ fontWeight: 600 }}>{project.endDate || 'Not set'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Time Tracked</span>
                <span style={{ fontWeight: 600 }}>24h 30m</span>
              </div>
            </div>

            {/* Team */}
            <div>
              <h4 style={{ margin: '0 0 12px', fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Team</h4>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {assignees.map(m => (
                  <div key={m.id} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'var(--bg-primary)', padding: '4px 8px', borderRadius: '20px', border: '1px solid var(--border)' }}>
                    <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'var(--blue-dim)', color: 'var(--blue)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '9px', fontWeight: 700 }}>
                      {m.avatar}
                    </div>
                    <span style={{ fontSize: '12px', fontWeight: 500 }}>{m.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Links */}
            <div>
              <h4 style={{ margin: '0 0 12px', fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Linked Entities</h4>
              {project.linkedDeal ? (
                <div style={{ fontSize: '12px', background: 'var(--purple-dim)', color: '#000', padding: '6px 12px', borderRadius: '6px', display: 'inline-block', fontWeight: 500 }}>
                  Deal: {project.linkedDeal}
                </div>
              ) : (
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>No links attached</div>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'var(--bg-primary)' }}>
          {/* Tabs */}
          <div style={{ borderBottom: '1px solid var(--border)', display: 'flex', padding: '0 24px', gap: '24px' }}>
            {(['Plan', 'Files', 'Notes', 'Emails', 'Documents'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  borderBottom: activeTab === tab ? '2px solid var(--purple)' : '2px solid transparent',
                  padding: '24px 0 16px',
                  fontSize: '14px',
                  fontWeight: activeTab === tab ? 600 : 500,
                  color: activeTab === tab ? 'var(--text-primary)' : 'var(--text-muted)',
                  cursor: 'pointer',
                }}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
            {activeTab === 'Plan' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                {PHASES.map(phase => {
                  const phaseTasks = projectTasks.filter(t => t.phase === phase);
                  
                  return (
                    <div key={phase} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '12px', overflow: 'hidden' }}>
                      <div style={{ background: 'rgba(0,0,0,0.02)', padding: '12px 16px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h4 style={{ margin: 0, fontSize: '13px', fontWeight: 600 }}>{phase}</h4>
                        <span style={{ fontSize: '11px', color: 'var(--text-muted)', background: 'var(--bg-primary)', padding: '2px 8px', borderRadius: '12px', border: '1px solid var(--border)' }}>
                          {phaseTasks.length} items
                        </span>
                      </div>
                      
                      {phaseTasks.length > 0 ? (
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                          <thead>
                            <tr style={{ borderBottom: '1px solid var(--border)', fontSize: '11px', color: 'var(--text-muted)', textAlign: 'left' }}>
                              <th style={{ padding: '8px 16px', width: '40px' }}>Done</th>
                              <th style={{ padding: '8px 16px' }}>Subject</th>
                              <th style={{ padding: '8px 16px', width: '120px' }}>Assignee</th>
                              <th style={{ padding: '8px 16px', width: '100px' }}>Due Date</th>
                              <th style={{ padding: '8px 16px', width: '80px' }}>Priority</th>
                            </tr>
                          </thead>
                          <tbody>
                            {phaseTasks.map(task => {
                              const owner = members.find(m => m.id === task.owner);
                              return (
                                <tr key={task.id} style={{ borderBottom: '1px solid var(--border)' }}>
                                  <td style={{ padding: '8px 16px' }}>
                                    <input 
                                      type="checkbox" 
                                      checked={task.status === 'Done'} 
                                      onChange={() => toggleTaskDone(task.id)}
                                      style={{ cursor: 'pointer' }}
                                    />
                                  </td>
                                  <td style={{ padding: '8px 16px', fontSize: '13px', fontWeight: 500, color: task.status === 'Done' ? 'var(--text-muted)' : 'var(--text-primary)', textDecoration: task.status === 'Done' ? 'line-through' : 'none' }}>
                                    {task.title}
                                  </td>
                                  <td style={{ padding: '8px 16px' }}>
                                    {owner && (
                                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'var(--blue-dim)', color: 'var(--blue)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '9px', fontWeight: 700 }}>
                                          {owner.avatar}
                                        </div>
                                        <span style={{ fontSize: '12px' }}>{owner.name.split(' ')[0]}</span>
                                      </div>
                                    )}
                                  </td>
                                  <td style={{ padding: '8px 16px', fontSize: '12px', color: 'var(--text-muted)' }}>{task.due}</td>
                                  <td style={{ padding: '8px 16px' }}>
                                    <span style={{ 
                                      fontSize: '10px', fontWeight: 600, padding: '2px 6px', borderRadius: '4px',
                                      background: task.priority === 'High' || task.priority === 'Urgent' ? 'var(--rose-dim)' : 'var(--blue-dim)',
                                      color: task.priority === 'High' || task.priority === 'Urgent' ? 'var(--rose)' : 'var(--blue)'
                                    }}>
                                      {task.priority}
                                    </span>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      ) : (
                        <div style={{ padding: '24px', textAlign: 'center', fontSize: '13px', color: 'var(--text-muted)' }}>
                          No tasks in this phase yet.
                        </div>
                      )}
                      
                      {/* Footer for adding task */}
                      <div style={{ padding: '12px 16px', borderTop: phaseTasks.length > 0 ? '1px solid var(--border)' : 'none', background: 'rgba(0,0,0,0.01)' }}>
                        {newTaskPhase === phase ? (
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <input 
                              autoFocus
                              type="text" 
                              value={newTaskTitle} 
                              onChange={e => setNewTaskTitle(e.target.value)}
                              onKeyDown={e => e.key === 'Enter' && handleAddTask(phase)}
                              placeholder="Task subject..." 
                              style={{ flex: 1, padding: '6px 10px', fontSize: '12px', borderRadius: '6px', border: '1px solid var(--border)', background: 'var(--bg-primary)' }}
                            />
                            <button onClick={() => handleAddTask(phase)} style={{ background: 'var(--blue)', color: '#fff', border: 'none', padding: '0 12px', borderRadius: '6px', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>Add</button>
                            <button onClick={() => setNewTaskPhase(null)} style={{ background: 'transparent', color: 'var(--text-muted)', border: 'none', padding: '0 12px', fontSize: '12px', cursor: 'pointer' }}>Cancel</button>
                          </div>
                        ) : (
                          <button 
                            onClick={() => setNewTaskPhase(phase)}
                            style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', fontSize: '12px', fontWeight: 500, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                          >
                            <span style={{ fontSize: '14px' }}>+</span> Task / Activity / Milestone
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
            
            {/* FILES TAB */}
            {activeTab === 'Files' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {/* Upload zone */}
                <div
                  onDragOver={e => { e.preventDefault(); setIsDraggingOver(true); }}
                  onDragLeave={() => setIsDraggingOver(false)}
                  onDrop={e => { e.preventDefault(); setIsDraggingOver(false); }}
                  style={{
                    border: `2px dashed ${isDraggingOver ? 'var(--blue)' : 'var(--border)'}`,
                    borderRadius: '10px',
                    padding: '40px',
                    textAlign: 'center',
                    background: isDraggingOver ? 'var(--blue-dim)' : 'var(--bg-card)',
                    transition: 'all 0.2s',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '16px' }}>
                    <label style={{
                      background: '#2a7a2a', color: '#fff', padding: '8px 18px',
                      borderRadius: '6px', fontSize: '13px', fontWeight: 600, cursor: 'pointer',
                    }}>
                      Upload files
                      <input type="file" multiple style={{ display: 'none' }} />
                    </label>
                    <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>or drag files here.</span>
                  </div>
                  <div style={{ width: '100%', height: '1px', background: 'var(--border)', margin: '16px 0' }} />
                  <button style={{
                    display: 'inline-flex', alignItems: 'center', gap: '8px',
                    padding: '8px 18px', border: '1px solid var(--border)', borderRadius: '6px',
                    background: 'var(--bg-primary)', fontSize: '13px', fontWeight: 500, cursor: 'pointer', color: 'var(--text-primary)'
                  }}>
                    <span style={{ fontSize: '16px' }}>▲</span> Connect to Google Drive
                  </button>
                </div>

                {/* Filter bar */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                    {(['All', 'Deal files', 'Project files'] as const).map(f => (
                      <button key={f} onClick={() => setFileSubFilter(f)} style={{
                        padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 600, cursor: 'pointer', border: 'none',
                        background: fileSubFilter === f ? 'var(--blue-dim)' : 'transparent',
                        color: fileSubFilter === f ? '#000' : 'var(--text-muted)',
                      }}>{f}</button>
                    ))}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: 'var(--text-muted)' }}>
                    <div
                      onClick={() => setExpandFiles(!expandFiles)}
                      style={{ width: '36px', height: '20px', borderRadius: '10px', background: expandFiles ? 'var(--blue)' : 'var(--border)', cursor: 'pointer', position: 'relative', transition: 'background 0.2s' }}
                    >
                      <div style={{ position: 'absolute', top: '2px', left: expandFiles ? '18px' : '2px', width: '16px', height: '16px', borderRadius: '50%', background: '#fff', transition: 'left 0.2s' }} />
                    </div>
                    Expand all items ⓘ
                  </div>
                </div>

                {/* Empty state */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
                  <div style={{ width: '60px', height: '72px', border: '2px solid var(--border)', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px', position: 'relative' }}>
                    <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                  </div>
                  <span style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)' }}>No files added yet</span>
                </div>
              </div>
            )}

            {/* NOTES TAB */}
            {activeTab === 'Notes' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {/* Owner bar */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid var(--border)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>👤</div>
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: 700 }}>JOSELINE ESTHER</div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Owner</div>
                    </div>
                    <span style={{ color: 'var(--text-muted)', marginLeft: '4px', cursor: 'pointer' }}>▼</span>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 14px', border: '1px solid var(--border)', borderRadius: '6px', background: 'var(--bg-primary)', fontSize: '12px', fontWeight: 600, cursor: 'pointer', color: '#2a7a2a' }}>
                      ✅ Complete
                    </button>
                    <button style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 14px', border: '1px solid var(--border)', borderRadius: '6px', background: 'var(--bg-primary)', fontSize: '12px', fontWeight: 600, cursor: 'pointer', color: 'var(--rose)' }}>
                      ✖ Cancel
                    </button>
                    <button style={{ padding: '6px 12px', border: '1px solid var(--border)', borderRadius: '6px', background: 'var(--bg-primary)', fontSize: '12px', cursor: 'pointer', color: 'var(--text-muted)' }}>···</button>
                  </div>
                </div>

                {/* Note input */}
                <textarea
                  value={noteText}
                  onChange={e => setNoteText(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleAddNote()}
                  placeholder="Take a note, @name..."
                  rows={3}
                  style={{
                    width: '100%', padding: '12px 14px', border: '1px solid var(--border)', borderRadius: '8px',
                    background: 'var(--bg-card)', fontSize: '13px', color: 'var(--text-primary)',
                    resize: 'none', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box',
                  }}
                />

                {/* Filter bar */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                    {(['All', 'Deal notes', 'Project notes'] as const).map(f => (
                      <button key={f} onClick={() => setNoteSubFilter(f)} style={{
                        padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 600, cursor: 'pointer', border: 'none',
                        background: noteSubFilter === f ? 'var(--blue-dim)' : 'transparent',
                        color: noteSubFilter === f ? '#000' : 'var(--text-muted)',
                      }}>{f}</button>
                    ))}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: 'var(--text-muted)' }}>
                    <div
                      onClick={() => setExpandNotes(!expandNotes)}
                      style={{ width: '36px', height: '20px', borderRadius: '10px', background: expandNotes ? 'var(--blue)' : 'var(--border)', cursor: 'pointer', position: 'relative', transition: 'background 0.2s' }}
                    >
                      <div style={{ position: 'absolute', top: '2px', left: expandNotes ? '18px' : '2px', width: '16px', height: '16px', borderRadius: '50%', background: '#fff', transition: 'left 0.2s' }} />
                    </div>
                    Expand all items ⓘ
                  </div>
                </div>

                {/* Notes list or empty state */}
                {notes.length === 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
                    <div style={{ width: '60px', height: '60px', border: '2px solid var(--border)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                      <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                    </div>
                    <span style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)' }}>No notes added yet</span>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {notes.filter(n => noteSubFilter === 'All' || (noteSubFilter === 'Project notes' && n.type === 'project') || (noteSubFilter === 'Deal notes' && n.type === 'deal')).map(n => (
                      <div key={n.id} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '8px', padding: '12px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                          <span style={{ fontSize: '12px', fontWeight: 600 }}>{n.author}</span>
                          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{n.date}</span>
                        </div>
                        <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-primary)' }}>{n.text}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* EMAILS TAB */}
            {activeTab === 'Emails' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {/* Email input bar */}
                <div
                  onClick={() => setEmailInput('')}
                  style={{
                    padding: '12px 14px', border: '1px solid var(--border)', borderRadius: '8px',
                    background: 'var(--bg-card)', fontSize: '13px',
                    color: emailInput ? 'var(--text-primary)' : 'var(--text-muted)',
                    cursor: 'text',
                  }}
                >
                  Click here to add an email...
                </div>

                {/* Filter bar */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                    {(['All', 'Deal emails', 'Project emails'] as const).map(f => (
                      <button key={f} onClick={() => setEmailSubFilter(f)} style={{
                        padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 600, cursor: 'pointer', border: 'none',
                        background: emailSubFilter === f ? 'var(--blue-dim)' : 'transparent',
                        color: emailSubFilter === f ? '#000' : 'var(--text-muted)',
                      }}>{f}</button>
                    ))}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: 'var(--text-muted)' }}>
                    <div
                      onClick={() => setExpandEmails(!expandEmails)}
                      style={{ width: '36px', height: '20px', borderRadius: '10px', background: expandEmails ? 'var(--blue)' : 'var(--border)', cursor: 'pointer', position: 'relative', transition: 'background 0.2s' }}
                    >
                      <div style={{ position: 'absolute', top: '2px', left: expandEmails ? '18px' : '2px', width: '16px', height: '16px', borderRadius: '50%', background: '#fff', transition: 'left 0.2s' }} />
                    </div>
                    Expand all items ⓘ
                  </div>
                </div>

                {/* Empty state */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
                  <div style={{ marginBottom: '16px' }}>
                    <svg width="52" height="52" fill="none" stroke="var(--border)" strokeWidth="2" viewBox="0 0 24 24"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m2 7 10 7 10-7"/></svg>
                  </div>
                  <span style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px' }}>No emails linked yet</span>
                  <span style={{ fontSize: '13px', color: 'var(--blue)', cursor: 'pointer' }}>Link an email to this project to see it here</span>
                </div>
              </div>
            )}

            {/* DOCUMENTS TAB */}
            {activeTab === 'Documents' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
                <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '10px', overflow: 'hidden' }}>
                  {/* Sub-tabs header */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)', padding: '0 16px' }}>
                    <div style={{ display: 'flex' }}>
                      {(['Documents', 'Templates'] as const).map(st => (
                        <button key={st} onClick={() => setDocSubTab(st)} style={{
                          padding: '14px 16px', border: 'none', background: 'transparent', cursor: 'pointer',
                          fontSize: '13px', fontWeight: docSubTab === st ? 600 : 500,
                          color: docSubTab === st ? 'var(--blue)' : 'var(--text-muted)',
                          borderBottom: docSubTab === st ? '2px solid var(--blue)' : '2px solid transparent',
                        }}>{st}</button>
                      ))}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <button style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: 'var(--text-muted)', background: 'transparent', border: 'none', cursor: 'pointer' }}>
                        ❓ Learn more ▼
                      </button>
                      <button style={{ fontSize: '14px', color: 'var(--text-muted)', background: 'transparent', border: 'none', cursor: 'pointer' }}>···</button>
                    </div>
                  </div>

                  {/* Upload actions */}
                  <div style={{ padding: '16px', display: 'flex', gap: '10px' }}>
                    <label style={{
                      display: 'flex', alignItems: 'center', gap: '6px', padding: '7px 14px',
                      border: '1px solid var(--border)', borderRadius: '6px', background: 'var(--bg-primary)',
                      fontSize: '12px', fontWeight: 600, cursor: 'pointer', color: 'var(--text-primary)'
                    }}>
                      🖥️ Upload from device
                      <input type="file" style={{ display: 'none' }} />
                    </label>
                    <button style={{
                      display: 'flex', alignItems: 'center', gap: '6px', padding: '7px 14px',
                      border: 'none', background: 'transparent', fontSize: '12px', fontWeight: 600,
                      cursor: 'pointer', color: 'var(--blue)'
                    }}>☁️ Connect cloud storage</button>
                  </div>

                  {/* Documents list or empty */}
                  <div style={{ padding: '0 16px 16px' }}>
                    <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.07em', marginBottom: '16px' }}>DOCUMENTS CREATED</div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 20px', color: 'var(--text-muted)' }}>
                      <div style={{ position: 'relative', marginBottom: '16px' }}>
                        <svg width="32" height="40" fill="none" stroke="var(--border)" strokeWidth="2" viewBox="0 0 24 30"><path d="M14 2H6a2 2 0 0 0-2 2v22a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                        <span style={{ position: 'absolute', top: '-8px', right: '-8px', fontSize: '16px' }}>✦</span>
                        <span style={{ position: 'absolute', bottom: '-8px', left: '-8px', fontSize: '12px', color: 'var(--border)' }}>○</span>
                      </div>
                      <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>No documents created yet</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        
      </div>
    </div>
  );
}
