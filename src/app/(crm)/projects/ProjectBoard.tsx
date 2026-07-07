'use client';
import React, { useState } from 'react';
import { Project, Member, useWorkspace } from '@/context/WorkspaceContext';

const COLUMNS = ['Kick-off', 'Planning', 'Implementation', 'Review', 'Closing'] as const;
type ColumnType = typeof COLUMNS[number];

interface ProjectCardProps {
  project: Project;
  members: Member[];
  onClick: (project: Project) => void;
  isDragged: boolean;
  onDragStart: () => void;
  onDragEnd: () => void;
}

function ProjectCard({ project, members, onClick, isDragged, onDragStart, onDragEnd }: ProjectCardProps) {
  const assignees = members.filter(m => project.members.includes(m.id));

  // Progress ring
  const radius = 14;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (project.progress / 100) * circumference;

  return (
    <div
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      style={{ cursor: 'grab', opacity: isDragged ? 0.4 : 1 }}
      onClick={() => onClick(project)}
      className="project-card-item"
    >
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '8px', padding: '12px', marginBottom: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '18px' }}>{project.emoji || '📁'}</span>
            <h4 style={{ margin: 0, fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>{project.name}</h4>
          </div>
          <div style={{ position: 'relative', width: '32px', height: '32px' }}>
            <svg width="32" height="32" viewBox="0 0 32 32">
              <circle cx="16" cy="16" r={radius} fill="none" stroke="var(--border)" strokeWidth="3" />
              <circle
                cx="16" cy="16" r={radius}
                fill="none" stroke={project.color || 'var(--blue)'} strokeWidth="3"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                transform="rotate(-90 16 16)"
              />
            </svg>
            <span style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '9px', fontWeight: 700, color: 'var(--text-secondary)' }}>
              {project.progress}%
            </span>
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
            {project.endDate ? `Due ${project.endDate}` : 'No due date'}
          </div>
          <div style={{ display: 'flex', gap: '-4px' }}>
            {assignees.map((m, i) => (
              <div
                key={m.id}
                style={{
                  width: '24px', height: '24px', borderRadius: '50%', background: 'var(--blue-dim)', color: 'var(--blue)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 700,
                  border: '2px solid var(--bg-card)', marginLeft: i > 0 ? '-8px' : 0, zIndex: assignees.length - i
                }}
                title={m.name}
              >
                {m.avatar}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

interface DroppableColumnProps {
  id: ColumnType;
  title: string;
  projects: Project[];
  members: Member[];
  onProjectClick: (p: Project) => void;
  draggedProjectId: string | null;
  dragOverStatusId: ColumnType | null;
  setDraggedProjectId: (id: string | null) => void;
  setDragOverStatusId: (id: ColumnType | null) => void;
  handleDrop: (targetStatus: ColumnType) => void;
}

function DroppableColumn({
  id, title, projects, members, onProjectClick,
  draggedProjectId, dragOverStatusId, setDraggedProjectId, setDragOverStatusId, handleDrop
}: DroppableColumnProps) {
  const isDragOver = dragOverStatusId === id;

  return (
    <div
      style={{ flex: '0 0 280px', background: isDragOver ? 'var(--purple-dim)' : 'var(--bg-primary)', border: `1px solid ${isDragOver ? 'var(--purple)' : 'var(--border)'}`, borderRadius: '12px', padding: '12px', display: 'flex', flexDirection: 'column', transition: 'background 0.15s, border-color 0.15s' }}
      onDragOver={e => { e.preventDefault(); if (draggedProjectId) setDragOverStatusId(id); }}
      onDragLeave={() => { if (dragOverStatusId === id) setDragOverStatusId(null); }}
      onDrop={() => { if (draggedProjectId) handleDrop(id); }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', padding: '0 4px' }}>
        <h3 style={{ margin: 0, fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>{title}</h3>
        <span style={{ background: 'var(--purple-dim)', color: '#000', padding: '2px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: 600 }}>
          {projects.length}
        </span>
      </div>
      <div style={{ flex: 1, minHeight: '150px', display: 'flex', flexDirection: 'column' }}>
        {projects.map(project => (
          <ProjectCard
            key={project.id}
            project={project}
            members={members}
            onClick={onProjectClick}
            isDragged={draggedProjectId === project.id}
            onDragStart={() => setDraggedProjectId(project.id)}
            onDragEnd={() => { setDraggedProjectId(null); setDragOverStatusId(null); }}
          />
        ))}
      </div>
    </div>
  );
}

interface ProjectBoardProps {
  onProjectClick: (project: Project) => void;
}

export default function ProjectBoard({ onProjectClick }: ProjectBoardProps) {
  const { projects, members, updateProject } = useWorkspace();
  const [draggedProjectId, setDraggedProjectId] = useState<string | null>(null);
  const [dragOverStatusId, setDragOverStatusId] = useState<ColumnType | null>(null);

  const handleDrop = (targetStatus: ColumnType) => {
    setDragOverStatusId(null);
    if (!draggedProjectId) return;
    
    const activeProject = projects.find(p => p.id === draggedProjectId);
    setDraggedProjectId(null);
    
    if (!activeProject || activeProject.status === targetStatus) return;
    
    updateProject({ ...activeProject, status: targetStatus });
  };

  return (
    <div style={{ display: 'flex', gap: '16px', overflowX: 'auto', paddingBottom: '16px' }}>
      {COLUMNS.map(col => (
        <DroppableColumn
          key={col}
          id={col}
          title={col}
          projects={projects.filter(p => p.status === col)}
          members={members}
          onProjectClick={onProjectClick}
          draggedProjectId={draggedProjectId}
          dragOverStatusId={dragOverStatusId}
          setDraggedProjectId={setDraggedProjectId}
          setDragOverStatusId={setDragOverStatusId}
          handleDrop={handleDrop}
        />
      ))}
    </div>
  );
}
