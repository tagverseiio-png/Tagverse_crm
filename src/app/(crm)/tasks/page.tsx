"use client";
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  Kanban, 
  List, 
  Table2, 
  Calendar as CalendarIcon, 
  Plus, 
  Search, 
  ArrowUpDown, 
  CheckSquare, 
  MessageSquare, 
  Paperclip, 
  Clock, 
  User, 
  FileText, 
  Check,
  AlertTriangle,
  Flame,
  Briefcase,
  X, 
  Edit2,
  CalendarDays,
  Sun,
  Moon,
  Trash2,
  CheckCircle2,
  BarChart3,
  TrendingUp,
  PieChart as PieIcon,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CornerDownRight,
  UserPlus,
  Info,
  Maximize2,
  Layers,
  Settings
} from 'lucide-react';

// ==========================================
// 1. TYPES & INTERFACES (TypeScript v5)
// ==========================================

export interface Assignee {
  id: string;
  name: string;
  avatar: string;
  email: string;
}

export interface SubTask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Comment {
  id: string;
  author: string;
  avatar: string;
  text: string;
  timestamp: string;
}

export interface DealReference {
  name: string;
  value: string;
  stage: string;
}

export interface Attachment {
  id: string;
  name: string;
  size: string;
  type: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: string; // 'To Do' | 'In Progress' | 'Review' | 'Done'
  assignee: Assignee;
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  dueDate: string; // YYYY-MM-DD
  subtasks: SubTask[];
  comments: Comment[];
  labels: string[];
  dealReference: DealReference | null;
  attachments: Attachment[];
}

// Custom Grid layout interface for Dashboard widgets
export interface DashboardWidget {
  id: string;
  title: string;
  w: number; // grid column span
  h: number; // height type
  type: 'overview' | 'status-chart' | 'priority-chart' | 'team-activity';
}

// ==========================================
// 2. CONSTANTS & INITIAL DATA
// ==========================================

const INITIAL_COLUMNS = ['To Do', 'In Progress', 'Review', 'Done'];

const INITIAL_MEMBERS: Assignee[] = [
  { id: 'm1', name: 'Sarah Connor', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150', email: 'sarah@acme-crm.com' },
  { id: 'm2', name: 'Marcus Wright', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', email: 'marcus@acme-crm.com' },
  { id: 'm3', name: 'John Doe', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150', email: 'john@acme-crm.com' },
  { id: 'm4', name: 'Elena Rostova', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150', email: 'elena@acme-crm.com' },
];

const PRESET_LABELS = ['Marketing', 'Development', 'Design', 'Legal', 'Enterprise', 'Security'];

const INITIAL_TASKS: Task[] = [
  {
    id: 'task-1',
    title: 'Migrate pipeline database to secure cloud hosting',
    description: 'We need to move the production client records into the isolated EU-West database shard for complete compliance. Make sure the testing pipeline is verified with green checks first.',
    status: 'To Do',
    assignee: INITIAL_MEMBERS[0],
    priority: 'High',
    dueDate: '2026-07-15',
    subtasks: [
      { id: 'sub-1', title: 'Verify SSL handshakes on target DB', completed: true },
      { id: 'sub-2', title: 'Export backup in secure binary form', completed: false },
      { id: 'sub-3', title: 'Run shadow sync dry run', completed: false }
    ],
    comments: [
      { id: 'c-1', author: 'Marcus Wright', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', text: 'Sarah, remember to double-check the IP whitelists.', timestamp: '2 hours ago' }
    ],
    labels: ['Development', 'Security'],
    dealReference: { name: 'Acme Corp Sharding Expansion', value: '$45,000', stage: 'Proposal Sent' },
    attachments: [
      { id: 'at-1', name: 'migration_specs_v3.pdf', size: '2.4 MB', type: 'PDF' }
    ]
  },
  {
    id: 'task-2',
    title: 'Draft quarterly contract update for legal alignment',
    description: 'Update the regional enterprise indemnity provisions to accommodate the latest regulatory mandates.',
    status: 'In Progress',
    assignee: INITIAL_MEMBERS[3],
    priority: 'Medium',
    dueDate: '2026-07-10',
    subtasks: [
      { id: 'sub-4', title: 'Consult regional compliance officers', completed: true },
      { id: 'sub-5', title: 'Compile revised indemnity phrasing', completed: true }
    ],
    comments: [
      { id: 'c-2', author: 'Elena Rostova', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150', text: 'Draft has been submitted to Legal team for first-pass review.', timestamp: 'Yesterday' }
    ],
    labels: ['Legal', 'Enterprise'],
    dealReference: { name: 'Initech Enterprise Licensing Upgrade', value: '$120,000', stage: 'Negotiation' },
    attachments: [
      { id: 'at-2', name: 'contract_draft_amended.docx', size: '1.1 MB', type: 'DOCX' }
    ]
  },
  {
    id: 'task-3',
    title: 'Rebrand product presentation pitch deck templates',
    description: 'Align color swatches, typography styles, and core branding elements to reflect the refined corporate violet design guidelines.',
    status: 'Review',
    assignee: INITIAL_MEMBERS[1],
    priority: 'Low',
    dueDate: '2026-07-09',
    subtasks: [
      { id: 'sub-6', title: 'Update presentation assets library', completed: true },
      { id: 'sub-7', title: 'Review with marketing director', completed: false }
    ],
    comments: [],
    labels: ['Marketing', 'Design'],
    dealReference: null,
    attachments: []
  },
  {
    id: 'task-4',
    title: 'Resolve memory leaks in WebSocket real-time updates',
    description: 'Track connections keeping the server sockets alive past client-side termination. Profiler indicates heavy memory retainment in message queues.',
    status: 'Done',
    assignee: INITIAL_MEMBERS[2],
    priority: 'Urgent',
    dueDate: '2026-07-05',
    subtasks: [
      { id: 'sub-8', title: 'Identify subscription cleanup leaks', completed: true },
      { id: 'sub-9', title: 'Apply patch to socket-manager component', completed: true },
      { id: 'sub-10', title: 'Benchmark memory profile over 24h run', completed: true }
    ],
    comments: [
      { id: 'c-3', author: 'Sarah Connor', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150', text: 'This looks highly stable in production now! Outstanding debug speed.', timestamp: '3 days ago' }
    ],
    labels: ['Development'],
    dealReference: null,
    attachments: []
  }
];

const INITIAL_WIDGETS: DashboardWidget[] = [
  { id: 'w-1', title: 'Overview KPI metrics', w: 12, h: 100, type: 'overview' },
  { id: 'w-2', title: 'Status Distribution Flow', w: 6, h: 260, type: 'status-chart' },
  { id: 'w-3', title: 'Priority Density Matrix', w: 6, h: 260, type: 'priority-chart' },
  { id: 'w-4', title: 'Workspace Core Resource Distribution', w: 12, h: 300, type: 'team-activity' }
];

// ==========================================
// 3. RUNTIME SCHEMA CHECKER (Zod Mimicry)
// ==========================================

const TaskZodSchema = {
  safeParse: (data: any) => {
    const errors: Record<string, string> = {};
    
    if (!data.title || typeof data.title !== 'string' || data.title.trim().length < 3) {
      errors.title = 'Title is required and must be at least 3 characters long.';
    }
    
    if (!data.dueDate || !/^\d{4}-\d{2}-\d{2}$/.test(data.dueDate)) {
      errors.dueDate = 'Due date must be a valid YYYY-MM-DD string.';
    }
    
    if (!data.priority || !['Low', 'Medium', 'High', 'Urgent'].includes(data.priority)) {
      errors.priority = 'Priority must be Low, Medium, High, or Urgent.';
    }

    if (!data.status || typeof data.status !== 'string') {
      errors.status = 'Status is required.';
    }

    return {
      success: Object.keys(errors).length === 0,
      error: Object.keys(errors).length > 0 ? { format: () => errors } : null,
      data: data as Partial<Task>
    };
  }
};

// ==========================================
// 4. MAIN CENTRALIZED STORE (Zustand Mock Hook)
// ==========================================

function useTaskStore() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [members, setMembers] = useState<Assignee[]>(INITIAL_MEMBERS);

  const [columns, setColumns] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('veloce_columns');
      return saved ? JSON.parse(saved) : INITIAL_COLUMNS;
    }
    return INITIAL_COLUMNS;
  });

  const [widgets, setWidgets] = useState<DashboardWidget[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('veloce_widgets');
      return saved ? JSON.parse(saved) : INITIAL_WIDGETS;
    }
    return INITIAL_WIDGETS;
  });

  const [darkMode, setDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('veloce_darkmode');
      return saved ? JSON.parse(saved) : true;
    }
    return true;
  });

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        try {
          const teamRes = await fetch('/api/team');
          const teamJson = await teamRes.json();
          if (teamJson.reps && teamJson.reps.length > 0) {
            const dbMembers = teamJson.reps.map((r: any) => ({
              id: r.id,
              name: r.name,
              avatar: r.color ? undefined : 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
              email: r.email,
            }));
            setMembers(dbMembers);
          }
        } catch(err) {
          console.error("Failed to fetch team members", err);
        }

        const res = await fetch('/api/tasks');
        const json = await res.json();
        if (json.data) {
          const mappedTasks = json.data.map((t: any) => ({
            id: t.id,
            title: t.title,
            description: t.description || '',
            status: t.status === 'todo' || t.status === 'to-do' ? 'To Do' : 
                    t.status === 'in-progress' ? 'In Progress' : 
                    t.status === 'review' ? 'Review' :
                    t.status === 'done' ? 'Done' : 
                    t.status,
            assignee: {
              id: t.assignedTo?.id || 'u-unknown',
              name: t.assignedTo?.name || 'Unassigned User',
              avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
              email: ''
            },
            priority: t.priority === 'low' ? 'Low' : 
                      t.priority === 'medium' ? 'Medium' : 
                      t.priority === 'high' ? 'High' : 
                      t.priority === 'urgent' ? 'Urgent' : 
                      t.priority,
            dueDate: t.dueDate ? t.dueDate.split('T')[0] : new Date().toISOString().split('T')[0],
            subtasks: [],
            comments: [],
            labels: [t.contextType || 'General'],
            dealReference: t.deal ? { name: t.deal.title, value: '-', stage: '-' } : null,
            attachments: []
          }));
          setTasks(mappedTasks);
        }
      } catch (err) {
        console.error('Failed to fetch tasks:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTasks();
  }, []);

  useEffect(() => {
    localStorage.setItem('veloce_columns', JSON.stringify(columns));
  }, [columns]);

  useEffect(() => {
    localStorage.setItem('veloce_widgets', JSON.stringify(widgets));
  }, [widgets]);

  useEffect(() => {
    localStorage.setItem('veloce_darkmode', JSON.stringify(darkMode));
  }, [darkMode]);

  return {
    tasks,
    isLoading,
    members,
    columns,
    widgets,
    darkMode,
    setDarkMode,
    
    addTask: async (newTask: Task) => {
      // Optimistic update
      setTasks(prev => [newTask, ...prev]);
      
      try {
        await fetch('/api/tasks', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: newTask.title,
            description: newTask.description,
            priority: newTask.priority,
            status: newTask.status,
            dueDate: newTask.dueDate ? new Date(newTask.dueDate).toISOString() : undefined,
            assignedToId: newTask.assignee?.id && newTask.assignee.id !== 'u-unknown' ? newTask.assignee.id : undefined,
          })
        });
      } catch (err) {
        console.error('Failed to save task:', err);
      }
    },
    
    updateTask: async (updatedTask: Task) => {
      // Optimistic update
      setTasks(prev => prev.map(t => t.id === updatedTask.id ? updatedTask : t));
      
      try {
        await fetch(`/api/tasks/${updatedTask.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: updatedTask.title,
            description: updatedTask.description,
            priority: updatedTask.priority,
            status: updatedTask.status,
            dueDate: updatedTask.dueDate ? new Date(updatedTask.dueDate).toISOString() : undefined,
            assignedToId: updatedTask.assignee?.id && updatedTask.assignee.id !== 'u-unknown' ? updatedTask.assignee.id : undefined,
          })
        });
      } catch (err) {
        console.error('Failed to update task:', err);
      }
    },
    
    deleteTask: async (taskId: string) => {
      // Optimistic update
      setTasks(prev => prev.filter(t => t.id !== taskId));
      
      try {
        await fetch(`/api/tasks/${taskId}`, {
          method: 'DELETE'
        });
      } catch (err) {
        console.error('Failed to delete task:', err);
      }
    },
    
    addColumn: (newCol: string) => {
      if (!columns.includes(newCol)) {
        setColumns(prev => [...prev, newCol]);
      }
    },
    
    deleteColumn: (colName: string) => {
      if (columns.length <= 1) return;
      const filtered = columns.filter(c => c !== colName);
      setColumns(filtered);
      setTasks(prev => prev.map(t => t.status === colName ? { ...t, status: filtered[0] } : t));
    },

    reorderWidgets: (draggedId: string, targetId: string) => {
      const draggedIndex = widgets.findIndex(w => w.id === draggedId);
      const targetIndex = widgets.findIndex(w => w.id === targetId);
      if (draggedIndex !== -1 && targetIndex !== -1) {
        const reordered = [...widgets];
        const [removed] = reordered.splice(draggedIndex, 1);
        reordered.splice(targetIndex, 0, removed);
        setWidgets(reordered);
      }
    }
  };
}

// ==========================================
// 5. THE APP COMPONENT (Entry Point)
// ==========================================

export default function App() {
  const store = useTaskStore();
  const { tasks, members, columns, widgets, darkMode, setDarkMode, addTask, updateTask, deleteTask, addColumn, deleteColumn, reorderWidgets } = store;

  // Navigation & View States
  const [view, setView] = useState<'Board' | 'List' | 'Table' | 'Calendar' | 'Dashboard'>('Board');
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [taskModalMode, setTaskModalMode] = useState<'view' | 'edit' | 'delete' | null>(null);
  const [bulkSelection, setBulkSelection] = useState<string[]>([]);
  
  // Filtering, Sorting & Search States
  const [searchQuery, setSearchQuery] = useState('');
  const [filterAssignee, setFilterAssignee] = useState('All');
  const [filterPriority, setFilterPriority] = useState('All');
  const [filterTag, setFilterTag] = useState('All');
  const [sortBy, setSortBy] = useState<'None' | 'dueDate' | 'priority' | 'title'>('None');

  // Creator state
  const [isNewTaskModalOpen, setIsNewTaskModalOpen] = useState(false);
  const [newTaskInitialDate, setNewTaskInitialDate] = useState<string | undefined>(undefined);
  const [newTaskInitialStatus, setNewTaskInitialStatus] = useState<string | undefined>(undefined);

  const activeTask = useMemo(() => {
    return tasks.find(t => t.id === selectedTaskId) || null;
  }, [tasks, selectedTaskId]);

  const handleOpenTaskDetails = (taskId: string) => {
    setSelectedTaskId(taskId);
    setTaskModalMode('view');
  };

  const handleCloseTaskDetails = () => {
    setTaskModalMode(null);
    setSelectedTaskId(null);
  };

  // Drag-and-drop state controllers (Kanban columns)
  const [activeDragOverColumn, setActiveDragOverColumn] = useState<string | null>(null);

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    e.dataTransfer.setData('text/plain', taskId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDropToColumn = (e: React.DragEvent, targetCol: string) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('text/plain');
    if (taskId) {
      const match = tasks.find(t => t.id === taskId);
      if (match) {
        updateTask({ ...match, status: targetCol });
      }
    }
    setActiveDragOverColumn(null);
  };

  // Bulk Status Move and Delete
  const handleBulkStatusChange = (status: string) => {
    bulkSelection.forEach(id => {
      const match = tasks.find(t => t.id === id);
      if (match) {
        updateTask({ ...match, status });
      }
    });
    setBulkSelection([]);
  };

  const handleBulkDelete = () => {
    bulkSelection.forEach(id => deleteTask(id));
    setBulkSelection([]);
  };

  // Memoized query filter processing
  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      const matchSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          task.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchAssignee = filterAssignee === 'All' || task.assignee.id === filterAssignee;
      const matchPriority = filterPriority === 'All' || task.priority === filterPriority;
      const matchTag = filterTag === 'All' || task.labels.includes(filterTag);
      
      return matchSearch && matchAssignee && matchPriority && matchTag;
    }).sort((a, b) => {
      if (sortBy === 'dueDate') {
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      }
      if (sortBy === 'priority') {
        const pWeights = { 'Urgent': 4, 'High': 3, 'Medium': 2, 'Low': 1 };
        return (pWeights[b.priority] || 0) - (pWeights[a.priority] || 0);
      }
      if (sortBy === 'title') {
        return a.title.localeCompare(b.title);
      }
      return 0;
    });
  }, [tasks, searchQuery, filterAssignee, filterPriority, filterTag, sortBy]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', width: '100vw', background: 'var(--bg-primary)', color: 'var(--text-primary)', fontFamily: 'Inter, sans-serif', overflow: 'hidden' }}>
      
      {/* Decorative Blur Backdrops */}
      
      

      {/* Main Structural Wrapper */}
      <div className="flex h-screen overflow-hidden relative z-10">
        
        {/* WORKSPACE CENTRAL WORK AREA */}
        <main className="flex-1 flex flex-col h-full overflow-hidden relative">
          
          
          {/* COMBINED TOOLBAR & VIEW CONTROLS */}
          <div style={{ padding: '16px 24px', display: 'flex', flexDirection: 'column', gap: 16, background: 'var(--bg-primary)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
              {/* View Switchers */}
              <div style={{ display: 'flex', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8, overflow: 'hidden' }}>
                {[
                  { id: 'Board', label: 'Kanban', icon: Kanban },
                  { id: 'Dashboard', label: 'Dashboard', icon: BarChart3 },
                  { id: 'List', label: 'List', icon: List },
                  { id: 'Table', label: 'Table', icon: Table2 },
                  { id: 'Calendar', label: 'Calendar', icon: CalendarIcon }
                ].map(v => {
                  const Icon = v.icon;
                  return (
                    <button
                      key={v.id}
                      onClick={() => setView(v.id as any)}
                      style={{ 
                        padding: '7px 16px', fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6,
                        background: view === v.id ? 'var(--purple-dim)' : 'transparent', 
                        color: view === v.id ? 'var(--brand-accent)' : 'var(--text-muted)', 
                        border: 'none', cursor: 'pointer', borderRight: '1px solid var(--border)', 
                        fontFamily: 'Inter, sans-serif'
                      }}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="hidden sm:inline">{v.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                {/* Search Bar */}
                <div style={{ position: 'relative', width: '240px' }}>
                  <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search tasks..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{ width: '100%', padding: '8px 12px 8px 36px', fontSize: 13, background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text-primary)', outline: 'none' }}
                  />
                </div>
                <button
                  onClick={() => {
                    setNewTaskInitialDate(undefined);
                    setNewTaskInitialStatus(undefined);
                    setIsNewTaskModalOpen(true);
                  }}
                  className="btn btn-primary"
                  style={{ fontSize: 13, padding: '8px 16px' }}
                >
                  <Plus className="w-4 h-4" /> New Task
                </button>
              </div>
            </div>

            {/* Filters */}
            {view !== 'Dashboard' && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Owner</span>
                  <select value={filterAssignee} onChange={(e) => setFilterAssignee(e.target.value)} style={{ padding: '6px 12px', fontSize: 13, background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 6, color: 'var(--text-primary)', outline: 'none' }}>
                    <option value="All">All Members</option>
                    {members.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                  </select>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Priority</span>
                  <select value={filterPriority} onChange={(e) => setFilterPriority(e.target.value)} style={{ padding: '6px 12px', fontSize: 13, background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 6, color: 'var(--text-primary)', outline: 'none' }}>
                    <option value="All">All Priorities</option>
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Urgent">Urgent</option>
                  </select>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Tag</span>
                  <select value={filterTag} onChange={(e) => setFilterTag(e.target.value)} style={{ padding: '6px 12px', fontSize: 13, background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 6, color: 'var(--text-primary)', outline: 'none' }}>
                    <option value="All">All Tags</option>
                    {PRESET_LABELS.map(tag => <option key={tag} value={tag}>{tag}</option>)}
                  </select>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginLeft: 'auto' }}>
                  <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}><ArrowUpDown className="w-3 h-3 inline mr-1"/> Sort</span>
                  <select value={sortBy} onChange={(e) => setSortBy(e.target.value as any)} style={{ padding: '6px 12px', fontSize: 13, background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 6, color: 'var(--text-primary)', outline: 'none' }}>
                    <option value="None">None</option>
                    <option value="dueDate">Due Date</option>
                    <option value="priority">Priority</option>
                    <option value="title">Title</option>
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* BULK ACTIONS STRIP */}
          {bulkSelection.length > 0 && (view === 'List' || view === 'Table') && (
            <div className="bg-violet-600/10 border-b border-violet-500/20 px-10 py-8 flex items-center justify-between transition-all">
              <div className="flex items-center gap-3 text-lg font-bold text-violet-400">
                <CheckCircle2 className="w-7 h-7 text-violet-500 animate-pulse" />
                <span>{bulkSelection.length} tasks selected</span>
              </div>
              <div className="flex items-center gap-3">
                <select
                  onChange={(e) => handleBulkStatusChange(e.target.value)}
                  defaultValue=""
                  className="px-4 py-3 text-base rounded-lg border border-violet-500/30 bg-slate-900 text-slate-300 outline-none"
                >
                  <option value="" disabled>Move status to...</option>
                  {columns.map(col => (
                    <option key={col} value={col}>{col}</option>
                  ))}
                </select>
                <button
                  onClick={handleBulkDelete}
                  className="flex items-center gap-1 px-5 py-3 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-base font-bold"
                >
                  <Trash2 className="w-5 h-5" />
                  <span>Delete</span>
                </button>
                <button
                  onClick={() => setBulkSelection([])}
                  className="p-1 text-slate-400 hover:text-slate-200 ml-1"
                  title="Clear Selection"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>
          )}

          {/* DYNAMIC VIEWS CONTAINER */}
          <style>{`
            .hide-scroll::-webkit-scrollbar { display: none; }
            .hide-scroll { scrollbar-width: none; ms-overflow-style: none; }
          `}</style>
          <div className="flex-1 overflow-auto p-6 relative hide-scroll">
            {view === 'Board' && (
              <BoardView 
                columns={columns}
                tasks={filteredTasks}
                darkMode={darkMode}
                activeDragOverColumn={activeDragOverColumn}
                setActiveDragOverColumn={setActiveDragOverColumn}
                handleDragStart={handleDragStart}
                handleDropToColumn={handleDropToColumn}
                handleOpenTaskDetails={handleOpenTaskDetails}
                deleteColumn={deleteColumn}
                addColumn={addColumn}
                onOpenNewTaskModal={(status) => {
                  setNewTaskInitialStatus(status);
                  setNewTaskInitialDate(undefined);
                  setIsNewTaskModalOpen(true);
                }}
              />
            )}

            {view === 'Dashboard' && (
              <DashboardView 
                tasks={tasks}
                widgets={widgets}
                darkMode={darkMode}
                members={members.length > 0 ? members : INITIAL_MEMBERS}
                reorderWidgets={reorderWidgets}
              />
            )}

            {view === 'List' && (
              <ListView 
                tasks={filteredTasks}
                darkMode={darkMode}
                bulkSelection={bulkSelection}
                setBulkSelection={setBulkSelection}
                handleOpenTaskDetails={handleOpenTaskDetails}
                handleDeleteTask={deleteTask}
                columns={columns}
                handleUpdateTask={updateTask}
              />
            )}

            {view === 'Table' && (
              <TableView 
                tasks={filteredTasks}
                darkMode={darkMode}
                bulkSelection={bulkSelection}
                setBulkSelection={setBulkSelection}
                handleOpenTaskDetails={handleOpenTaskDetails}
                handleDeleteTask={deleteTask}
                columns={columns}
                handleUpdateTask={updateTask}
              />
            )}

            {view === 'Calendar' && (
              <CalendarView 
                tasks={filteredTasks}
                darkMode={darkMode}
                handleOpenTaskDetails={handleOpenTaskDetails}
                onOpenNewTaskModal={(dateStr) => {
                  setNewTaskInitialDate(dateStr);
                  setIsNewTaskModalOpen(true);
                }}
              />
            )}
          </div>

        </main>



      </div>

      {/* NEW TASK CREATION / EDIT MODAL */}
      {(isNewTaskModalOpen || taskModalMode === 'edit') && (
        <NewTaskModal 
          initialDueDate={newTaskInitialDate}
          initialStatus={newTaskInitialStatus}
          taskToEdit={taskModalMode === 'edit' && activeTask ? activeTask : undefined}
          onClose={() => {
            if (taskModalMode === 'edit') setTaskModalMode('view');
            else setIsNewTaskModalOpen(false);
          }}
          onSubmit={(validatedData) => {
            if (taskModalMode === 'edit' && activeTask) {
              updateTask({ ...activeTask, ...validatedData } as Task);
              setTaskModalMode('view');
            } else {
              const finalTask: Task = {
                id: `task-${Date.now()}`,
                title: validatedData.title || 'Untitled Action Item',
                description: validatedData.description || '',
                status: validatedData.status || columns[0],
                assignee: validatedData.assignee || members[0] || INITIAL_MEMBERS[0],
                priority: validatedData.priority as any || 'Medium',
                dueDate: validatedData.dueDate || new Date().toISOString().split('T')[0],
                subtasks: [],
                comments: [],
                labels: validatedData.labels || [],
                dealReference: null,
                attachments: []
              };
              addTask(finalTask);
              setIsNewTaskModalOpen(false);
            }
          }}
          columns={columns}
          members={members.length > 0 ? members : INITIAL_MEMBERS}
          darkMode={darkMode}
        />
      )}

      {/* TASK DETAILS VIEW MODAL */}
      {taskModalMode === 'view' && activeTask && (
        <TaskViewModal
          task={activeTask}
          onClose={handleCloseTaskDetails}
          onEdit={() => setTaskModalMode('edit')}
          onDelete={() => setTaskModalMode('delete')}
          darkMode={darkMode}
        />
      )}

      {/* DELETE CONFIRM MODAL */}
      {taskModalMode === 'delete' && activeTask && (
        <DeleteConfirmModal
          taskTitle={activeTask.title}
          onClose={() => setTaskModalMode('view')}
          onConfirm={() => {
            deleteTask(activeTask.id);
            handleCloseTaskDetails();
          }}
          darkMode={darkMode}
        />
      )}

    </div>
  );
}

// ==========================================
// 6. KANBAN BOARD VIEW SUB-COMPONENT
// ==========================================

interface BoardViewProps {
  columns: string[];
  tasks: Task[];
  darkMode: boolean;
  activeDragOverColumn: string | null;
  setActiveDragOverColumn: (col: string | null) => void;
  handleDragStart: (e: React.DragEvent, id: string) => void;
  handleDropToColumn: (e: React.DragEvent, targetCol: string) => void;
  handleOpenTaskDetails: (id: string) => void;
  deleteColumn: (name: string) => void;
  addColumn: (name: string) => void;
  onOpenNewTaskModal?: (status: string) => void;
}

function BoardView({
  columns,
  tasks,
  darkMode,
  activeDragOverColumn,
  setActiveDragOverColumn,
  handleDragStart,
  handleDropToColumn,
  handleOpenTaskDetails,
  deleteColumn,
  addColumn,
  onOpenNewTaskModal
}: BoardViewProps) {
  const STAGE_COLOR_PALETTE = [
    { color: 'new', headerColor: '#3b82f6' },
    { color: 'engaged', headerColor: '#7c5cbf' },
    { color: 'qualified', headerColor: '#f59e0b' },
    { color: 'proposal', headerColor: '#6366f1' },
    { color: 'negotiation', headerColor: '#f97316' },
    { color: 'won', headerColor: '#10b981' },
    { color: 'lost', headerColor: '#f43f5e' },
  ];

  const [addingColumn, setAddingColumn] = useState(false);
  const [newColumnName, setNewColumnName] = useState('');

  return (
    <>
      <style>{`
        .hide-scroll::-webkit-scrollbar { display: none; }
      `}</style>
      <div className="hide-scroll" style={{ display: 'flex', gap: 16, overflowX: 'auto', paddingBottom: 8, height: '100%', alignItems: 'stretch', scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
      {columns.map((col, index) => {
        const columnTasks = tasks.filter(t => t.status === col);
        const palette = STAGE_COLOR_PALETTE[index % STAGE_COLOR_PALETTE.length];
        const isDragOver = activeDragOverColumn === col;

        return (
          <div
            key={col}
            style={{ width: 300, flexShrink: 0, display: 'flex', flexDirection: 'column' }}
            onDragOver={(e) => { e.preventDefault(); setActiveDragOverColumn(col); }}
            onDragLeave={() => { if(activeDragOverColumn === col) setActiveDragOverColumn(null); }}
            onDrop={(e) => handleDropToColumn(e, col)}
          >
            {/* Column Header */}
            <div style={{ 
              background: 'var(--bg-card)', 
              borderRight: '1px solid var(--border)', 
              borderBottom: '1px solid var(--border)', 
              borderLeft: '1px solid var(--border)', 
              borderTop: `3px solid ${palette.headerColor}`, 
              borderRadius: '10px 10px 0 0', 
              padding: '12px 16px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between'
            }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)' }}>{col}</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span className={`pipeline-col-count ${palette.color}`} style={{ fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 8 }}>{columnTasks.length}</span>
                <button onClick={() => deleteColumn(col)} disabled={columns.length <= 1} style={{ background: 'transparent', border: 'none', cursor: columns.length <= 1 ? 'not-allowed' : 'pointer', color: columns.length <= 1 ? 'var(--text-muted)' : 'var(--rose)', fontSize: 12 }}>✕</button>
              </div>
            </div>

            {/* Cards */}
            <div style={{
              background: isDragOver ? 'var(--purple-dim)' : 'var(--bg-glass)',
              borderRight: `1px solid ${isDragOver ? 'var(--purple)' : 'var(--border)'}`,
              borderBottom: `1px solid ${isDragOver ? 'var(--purple)' : 'var(--border)'}`,
              borderLeft: `1px solid ${isDragOver ? 'var(--purple)' : 'var(--border)'}`,
              borderTop: 'none', 
              borderRadius: '0 0 10px 10px', 
              padding: '12px',
              display: 'flex', 
              flexDirection: 'column', 
              gap: 12, 
              minHeight: 120, 
              transition: 'background 0.15s, border-color 0.15s',
              flex: 1,
              overflowY: 'auto'
            }}>
              {columnTasks.map(task => (
                <div
                  key={task.id}
                  className="deal-card"
                  draggable
                  onDragStart={(e) => handleDragStart(e, task.id)}
                  onClick={() => handleOpenTaskDetails(task.id)}
                  style={{ position: 'relative', padding: '14px', cursor: 'grab' }}
                >
                  <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4 }}>{task.title}</div>
                  {task.description && <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 8, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{task.description}</div>}
                  
                  {task.labels && task.labels.length > 0 && (
                    <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginBottom: 12 }}>
                      {task.labels.map(l => (
                        <span key={l} style={{ fontSize: 10, padding: '2px 6px', borderRadius: 4, background: 'var(--bg-primary)', border: '1px solid var(--border)', color: 'var(--text-muted)' }}>{l}</span>
                      ))}
                    </div>
                  )}

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--border)', paddingTop: 8 }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: task.priority === 'Urgent' ? 'var(--rose)' : task.priority === 'High' ? 'var(--amber)' : 'var(--emerald)' }}>{task.priority}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{task.dueDate}</span>
                      {task.assignee && (
                        <img src={task.assignee.avatar} alt={task.assignee.name} style={{ width: 24, height: 24, borderRadius: '50%', objectFit: 'cover' }} />
                      )}
                    </div>
                  </div>
                </div>
              ))}
              
              <button onClick={() => onOpenNewTaskModal && onOpenNewTaskModal(col)} style={{ border: '1px dashed var(--border)', borderRadius: 8, padding: '8px', fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', background: 'transparent', cursor: 'pointer', transition: 'all 0.2s', marginTop: 'auto' }}>+ Add Task</button>
            </div>
          </div>
        );
      })}

      {/* Add Column */}
      <div style={{ width: 220, flexShrink: 0 }}>
        {addingColumn ? (
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 10, padding: 10, display: 'flex', flexDirection: 'column', gap: 8 }}>
            <input
              autoFocus
              value={newColumnName}
              onChange={e => setNewColumnName(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') { addColumn(newColumnName); setAddingColumn(false); setNewColumnName(''); }
                if (e.key === 'Escape') { setAddingColumn(false); setNewColumnName(''); }
              }}
              placeholder="Column name..."
              style={{
                width: '100%', boxSizing: 'border-box', padding: '8px 10px',
                background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 8,
                color: 'var(--text-primary)', fontSize: 13, outline: 'none', fontFamily: 'Inter, sans-serif',
              }}
            />
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={() => { addColumn(newColumnName); setAddingColumn(false); setNewColumnName(''); }} className="btn btn-primary" style={{ padding: '6px 14px', fontSize: 12 }}>Add</button>
              <button onClick={() => { setAddingColumn(false); setNewColumnName(''); }} className="btn btn-ghost" style={{ padding: '6px 14px', fontSize: 12 }}>Cancel</button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setAddingColumn(true)}
            style={{
              width: '100%', height: 52, border: '1px dashed var(--border)', borderRadius: 10,
              background: 'transparent', color: 'var(--text-muted)', cursor: 'pointer',
              fontSize: 13, fontWeight: 600, fontFamily: 'Inter, sans-serif',
            }}
          >+ Add Column</button>
        )}
      </div>
    </div>
    </>
  );
}

// ==========================================
// 7. COMPACT LIST VIEW SUB-COMPONENT
// ==========================================

interface ListViewProps {
  tasks: Task[];
  darkMode: boolean;
  bulkSelection: string[];
  setBulkSelection: React.Dispatch<React.SetStateAction<string[]>>;
  handleOpenTaskDetails: (id: string) => void;
  handleDeleteTask: (id: string) => void;
  columns: string[];
  handleUpdateTask: (task: Task) => void;
}

function ListView({
  tasks,
  darkMode,
  bulkSelection,
  setBulkSelection,
  handleOpenTaskDetails,
  handleDeleteTask,
  columns,
  handleUpdateTask
}: ListViewProps) {
  const toggleSelectAll = () => {
    if (bulkSelection.length === tasks.length) {
      setBulkSelection([]);
    } else {
      setBulkSelection(tasks.map(t => t.id));
    }
  };

  const toggleSelectOne = (taskId: string) => {
    if (bulkSelection.includes(taskId)) {
      setBulkSelection(prev => prev.filter(id => id !== taskId));
    } else {
      setBulkSelection(prev => [...prev, taskId]);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, minWidth: 800, padding: '16px 0' }}>
      {/* Header bar layout */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        padding: '0 20px', 
        fontSize: 13, 
        fontWeight: 700, 
        color: 'var(--text-muted)',
        marginBottom: 8
      }}>
        <div style={{ width: 40, display: 'flex', justifyContent: 'center' }}>
          <input
            type="checkbox"
            checked={tasks.length > 0 && bulkSelection.length === tasks.length}
            onChange={toggleSelectAll}
            style={{ width: 18, height: 18, cursor: 'pointer', accentColor: 'var(--brand-accent)' }}
          />
        </div>
        <div style={{ flex: 1, paddingLeft: 12 }}>Task Details</div>
        <div style={{ width: 140 }}>Status</div>
        <div style={{ width: 120 }}>Priority</div>
        <div style={{ width: 140 }}>Due Date</div>
        <div style={{ width: 140 }}>Assignee</div>
        <div style={{ width: 60, textAlign: 'center' }}>Action</div>
      </div>

      {/* Task Rows as Cards */}
      {tasks.map(task => {
        const isSelected = bulkSelection.includes(task.id);
        return (
          <div
            key={task.id}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              padding: '18px 22px', 
              background: isSelected ? 'var(--bg-secondary)' : 'var(--bg-card)', 
              border: `1px solid ${isSelected ? 'var(--brand-accent)' : 'var(--border)'}`, 
              borderRadius: 12,
              boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
              transition: 'all 0.2s ease',
              cursor: 'default'
            }}
            onMouseOver={(e) => {
              if(!isSelected) e.currentTarget.style.borderColor = 'var(--border-bright)';
            }}
            onMouseOut={(e) => {
              if(!isSelected) e.currentTarget.style.borderColor = 'var(--border)';
            }}
          >
            <div style={{ width: 40, display: 'flex', justifyContent: 'center' }}>
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => toggleSelectOne(task.id)}
                style={{ width: 18, height: 18, cursor: 'pointer', accentColor: 'var(--brand-accent)' }}
              />
            </div>

            {/* Title / Labels */}
            <div style={{ flex: 1, paddingLeft: 12, display: 'flex', alignItems: 'center', gap: 16, minWidth: 0 }}>
              <button
                onClick={() => handleOpenTaskDetails(task.id)}
                style={{ 
                  textAlign: 'left', 
                  fontWeight: 700, 
                  fontSize: 13, 
                  color: 'var(--text-primary)', 
                  background: 'none', 
                  border: 'none', 
                  cursor: 'pointer',
                  padding: 0,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}
                onMouseOver={(e) => e.currentTarget.style.color = 'var(--brand-accent)'}
                onMouseOut={(e) => e.currentTarget.style.color = 'var(--text-primary)'}
              >
                {task.title}
              </button>
              <div style={{ display: 'flex', gap: 8 }}>
                {task.labels.map(lbl => (
                  <span key={lbl} style={{ 
                    fontSize: 10, 
                    fontWeight: 800, 
                    textTransform: 'uppercase', 
                    padding: '4px 8px', 
                    borderRadius: 6, 
                    background: 'var(--purple-dim)', 
                    color: 'var(--brand-accent)',
                    whiteSpace: 'nowrap'
                  }}>
                    {lbl}
                  </span>
                ))}
              </div>
            </div>

            {/* Status Select */}
            <div style={{ width: 140, paddingRight: 16 }}>
              <select
                value={task.status}
                onChange={(e) => handleUpdateTask({ ...task, status: e.target.value })}
                style={{ 
                  width: '100%', 
                  padding: '10px 14px', 
                  fontSize: 13, 
                  fontWeight: 600,
                  borderRadius: 8, 
                  border: '1px solid var(--border)', 
                  background: 'var(--bg-primary)', 
                  color: 'var(--text-primary)',
                  cursor: 'pointer',
                  outline: 'none'
                }}
              >
                {columns.map(col => (
                  <option key={col} value={col}>{col}</option>
                ))}
              </select>
            </div>

            {/* Priority Select */}
            <div style={{ width: 120, paddingRight: 16 }}>
              <select
                value={task.priority}
                onChange={(e) => handleUpdateTask({ ...task, priority: e.target.value as any })}
                style={{ 
                  width: '100%', 
                  padding: '10px 14px', 
                  fontSize: 13, 
                  fontWeight: 600,
                  borderRadius: 8, 
                  border: '1px solid var(--border)', 
                  background: 'var(--bg-primary)', 
                  color: 'var(--text-primary)',
                  cursor: 'pointer',
                  outline: 'none'
                }}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Urgent">Urgent</option>
              </select>
            </div>

            {/* Due Date */}
            <div style={{ width: 140, paddingRight: 16 }}>
              <input
                type="date"
                value={task.dueDate}
                onChange={(e) => handleUpdateTask({ ...task, dueDate: e.target.value })}
                style={{ 
                  width: '100%', 
                  padding: '10px 14px', 
                  fontSize: 13, 
                  fontWeight: 600,
                  borderRadius: 8, 
                  border: '1px solid var(--border)', 
                  background: 'var(--bg-primary)', 
                  color: 'var(--text-primary)',
                  cursor: 'pointer',
                  outline: 'none'
                }}
              />
            </div>

            {/* Assignee */}
            <div style={{ width: 140, display: 'flex', alignItems: 'center', gap: 10 }}>
              <img src={task.assignee.avatar} alt={task.assignee.name} style={{ width: 30, height: 30, borderRadius: '50%', objectFit: 'cover' }} />
              <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {task.assignee.name.split(' ')[0]}
              </span>
            </div>

            {/* Action */}
            <div style={{ width: 60, display: 'flex', justifyContent: 'center' }}>
              <button
                onClick={() => handleDeleteTask(task.id)}
                style={{ 
                  padding: 8, 
                  borderRadius: 8, 
                  background: 'transparent', 
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s'
                }}
                onMouseOver={(e) => { e.currentTarget.style.color = 'var(--rose)'; e.currentTarget.style.background = 'var(--rose-dim)'; }}
                onMouseOut={(e) => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.background = 'transparent'; }}
                title="Remove task"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        );
      })}

      {tasks.length === 0 && (
        <div style={{ padding: '60px 0', textAlign: 'center', color: 'var(--text-muted)', fontSize: 13 }}>
          No records matching selected criteria exist.
        </div>
      )}
    </div>
  );
}

// ==========================================
// 8. NOTION-STYLE GRID TABLE VIEW SUB-COMPONENT
// ==========================================

interface TableViewProps extends ListViewProps {}

function TableView({
  tasks,
  darkMode,
  bulkSelection,
  setBulkSelection,
  handleOpenTaskDetails,
  handleDeleteTask,
  columns,
  handleUpdateTask
}: TableViewProps) {
  const toggleSelectAll = () => {
    if (bulkSelection.length === tasks.length) {
      setBulkSelection([]);
    } else {
      setBulkSelection(tasks.map(t => t.id));
    }
  };

  const toggleSelectOne = (taskId: string) => {
    if (bulkSelection.includes(taskId)) {
      setBulkSelection(prev => prev.filter(id => id !== taskId));
    } else {
      setBulkSelection(prev => [...prev, taskId]);
    }
  };

  return (
    <div style={{ 
      background: 'var(--bg-card)', 
      border: '1px solid var(--border)', 
      borderRadius: 16, 
      overflow: 'hidden', 
      minWidth: 800, 
      boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
      marginTop: 16
    }}>
      <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ 
            borderBottom: '1px solid var(--border)', 
            fontSize: 13, 
            fontWeight: 800, 
            textTransform: 'uppercase', 
            letterSpacing: '0.5px', 
            color: 'var(--text-muted)',
            background: 'var(--bg-secondary)'
          }}>
            <th style={{ padding: '24px 28px', width: 48, textAlign: 'center' }}>
              <input
                type="checkbox"
                checked={tasks.length > 0 && bulkSelection.length === tasks.length}
                onChange={toggleSelectAll}
                style={{ width: 20, height: 20, cursor: 'pointer', accentColor: 'var(--brand-accent)' }}
              />
            </th>
            <th style={{ padding: '24px 28px' }}>Title / Core Goal Description</th>
            <th style={{ padding: '24px 28px', width: 140 }}>Status</th>
            <th style={{ padding: '24px 28px', width: 130 }}>Priority</th>
            <th style={{ padding: '24px 28px', width: 150 }}>Due Date</th>
            <th style={{ padding: '24px 28px', width: 150 }}>Lead Owner</th>
            <th style={{ padding: '24px 28px', width: 120 }}>Deal Context</th>
            <th style={{ padding: '24px 28px', width: 60, textAlign: 'center' }}>Action</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map(task => {
            const isSelected = bulkSelection.includes(task.id);
            return (
              <tr 
                key={task.id}
                style={{ 
                  borderBottom: '1px solid var(--border)', 
                  background: isSelected ? 'var(--bg-secondary)' : 'transparent',
                  transition: 'background 0.2s',
                  fontSize: 15
                }}
                onMouseOver={(e) => {
                  if(!isSelected) e.currentTarget.style.background = 'var(--bg-glass)';
                }}
                onMouseOut={(e) => {
                  if(!isSelected) e.currentTarget.style.background = 'transparent';
                }}
              >
                <td style={{ padding: '24px 28px', textAlign: 'center' }}>
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => toggleSelectOne(task.id)}
                    style={{ width: 20, height: 20, cursor: 'pointer', accentColor: 'var(--brand-accent)' }}
                  />
                </td>
                <td style={{ padding: '24px 28px', fontWeight: 600 }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <button
                      onClick={() => handleOpenTaskDetails(task.id)}
                      style={{ 
                        textAlign: 'left', 
                        fontWeight: 700, 
                        fontSize: 16, 
                        color: 'var(--text-primary)', 
                        background: 'none', 
                        border: 'none', 
                        cursor: 'pointer', 
                        padding: 0,
                        transition: 'color 0.2s'
                      }}
                      onMouseOver={(e) => e.currentTarget.style.color = 'var(--brand-accent)'}
                      onMouseOut={(e) => e.currentTarget.style.color = 'var(--text-primary)'}
                    >
                      {task.title}
                    </button>
                    <span style={{ fontSize: 13, color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 300 }}>
                      {task.description || 'No additional summary details entered.'}
                    </span>
                  </div>
                </td>
                <td style={{ padding: '24px 28px' }}>
                  <select
                    value={task.status}
                    onChange={(e) => handleUpdateTask({ ...task, status: e.target.value })}
                    style={{ 
                      width: '100%', 
                      padding: '12px 16px', 
                      fontSize: 15, 
                      fontWeight: 600,
                      borderRadius: 8, 
                      border: '1px solid var(--border)', 
                      background: 'var(--bg-primary)', 
                      color: 'var(--text-primary)',
                      cursor: 'pointer',
                      outline: 'none'
                    }}
                  >
                    {columns.map(col => (
                      <option key={col} value={col}>{col}</option>
                    ))}
                  </select>
                </td>
                <td style={{ padding: '24px 28px' }}>
                  <select
                    value={task.priority}
                    onChange={(e) => handleUpdateTask({ ...task, priority: e.target.value as any })}
                    style={{ 
                      width: '100%', 
                      padding: '12px 16px', 
                      fontSize: 15, 
                      fontWeight: 600,
                      borderRadius: 8, 
                      border: '1px solid var(--border)', 
                      background: 'var(--bg-primary)', 
                      color: 'var(--text-primary)',
                      cursor: 'pointer',
                      outline: 'none'
                    }}
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Urgent">Urgent</option>
                  </select>
                </td>
                <td style={{ padding: '24px 28px' }}>
                  <input
                    type="date"
                    value={task.dueDate}
                    onChange={(e) => handleUpdateTask({ ...task, dueDate: e.target.value })}
                    style={{ 
                      width: '100%', 
                      padding: '12px 16px', 
                      fontSize: 15, 
                      fontWeight: 600,
                      borderRadius: 8, 
                      border: '1px solid var(--border)', 
                      background: 'var(--bg-primary)', 
                      color: 'var(--text-primary)',
                      cursor: 'pointer',
                      outline: 'none'
                    }}
                  />
                </td>
                <td style={{ padding: '24px 28px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <img src={task.assignee.avatar} alt={task.assignee.name} style={{ width: 28, height: 28, borderRadius: '50%', objectFit: 'cover' }} />
                    <span style={{ fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 100 }}>
                      {task.assignee.name.split(' ')[0]}
                    </span>
                  </div>
                </td>
                <td style={{ padding: '24px 28px' }}>
                  {task.dealReference ? (
                    <div style={{ 
                      display: 'inline-flex', 
                      alignItems: 'center', 
                      gap: 6, 
                      fontSize: 13, 
                      fontWeight: 800, 
                      color: 'var(--brand-accent)', 
                      background: 'var(--purple-dim)', 
                      padding: '4px 8px', 
                      borderRadius: 6 
                    }}>
                      <Briefcase size={12} />
                      <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 80 }}>{task.dealReference.name}</span>
                    </div>
                  ) : (
                    <span style={{ color: 'var(--text-muted)', fontSize: 15 }}>—</span>
                  )}
                </td>
                <td style={{ padding: '24px 28px', textAlign: 'center' }}>
                  <button
                    onClick={() => handleDeleteTask(task.id)}
                    style={{ 
                      padding: 8, 
                      borderRadius: 8, 
                      background: 'transparent', 
                      border: 'none',
                      color: 'var(--text-muted)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.2s',
                      margin: '0 auto'
                    }}
                    onMouseOver={(e) => { e.currentTarget.style.color = 'var(--rose)'; e.currentTarget.style.background = 'var(--rose-dim)'; }}
                    onMouseOut={(e) => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.background = 'transparent'; }}
                    title="Remove task"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {tasks.length === 0 && (
        <div style={{ padding: '60px 0', textAlign: 'center', color: 'var(--text-muted)', fontSize: 16 }}>
          No records matching the current layout properties.
        </div>
      )}
    </div>
  );
}

// ==========================================
// 9. HIGH-FIDELITY CRM CALENDAR SUB-COMPONENT
// ==========================================

interface CalendarViewProps {
  tasks: Task[];
  darkMode: boolean;
  handleOpenTaskDetails: (id: string) => void;
  onOpenNewTaskModal: (dateStr: string) => void;
}

function CalendarView({
  tasks,
  darkMode,
  handleOpenTaskDetails,
  onOpenNewTaskModal
}: CalendarViewProps) {
  const today = new Date();
  const [viewDate, setViewDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [selectedDate, setSelectedDate] = useState(today);
  const [isMonthView, setIsMonthView] = useState(false);

  const formatYMD = (d: Date) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  };

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  
  const days: { empty: boolean; day?: number; isToday?: boolean; evts?: Task[] }[] = [];
  for (let i = 0; i < firstDayOfMonth; i++) days.push({ empty: true });
  for (let i = 1; i <= daysInMonth; i++) {
    const dateStr = formatYMD(new Date(year, month, i));
    days.push({ 
      empty: false, 
      day: i, 
      isToday: year === today.getFullYear() && month === today.getMonth() && i === today.getDate(), 
      evts: tasks.filter(t => t.dueDate === dateStr)
    });
  }

  const selectedStr = formatYMD(selectedDate);
  const dayEvents = tasks.filter(t => t.dueDate === selectedStr);
  const monthEvents = tasks.filter(t => t.dueDate.startsWith(`${year}-${String(month + 1).padStart(2, '0')}`));
  const displayEvents = isMonthView ? monthEvents : dayEvents;

  const handleDayClick = (dateStr: string) => {
    onOpenNewTaskModal(dateStr);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, padding: '0 8px' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ fontSize: 24, fontWeight: 800, display: 'flex', alignItems: 'center', gap: 10, color: 'var(--text-primary)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 40, height: 40, borderRadius: 10, background: 'var(--purple-dim)', color: 'var(--brand-accent)' }}>
              <CalendarDays size={24} />
            </div>
            Scheduling Calendar
          </div>
          <div style={{ fontSize: 14, color: 'var(--text-muted)', marginTop: 6, marginLeft: 50 }}>
            Plan and coordinate tasks across your pipeline timeline.
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button 
            onClick={() => handleDayClick(selectedStr)}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 6, 
              padding: '10px 18px', 
              borderRadius: 10, 
              background: 'var(--text-primary)', 
              color: 'var(--bg-primary)', 
              border: 'none',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            + Schedule Task
          </button>
        </div>
      </div>

      {/* Calendar + Day View Split */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 420px', gap: 24 }}>
        
        {/* Calendar Left Panel */}
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 16, padding: 24, display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
            <button 
              onClick={() => setViewDate(new Date(year, month - 1, 1))}
              style={{ padding: '8px', borderRadius: '50%', background: 'var(--bg-secondary)', color: 'var(--text-primary)', border: '1px solid var(--border)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <ChevronLeft size={20} />
            </button>
            <h2 
              onClick={() => setIsMonthView(true)} 
              style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', margin: 0, cursor: 'pointer' }} 
              title="Click to view all tasks in this month"
            >
              {viewDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
            </h2>
            <button 
              onClick={() => setViewDate(new Date(year, month + 1, 1))}
              style={{ padding: '8px', borderRadius: '50%', background: 'var(--bg-secondary)', color: 'var(--text-primary)', border: '1px solid var(--border)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <ChevronRight size={20} />
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 10, flex: 1 }}>
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
              <div key={d} style={{ fontSize: 12, color: 'var(--text-muted)', textAlign: 'center', fontWeight: 700, paddingBottom: 12, textTransform: 'uppercase', letterSpacing: '1px' }}>{d}</div>
            ))}
            {days.map((d, i) => {
              if (d.empty) return <div key={i} />;
              const isSelected = !isMonthView && selectedDate.getFullYear() === year && selectedDate.getMonth() === month && selectedDate.getDate() === d.day;
              return (
                <div 
                  key={i} 
                  onClick={() => { setSelectedDate(new Date(year, month, d.day!)); setIsMonthView(false); }} 
                  style={{
                    position: 'relative', height: 90, padding: '10px', borderRadius: 12, cursor: 'pointer',
                    border: isSelected ? '2px solid var(--brand-accent)' : '1px solid var(--border)',
                    background: isSelected ? 'var(--purple-dim)' : d.isToday ? 'var(--bg-secondary)' : 'var(--bg-primary)',
                    transition: 'all 0.2s',
                    display: 'flex', flexDirection: 'column', alignItems: 'flex-start',
                  }}
                >
                  <span style={{
                    fontSize: 14, fontWeight: isSelected || d.isToday ? 800 : 600,
                    color: isSelected ? 'var(--brand-accent)' : d.isToday ? 'var(--text-primary)' : 'var(--text-secondary)',
                    background: d.isToday && !isSelected ? 'var(--border)' : 'transparent',
                    padding: d.isToday && !isSelected ? '2px 8px' : '0', borderRadius: 12,
                  }}>{d.day}</span>
                  
                  {d.evts && d.evts.length > 0 && (
                    <div style={{ marginTop: 'auto', display: 'flex', flexWrap: 'wrap', gap: 4, width: '100%' }}>
                      {d.evts.slice(0, 3).map((t, idx) => {
                        const colorMap: any = { Urgent: 'var(--rose)', High: 'var(--amber)', Medium: 'var(--brand-accent)', Low: 'var(--emerald)' };
                        return <div key={idx} style={{ height: 6, flex: 1, minWidth: 10, background: colorMap[t.priority] || 'var(--text-muted)', borderRadius: 4, opacity: t.status === 'Done' ? 0.4 : 1 }} title={t.title} />;
                      })}
                      {d.evts.length > 3 && <span style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 800, marginLeft: 2 }}>+{d.evts.length - 3}</span>}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Daily Schedule Right Panel */}
        <div style={{ 
          background: 'var(--bg-card)', 
          border: '1px solid var(--border)', 
          borderRadius: 16, 
          padding: 24, 
          display: 'flex', 
          flexDirection: 'column', 
          height: '100%',
          minHeight: 600
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
            <div>
              <h3 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: 'var(--text-primary)' }}>
                {isMonthView ? `${viewDate.toLocaleString('default', { month: 'long' })} ${year}` : `${selectedDate.toLocaleString('default', { month: 'long' })} ${selectedDate.getDate()}`}
              </h3>
              <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4, fontWeight: 600 }}>{isMonthView ? 'Monthly Schedule' : 'Daily Schedule'}</div>
            </div>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <span style={{ padding: '4px 10px', background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 20, fontSize: 12, fontWeight: 700, color: 'var(--text-muted)' }}>
                {displayEvents.length} items
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, overflowY: 'auto', flex: 1, paddingRight: 4 }}>
            {displayEvents.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '50px 20px', color: 'var(--text-muted)', border: '2px dashed var(--border)', borderRadius: 16 }}>
                <CalendarDays size={32} style={{ opacity: 0.5, marginBottom: 16 }} />
                <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)' }}>Nothing scheduled</div>
                <div style={{ fontSize: 13, marginTop: 6, fontWeight: 500 }}>{isMonthView ? 'No tasks planned for this month.' : 'No tasks planned for this date.'}</div>
                <button 
                  style={{ marginTop: 20, fontSize: 13, color: 'var(--brand-accent)', fontWeight: 700, background: 'transparent', border: 'none', cursor: 'pointer' }}
                  onClick={() => handleDayClick(selectedStr)}
                >
                  + Schedule Task
                </button>
              </div>
            ) : (
              displayEvents.map(t => {
                const colorMap: any = { Urgent: 'var(--rose)', High: 'var(--amber)', Medium: 'var(--brand-accent)', Low: 'var(--emerald)' };
                const tColor = colorMap[t.priority] || 'var(--text-muted)';
                return (
                  <div 
                    key={t.id} 
                    onClick={() => handleOpenTaskDetails(t.id)}
                    style={{ 
                      padding: '16px 20px', 
                      background: 'var(--bg-primary)', 
                      border: '1px solid var(--border)', 
                      borderRadius: 14, 
                      position: 'relative', 
                      overflow: 'hidden', 
                      cursor: 'pointer',
                      transition: 'border-color 0.2s'
                    }} 
                    onMouseOver={(e) => e.currentTarget.style.borderColor = 'var(--border-bright)'}
                    onMouseOut={(e) => e.currentTarget.style.borderColor = 'var(--border)'}
                  >
                    <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 4, background: tColor }} />
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                      <span style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', color: tColor }}>{t.priority} PRIORITY</span>
                      <span style={{ fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 10, background: 'var(--bg-secondary)', color: 'var(--text-secondary)' }}>
                        {t.status}
                      </span>
                    </div>
                    <div style={{ fontSize: 15, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 10 }}>{t.title}</div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 16, fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <img src={t.assignee.avatar} alt={t.assignee.name} style={{ width: 20, height: 20, borderRadius: '50%', objectFit: 'cover' }} />
                          {t.assignee.name.split(' ')[0]}
                        </span>
                        {isMonthView && <span style={{ color: 'var(--text-muted)' }}>Due: {t.dueDate}</span>}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 10. RECHARTS-MIMICKING CRM ANALYTICS VIEW
// ==========================================

interface DashboardViewProps {
  tasks: Task[];
  widgets: DashboardWidget[];
  darkMode: boolean;
  members: Assignee[];
  reorderWidgets: (draggedId: string, targetId: string) => void;
}

function DashboardView({
  tasks,
  widgets,
  darkMode,
  members,
  reorderWidgets
}: DashboardViewProps) {
  // SVG charts calculation helpers
  const stats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter(t => t.status === 'Done').length;
    const progress = tasks.filter(t => t.status === 'In Progress').length;
    const review = tasks.filter(t => t.status === 'Review').length;
    const todo = tasks.filter(t => t.status === 'To Do').length;

    const highOrUrgent = tasks.filter(t => t.priority === 'High' || t.priority === 'Urgent').length;

    const statusMap = { 'To Do': todo, 'In Progress': progress, 'Review': review, 'Done': completed };
    const priorityMap = {
      Low: tasks.filter(t => t.priority === 'Low').length,
      Medium: tasks.filter(t => t.priority === 'Medium').length,
      High: tasks.filter(t => t.priority === 'High').length,
      Urgent: tasks.filter(t => t.priority === 'Urgent').length
    };

    return { total, completed, progress, review, todo, highOrUrgent, statusMap, priorityMap };
  }, [tasks]);

  const [draggedWidgetId, setDraggedWidgetId] = useState<string | null>(null);

  const handleWidgetDragStart = (e: React.DragEvent, id: string) => {
    setDraggedWidgetId(id);
    e.dataTransfer.setData('text/widget', id);
  };

  const handleWidgetDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    const draggedId = e.dataTransfer.getData('text/widget') || draggedWidgetId;
    if (draggedId && draggedId !== targetId) {
      reorderWidgets(draggedId, targetId);
    }
    setDraggedWidgetId(null);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, padding: '0 8px' }}>
      


      {/* Grid container */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 20 }}>
        {widgets.map(widget => (
          <div
            key={widget.id}
            draggable
            onDragStart={(e) => handleWidgetDragStart(e, widget.id)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => handleWidgetDrop(e, widget.id)}
            style={{ 
              gridColumn: widget.w === 12 ? 'span 12' : 'span 6',
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              borderRadius: 16,
              cursor: 'grab',
              transition: 'box-shadow 0.2s',
              overflow: 'hidden'
            }}
            onMouseOver={(e) => (e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)')}
            onMouseOut={(e) => (e.currentTarget.style.boxShadow = 'none')}
          >
            {/* Widget Header */}
            <div style={{ 
              padding: '12px 16px', 
              borderBottom: '1px solid var(--border)', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between',
              background: 'var(--bg-glass)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 4, height: 12, background: 'var(--brand-accent)', borderRadius: 4 }} />
                <h4 style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-secondary)', letterSpacing: '0.5px', margin: 0 }}>{widget.title}</h4>
              </div>
              <Maximize2 size={14} color="var(--text-muted)" />
            </div>

            {/* Render appropriate widget templates */}
            <div style={{ padding: 20, minHeight: `${widget.h}px` }}>
              
              {/* Widget A: Key Overview Numbers */}
              {widget.type === 'overview' && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 16 }}>
                  {[
                    { label: 'Total tasks', count: stats.total, color: 'var(--brand-accent)', trend: 'Live updates' },
                    { label: 'Completed', count: stats.completed, color: 'var(--emerald)', trend: `${Math.round((stats.completed/stats.total)*100 || 0)}% completion rate` },
                    { label: 'Active Pipeline', count: stats.progress + stats.review, color: 'var(--amber)', trend: 'Pending alignment' },
                    { label: 'High Priority', count: stats.highOrUrgent, color: 'var(--rose)', trend: 'Requires attention' }
                  ].map((item, idx) => (
                    <div key={idx} style={{ 
                      padding: 16, 
                      borderRadius: 12, 
                      border: '1px solid var(--border)', 
                      background: 'var(--bg-glass)' 
                    }}>
                      <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{item.label}</div>
                      <div style={{ fontSize: 28, fontWeight: 800, margin: '8px 0', color: item.color, fontFamily: 'Outfit, sans-serif' }}>{item.count}</div>
                      <div style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 600 }}>{item.trend}</div>
                    </div>
                  ))}
                </div>
              )}

              {/* Widget B: Status Bar Chart */}
              {widget.type === 'status-chart' && (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                  <svg viewBox="0 0 400 180" style={{ width: '100%', maxHeight: 180 }}>
                    <line x1="40" y1="20" x2="380" y2="20" stroke="var(--border)" strokeWidth="1" strokeDasharray="4 4" />
                    <line x1="40" y1="70" x2="380" y2="70" stroke="var(--border)" strokeWidth="1" strokeDasharray="4 4" />
                    <line x1="40" y1="120" x2="380" y2="120" stroke="var(--border)" strokeWidth="1" strokeDasharray="4 4" />
                    <line x1="40" y1="150" x2="380" y2="150" stroke="var(--border-bright)" strokeWidth="1" />

                    <text x="30" y="24" fill="var(--text-muted)" fontSize="10" textAnchor="end">100%</text>
                    <text x="30" y="74" fill="var(--text-muted)" fontSize="10" textAnchor="end">50%</text>
                    <text x="30" y="124" fill="var(--text-muted)" fontSize="10" textAnchor="end">10%</text>
                    <text x="30" y="154" fill="var(--text-muted)" fontSize="10" textAnchor="end">0</text>

                    {Object.entries(stats.statusMap).map(([statusKey, val], index) => {
                      const barWidth = 35;
                      const spacing = 80;
                      const x = 60 + index * spacing;
                      const heightPercent = stats.total > 0 ? (val / stats.total) * 120 : 0;
                      const y = 150 - heightPercent;
                      
                      return (
                        <g key={statusKey} style={{ cursor: 'pointer' }}>
                          <rect x={x} y={y} width={barWidth} height={heightPercent} fill={index === 3 ? 'var(--emerald)' : 'var(--brand-accent)'} rx="4" opacity="0.85" />
                          <text x={x + barWidth/2} y={y - 6} fill="var(--text-primary)" fontSize="11" fontWeight="bold" textAnchor="middle">{val}</text>
                          <text x={x + barWidth/2} y="168" fill="var(--text-muted)" fontSize="10" fontWeight="bold" textAnchor="middle">{statusKey}</text>
                        </g>
                      );
                    })}
                  </svg>
                </div>
              )}

              {/* Widget C: Priority Distribution Donut */}
              {widget.type === 'priority-chart' && (
                <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-around', gap: 16 }}>
                  <svg style={{ width: 130, height: 130, transform: 'rotate(-90deg)' }}>
                    <circle cx="65" cy="65" r="50" fill="transparent" stroke="var(--bg-secondary)" strokeWidth="14" />
                    {(() => {
                      const priorityWeights = [
                        { label: 'Low', count: stats.priorityMap.Low, color: 'var(--emerald)' },
                        { label: 'Medium', count: stats.priorityMap.Medium, color: 'var(--brand-accent)' },
                        { label: 'High', count: stats.priorityMap.High, color: 'var(--amber)' },
                        { label: 'Urgent', count: stats.priorityMap.Urgent, color: 'var(--rose)' }
                      ];
                      const totalCount = stats.total || 1;
                      let accumulatedPercent = 0;
                      
                      return priorityWeights.map((pw, i) => {
                        const percent = pw.count / totalCount;
                        const strokeDasharray = `${percent * 314.15} 314.15`;
                        const strokeDashoffset = `-${accumulatedPercent * 314.15}`;
                        accumulatedPercent += percent;
                        return (
                          <circle
                            key={i}
                            cx="65"
                            cy="65"
                            r="50"
                            fill="transparent"
                            stroke={pw.color}
                            strokeWidth="14"
                            strokeDasharray={strokeDasharray}
                            strokeDashoffset={strokeDashoffset}
                            strokeLinecap="round"
                            style={{ transition: 'all 0.3s' }}
                          />
                        );
                      });
                    })()}
                  </svg>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 12, fontWeight: 600 }}>
                    {[
                      { label: 'Urgent Priority', count: stats.priorityMap.Urgent, color: 'var(--rose)' },
                      { label: 'High Priority', count: stats.priorityMap.High, color: 'var(--amber)' },
                      { label: 'Medium Priority', count: stats.priorityMap.Medium, color: 'var(--brand-accent)' },
                      { label: 'Low Priority', count: stats.priorityMap.Low, color: 'var(--emerald)' }
                    ].map((p, idx) => (
                      <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ width: 10, height: 10, borderRadius: '50%', background: p.color }} />
                        <span style={{ color: 'var(--text-muted)' }}>{p.label}:</span>
                        <span style={{ color: 'var(--text-primary)', fontWeight: 700 }}>{p.count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Widget D: Interactive team resource density allocation */}
              {widget.type === 'team-activity' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Assignee Task Distribution Density</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    {members.map(member => {
                      const memberTasksCount = tasks.filter(t => t.assignee.id === member.id).length;
                      const pct = stats.total > 0 ? (memberTasksCount / stats.total) * 100 : 0;
                      return (
                        <div key={member.id} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                          <img src={member.avatar} alt={member.name} style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover' }} />
                          <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, fontWeight: 600, marginBottom: 6 }}>
                              <span style={{ color: 'var(--text-primary)' }}>{member.name}</span>
                              <span style={{ color: 'var(--text-muted)' }}>{memberTasksCount} assigned goals ({Math.round(pct)}%)</span>
                            </div>
                            <div style={{ width: '100%', height: 6, background: 'var(--bg-primary)', borderRadius: 3, overflow: 'hidden' }}>
                              <div 
                                style={{ height: '100%', background: 'var(--brand-accent)', width: `${pct}%`, transition: 'width 0.3s' }}
                              />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ==========================================
// 11. NOTION-STYLE DETAIL SLIDE-OVER SIDEBAR
// ==========================================

interface TaskViewModalProps {
  task: Task;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
  darkMode: boolean;
}

function TaskViewModal({ task, onClose, onEdit, onDelete, darkMode }: TaskViewModalProps) {
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }} />

      <div style={{ 
        position: 'relative', 
        width: '100%', 
        maxWidth: 600, 
        background: 'var(--bg-card)', 
        borderRadius: 20, 
        boxShadow: '0 24px 64px rgba(0,0,0,0.2)', 
        display: 'flex', 
        flexDirection: 'column', 
        overflow: 'hidden', 
        maxHeight: '90vh' 
      }}>
        
        <div style={{ padding: '24px 32px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: `1px solid var(--border)` }}>
          <div>
            <h3 style={{ margin: 0, fontSize: 24, fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.2 }}>
              {task.title}
            </h3>
            <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
              <span style={{ fontSize: 12, padding: '4px 10px', borderRadius: 12, background: 'var(--purple-dim)', color: 'var(--brand-accent)', fontWeight: 700 }}>{task.status}</span>
              <PriorityBadge priority={task.priority} />
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'var(--bg-primary)', border: 'none', width: 32, height: 32, borderRadius: '50%', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <X size={18} strokeWidth={2.5} />
          </button>
        </div>

        <div style={{ padding: '24px 32px', display: 'flex', flexDirection: 'column', gap: 24, overflowY: 'auto' }} className="custom-scrollbar">
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 8 }}>Assignee</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <img src={task.assignee.avatar} alt={task.assignee.name} style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover' }} />
                <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>{task.assignee.name}</span>
              </div>
            </div>
            <div>
              <div style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 8 }}>Due Date</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>
                <CalendarIcon size={16} className="text-violet-500" />
                {task.dueDate}
              </div>
            </div>
          </div>

          <div>
            <div style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 8 }}>Description</div>
            <div style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6, whiteSpace: 'pre-wrap', background: 'var(--bg-primary)', padding: 16, borderRadius: 12, border: `1px solid var(--border)` }}>
              {task.description || <span style={{ fontStyle: 'italic', color: 'var(--text-muted)' }}>No description provided.</span>}
            </div>
          </div>

          {task.labels && task.labels.length > 0 && (
            <div>
              <div style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 8 }}>Labels</div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {task.labels.map(l => (
                  <span key={l} style={{ fontSize: 12, padding: '4px 12px', borderRadius: 16, background: 'var(--bg-primary)', color: 'var(--text-primary)', fontWeight: 600 }}>{l}</span>
                ))}
              </div>
            </div>
          )}

          {task.dealReference && (
            <div>
              <div style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 8 }}>Linked Deal</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, background: 'var(--purple-dim)', padding: 12, borderRadius: 12, border: '1px solid var(--purple-dim)' }}>
                <div style={{ width: 36, height: 36, borderRadius: 8, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--brand-accent)' }}>
                  <Briefcase size={20} />
                </div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--brand-accent)' }}>{task.dealReference.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-primary)' }}>{task.dealReference.value} • {task.dealReference.stage}</div>
                </div>
              </div>
            </div>
          )}

        </div>

        <div style={{ padding: '16px 32px', background: 'var(--bg-primary)', display: 'flex', justifyContent: 'flex-end', gap: 12, borderTop: `1px solid var(--border)` }}>
          <button onClick={onDelete} style={{ padding: '8px 20px', borderRadius: 8, background: 'transparent', border: '1px solid var(--rose)', color: 'var(--rose)', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
            <Trash2 size={16} /> Delete
          </button>
          <button onClick={onEdit} style={{ padding: '8px 24px', borderRadius: 8, background: 'var(--brand-accent)', border: 'none', color: '#fff', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
            <Edit2 size={16} /> Edit Task
          </button>
        </div>

      </div>
    </div>
  );
}

interface DeleteConfirmModalProps {
  taskTitle: string;
  onClose: () => void;
  onConfirm: () => void;
  darkMode: boolean;
}

function DeleteConfirmModal({ taskTitle, onClose, onConfirm, darkMode }: DeleteConfirmModalProps) {
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }} />

      <div style={{ 
        position: 'relative', 
        width: '100%', 
        maxWidth: 400, 
        background: 'var(--bg-card)', 
        borderRadius: 16, 
        boxShadow: '0 24px 64px rgba(0,0,0,0.2)', 
        display: 'flex', 
        flexDirection: 'column', 
        overflow: 'hidden',
        padding: 32,
        textAlign: 'center'
      }}>
        <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'var(--rose-dim)', color: 'var(--rose)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
          <AlertTriangle size={32} />
        </div>
        
        <h3 style={{ margin: '0 0 12px', fontSize: 20, fontWeight: 700, color: 'var(--text-primary)' }}>Delete Task?</h3>
        <p style={{ margin: '0 0 24px', fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.5 }}>
          Are you sure you want to delete <strong>"{taskTitle}"</strong>? This action cannot be undone.
        </p>

        <div style={{ display: 'flex', gap: 12 }}>
          <button onClick={onClose} style={{ flex: 1, padding: '10px 0', borderRadius: 8, background: 'var(--bg-primary)', border: 'none', color: 'var(--text-primary)', fontWeight: 600, cursor: 'pointer' }}>
            Cancel
          </button>
          <button onClick={onConfirm} style={{ flex: 1, padding: '10px 0', borderRadius: 8, background: 'var(--rose)', border: 'none', color: '#fff', fontWeight: 600, cursor: 'pointer' }}>
            Confirm Delete
          </button>
        </div>
      </div>
    </div>
  );
}

interface TaskDetailSidebarProps {
  task: Task;
  onClose: () => void;
  onUpdate: (task: Task) => void;
  onDelete: (id: string) => void;
  columns: string[];
  members: Assignee[];
  darkMode: boolean;
}

function TaskDetailSidebar({
  task,
  onClose,
  onUpdate,
  onDelete,
  columns,
  members,
  darkMode
}: TaskDetailSidebarProps) {
  const [comInput, setComInput] = useState('');
  const [newSubTitle, setNewSubTitle] = useState('');
  const [isEditTitle, setIsEditTitle] = useState(false);
  const [titleEditVal, setTitleEditVal] = useState(task.title);

  useEffect(() => {
    setTitleEditVal(task.title);
    setIsEditTitle(false);
  }, [task]);

  const saveTitle = () => {
    if (titleEditVal.trim()) {
      onUpdate({ ...task, title: titleEditVal });
      setIsEditTitle(false);
    }
  };

  const toggleSubtask = (subId: string) => {
    const updated = task.subtasks.map(s => s.id === subId ? { ...s, completed: !s.completed } : s);
    onUpdate({ ...task, subtasks: updated });
  };

  const addSubtask = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSubTitle.trim()) {
      const newSub: SubTask = { id: `sub-${Date.now()}`, title: newSubTitle.trim(), completed: false };
      onUpdate({ ...task, subtasks: [...task.subtasks, newSub] });
      setNewSubTitle('');
    }
  };

  const deleteSubtask = (subId: string) => {
    onUpdate({ ...task, subtasks: task.subtasks.filter(s => s.id !== subId) });
  };

  const submitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (comInput.trim()) {
      const newCom: Comment = {
        id: `c-${Date.now()}`,
        author: 'Workspace Owner',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
        text: comInput.trim(),
        timestamp: 'Just now'
      };
      onUpdate({ ...task, comments: [...task.comments, newCom] });
      setComInput('');
    }
  };

  const toggleLabel = (lbl: string) => {
    const updated = task.labels.includes(lbl) 
      ? task.labels.filter(l => l !== lbl) 
      : [...task.labels, lbl];
    onUpdate({ ...task, labels: updated });
  };

  return (
    <div className="flex flex-col h-full">
      {/* Detail panel top bar */}
      <div className={`p-4 border-b flex items-center justify-between ${
        darkMode ? 'border-slate-800' : 'border-slate-200'
      }`}>
        <div className="flex items-center gap-1.5 text-slate-500 text-xs">
          <Briefcase className="w-4 h-4" />
          <span>Workspace Detail Panel</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onDelete(task.id)}
            className="p-1.5 rounded hover:bg-rose-500/10 text-slate-500 hover:text-rose-500 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          <button onClick={onClose} className="p-1.5 rounded hover:bg-slate-800 text-slate-400">
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Detail Scrollable body */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
        
        {/* Title area */}
        <div>
          {isEditTitle ? (
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={titleEditVal}
                onChange={(e) => setTitleEditVal(e.target.value)}
                className={`flex-1 font-bold text-base px-3 py-1.5 rounded-xl border focus:ring-1 outline-none ${
                  darkMode ? 'bg-slate-950 border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-900'
                }`}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') saveTitle();
                  if (e.key === 'Escape') setIsEditTitle(false);
                }}
              />
              <button onClick={saveTitle} className="px-2.5 py-1.5 bg-violet-600 hover:bg-violet-500 text-white rounded-lg text-xs font-bold">
                Save
              </button>
            </div>
          ) : (
            <div className="flex items-start justify-between group">
              <h3 className="font-extrabold text-base leading-snug hover:text-violet-400 cursor-pointer" onClick={() => setIsEditTitle(true)}>
                {task.title}
              </h3>
              <button onClick={() => setIsEditTitle(true)} className="opacity-0 group-hover:opacity-100 p-1 text-slate-400">
                <Edit2 className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* Task Properties Grid */}
        <div className={`p-4 rounded-2xl space-y-3 border ${
          darkMode ? 'bg-slate-950/30 border-slate-800/80' : 'bg-slate-50 border-slate-200/50'
        }`}>
          {/* Status Select */}
          <div className="grid grid-cols-3 items-center">
            <span className="text-xs font-bold text-slate-500 uppercase">Status</span>
            <div className="col-span-2">
              <select
                value={task.status}
                onChange={(e) => onUpdate({ ...task, status: e.target.value })}
                className={`px-2.5 py-1 text-xs rounded border outline-none cursor-pointer w-full max-w-[200px] ${
                  darkMode ? 'bg-slate-900 border-slate-800 text-slate-200' : 'bg-white border-slate-200 text-slate-800 shadow-sm'
                }`}
              >
                {columns.map(col => (
                  <option key={col} value={col}>{col}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Assignee */}
          <div className="grid grid-cols-3 items-center">
            <span className="text-xs font-bold text-slate-500 uppercase">Assignee</span>
            <div className="col-span-2">
              <select
                value={task.assignee.id}
                onChange={(e) => {
                  const match = members.find(m => m.id === e.target.value);
                  if (match) onUpdate({ ...task, assignee: match });
                }}
                className={`px-2.5 py-1 text-xs rounded border outline-none cursor-pointer w-full max-w-[200px] ${
                  darkMode ? 'bg-slate-900 border-slate-800 text-slate-200' : 'bg-white border-slate-200 text-slate-800 shadow-sm'
                }`}
              >
                {members.map(m => (
                  <option key={m.id} value={m.id}>{m.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Priority */}
          <div className="grid grid-cols-3 items-center">
            <span className="text-xs font-bold text-slate-500 uppercase">Priority</span>
            <div className="col-span-2">
              <select
                value={task.priority}
                onChange={(e) => onUpdate({ ...task, priority: e.target.value as any })}
                className={`px-2.5 py-1 text-xs rounded border outline-none cursor-pointer w-full max-w-[200px] ${
                  darkMode ? 'bg-slate-900 border-slate-800 text-slate-200' : 'bg-white border-slate-200 text-slate-800 shadow-sm'
                }`}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Urgent">Urgent</option>
              </select>
            </div>
          </div>

          {/* Due date */}
          <div className="grid grid-cols-3 items-center">
            <span className="text-xs font-bold text-slate-500 uppercase">Due Date</span>
            <div className="col-span-2">
              <input
                type="date"
                value={task.dueDate}
                onChange={(e) => onUpdate({ ...task, dueDate: e.target.value })}
                className={`px-2.5 py-1 text-xs rounded border outline-none cursor-pointer w-full max-w-[200px] ${
                  darkMode ? 'bg-slate-900 border-slate-800 text-slate-200' : 'bg-white border-slate-200 text-slate-800 shadow-sm'
                }`}
              />
            </div>
          </div>
        </div>

        {/* Dynamic Label Tag Toggles */}
        <div>
          <h4 className="text-xs font-extrabold uppercase text-slate-500 tracking-wider mb-2">Category Labels</h4>
          <div className="flex flex-wrap gap-1.5">
            {PRESET_LABELS.map(lbl => {
              const hasIt = task.labels.includes(lbl);
              return (
                <button
                  key={lbl}
                  onClick={() => toggleLabel(lbl)}
                  className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wide transition-colors ${
                    hasIt 
                      ? 'bg-violet-600 text-white' 
                      : darkMode ? 'bg-slate-800 text-slate-400 hover:bg-slate-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {lbl}
                </button>
              );
            })}
          </div>
        </div>

        {/* Description Textarea */}
        <div>
          <h4 className="text-xs font-extrabold uppercase text-slate-500 tracking-wider mb-2">Description Notes</h4>
          <textarea
            value={task.description}
            onChange={(e) => onUpdate({ ...task, description: e.target.value })}
            placeholder="Add comprehensive notes and alignment details..."
            className={`w-full p-3 text-xs rounded-xl border outline-none min-h-[100px] resize-none focus:ring-1 ${
              darkMode 
                ? 'bg-slate-950 border-slate-800/80 text-slate-200 focus:border-violet-500' 
                : 'bg-slate-50 border-slate-200 focus:border-violet-400'
            }`}
          />
        </div>

        {/* Subtask checklist progress */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <h4 className="text-xs font-extrabold uppercase text-slate-500 tracking-wider">Subtask Checklist</h4>
            {task.subtasks.length > 0 && (
              <span className="text-xs font-bold text-violet-400">
                {Math.round((task.subtasks.filter(s => s.completed).length / task.subtasks.length) * 100)}% Done
              </span>
            )}
          </div>

          <div className="space-y-1.5">
            {task.subtasks.map(s => (
              <div key={s.id} className="flex items-center justify-between p-2 rounded-xl bg-slate-900/10 dark:bg-slate-950/20 group">
                <label className="flex items-center gap-2.5 cursor-pointer flex-1 select-none text-xs">
                  <input
                    type="checkbox"
                    checked={s.completed}
                    onChange={() => toggleSubtask(s.id)}
                    className="rounded border-slate-300 text-violet-600 focus:ring-violet-500"
                  />
                  <span className={`${s.completed ? 'line-through text-slate-500' : 'text-slate-300'}`}>
                    {s.title}
                  </span>
                </label>
                <button onClick={() => deleteSubtask(s.id)} className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-rose-500">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>

          <form onSubmit={addSubtask} className="flex gap-2">
            <input
              type="text"
              required
              placeholder="Add next checklist objective..."
              value={newSubTitle}
              onChange={(e) => setNewSubTitle(e.target.value)}
              className={`flex-1 px-3 py-1.5 text-xs rounded-lg border outline-none ${
                darkMode ? 'bg-slate-950 border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-800'
              }`}
            />
            <button type="submit" className="px-3 py-1.5 bg-violet-600 hover:bg-violet-500 text-white font-extrabold text-xs rounded-lg">
              Add
            </button>
          </form>
        </div>

        {/* Linked CRM deal reference details */}
        <div>
          <h4 className="text-xs font-extrabold uppercase text-slate-500 tracking-wider mb-2">CRM Contract Deals</h4>
          {task.dealReference ? (
            <div className={`p-4 rounded-xl border flex items-center justify-between ${
              darkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
            }`}>
              <div className="flex items-center gap-2.5">
                <Briefcase className="w-5 h-5 text-emerald-400" />
                <div>
                  <div className="text-xs font-bold">{task.dealReference.name}</div>
                  <div className="text-[10px] text-slate-500">{task.dealReference.value} • {task.dealReference.stage}</div>
                </div>
              </div>
              <button 
                onClick={() => onUpdate({ ...task, dealReference: null })}
                className="text-[10px] text-rose-500 hover:underline"
              >
                Unlink
              </button>
            </div>
          ) : (
            <button
              onClick={() => onUpdate({
                ...task,
                dealReference: { name: 'Acme Premium License Shard Deal', value: '$75,000', stage: 'Negotiation' }
              })}
              className={`w-full py-2.5 border border-dashed rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 hover:border-violet-500/50 hover:text-violet-400 transition-colors ${
                darkMode ? 'border-slate-800 text-slate-400' : 'border-slate-300 text-slate-600'
              }`}
            >
              <Plus className="w-4 h-4" />
              <span>Link Account Deal Target</span>
            </button>
          )}
        </div>

        {/* Comment log thread */}
        <div className="space-y-4">
          <h4 className="text-xs font-extrabold uppercase text-slate-500 tracking-wider">Comments Log ({task.comments.length})</h4>
          
          <div className="space-y-3">
            {task.comments.map(c => (
              <div key={c.id} className="flex gap-2.5 text-xs">
                <img src={c.avatar} alt={c.author} className="w-6 h-6 rounded-full object-cover mt-0.5" />
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold">{c.author}</span>
                    <span className="text-[9px] text-slate-500">{c.timestamp}</span>
                  </div>
                  <p className={`p-2.5 rounded-xl border leading-relaxed ${
                    darkMode ? 'bg-slate-950/50 border-slate-800 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'
                  }`}>
                    {c.text}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <form onSubmit={submitComment} className="flex gap-2 items-end">
            <textarea
              required
              value={comInput}
              onChange={(e) => setComInput(e.target.value)}
              placeholder="Write a status update..."
              className={`flex-1 p-2.5 text-xs rounded-xl border outline-none h-16 resize-none focus:ring-1 ${
                darkMode ? 'bg-slate-950 border-slate-800 text-slate-200 focus:border-violet-500' : 'bg-slate-50 border-slate-200 text-slate-800 focus:border-violet-400'
              }`}
            />
            <button type="submit" className="px-4 py-2.5 bg-violet-600 hover:bg-violet-500 text-white font-extrabold text-xs rounded-xl">
              Post
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}

// ==========================================
// 12. PRIORITY BADGE DECORATOR HELPER
// ==========================================

function PriorityBadge({ priority }: { priority: string }) {
  const styles = {
    Low: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    Medium: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
    High: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    Urgent: 'bg-rose-500/10 text-rose-400 border-rose-500/20'
  };

  const icons = {
    Low: <Check className="w-2.5 h-2.5" />,
    Medium: <Clock className="w-2.5 h-2.5" />,
    High: <AlertTriangle className="w-2.5 h-2.5" />,
    Urgent: <Flame className="w-2.5 h-2.5 animate-pulse" />
  };

  const currentStyle = styles[priority as keyof typeof styles] || styles.Medium;
  const currentIcon = icons[priority as keyof typeof icons] || icons.Medium;

  return (
    <span className={`flex items-center gap-1 text-[8px] px-1.5 py-0.5 rounded border font-extrabold uppercase tracking-wider ${currentStyle}`}>
      {currentIcon}
      <span>{priority}</span>
    </span>
  );
}

// ==========================================
// 13. NEW TASK CREATOR MODAL (Zod Schema Guarded)
// ==========================================

interface NewTaskModalProps {
  onClose: () => void;
  onSubmit: (data: Partial<Task>) => void;
  columns: string[];
  members: Assignee[];
  darkMode: boolean;
  initialDueDate?: string;
  initialStatus?: string;
  taskToEdit?: Task;
}

function NewTaskModal({ 
  onClose, 
  onSubmit, 
  darkMode, 
  columns, 
  members,
  initialDueDate,
  initialStatus,
  taskToEdit
}: NewTaskModalProps) {
  const [title, setTitle] = useState(taskToEdit?.title || '');
  const [description, setDescription] = useState(taskToEdit?.description || '');
  const [status, setStatus] = useState(taskToEdit?.status || initialStatus || columns[0] || 'To Do');
  const [priority, setPriority] = useState<'Low'|'Medium'|'High'|'Urgent'>(taskToEdit?.priority || 'Medium');
  const [dueDate, setDueDate] = useState(taskToEdit?.dueDate || initialDueDate || '');
  const [assignee, setAssignee] = useState<Assignee>(taskToEdit?.assignee || members[0]);
  const [selectedLabels, setSelectedLabels] = useState<string[]>(taskToEdit?.labels || []);
  
  const [formErrors, setFormErrors] = useState<{title?: string; dueDate?: string}>({});

  const toggleLabel = (lbl: string) => {
    setSelectedLabels(prev => prev.includes(lbl) ? prev.filter(l => l !== lbl) : [...prev, lbl]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: any = {};
    if (title.trim().length < 3) errors.title = 'Title must be at least 3 characters.';
    if (!dueDate) errors.dueDate = 'Due date is required.';
    
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    const result = TaskZodSchema.safeParse({
      title, description, status, priority, dueDate
    });

    if (!result.success) {
      setFormErrors(result.error!.format() as any);
      return;
    }

    result.data.assignee = assignee;
    result.data.labels = selectedLabels;
    result.data.subtasks = [];
    result.data.comments = [];
    result.data.attachments = [];
    result.data.dealReference = null;
    
    onSubmit(result.data);
  };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }} />

      <div style={{ 
        position: 'relative', 
        width: '100%', 
        maxWidth: 550, 
        background: '#fbfafc', 
        borderRadius: 20, 
        boxShadow: '0 24px 64px rgba(0,0,0,0.2)', 
        display: 'flex', 
        flexDirection: 'column', 
        overflow: 'hidden', 
        maxHeight: '90vh' 
      }}>
        
        <div style={{ padding: '24px 32px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ margin: 0, fontSize: 22, fontWeight: 700, fontFamily: 'Georgia, serif', color: '#1e1b4b', letterSpacing: '-0.5px' }}>
            {taskToEdit ? 'Edit Task' : 'Schedule New Task'}
          </h3>
          <button onClick={onClose} style={{ background: '#f4ebff', border: 'none', width: 32, height: 32, borderRadius: '50%', cursor: 'pointer', color: '#9333ea', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.2s' }}>
            <X size={18} strokeWidth={2.5} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: '0px 32px 32px', display: 'flex', flexDirection: 'column', gap: 20, overflowY: 'auto' }} className="custom-scrollbar">
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px', color: '#9333ea' }}>Task Title</label>
            <input
              type="text"
              required
              placeholder="e.g. Audit regional liabilities"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (formErrors.title) setFormErrors(prev => ({ ...prev, title: '' }));
              }}
              style={{ 
                width: '100%', 
                padding: '12px 16px', 
                fontSize: 14, 
                borderRadius: 10, 
                border: `1px solid ${formErrors.title ? '#ef4444' : '#e9d5ff'}`, 
                background: '#f4ebff', 
                color: '#4c1d95',
                outline: 'none',
                fontWeight: 500
              }}
            />
            {formErrors.title && <p style={{ margin: 0, fontSize: 12, color: '#ef4444', fontWeight: 600 }}>{formErrors.title}</p>}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px', color: '#9333ea' }}>Initial Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                style={{ 
                  width: '100%', 
                  padding: '12px 16px', 
                  fontSize: 14, 
                  fontWeight: 500,
                  borderRadius: 10, 
                  border: '1px solid #e9d5ff', 
                  background: '#f4ebff', 
                  color: '#4c1d95',
                  cursor: 'pointer',
                  outline: 'none'
                }}
              >
                {columns.map(col => <option key={col} value={col}>{col}</option>)}
              </select>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px', color: '#9333ea' }}>Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as any)}
                style={{ 
                  width: '100%', 
                  padding: '12px 16px', 
                  fontSize: 14, 
                  fontWeight: 500,
                  borderRadius: 10, 
                  border: '1px solid #e9d5ff', 
                  background: '#f4ebff', 
                  color: '#4c1d95',
                  cursor: 'pointer',
                  outline: 'none'
                }}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Urgent">Urgent</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px', color: '#9333ea' }}>Label Tags</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center', marginTop: 4 }}>
              {PRESET_LABELS.map((lbl, idx) => {
                const isSelected = selectedLabels.includes(lbl);
                const colors = ['#4f46e5', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#8b5cf6', '#06b6d4', '#84cc16', '#f97316'];
                const color = colors[idx % colors.length];
                return (
                  <button
                    key={lbl}
                    type="button"
                    onClick={() => toggleLabel(lbl)}
                    title={lbl}
                    style={{ 
                      width: 28, 
                      height: 28, 
                      borderRadius: '50%', 
                      background: color,
                      border: isSelected ? `3px solid #1e1b4b` : '2px solid transparent',
                      boxShadow: isSelected ? '0 0 0 2px #fff inset' : 'none',
                      cursor: 'pointer',
                      padding: 0,
                      transition: 'transform 0.1s'
                    }}
                  />
                );
              })}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px', color: '#9333ea' }}>Date</label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => {
                  setDueDate(e.target.value);
                  if (formErrors.dueDate) setFormErrors(prev => ({ ...prev, dueDate: '' }));
                }}
                style={{ 
                  width: '100%', 
                  padding: '12px 16px', 
                  fontSize: 14, 
                  fontWeight: 500,
                  borderRadius: 10, 
                  border: `1px solid ${formErrors.dueDate ? '#ef4444' : '#e9d5ff'}`, 
                  background: '#f4ebff', 
                  color: '#4c1d95',
                  cursor: 'pointer',
                  outline: 'none'
                }}
              />
              {formErrors.dueDate && <p style={{ margin: 0, fontSize: 12, color: '#ef4444', fontWeight: 600 }}>{formErrors.dueDate}</p>}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px', color: '#9333ea' }}>Assignee</label>
              <select
                value={assignee.id}
                onChange={(e) => {
                  const match = members.find(m => m.id === e.target.value);
                  if (match) setAssignee(match);
                }}
                style={{ 
                  width: '100%', 
                  padding: '12px 16px', 
                  fontSize: 14, 
                  fontWeight: 500,
                  borderRadius: 10, 
                  border: '1px solid #e9d5ff', 
                  background: '#f4ebff', 
                  color: '#4c1d95',
                  cursor: 'pointer',
                  outline: 'none'
                }}
              >
                {members.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px', color: '#9333ea' }}>Description</label>
            <textarea
              placeholder="Provide more details..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={{ 
                width: '100%', 
                padding: '12px 16px', 
                borderRadius: 10, 
                border: '1px solid #e9d5ff', 
                background: '#f4ebff', 
                color: '#4c1d95',
                outline: 'none', 
                fontSize: 14, 
                minHeight: 60, 
                resize: 'vertical',
                fontWeight: 500
              }}
            />
          </div>

          <div style={{ paddingTop: 8, display: 'flex', justifyContent: 'flex-end', gap: 16 }}>
            <button
              type="button"
              onClick={onClose}
              style={{ 
                padding: '10px 24px', 
                fontSize: 14, 
                fontWeight: 700, 
                borderRadius: 24, 
                border: '1px solid #e9d5ff', 
                background: 'transparent',
                color: '#1e1b4b',
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              style={{ 
                padding: '10px 24px', 
                fontSize: 14, 
                fontWeight: 700, 
                borderRadius: 24, 
                background: 'linear-gradient(135deg, #a855f7 0%, #7c3aed 100%)', 
                color: '#fff', 
                border: 'none', 
                boxShadow: '0 4px 12px rgba(124,92,237,0.3)',
                cursor: 'pointer'
              }}
            >
              {taskToEdit ? 'Save Changes' : 'Schedule Task'}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
