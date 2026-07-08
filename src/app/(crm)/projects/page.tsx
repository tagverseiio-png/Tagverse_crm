'use client';
import React, { useState, useEffect } from 'react';
import { useWorkspace, Project, Member } from '@/context/WorkspaceContext';
import styles from './projects.module.css';
import ProjectBoard from './ProjectBoard';
import ProjectDetailOverlay from './ProjectDetailOverlay';

export default function ProjectsPage() {
  const {
    members,
    addProject,
  } = useWorkspace();

  const [searchQuery, setSearchQuery] = useState('');
  
  // Drawer/Overlay state
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

  // Modal states for creating new project
  const [projectModalOpen, setProjectModalOpen] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectColor, setNewProjectColor] = useState('#6366f1');
  const [newProjectEstBudget, setNewProjectEstBudget] = useState('40000');
  const [newProjectActCost, setNewProjectActCost] = useState('0');
  const [newProjectMembers, setNewProjectMembers] = useState<string[]>([]);
  const [isMemberDropdownOpen, setIsMemberDropdownOpen] = useState(false);
  const [newMemberName, setNewMemberName] = useState('');
  const [localMembers, setLocalMembers] = useState<Member[]>([]);
  const [hiddenMembers, setHiddenMembers] = useState<string[]>([]);
  const [membersLoaded, setMembersLoaded] = useState(false);

  useEffect(() => {
    const savedLocal = localStorage.getItem('project-local-members');
    const savedHidden = localStorage.getItem('project-hidden-members');
    if (savedLocal) {
      try { setLocalMembers(JSON.parse(savedLocal)); } catch(e) {}
    }
    if (savedHidden) {
      try { setHiddenMembers(JSON.parse(savedHidden)); } catch(e) {}
    }
    setMembersLoaded(true);
  }, []);

  useEffect(() => {
    if (membersLoaded) {
      localStorage.setItem('project-local-members', JSON.stringify(localMembers));
      localStorage.setItem('project-hidden-members', JSON.stringify(hiddenMembers));
    }
  }, [localMembers, hiddenMembers, membersLoaded]);

  const allMembers = [...members, ...localMembers].filter(m => !hiddenMembers.includes(m.id));

  const handleRemoveMember = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setHiddenMembers(prev => [...prev, id]);
    setNewProjectMembers(prev => prev.filter(x => x !== id));
  };

  const handleAddNewMember = () => {
    const val = newMemberName.trim();
    if (val) {
      const formatted = val.charAt(0).toUpperCase() + val.slice(1);
      const exists = allMembers.find(m => m.name.toLowerCase() === formatted.toLowerCase());
      if (!exists) {
        const newId = 'm-local-' + Date.now();
        const newMember: Member = {
          id: newId,
          name: formatted,
          role: 'Member',
          department: 'General',
          avatar: formatted.substring(0, 2).toUpperCase(),
          email: `${formatted.replace(/\s+/g, '').toLowerCase()}@example.com`
        };
        setLocalMembers(prev => [...prev, newMember]);
        setNewProjectMembers(prev => [...prev, newId]);
      } else if (!newProjectMembers.includes(exists.id)) {
        setNewProjectMembers(prev => [...prev, exists.id]);
      }
      setNewMemberName('');
    }
  };

  const handleCreateProject = () => {
    if (!newProjectName.trim()) {
      alert('Project Name is required!');
      return;
    }
    addProject({
      name: newProjectName.trim(),
      status: 'Kick-off',
      color: newProjectColor,
      members: newProjectMembers,
      linkedDeal: null,
      emoji: '📁',
      startDate: new Date().toISOString().split('T')[0],
      endDate: '',
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

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', height: '100%' }}>
      
      {/* Top action row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ fontSize: '18px', fontWeight: 700, margin: 0 }}>Project Management</h2>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: '2px 0 0' }}>Manage projects across different phases</p>
        </div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          {/* Search bar */}
          <div style={{ position: 'relative', width: '220px' }}>
            <span style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', fontSize: '13px' }}>🔍</span>
            <input
              type="text"
              placeholder="Search projects..."
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

      <div style={{ flex: 1, minHeight: 0 }}>
        <ProjectBoard onProjectClick={(p) => setSelectedProjectId(p.id)} />
      </div>

      {/* Detail Overlay */}
      <ProjectDetailOverlay
        isOpen={selectedProjectId !== null}
        projectId={selectedProjectId}
        onClose={() => setSelectedProjectId(null)}
      />

      {/* Create Project Modal */}
      {projectModalOpen && (
        <div className="modal-backdrop">
          <div className="modal-content" style={{ width: '400px' }}>
            <h3 style={{ margin: '0 0 16px', fontSize: '16px', fontWeight: 700 }}>Create New Project</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '11px', color: 'var(--text-muted)', marginBottom: '4px' }}>Project Name</label>
                <input
                  type="text"
                  value={newProjectName}
                  onChange={e => setNewProjectName(e.target.value)}
                  style={{ width: '100%', padding: '8px', background: 'var(--bg-primary)', border: '1px solid var(--border)', borderRadius: '6px', color: 'var(--text-primary)', fontSize: '13px' }}
                  placeholder="e.g. Q3 Marketing Campaign"
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '11px', color: 'var(--text-muted)', marginBottom: '4px' }}>Color Theme</label>
                <input
                  type="color"
                  value={newProjectColor}
                  onChange={e => setNewProjectColor(e.target.value)}
                  style={{ width: '100%', height: '32px', background: 'var(--bg-primary)', border: '1px solid var(--border)', borderRadius: '6px', cursor: 'pointer' }}
                />
              </div>
              
              <div style={{ display: 'flex', gap: '12px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '11px', color: 'var(--text-muted)', marginBottom: '4px' }}>Est Budget ($)</label>
                  <input
                    type="number"
                    value={newProjectEstBudget}
                    onChange={e => setNewProjectEstBudget(e.target.value)}
                    style={{ width: '100%', padding: '8px', background: 'var(--bg-primary)', border: '1px solid var(--border)', borderRadius: '6px', color: 'var(--text-primary)', fontSize: '13px' }}
                  />
                </div>
              </div>

              <div style={{ position: 'relative' }}>
                <label style={{ display: 'block', fontSize: '11px', color: 'var(--text-muted)', marginBottom: '4px' }}>Assign Members</label>
                <div style={{ position: 'relative' }}>
                  <div
                    style={{ width: '100%', padding: '8px', background: 'var(--bg-primary)', border: '1px solid var(--border)', borderRadius: '6px', color: 'var(--text-primary)', fontSize: '13px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                    onClick={() => setIsMemberDropdownOpen(!isMemberDropdownOpen)}
                  >
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {newProjectMembers.length > 0 
                        ? newProjectMembers.map(id => allMembers.find(m => m.id === id)?.name).filter(Boolean).join(', ')
                        : 'Select Members'}
                    </span>
                    <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>▼</span>
                  </div>
                  {isMemberDropdownOpen && (
                    <>
                      <div style={{ position: 'fixed', inset: 0, zIndex: 9 }} onClick={() => setIsMemberDropdownOpen(false)} />
                      <div style={{
                        position: 'absolute', top: '100%', left: 0, right: 0, marginTop: '4px',
                        background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '8px',
                        boxShadow: '0 8px 24px rgba(0,0,0,0.2)', zIndex: 10, overflow: 'hidden'
                      }}>
                        <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                          {allMembers.map(m => (
                            <div key={m.id} style={{
                              padding: '8px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                              cursor: 'pointer', background: newProjectMembers.includes(m.id) ? 'var(--bg-secondary)' : 'transparent'
                            }} className="hover-bg-secondary" onClick={() => {
                              setNewProjectMembers(prev => prev.includes(m.id) ? prev.filter(x => x !== m.id) : [...prev, m.id]);
                            }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'var(--purple-dim)', color: 'var(--purple-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 'bold' }}>{m.avatar}</span>
                                <span style={{ fontSize: '13px', color: 'var(--text-primary)' }}>{m.name}</span>
                              </div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                {newProjectMembers.includes(m.id) && <span style={{ color: 'var(--purple)', fontSize: '12px', fontWeight: 'bold' }}>✓</span>}
                                <button
                                  title="Remove member"
                                  type="button"
                                  onClick={(e) => handleRemoveMember(e, m.id)}
                                  style={{ background: 'var(--rose-dim, rgba(244, 63, 94, 0.1))', border: 'none', color: 'var(--rose)', cursor: 'pointer', width: '24px', height: '24px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0.8 }}
                                >
                                  <span style={{ fontSize: '12px', fontWeight: 'bold' }}>✕</span>
                                </button>
                              </div>
                            </div>
                          ))}
                          {allMembers.length === 0 && (
                            <div style={{ padding: '12px', textAlign: 'center', fontSize: '13px', color: 'var(--text-muted)' }}>
                              No members available.
                            </div>
                          )}
                        </div>
                        <div style={{ padding: '8px', borderTop: '1px solid var(--border)', display: 'flex', gap: '6px', background: 'var(--bg-secondary)' }}>
                          <input
                            style={{ width: '100%', padding: '6px 10px', borderRadius: '6px', border: '1px solid var(--border)', background: 'var(--bg-primary)', color: 'var(--text-primary)', fontSize: '12px', flex: 1 }}
                            placeholder="New Member..."
                            value={newMemberName}
                            onChange={e => setNewMemberName(e.target.value)}
                            onKeyDown={e => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                handleAddNewMember();
                              }
                            }}
                            onClick={e => e.stopPropagation()}
                          />
                          <button
                            type="button"
                            style={{ background: 'var(--text-primary)', color: 'var(--bg-card)', border: 'none', borderRadius: '6px', padding: '0 12px', cursor: 'pointer', fontWeight: 600, fontSize: '12px' }}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAddNewMember();
                            }}
                          >
                            Add
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '24px' }}>
              <button className="btn btn-ghost" onClick={() => setProjectModalOpen(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleCreateProject}>Create Project</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
