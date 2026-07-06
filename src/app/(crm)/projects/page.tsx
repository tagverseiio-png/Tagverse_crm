'use client';
import React, { useState } from 'react';
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

              <div>
                <label style={{ display: 'block', fontSize: '11px', color: 'var(--text-muted)', marginBottom: '4px' }}>Assign Members</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <button
                    className="btn btn-ghost"
                    style={{ justifyContent: 'center', width: '100%', border: '1px dashed var(--border)' }}
                    onClick={() => alert("Manual add member functionality to be implemented")}
                  >
                    ➕ Add Member Manually
                  </button>
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
