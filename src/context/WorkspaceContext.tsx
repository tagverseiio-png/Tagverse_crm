'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Member {
  id: string;
  name: string;
  role: 'Admin' | 'Member' | 'Guest';
  department: string;
  avatar: string;
  email: string;
}

export interface Project {
  id: string;
  name: string;
  status: 'Active' | 'Planning' | 'Archived';
  members: string[]; // Member IDs
  linkedDeal: string | null;
  progress: number;
  budget: {
    est: number;
    actual: number;
  };
  color: string;
}

export interface Task {
  id: string;
  title: string;
  projectId: string | null;
  owner: string; // Member ID
  status: 'To Do' | 'In Progress' | 'Done';
  priority: 'Low' | 'Normal' | 'High' | 'Urgent';
  due: string; // YYYY-MM-DD
  parentType: 'project' | 'deal' | 'contact' | null;
  tags: string[];
}

export interface CalendarEvent {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  attendees: string[]; // Member IDs
  linkedRecord: { type: 'project' | 'deal'; id: string } | null;
  color: string;
}

interface WorkspaceContextType {
  members: Member[];
  projects: Project[];
  tasks: Task[];
  events: CalendarEvent[];
  addTask: (task: Omit<Task, 'id'>) => void;
  updateTask: (task: Task) => void;
  deleteTask: (id: string) => void;
  toggleTaskDone: (id: string) => void;
  addProject: (project: Omit<Project, 'id' | 'progress'>) => void;
  addEvent: (event: Omit<CalendarEvent, 'id'>) => void;
  updateEvent: (event: CalendarEvent) => void;
  deleteEvent: (id: string) => void;
}

const WorkspaceContext = createContext<WorkspaceContextType | undefined>(undefined);

const initialMembers: Member[] = [
  { id: 'm1', name: 'Sarah Connor', role: 'Admin', department: 'Management', avatar: 'SC', email: 'sarah@acme.co' },
  { id: 'm2', name: 'John Doe', role: 'Member', department: 'Engineering', avatar: 'JD', email: 'john@acme.co' },
  { id: 'm3', name: 'Ellen Ripley', role: 'Member', department: 'Design', avatar: 'ER', email: 'ripley@acme.co' },
  { id: 'm4', name: 'Marcus Wright', role: 'Guest', department: 'Marketing', avatar: 'MW', email: 'marcus@acme.co' }
];

const initialProjects: Project[] = [
  { id: 'p1', name: 'Brand Identity Redesign', status: 'Active', members: ['m3', 'm4'], linkedDeal: 'deal-102', progress: 0, budget: { est: 25000, actual: 18500 }, color: '#6366f1' },
  { id: 'p2', name: 'API Integration Sprint', status: 'Active', members: ['m2'], linkedDeal: 'deal-105', progress: 0, budget: { est: 45000, actual: 32000 }, color: '#3b82f6' },
  { id: 'p3', name: 'SaaS Beta Launch Prep', status: 'Planning', members: ['m1', 'm2', 'm3'], linkedDeal: 'deal-109', progress: 0, budget: { est: 80000, actual: 5000 }, color: '#10b981' }
];

const initialTasks: Task[] = [
  { id: 't1', title: 'Complete high-fidelity dashboard wireframes', projectId: 'p1', owner: 'm3', status: 'In Progress', priority: 'High', due: '2026-06-28', parentType: 'project', tags: ['design', 'ui'] },
  { id: 't2', title: 'Refactor Auth middleware for token expiration', projectId: 'p2', owner: 'm2', status: 'To Do', priority: 'High', due: '2026-06-26', parentType: 'project', tags: ['backend', 'security'] },
  { id: 't3', title: 'Draft email onboarding sequence copy', projectId: 'p3', owner: 'm4', status: 'To Do', priority: 'Normal', due: '2026-06-30', parentType: 'project', tags: ['copywriting', 'marketing'] },
  { id: 't4', title: 'Conduct user research database schema validation', projectId: 'p2', owner: 'm2', status: 'Done', priority: 'Low', due: '2026-06-22', parentType: 'project', tags: ['database'] },
  { id: 't5', title: 'Write unit tests for Stripe payment webhooks', projectId: 'p2', owner: 'm2', status: 'In Progress', priority: 'Urgent', due: '2026-06-25', parentType: 'project', tags: ['stripe', 'testing'] },
  { id: 't6', title: 'Finalize brand color palette system styles', projectId: 'p1', owner: 'm3', status: 'Done', priority: 'Normal', due: '2026-06-20', parentType: 'project', tags: ['design', 'branding'] },
  { id: 't7', title: 'Define SLA protocols and response times documentation', projectId: null, owner: 'm1', status: 'To Do', priority: 'Normal', due: '2026-07-02', parentType: null, tags: ['docs'] },
  { id: 't8', title: 'Set up Google Analytics marketing dashboard pixels', projectId: 'p3', owner: 'm4', status: 'To Do', priority: 'Low', due: '2026-06-27', parentType: 'project', tags: ['analytics'] }
];

const initialEvents: CalendarEvent[] = [
  { id: 'e1', title: 'Sprint Planning Alignment', date: '2026-06-25', time: '10:00', attendees: ['m1', 'm2', 'm3'], linkedRecord: { type: 'project', id: 'p2' }, color: '#3b82f6' },
  { id: 'e2', title: 'UI Design Review', date: '2026-06-25', time: '14:30', attendees: ['m1', 'm3'], linkedRecord: { type: 'project', id: 'p1' }, color: '#6366f1' },
  { id: 'e3', title: 'Marketing Sync Meeting', date: '2026-06-26', time: '11:00', attendees: ['m1', 'm4'], linkedRecord: null, color: '#10b981' },
  { id: 'e4', title: 'Prisma DB Migration Rollout', date: '2026-06-22', time: '09:00', attendees: ['m2'], linkedRecord: { type: 'project', id: 'p2' }, color: '#3b82f6' },
  { id: 'e5', title: 'Client Feedback Call', date: '2026-06-29', time: '15:00', attendees: ['m1', 'm3'], linkedRecord: { type: 'project', id: 'p1' }, color: '#6366f1' }
];

export function WorkspaceProvider({ children }: { children: React.ReactNode }) {
  const [members] = useState<Member[]>(initialMembers);
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [events, setEvents] = useState<CalendarEvent[]>(initialEvents);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on client side
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedProjects = localStorage.getItem('ws-projects');
      const storedTasks = localStorage.getItem('ws-tasks');
      const storedEvents = localStorage.getItem('ws-events');

      if (storedProjects) setProjects(JSON.parse(storedProjects));
      if (storedTasks) setTasks(JSON.parse(storedTasks));
      if (storedEvents) setEvents(JSON.parse(storedEvents));
      setIsLoaded(true);
    }
  }, []);

  // Save to localStorage when state changes
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('ws-projects', JSON.stringify(projects));
    }
  }, [projects, isLoaded]);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('ws-tasks', JSON.stringify(tasks));
    }
  }, [tasks, isLoaded]);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('ws-events', JSON.stringify(events));
    }
  }, [events, isLoaded]);

  const addTask = (task: Omit<Task, 'id'>) => {
    const newTask: Task = {
      ...task,
      id: 't-' + Date.now(),
    };
    setTasks(prev => [newTask, ...prev]);
  };

  const updateTask = (updatedTask: Task) => {
    setTasks(prev => prev.map(t => (t.id === updatedTask.id ? updatedTask : t)));
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const toggleTaskDone = (id: string) => {
    setTasks(prev =>
      prev.map(t => {
        if (t.id === id) {
          return {
            ...t,
            status: t.status === 'Done' ? 'To Do' : 'Done',
          };
        }
        return t;
      })
    );
  };

  const addProject = (project: Omit<Project, 'id' | 'progress'>) => {
    const newProject: Project = {
      ...project,
      id: 'p-' + Date.now(),
      progress: 0,
    };
    setProjects(prev => [...prev, newProject]);
  };

  const addEvent = (event: Omit<CalendarEvent, 'id'>) => {
    const newEvent: CalendarEvent = {
      ...event,
      id: 'e-' + Date.now(),
    };
    setEvents(prev => [...prev, newEvent]);
  };

  const updateEvent = (updatedEvent: CalendarEvent) => {
    setEvents(prev => prev.map(e => (e.id === updatedEvent.id ? updatedEvent : e)));
  };

  const deleteEvent = (id: string) => {
    setEvents(prev => prev.filter(e => e.id !== id));
  };

  return (
    <WorkspaceContext.Provider
      value={{
        members,
        projects,
        tasks,
        events,
        addTask,
        updateTask,
        deleteTask,
        toggleTaskDone,
        addProject,
        addEvent,
        updateEvent,
        deleteEvent,
      }}
    >
      {children}
    </WorkspaceContext.Provider>
  );
}

export function useWorkspace() {
  const context = useContext(WorkspaceContext);
  if (!context) {
    throw new Error('useWorkspace must be used within a WorkspaceProvider');
  }
  return context;
}
