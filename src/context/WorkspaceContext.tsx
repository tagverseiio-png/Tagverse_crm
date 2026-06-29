'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { workspaceInitialMembers, workspaceInitialProjects, workspaceInitialTasks, workspaceInitialEvents } from '@/lib/mockData';

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

const initialMembers: Member[] = workspaceInitialMembers as Member[];
const initialProjects: Project[] = workspaceInitialProjects as Project[];
const initialTasks: Task[] = workspaceInitialTasks as Task[];
const initialEvents: CalendarEvent[] = workspaceInitialEvents as CalendarEvent[];

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
