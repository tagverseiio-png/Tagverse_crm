'use client';
import React, { useState } from 'react';
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragOverEvent,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Project, Member, useWorkspace } from '@/context/WorkspaceContext';

const COLUMNS = ['Kick-off', 'Planning', 'Implementation', 'Review', 'Closing'] as const;
type ColumnType = typeof COLUMNS[number];

interface SortableProjectCardProps {
  project: Project;
  members: Member[];
  onClick: (project: Project) => void;
}

function SortableProjectCard({ project, members, onClick }: SortableProjectCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: project.id, data: { type: 'Project', project } });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  const assignees = members.filter(m => project.members.includes(m.id));

  // Progress ring
  const radius = 14;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (project.progress / 100) * circumference;

  return (
    <div
      ref={setNodeRef}
      style={{ ...style, cursor: 'grab' }}
      {...attributes}
      {...listeners}
      onClick={(e) => {
        // Prevent drag events from triggering click
        if (transform && (Math.abs(transform.x) > 5 || Math.abs(transform.y) > 5)) return;
        onClick(project);
      }}
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

function DroppableColumn({ id, title, projects, members, onProjectClick }: { id: ColumnType, title: string, projects: Project[], members: Member[], onProjectClick: (p: Project) => void }) {
  return (
    <div style={{ flex: '0 0 280px', background: 'var(--bg-primary)', border: '1px solid var(--border)', borderRadius: '12px', padding: '12px', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', padding: '0 4px' }}>
        <h3 style={{ margin: 0, fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>{title}</h3>
        <span style={{ background: 'var(--purple-dim)', color: '#000', padding: '2px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: 600 }}>
          {projects.length}
        </span>
      </div>
      <SortableContext id={id} items={projects.map(p => p.id)} strategy={verticalListSortingStrategy}>
        <div style={{ flex: 1, minHeight: '150px' }}>
          {projects.map(project => (
            <SortableProjectCard key={project.id} project={project} members={members} onClick={onProjectClick} />
          ))}
        </div>
      </SortableContext>
    </div>
  );
}

interface ProjectBoardProps {
  onProjectClick: (project: Project) => void;
}

export default function ProjectBoard({ onProjectClick }: ProjectBoardProps) {
  const { projects, members, updateProject } = useWorkspace();
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragOver = (event: DragOverEvent) => {
    // We don't need strict over logic here for column changing if DragEnd handles status
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveId(null);
    const { active, over } = event;
    if (!over) return;

    const activeProject = projects.find(p => p.id === active.id);
    if (!activeProject) return;

    let newStatus = activeProject.status;

    if (COLUMNS.includes(over.id as any)) {
      newStatus = over.id as any;
    } else {
      const overProject = projects.find(p => p.id === over.id);
      if (overProject) {
        newStatus = overProject.status;
      }
    }

    if (newStatus !== activeProject.status) {
      updateProject({ ...activeProject, status: newStatus as any });
    }
  };

  const activeProject = projects.find(p => p.id === activeId);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div style={{ display: 'flex', gap: '16px', overflowX: 'auto', paddingBottom: '16px' }}>
        {COLUMNS.map(col => (
          <DroppableColumn
            key={col}
            id={col}
            title={col}
            projects={projects.filter(p => p.status === col)}
            members={members}
            onProjectClick={onProjectClick}
          />
        ))}
      </div>
      <DragOverlay>
        {activeProject ? (
          <SortableProjectCard project={activeProject} members={members} onClick={() => {}} />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
