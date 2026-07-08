"use client";
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useTheme } from '@/components/ThemeProvider';
import {
  Kanban,
  List,
  Table2,
  Calendar as CalendarIcon,
  Plus,
  Search,
  Filter,
  ArrowUpDown,
  SlidersHorizontal,
  CheckSquare,
  MessageSquare,
  Paperclip,
  Clock,
  Tag,
  UserPlus,
  MoreHorizontal,
  Trash2,
  X,
  ChevronRight,
  ExternalLink,
  CheckCircle2,
  User,
  Grid,
  FileText,
  CornerDownRight,
  Check,
  AlertTriangle,
  Flame,
  Briefcase,
  ChevronDown,
  Edit2,
  CalendarDays,
  Menu,
  Sun,
  Moon
} from 'lucide-react';

// --- INITIAL MOCK DATA ---
const INITIAL_COLUMNS = ['To Do', 'In Progress', 'Review', 'Done'];

const MEMBERS = [
  { id: 'm1', name: 'Sarah Connor', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150', email: 'sarah@acme-crm.com' },
  { id: 'm2', name: 'Marcus Wright', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', email: 'marcus@acme-crm.com' },
  { id: 'm3', name: 'John Doe', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150', email: 'john@acme-crm.com' },
  { id: 'm4', name: 'Elena Rostova', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150', email: 'elena@acme-crm.com' },
];

const PRESET_LABELS = ['Marketing', 'Development', 'Design', 'Legal', 'Enterprise', 'Security'];

const INITIAL_TASKS = [
  {
    id: 'task-1',
    title: 'Migrate pipeline database to secure cloud hosting',
    description: 'We need to move the production client records into the isolated EU-West database shard for complete compliance. Make sure the testing pipeline is verified with green checks first.',
    status: 'To Do',
    assignee: MEMBERS[0],
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
    assignee: MEMBERS[3],
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
    assignee: MEMBERS[1],
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
    assignee: MEMBERS[2],
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

export default function App() {
  // Theme & Layout States
  const { theme, setTheme } = useTheme();
  const darkMode = theme === 'dark';


  const [view, setView] = useState('Board'); // 'Board' | 'List' | 'Table' | 'Calendar'

  // Data States
  const [tasks, setTasks] = useState(INITIAL_TASKS);
  const [columns, setColumns] = useState(INITIAL_COLUMNS);

  // Selection and Side Panel
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [bulkSelection, setBulkSelection] = useState([]);

  // Toolbar Filter/Sort States
  const [searchQuery, setSearchQuery] = useState('');
  const [filterAssignee, setFilterAssignee] = useState('All');
  const [filterPriority, setFilterPriority] = useState('All');
  const [filterTag, setFilterTag] = useState('All');
  const [sortBy, setSortBy] = useState('None'); // 'None' | 'dueDate' | 'priority' | 'title'
  const [groupBy, setGroupBy] = useState('Status'); // 'Status' | 'Priority' | 'Assignee'

  // Modal / Creator States
  const [isNewTaskModalOpen, setIsNewTaskModalOpen] = useState(false);
  const [newColumnName, setNewColumnName] = useState('');
  const [isAddingColumn, setIsAddingColumn] = useState(false);

  // Active task details helper
  const activeTask = useMemo(() => {
    return tasks.find(t => t.id === selectedTaskId) || null;
  }, [tasks, selectedTaskId]);

  // Open sidebar with specific task
  const handleOpenTaskDetails = (taskId) => {
    setSelectedTaskId(taskId);
    setIsSidebarOpen(true);
  };

  // Close sidebar
  const handleCloseTaskDetails = () => {
    setIsSidebarOpen(false);
    setSelectedTaskId(null);
  };

  // Drag and Drop implementation
  const [draggedTaskId, setDraggedTaskId] = useState(null);
  const [activeDragOverColumn, setActiveDragOverColumn] = useState(null);

  const handleDragStart = (e, taskId) => {
    setDraggedTaskId(taskId);
    e.dataTransfer.setData('text/plain', taskId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e, columnId) => {
    e.preventDefault();
    if (activeDragOverColumn !== columnId) {
      setActiveDragOverColumn(columnId);
    }
  };

  const handleDrop = (e, targetColumnId) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('text/plain') || draggedTaskId;
    if (taskId) {
      setTasks(prevTasks => prevTasks.map(t => {
        if (t.id === taskId) {
          return { ...t, status: targetColumnId };
        }
        return t;
      }));
    }
    setDraggedTaskId(null);
    setActiveDragOverColumn(null);
  };

  const handleDragEnd = () => {
    setDraggedTaskId(null);
    setActiveDragOverColumn(null);
  };

  // Add Task Function
  const handleAddTask = (taskData) => {
    const newTask = {
      id: `task-${Date.now()}`,
      title: taskData.title || 'Untitled Task',
      description: taskData.description || '',
      status: taskData.status || columns[0],
      assignee: taskData.assignee || MEMBERS[0],
      priority: taskData.priority || 'Medium',
      dueDate: taskData.dueDate || new Date().toISOString().split('T')[0],
      subtasks: taskData.subtasks || [],
      comments: [],
      labels: taskData.labels || [],
      dealReference: taskData.dealReference || null,
      attachments: []
    };
    setTasks(prev => [newTask, ...prev]);
    setIsNewTaskModalOpen(false);
  };

  // Delete Task
  const handleDeleteTask = (taskId) => {
    setTasks(prev => prev.filter(t => t.id !== taskId));
    if (selectedTaskId === taskId) {
      handleCloseTaskDetails();
    }
    setBulkSelection(prev => prev.filter(id => id !== taskId));
  };

  // Update Task detail directly
  const handleUpdateTask = (updatedTask) => {
    setTasks(prev => prev.map(t => t.id === updatedTask.id ? updatedTask : t));
  };

  // Add Column
  const handleAddColumn = (e) => {
    e.preventDefault();
    if (newColumnName.trim() && !columns.includes(newColumnName.trim())) {
      setColumns([...columns, newColumnName.trim()]);
      setNewColumnName('');
      setIsAddingColumn(false);
    }
  };

  // Delete Column (removes and resets tasks in it to the first column)
  const handleDeleteColumn = (columnName) => {
    if (columns.length <= 1) return;
    const remainingColumns = columns.filter(c => c !== columnName);
    const fallbackColumn = remainingColumns[0];

    setColumns(remainingColumns);
    setTasks(prev => prev.map(t => t.status === columnName ? { ...t, status: fallbackColumn } : t));
  };

  // Bulk Actions
  const handleBulkDelete = () => {
    setTasks(prev => prev.filter(t => !bulkSelection.includes(t.id)));
    setBulkSelection([]);
  };

  const handleBulkStatusChange = (newStatus) => {
    setTasks(prev => prev.map(t => bulkSelection.includes(t.id) ? { ...t, status: newStatus } : t));
    setBulkSelection([]);
  };

  // Filtering and Sorting Process
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
        return new Date(a.dueDate) - new Date(b.dueDate);
      }
      if (sortBy === 'priority') {
        const priorityWeight = { 'Urgent': 4, 'High': 3, 'Medium': 2, 'Low': 1 };
        return (priorityWeight[b.priority] || 0) - (priorityWeight[a.priority] || 0);
      }
      if (sortBy === 'title') {
        return a.title.localeCompare(b.title);
      }
      return 0; // None
    });
  }, [tasks, searchQuery, filterAssignee, filterPriority, filterTag, sortBy]);

  return (
    <div className={`flex flex-col h-[calc(100vh-64px)] w-full font-sans transition-colors duration-200 ${darkMode ? 'bg-[#090812]' : 'bg-transparent'}`}>

      <div className={`flex flex-1 overflow-hidden relative ${darkMode ? 'bg-transparent' : 'bg-transparent'}`}>

        {/* MAIN WORKSPACE CONTENT PANEL */}
        <main className="flex-1 flex flex-col h-full overflow-hidden relative">

          {/* TOP BAR / HEADER */}
          <header className={`shrink-0 px-6 py-5 border-b flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 transition-colors duration-200 ${darkMode ? 'bg-transparent border-white/5' : 'bg-transparent border-black/5'}`}>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-violet-500/10 text-violet-500 rounded-lg md:hidden">
                <Kanban className="w-5 h-5" />
              </div>
              <div>
                <div className={`text-[11px] font-bold uppercase tracking-widest ${darkMode ? 'text-slate-400' : 'text-violet-600/70'}`}>CRM Pipeline</div>
                <h2 className={`text-[22px] font-bold tracking-tight mt-0.5 ${darkMode ? 'text-white' : 'text-slate-900'}`}>Enterprise Client Tasks</h2>
              </div>
            </div>

            {/* Right section: Tabs Switcher & Actions */}
            <div className="flex flex-wrap items-center gap-4">
              {/* Tab Selector */}
              <div className={`flex items-center gap-1 p-1 rounded-lg border ${darkMode ? 'bg-[#100F18] border-white/5' : 'bg-white/40 border-black/5 backdrop-blur-sm'}`}>
                {[
                  { name: 'Board', icon: Kanban },
                  { name: 'List', icon: List },
                  { name: 'Table', icon: Table2 },
                  { name: 'Calendar', icon: CalendarIcon }
                ].map(t => {
                  const IconComp = t.icon;
                  const isActive = view === t.name;
                  return (
                    <button
                      key={t.name}
                      onClick={() => setView(t.name)}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-[13px] font-medium transition-all ${isActive
                          ? (darkMode ? 'bg-[#2D2A4A]/60 text-violet-300 shadow-sm' : 'bg-white text-violet-600 shadow-sm')
                          : (darkMode ? 'text-slate-400 hover:text-slate-200 bg-transparent' : 'text-slate-600/70 hover:text-slate-900 bg-transparent')
                        }`}
                    >
                      <IconComp className="w-4 h-4 shrink-0" />
                      <span className="whitespace-nowrap">{t.name}</span>
                    </button>
                  );
                })}
              </div>

              {/* Theme Toggle for small viewport */}
              <button
                onClick={() => setTheme(darkMode ? 'light' : 'dark')}
                className="md:hidden p-2 rounded-lg border dark:border-slate-800 dark:bg-slate-900 text-slate-400 hover:text-slate-200"
              >
                {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>

              {/* Primary +New Task trigger */}
              <button
                onClick={() => setIsNewTaskModalOpen(true)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-sm font-bold shadow-md transition-all active:scale-[0.98] whitespace-nowrap shrink-0"
              >
                <Plus className="w-5 h-5 shrink-0 stroke-[2.5]" />
                <span>Add Task</span>
              </button>
            </div>
          </header>

          {/* DYNAMIC TOOLBAR (Search, Filters, Sorters) */}
          <div className={`shrink-0 px-6 py-4 border-b flex flex-wrap items-center justify-between gap-4 transition-colors duration-200 ${darkMode ? 'bg-transparent border-white/5' : 'bg-transparent border-black/5'}`}>
            <div className="flex flex-wrap items-center gap-4 w-full lg:w-auto">

              {/* Row 1: Search & Owner */}
              <div className="flex flex-wrap items-center gap-4 flex-1">
                {/* Search */}
                <div className="relative min-w-[200px] w-full sm:w-64">
                  <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search tasks, descriptions..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={`w-full pl-9 pr-4 py-1.5 text-sm rounded-lg outline-none border focus:ring-1 transition-all h-[36px] ${darkMode
                        ? 'bg-[#12111D] border-white/5 focus:border-violet-500 focus:ring-violet-500 text-white placeholder-slate-500'
                        : 'bg-white/60 backdrop-blur border-black/5 focus:border-violet-400 focus:ring-violet-400 text-slate-800'
                      }`}
                  />
                  {searchQuery && (
                    <button onClick={() => setSearchQuery('')} className="absolute right-3 top-2.5">
                      <X className="w-4 h-4 text-slate-400 hover:text-slate-200" />
                    </button>
                  )}
                </div>

                {/* Filter Assignee */}
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-slate-300 font-bold uppercase tracking-widest whitespace-nowrap">Owner</span>
                  <select
                    value={filterAssignee}
                    onChange={(e) => setFilterAssignee(e.target.value)}
                    className={`px-3 py-1.5 text-sm rounded-lg border outline-none cursor-pointer h-[36px] ${darkMode ? 'bg-[#12111D] border-white/5 text-slate-300' : 'bg-white/60 backdrop-blur border-black/5 text-slate-700'
                      }`}
                  >
                    <option value="All">All Members</option>
                    {MEMBERS.map(m => (
                      <option key={m.id} value={m.id}>{m.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Row 2: Priority & Tag */}
              <div className="flex flex-wrap items-center gap-4">
                {/* Filter Priority */}
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-slate-300 font-bold uppercase tracking-widest whitespace-nowrap">Priority</span>
                  <select
                    value={filterPriority}
                    onChange={(e) => setFilterPriority(e.target.value)}
                    className={`px-3 py-1.5 text-sm rounded-lg border outline-none cursor-pointer h-[36px] ${darkMode ? 'bg-[#12111D] border-white/5 text-slate-300' : 'bg-white/60 backdrop-blur border-black/5 text-slate-700'
                      }`}
                  >
                    <option value="All">All Priorities</option>
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Urgent">Urgent</option>
                  </select>
                </div>

                {/* Filter Tag */}
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-slate-300 font-bold uppercase tracking-widest whitespace-nowrap">Tag</span>
                  <select
                    value={filterTag}
                    onChange={(e) => setFilterTag(e.target.value)}
                    className={`px-3 py-1.5 text-sm rounded-lg border outline-none cursor-pointer h-[36px] ${darkMode ? 'bg-[#12111D] border-white/5 text-slate-300' : 'bg-white/60 backdrop-blur border-black/5 text-slate-700'
                      }`}
                  >
                    <option value="All">All Tags</option>
                    {PRESET_LABELS.map(tag => (
                      <option key={tag} value={tag}>{tag}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Sort & Group */}
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest whitespace-nowrap">
                <ArrowUpDown className="w-3 h-3 inline mr-1" />
                Sort by:
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className={`px-3 py-1.5 text-sm rounded-lg border outline-none cursor-pointer h-[36px] ${darkMode ? 'bg-[#12111D] border-white/5 text-slate-300' : 'bg-white/60 backdrop-blur border-black/5 text-slate-700'
                  }`}
              >
                <option value="None">None</option>
                <option value="dueDate">Due Date</option>
                <option value="priority">Priority</option>
                <option value="title">Title</option>
              </select>
            </div>
          </div>

          {/* BULK ACTIONS STRIP */}
          {bulkSelection.length > 0 && (
            <div className="shrink-0 bg-violet-600/10 border-b border-violet-500/20 px-6 py-2.5 flex items-center justify-between transition-all">
              <div className="flex items-center gap-2 text-xs font-semibold text-violet-400">
                <CheckCircle2 className="w-4 h-4 text-violet-500 animate-pulse" />
                <span>{bulkSelection.length} tasks selected</span>
              </div>
              <div className="flex items-center gap-2">
                <select
                  onChange={(e) => handleBulkStatusChange(e.target.value)}
                  defaultValue=""
                  className="px-2 py-1 text-xs rounded border border-violet-500/30 bg-slate-900 text-slate-300 outline-none"
                >
                  <option value="" disabled>Move to...</option>
                  {columns.map(col => (
                    <option key={col} value={col}>{col}</option>
                  ))}
                </select>
                <button
                  onClick={handleBulkDelete}
                  className="flex items-center gap-1 px-2.5 py-1 rounded bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete</span>
                </button>
                <button
                  onClick={() => setBulkSelection([])}
                  className="p-1 text-slate-400 hover:text-slate-200"
                  title="Clear Selection"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* DYNAMIC VIEWS container */}
          <div className="flex-1 overflow-auto p-6 relative">
            {view === 'Board' && (
              <BoardView
                columns={columns}
                tasks={filteredTasks}
                darkMode={darkMode}
                activeDragOverColumn={activeDragOverColumn}
                handleDragStart={handleDragStart}
                handleDragOver={handleDragOver}
                handleDrop={handleDrop}
                handleDragEnd={handleDragEnd}
                handleOpenTaskDetails={handleOpenTaskDetails}
                handleDeleteColumn={handleDeleteColumn}
                isAddingColumn={isAddingColumn}
                setIsAddingColumn={setIsAddingColumn}
                newColumnName={newColumnName}
                setNewColumnName={setNewColumnName}
                handleAddColumn={handleAddColumn}
              />
            )}

            {view === 'List' && (
              <ListView
                tasks={filteredTasks}
                darkMode={darkMode}
                bulkSelection={bulkSelection}
                setBulkSelection={setBulkSelection}
                handleOpenTaskDetails={handleOpenTaskDetails}
                handleDeleteTask={handleDeleteTask}
                columns={columns}
                handleUpdateTask={handleUpdateTask}
              />
            )}

            {view === 'Table' && (
              <TableView
                tasks={filteredTasks}
                darkMode={darkMode}
                bulkSelection={bulkSelection}
                setBulkSelection={setBulkSelection}
                handleOpenTaskDetails={handleOpenTaskDetails}
                handleDeleteTask={handleDeleteTask}
                columns={columns}
                handleUpdateTask={handleUpdateTask}
              />
            )}

            {view === 'Calendar' && (
              <CalendarView
                tasks={filteredTasks}
                darkMode={darkMode}
                handleOpenTaskDetails={handleOpenTaskDetails}
                handleAddTask={handleAddTask}
              />
            )}
          </div>

        </main>

        {/* SIDEBAR DETAIL SLIDE-OVER */}
        <div className={`fixed inset-y-0 right-0 w-full sm:w-[540px] shadow-2xl z-50 transform transition-transform duration-300 ease-out flex flex-col ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'
          } ${darkMode ? 'bg-slate-900 border-l border-slate-800 text-slate-100' : 'bg-white border-l border-slate-200 text-slate-900'}`}>
          {activeTask && (
            <TaskDetailSidebar
              task={activeTask}
              onClose={handleCloseTaskDetails}
              onUpdate={handleUpdateTask}
              onDelete={handleDeleteTask}
              columns={columns}
              members={MEMBERS}
              darkMode={darkMode}
            />
          )}
        </div>

        {/* Backdrop for detail sidebar */}
        {isSidebarOpen && (
          <div
            onClick={handleCloseTaskDetails}
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-40"
          />
        )}

      </div>

      {/* NEW TASK MODAL */}
      {isNewTaskModalOpen && (
        <NewTaskModal
          onClose={() => setIsNewTaskModalOpen(false)}
          onSubmit={handleAddTask}
          columns={columns}
          members={MEMBERS}
          darkMode={darkMode}
        />
      )}

    </div>
  );
}

// --- SUB-COMPONENTS BELOW ---

// 1. BOARD VIEW
function BoardView({
  columns,
  tasks,
  darkMode,
  activeDragOverColumn,
  handleDragStart,
  handleDragOver,
  handleDrop,
  handleDragEnd,
  handleOpenTaskDetails,
  handleDeleteColumn,
  isAddingColumn,
  setIsAddingColumn,
  newColumnName,
  setNewColumnName,
  handleAddColumn
}) {
  const STAGE_COLOR_PALETTE = [
    { color: 'new', headerColor: '#3b82f6' },
    { color: 'engaged', headerColor: '#7c5cbf' },
    { color: 'qualified', headerColor: '#f59e0b' },
    { color: 'proposal', headerColor: '#6366f1' },
    { color: 'negotiation', headerColor: '#f97316' },
    { color: 'won', headerColor: '#10b981' },
    { color: 'lost', headerColor: '#f43f5e' },
  ];

  return (
    <div className="flex gap-[20px] h-full select-none pb-4 items-start w-full overflow-x-auto custom-scrollbar">
      {columns.map((col, index) => {
        const columnTasks = tasks.filter(t => t.status === col);
        const isDragOver = activeDragOverColumn === col;
        const palette = STAGE_COLOR_PALETTE[index % STAGE_COLOR_PALETTE.length];

        return (
          <div
            key={col}
            className="w-[360px] shrink-0"
            onDragOver={(e) => handleDragOver(e, col)}
            onDrop={(e) => handleDrop(e, col)}
            style={{ opacity: 1 }}
          >
            {/* Column Header */}
            <div
              className="flex items-center justify-between px-5 py-4 rounded-t-[12px] bg-[var(--bg-card)] border-r border-b border-l border-[var(--border)] border-t-[4px] shadow-sm"
              style={{ borderTopColor: palette.headerColor }}
            >
              <span className="text-[15px] font-bold text-[var(--text-secondary)]">{col}</span>
              <div className="flex items-center gap-2">
                <span className={`pipeline-col-count ${palette.color} text-[13px] font-bold px-2.5 py-0.5 rounded-lg`}>
                  {columnTasks.length}
                </span>
                <button
                  onClick={() => handleDeleteColumn(col)}
                  disabled={columns.length <= 1}
                  title="Delete column"
                  className={`text-sm bg-transparent border-none cursor-pointer transition-opacity ${columns.length <= 1 ? 'opacity-30 cursor-not-allowed' : 'opacity-100 hover:scale-110'}`}
                  style={{ color: columns.length <= 1 ? 'var(--text-muted)' : 'var(--rose)' }}
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Cards Space */}
            <div
              className="flex flex-col gap-4 p-4 min-h-[150px] rounded-b-[12px] border-r border-b border-l border-t-0 transition-all duration-200"
              style={{
                background: isDragOver ? 'var(--purple-dim)' : 'var(--bg-glass)',
                borderColor: isDragOver ? 'var(--purple)' : 'var(--border)'
              }}
            >
              {columnTasks.map(task => (
                <div
                  key={task.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, task.id)}
                  onDragEnd={handleDragEnd}
                  onClick={() => handleOpenTaskDetails(task.id)}
                  className="relative p-5 rounded-[16px] cursor-grab active:cursor-grabbing bg-[var(--bg-card)] border border-[var(--border)] shadow-sm hover:shadow-md hover:border-[#7b2fff]/40 hover:-translate-y-0.5 transition-all duration-200 group"
                >
                  <div className="text-[16px] font-bold mb-1.5 text-[var(--text-primary)] group-hover:text-[#7b2fff] transition-colors">
                    {task.title}
                  </div>

                  {task.description && (
                    <div className="text-[13px] mb-3 line-clamp-2 text-[var(--text-muted)] leading-relaxed">
                      {task.description}
                    </div>
                  )}

                  {/* Tags display on card */}
                  {task.labels && task.labels.length > 0 && (
                    <div className="flex gap-1.5 flex-wrap mb-4">
                      {task.labels.map(l => (
                        <span key={l} className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-[var(--bg-primary)] border border-[var(--border)] text-[var(--text-secondary)]">
                          {l}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center justify-between mt-auto pt-2 border-t border-[var(--border)]">
                    <span className="text-[14px] font-bold tracking-wide" style={{
                      color: task.priority === 'Urgent' ? 'var(--rose)' : task.priority === 'High' ? 'var(--amber)' : 'var(--emerald)'
                    }}>
                      {task.priority}
                    </span>
                    <div className="flex items-center gap-3">
                      <span className="text-[12px] font-medium text-[var(--text-muted)] flex items-center gap-1">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                        {task.dueDate}
                      </span>
                      {task.assignee && (
                        <img
                          src={task.assignee.avatar}
                          alt={task.assignee.name}
                          className="w-8 h-8 rounded-full object-cover ring-2 ring-[var(--bg-card)] shadow-sm"
                          title={task.assignee.name}
                        />
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {columnTasks.length === 0 && (
                <div className="py-10 text-center text-[13px] font-medium rounded-[12px] border-2 border-dashed text-[var(--text-muted)] border-[var(--border)]">
                  Empty status
                </div>
              )}

              <div className="mt-auto p-3 text-center text-[13px] font-semibold rounded-[12px] border-2 border-dashed bg-transparent cursor-pointer transition-all duration-200 text-[var(--text-muted)] border-[var(--border)] hover:bg-[var(--bg-card)] hover:text-[var(--text-primary)] hover:border-[var(--text-muted)]">
                + Add Task
              </div>
            </div>
          </div>
        );
      })}

      {/* Add Column */}
      <div className="w-[300px] shrink-0">
        {isAddingColumn ? (
          <form
            onSubmit={handleAddColumn}
            className="flex flex-col gap-3 p-4 rounded-[12px] border bg-[var(--bg-card)] border-[var(--border)] shadow-sm"
          >
            <input
              autoFocus
              value={newColumnName}
              onChange={e => setNewColumnName(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Escape') { setIsAddingColumn(false); setNewColumnName(''); }
              }}
              placeholder="Column title..."
              className="w-full px-3 py-2.5 text-[14px] font-medium rounded-lg border outline-none bg-[var(--bg-secondary)] border-[var(--border)] text-[var(--text-primary)] focus:border-[#7b2fff]/50 transition-colors"
            />
            <div className="flex gap-2">
              <button type="submit" className="btn btn-primary flex-1 py-2 text-[13px]">
                Add Column
              </button>
              <button
                type="button"
                onClick={() => { setIsAddingColumn(false); setNewColumnName(''); }}
                className="btn btn-ghost px-4 py-2 text-[13px]"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <button
            onClick={() => setIsAddingColumn(true)}
            className="w-full h-[60px] text-[14px] font-bold rounded-[12px] border-2 border-dashed bg-transparent cursor-pointer text-[var(--text-muted)] border-[var(--border)] hover:bg-[var(--bg-card)] hover:text-[var(--text-primary)] transition-all duration-200"
          >
            + Add New Column
          </button>
        )}
      </div>
    </div>
  );
}

// 2. LIST VIEW
function ListView({ tasks, darkMode, bulkSelection, setBulkSelection, handleOpenTaskDetails, handleDeleteTask, columns, handleUpdateTask }) {
  const handleToggleSelectAll = () => {
    if (bulkSelection.length === tasks.length) {
      setBulkSelection([]);
    } else {
      setBulkSelection(tasks.map(t => t.id));
    }
  };

  const handleToggleSelectOne = (taskId) => {
    if (bulkSelection.includes(taskId)) {
      setBulkSelection(prev => prev.filter(id => id !== taskId));
    } else {
      setBulkSelection(prev => [...prev, taskId]);
    }
  };

  return (
    <div className="min-w-[950px] flex flex-col">
      {/* Table Header */}
      <div className={`flex items-center px-6 py-3 text-xs font-bold uppercase tracking-wider mb-3 rounded-xl ${darkMode ? 'bg-[#12111D] text-[#8c829e] border border-white/10' : 'bg-white text-slate-500 border border-slate-200 shadow-sm'
        }`}>
        <div className="w-12 flex justify-center shrink-0">
          <input
            type="checkbox"
            checked={tasks.length > 0 && bulkSelection.length === tasks.length}
            onChange={handleToggleSelectAll}
            className={`w-4 h-4 rounded cursor-pointer ${darkMode
                ? 'bg-[#1A1625] border-white/20 checked:bg-violet-600'
                : 'border-slate-300 text-violet-600 focus:ring-violet-500'
              }`}
            style={darkMode ? { appearance: 'none', WebkitAppearance: 'none' } : {}}
          />
        </div>
        <div className="flex-1 pr-4 min-w-0">Title / Task Description</div>
        <div className="w-40 shrink-0">Status</div>
        <div className="w-36 shrink-0">Priority</div>
        <div className="w-40 shrink-0">Due Date</div>
        <div className="w-44 shrink-0">Assignee</div>
        <div className="w-48 shrink-0">Linked Deal</div>
        <div className="w-16 shrink-0 text-center">Action</div>
      </div>

      {/* Task Rows (Individual Cards) */}
      <div className="flex flex-col space-y-3">
        {tasks.map(task => {
          const isSelected = bulkSelection.includes(task.id);
          return (
            <div
              key={task.id}
              className={`flex items-center px-6 py-5 rounded-xl border transition-all group shadow-sm hover:shadow-md ${darkMode
                  ? `border-white/10 ${isSelected ? 'bg-violet-900/20 border-violet-500/50' : 'bg-[#12111D] hover:bg-white/[0.04]'}`
                  : `border-slate-200 ${isSelected ? 'bg-violet-50 border-violet-300' : 'bg-white hover:bg-slate-50'}`
                }`}
            >
              {/* Checkbox */}
              <div className="w-12 flex justify-center shrink-0">
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => handleToggleSelectOne(task.id)}
                  className={`w-4 h-4 rounded cursor-pointer ${darkMode
                      ? 'bg-transparent border border-white/30 checked:bg-white checked:border-white'
                      : 'border-slate-300 text-violet-600 focus:ring-violet-500'
                    }`}
                  style={darkMode ? { appearance: 'none', WebkitAppearance: 'none', boxShadow: isSelected ? 'inset 0 0 0 2px #12111D' : 'none' } : {}}
                />
              </div>

              {/* Title & Description */}
              <div className="flex-1 pr-6 min-w-0 flex flex-col justify-center">
                <button
                  onClick={() => handleOpenTaskDetails(task.id)}
                  className={`text-left font-semibold text-[15px] truncate transition-colors ${darkMode ? 'text-slate-100 hover:text-violet-400' : 'text-slate-900 hover:text-violet-600'
                    }`}
                >
                  {task.title}
                </button>
                {task.description && (
                  <div className={`text-[13px] truncate mt-1 ${darkMode ? 'text-[#8c829e]' : 'text-slate-500'
                    }`}>
                    {task.description}
                  </div>
                )}
              </div>

              {/* Status */}
              <div className="w-40 shrink-0 pr-6">
                <div className="relative">
                  <select
                    value={task.status}
                    onChange={(e) => handleUpdateTask({ ...task, status: e.target.value })}
                    className={`w-full appearance-none pl-3.5 pr-8 py-2 text-[13px] font-medium rounded-lg border outline-none cursor-pointer ${darkMode
                        ? 'bg-[#1A1625] border-white/10 text-slate-300 focus:border-violet-500/50'
                        : 'bg-slate-50 border-slate-200 text-slate-700 focus:border-violet-400'
                      }`}
                  >
                    {columns.map(col => (
                      <option key={col} value={col}>{col}</option>
                    ))}
                  </select>
                  <ChevronDown className={`absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none ${darkMode ? 'text-[#8c829e]' : 'text-slate-400'}`} />
                </div>
              </div>

              {/* Priority */}
              <div className="w-36 shrink-0 pr-6">
                <div className="relative">
                  <select
                    value={task.priority}
                    onChange={(e) => handleUpdateTask({ ...task, priority: e.target.value })}
                    className={`w-full appearance-none pl-3.5 pr-8 py-2 text-[13px] font-medium rounded-lg border outline-none cursor-pointer ${darkMode
                        ? 'bg-[#1A1625] border-white/10 text-slate-300 focus:border-violet-500/50'
                        : 'bg-slate-50 border-slate-200 text-slate-700 focus:border-violet-400'
                      }`}
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Urgent">Urgent</option>
                  </select>
                  <ChevronDown className={`absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none ${darkMode ? 'text-[#8c829e]' : 'text-slate-400'}`} />
                </div>
              </div>

              {/* Due Date */}
              <div className="w-40 shrink-0 pr-6">
                <input
                  type="date"
                  value={task.dueDate}
                  onChange={(e) => handleUpdateTask({ ...task, dueDate: e.target.value })}
                  className={`w-full px-3.5 py-2 text-[13px] font-medium rounded-lg border outline-none cursor-pointer ${darkMode
                      ? 'bg-[#1A1625] border-white/10 text-slate-300 focus:border-violet-500/50 [color-scheme:dark]'
                      : 'bg-slate-50 border-slate-200 text-slate-700 focus:border-violet-400'
                    }`}
                />
              </div>

              {/* Assignee */}
              <div className="w-44 shrink-0 pr-6 flex items-center gap-3">
                <img
                  src={task.assignee.avatar}
                  alt={task.assignee.name}
                  className={`w-8 h-8 rounded-full object-cover ring-2 ${darkMode ? 'ring-[#1A1625]' : 'ring-white'}`}
                />
                <span className={`text-[13px] font-semibold truncate ${darkMode ? 'text-slate-200' : 'text-slate-700'}`}>
                  {task.assignee.name}
                </span>
              </div>

              {/* Linked Deal */}
              <div className="w-48 shrink-0 pr-6">
                {task.dealReference ? (
                  <div className={`inline-flex items-center gap-2 max-w-full px-3 py-1.5 rounded-lg text-xs font-semibold border ${darkMode
                      ? 'bg-violet-500/10 border-violet-500/20 text-violet-300'
                      : 'bg-violet-50 border-violet-200 text-violet-700'
                    }`}>
                    <Briefcase className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">{task.dealReference.name}</span>
                  </div>
                ) : (
                  <span className={`text-[13px] ${darkMode ? 'text-[#8c829e]' : 'text-slate-400'}`}>—</span>
                )}
              </div>

              {/* Action */}
              <div className="w-16 shrink-0 text-center flex justify-center">
                <button
                  onClick={() => handleDeleteTask(task.id)}
                  className={`p-2 rounded-lg transition-colors ${darkMode
                      ? 'text-[#8c829e] hover:text-rose-400 hover:bg-rose-500/10'
                      : 'text-slate-400 hover:text-rose-600 hover:bg-rose-50'
                    }`}
                  title="Delete task"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          );
        })}

        {tasks.length === 0 && (
          <div className={`py-24 text-center flex flex-col items-center justify-center rounded-xl border ${darkMode ? 'bg-[#12111D] border-white/10' : 'bg-white border-slate-200'}`}>
            <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-4 ${darkMode ? 'bg-white/5' : 'bg-slate-50'}`}>
              <CheckCircle2 className={`w-7 h-7 ${darkMode ? 'text-[#8c829e]' : 'text-slate-400'}`} />
            </div>
            <p className={`text-[15px] font-medium ${darkMode ? 'text-[#8c829e]' : 'text-slate-500'}`}>No tasks match the current filters.</p>
          </div>
        )}
      </div>
    </div>
  );
}

// 3. TABLE VIEW (Notion style grid)
function TableView({ tasks, darkMode, bulkSelection, setBulkSelection, handleOpenTaskDetails, handleDeleteTask, columns, handleUpdateTask }) {

  const handleToggleSelectAll = () => {
    if (bulkSelection.length === tasks.length) {
      setBulkSelection([]);
    } else {
      setBulkSelection(tasks.map(t => t.id));
    }
  };

  const handleToggleSelectOne = (taskId) => {
    if (bulkSelection.includes(taskId)) {
      setBulkSelection(prev => prev.filter(id => id !== taskId));
    } else {
      setBulkSelection(prev => [...prev, taskId]);
    }
  };

  return (
    <div className={`border rounded-xl overflow-hidden min-w-[800px] ${darkMode ? 'border-slate-800 bg-slate-900/20' : 'border-slate-200 bg-white'
      }`}>
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className={`border-b text-[11px] font-bold uppercase tracking-wider text-slate-400 ${darkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-slate-50 border-slate-200'
            }`}>
            <th className="p-3 w-10 text-center">
              <input
                type="checkbox"
                checked={tasks.length > 0 && bulkSelection.length === tasks.length}
                onChange={handleToggleSelectAll}
                className="rounded border-slate-300 text-violet-600 focus:ring-violet-500"
              />
            </th>
            <th className="p-3">Title / Task Description</th>
            <th className="p-3 w-40">Status</th>
            <th className="p-3 w-32">Priority</th>
            <th className="p-3 w-36">Due Date</th>
            <th className="p-3 w-36">Assignee</th>
            <th className="p-3 w-28">Linked Deal</th>
            <th className="p-3 w-16 text-center">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800/30 dark:divide-slate-800/60 text-xs">
          {tasks.map(task => {
            const isSelected = bulkSelection.includes(task.id);
            return (
              <tr
                key={task.id}
                className={`hover:bg-slate-800/10 dark:hover:bg-slate-800/30 transition-colors ${isSelected ? (darkMode ? 'bg-slate-800/40' : 'bg-violet-50/40') : ''
                  }`}
              >
                <td className="p-3 text-center">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => handleToggleSelectOne(task.id)}
                    className="rounded border-slate-300 text-violet-600 focus:ring-violet-500"
                  />
                </td>
                <td className="p-3 font-semibold">
                  <div className="flex flex-col gap-1">
                    <button
                      onClick={() => handleOpenTaskDetails(task.id)}
                      className="text-left font-bold hover:text-violet-400 hover:underline transition-all"
                    >
                      {task.title}
                    </button>
                    <span className="text-[10px] text-slate-500 truncate max-w-sm">
                      {task.description || 'No additional description details.'}
                    </span>
                  </div>
                </td>
                <td className="p-3">
                  <select
                    value={task.status}
                    onChange={(e) => handleUpdateTask({ ...task, status: e.target.value })}
                    className={`px-2 py-1 text-xs rounded border outline-none cursor-pointer w-full max-w-[125px] ${darkMode ? 'bg-slate-950 border-slate-800 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'
                      }`}
                  >
                    {columns.map(col => (
                      <option key={col} value={col}>{col}</option>
                    ))}
                  </select>
                </td>
                <td className="p-3">
                  <select
                    value={task.priority}
                    onChange={(e) => handleUpdateTask({ ...task, priority: e.target.value })}
                    className={`px-2 py-1 text-xs rounded border outline-none cursor-pointer w-full max-w-[100px] ${darkMode ? 'bg-slate-950 border-slate-800 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'
                      }`}
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Urgent">Urgent</option>
                  </select>
                </td>
                <td className="p-3">
                  <input
                    type="date"
                    value={task.dueDate}
                    onChange={(e) => handleUpdateTask({ ...task, dueDate: e.target.value })}
                    className={`px-2 py-1 text-xs rounded border outline-none cursor-pointer w-full max-w-[125px] ${darkMode ? 'bg-slate-950 border-slate-800 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'
                      }`}
                  />
                </td>
                <td className="p-3">
                  <div className="flex items-center gap-2">
                    <img src={task.assignee.avatar} alt={task.assignee.name} className="w-5 h-5 rounded-full object-cover" />
                    <span className="font-medium truncate max-w-[100px]">{task.assignee.name}</span>
                  </div>
                </td>
                <td className="p-3">
                  {task.dealReference ? (
                    <div className="flex items-center gap-1 text-[11px] text-violet-400 font-bold bg-violet-500/10 px-1.5 py-0.5 rounded w-max">
                      <Briefcase className="w-3 h-3" />
                      <span className="truncate max-w-[80px]">{task.dealReference.name}</span>
                    </div>
                  ) : (
                    <span className="text-slate-500 text-[11px]">—</span>
                  )}
                </td>
                <td className="p-3 text-center">
                  <button
                    onClick={() => handleDeleteTask(task.id)}
                    className="p-1.5 rounded hover:bg-rose-500/10 text-slate-400 hover:text-rose-500"
                    title="Delete task"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {tasks.length === 0 && (
        <div className="py-20 text-center text-slate-500">
          No records matching the filter presets are available.
        </div>
      )}
    </div>
  );
}

// 4. CALENDAR VIEW (Scheduling grid)
function CalendarView({ tasks, darkMode, handleOpenTaskDetails, handleAddTask }) {
  const [currentYear, setCurrentYear] = useState(2026);
  const [currentMonth, setCurrentMonth] = useState(6); // July (0-indexed 6 is July)

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Days calculations
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay();

  // Create relative month calendar slots
  const calendarSlots = useMemo(() => {
    const slots = [];
    // Padding from previous month
    const prevMonthDays = new Date(currentYear, currentMonth, 0).getDate();
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      slots.push({
        dayNumber: prevMonthDays - i,
        isCurrentMonth: false,
        dateString: `${currentYear}-${String(currentMonth).padStart(2, '0')}-${String(prevMonthDays - i).padStart(2, '0')}`
      });
    }
    // Current month days
    for (let d = 1; d <= daysInMonth; d++) {
      slots.push({
        dayNumber: d,
        isCurrentMonth: true,
        dateString: `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
      });
    }
    return slots;
  }, [currentYear, currentMonth, daysInMonth, firstDayIndex]);

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(prev => prev + 1);
    } else {
      setCurrentMonth(prev => prev + 1);
    }
  };

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(prev => prev - 1);
    } else {
      setCurrentMonth(prev => prev - 1);
    }
  };

  const handleDayClick = (dateString) => {
    const title = prompt('Enter a short title for the new task:');
    if (title && title.trim()) {
      handleAddTask({
        title,
        dueDate: dateString
      });
    }
  };

  return (
    <div className="flex flex-col h-full space-y-4">
      {/* Calendar Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CalendarDays className="w-5 h-5 text-violet-500" />
          <h3 className="font-bold text-base">
            {monthNames[currentMonth]} {currentYear}
          </h3>
        </div>
        <div className="flex gap-1">
          <button
            onClick={handlePrevMonth}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg border ${darkMode ? 'border-slate-800 hover:bg-slate-800 text-slate-300' : 'border-slate-200 hover:bg-slate-100 text-slate-700'
              }`}
          >
            Previous
          </button>
          <button
            onClick={handleNextMonth}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg border ${darkMode ? 'border-slate-800 hover:bg-slate-800 text-slate-300' : 'border-slate-200 hover:bg-slate-100 text-slate-700'
              }`}
          >
            Next
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className={`grid grid-cols-7 border rounded-xl overflow-hidden ${darkMode ? 'border-slate-800 bg-slate-900/20' : 'border-slate-200 bg-white'
        }`}>
        {/* Days label header */}
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div
            key={day}
            className={`p-2.5 text-center text-xs font-bold tracking-wide border-b ${darkMode ? 'bg-slate-900/50 border-slate-800 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-600'
              }`}
          >
            {day}
          </div>
        ))}

        {/* Month grid items */}
        {calendarSlots.map((slot, idx) => {
          const dayTasks = tasks.filter(t => t.dueDate === slot.dateString);
          return (
            <div
              key={idx}
              onClick={() => handleDayClick(slot.dateString)}
              className={`min-h-[110px] p-2 border-r border-b relative group cursor-pointer transition-colors ${slot.isCurrentMonth
                  ? (darkMode ? 'bg-slate-900/10 hover:bg-slate-800/10 border-slate-800/60' : 'bg-white hover:bg-slate-50 border-slate-200/60')
                  : (darkMode ? 'bg-slate-950/40 text-slate-600 border-slate-900' : 'bg-slate-50 text-slate-400 border-slate-100')
                }`}
            >
              {/* Day number with hover-action visual trigger */}
              <div className="flex items-center justify-between mb-1.5">
                <span className={`text-[11px] font-bold ${slot.isCurrentMonth ? (darkMode ? 'text-slate-300' : 'text-slate-700') : 'opacity-40'
                  }`}>
                  {slot.dayNumber}
                </span>
                <span className="opacity-0 group-hover:opacity-100 text-[9px] text-violet-500 font-bold transition-all">
                  + Add
                </span>
              </div>

              {/* Plotted tasks */}
              <div className="space-y-1 overflow-y-auto max-h-[70px] custom-scrollbar">
                {dayTasks.map(task => (
                  <div
                    key={task.id}
                    onClick={(e) => {
                      e.stopPropagation(); // Avoid triggering dayClick trigger
                      handleOpenTaskDetails(task.id);
                    }}
                    className="p-1 rounded text-[10px] font-semibold truncate hover:ring-1 hover:ring-violet-500 transition-all shadow-sm flex items-center gap-1 bg-violet-500/10 border border-violet-500/20 text-violet-400"
                    title={task.title}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-violet-500 flex-shrink-0" />
                    <span className="truncate">{task.title}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// 5. TASK DETAIL MODAL / SIDEBAR CONTENT
function TaskDetailSidebar({ task, onClose, onUpdate, onDelete, columns, members, darkMode }) {
  const [activeTab, setActiveTab] = useState('Details');
  const [commentInput, setCommentInput] = useState('');
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleEditVal, setTitleEditVal] = useState(task.title);

  // Sync state with selected task
  useEffect(() => {
    setTitleEditVal(task.title);
    setIsEditingTitle(false);
  }, [task]);

  // Title save handler
  const saveTitle = () => {
    if (titleEditVal.trim()) {
      onUpdate({ ...task, title: titleEditVal });
      setIsEditingTitle(false);
    }
  };

  // Subtasks actions
  const toggleSubtask = (subId) => {
    const updatedSubtasks = task.subtasks.map(s => s.id === subId ? { ...s, completed: !s.completed } : s);
    onUpdate({ ...task, subtasks: updatedSubtasks });
  };

  const addSubtask = (e) => {
    e.preventDefault();
    if (newSubtaskTitle.trim()) {
      const newSub = {
        id: `sub-${Date.now()}`,
        title: newSubtaskTitle.trim(),
        completed: false
      };
      onUpdate({ ...task, subtasks: [...(task.subtasks || []), newSub] });
      setNewSubtaskTitle('');
    }
  };

  const deleteSubtask = (subId) => {
    onUpdate({ ...task, subtasks: task.subtasks.filter(s => s.id !== subId) });
  };

  // Comments addition
  const addComment = (e) => {
    e.preventDefault();
    if (commentInput.trim()) {
      const newComment = {
        id: `c-${Date.now()}`,
        author: 'Workspace Owner',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150', // Mock logged in user avatar
        text: commentInput.trim(),
        timestamp: 'Just now'
      };
      onUpdate({ ...task, comments: [...(task.comments || []), newComment] });
      setCommentInput('');
    }
  };

  // Label tags toggle handler
  const toggleLabel = (labelName) => {
    const hasLabel = task.labels.includes(labelName);
    const updatedLabels = hasLabel 
      ? task.labels.filter(l => l !== labelName) 
      : [...task.labels, labelName];
    onUpdate({ ...task, labels: updatedLabels });
  };

  const firstTag = task.labels && task.labels.length > 0 ? task.labels[0] : 'TASK';

  return (
    <div className={`flex flex-col h-full font-sans ${darkMode ? 'bg-slate-900 text-slate-100' : 'bg-white text-slate-900'}`}>
      
      {/* Top Header Section (Clean Content Hub Style) */}
      <div className={`pt-8 pb-0 px-8 bg-white dark:bg-slate-900`}>
        <div className="flex justify-between items-start mb-6">
          <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-violet-100 text-violet-600 border border-violet-200/50 dark:bg-violet-900/30 dark:border-violet-800/50 dark:text-violet-300 shadow-sm">
            {firstTag}
          </span>
          <div className="flex gap-2 items-center">
            <button
              onClick={() => onDelete(task.id)}
              className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-rose-500 transition-colors"
              title="Delete this task"
            >
              <Trash2 className="w-5 h-5" />
            </button>
            <button 
              onClick={onClose}
              className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {isEditingTitle ? (
          <div className="flex items-center gap-3 mb-4">
            <input
              type="text"
              value={titleEditVal}
              onChange={(e) => setTitleEditVal(e.target.value)}
              className={`flex-1 font-extrabold text-3xl px-4 py-2 rounded-xl border outline-none focus:ring-2 focus:ring-violet-500/50 ${
                darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
              }`}
              onKeyDown={(e) => {
                if (e.key === 'Enter') saveTitle();
                if (e.key === 'Escape') setIsEditingTitle(false);
              }}
              autoFocus
            />
            <button 
              onClick={saveTitle}
              className="px-6 py-3 bg-violet-600 hover:bg-violet-700 text-white rounded-xl font-bold transition-colors shadow-sm"
            >
              Save
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-3 mb-6 group cursor-pointer" onClick={() => setIsEditingTitle(true)}>
            <h2 className="font-extrabold text-3xl lg:text-4xl leading-tight tracking-tight text-slate-900 dark:text-white group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
              {task.title}
            </h2>
            <Edit2 className="w-5 h-5 opacity-0 group-hover:opacity-100 text-slate-400 transition-all mt-1" />
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-8 border-b border-slate-200 dark:border-slate-800 mt-2">
          {['Details', `Subtasks (${task.subtasks?.length || 0})`, `Comments (${task.comments?.length || 0})`].map(tabStr => {
            const tabName = tabStr.split(' ')[0];
            const isActive = activeTab === tabName;
            return (
              <button
                key={tabName}
                onClick={() => setActiveTab(tabName)}
                className={`pb-4 px-1 text-[14px] font-bold tracking-wide relative transition-colors ${
                  isActive ? 'text-violet-600 dark:text-violet-400' : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
                }`}
              >
                {tabStr}
                {isActive && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-violet-600 dark:bg-violet-400" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Tab Content */}
      <div className="flex-1 overflow-y-auto p-8 bg-slate-50/30 dark:bg-slate-950/20 custom-scrollbar">
        
        {activeTab === 'Details' && (
          <div className="space-y-8 max-w-4xl">
            {/* Description Block */}
            <div className="space-y-2.5">
              <h4 className="text-[11px] font-bold uppercase text-slate-500 tracking-widest">Brief / Description</h4>
              <textarea
                value={task.description}
                placeholder="Add detailed task notes here..."
                onChange={(e) => onUpdate({ ...task, description: e.target.value })}
                className={`w-full p-4 rounded-xl border outline-none text-[14px] leading-relaxed resize-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all min-h-[120px] ${
                  darkMode ? 'bg-slate-900 border-slate-800 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'
                }`}
              />
            </div>

            {/* Grid Layout properties */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
              {/* Status */}
              <div className="space-y-2.5">
                <h4 className="text-[11px] font-bold uppercase text-slate-500 tracking-widest">Workflow Status</h4>
                <select
                  value={task.status}
                  onChange={(e) => onUpdate({ ...task, status: e.target.value })}
                  className={`w-full px-4 py-2.5 rounded-xl border outline-none cursor-pointer text-[14px] font-semibold transition-all focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 ${
                    darkMode ? 'bg-slate-900 border-slate-800 text-slate-200' : 'bg-white border-slate-200 text-slate-900 shadow-sm'
                  }`}
                >
                  {columns.map(col => <option key={col} value={col}>{col}</option>)}
                </select>
              </div>

              {/* Priority */}
              <div className="space-y-2.5">
                <h4 className="text-[11px] font-bold uppercase text-slate-500 tracking-widest">Priority Level</h4>
                <select
                  value={task.priority}
                  onChange={(e) => onUpdate({ ...task, priority: e.target.value })}
                  className={`w-full px-4 py-2.5 rounded-xl border outline-none cursor-pointer text-[14px] font-semibold transition-all focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 ${
                    darkMode ? 'bg-slate-900 border-slate-800 text-slate-200' : 'bg-white border-slate-200 text-slate-900 shadow-sm'
                  }`}
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Urgent">Urgent</option>
                </select>
              </div>

              {/* Assignee */}
              <div className="space-y-2.5">
                <h4 className="text-[11px] font-bold uppercase text-slate-500 tracking-widest">Assigned Owner</h4>
                <select
                  value={task.assignee.id}
                  onChange={(e) => {
                    const selectedMember = members.find(m => m.id === e.target.value);
                    onUpdate({ ...task, assignee: selectedMember });
                  }}
                  className={`w-full px-4 py-2.5 rounded-xl border outline-none cursor-pointer text-[14px] font-semibold transition-all focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 ${
                    darkMode ? 'bg-slate-900 border-slate-800 text-slate-200' : 'bg-white border-slate-200 text-slate-900 shadow-sm'
                  }`}
                >
                  {members.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                </select>
              </div>

              {/* Due Date */}
              <div className="space-y-2.5">
                <h4 className="text-[11px] font-bold uppercase text-slate-500 tracking-widest">Due Date</h4>
                <input
                  type="date"
                  value={task.dueDate}
                  onChange={(e) => onUpdate({ ...task, dueDate: e.target.value })}
                  className={`w-full px-4 py-2.5 rounded-xl border outline-none cursor-pointer text-[14px] font-semibold transition-all focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 ${
                    darkMode ? 'bg-slate-900 border-slate-800 text-slate-200' : 'bg-white border-slate-200 text-slate-900 shadow-sm'
                  }`}
                />
              </div>
            </div>

            {/* Labels */}
            <div className="space-y-4 pt-4">
              <h4 className="text-[13px] font-bold uppercase text-[#332A55] dark:text-slate-400 tracking-wider">Classification Tags</h4>
              <div className="flex flex-wrap gap-2">
                {PRESET_LABELS.map(lbl => {
                  const isActive = task.labels.includes(lbl);
                  return (
                    <button
                      key={lbl}
                      onClick={() => toggleLabel(lbl)}
                      className={`px-4 py-2 rounded-lg text-[13px] font-bold tracking-wide transition-all ${
                        isActive 
                          ? 'bg-violet-600 text-white shadow-md' 
                          : (darkMode ? 'bg-slate-800 text-slate-400 hover:bg-slate-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200')
                      }`}
                    >
                      {lbl}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Deal Reference */}
            <div className="space-y-4 pt-4">
              <h4 className="text-[13px] font-bold uppercase text-[#332A55] dark:text-slate-400 tracking-wider">Linked CRM Deals</h4>
              {task.dealReference ? (
                <div className={`p-5 rounded-2xl border flex items-center justify-between ${
                  darkMode ? 'bg-slate-900/50 border-slate-800' : 'bg-slate-50 border-slate-200'
                }`}>
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-emerald-500/15 text-emerald-500 rounded-xl">
                      <Briefcase className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="text-[16px] font-bold">{task.dealReference.name}</div>
                      <div className="text-[13px] text-slate-500 mt-1">Value: {task.dealReference.value} • Stage: {task.dealReference.stage}</div>
                    </div>
                  </div>
                  <button 
                    onClick={() => onUpdate({ ...task, dealReference: null })}
                    className="text-[13px] font-bold text-rose-500 hover:bg-rose-500/10 px-4 py-2 rounded-lg transition-colors"
                  >
                    Unlink
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => onUpdate({
                    ...task,
                    dealReference: { name: 'Acme Premium License Upgrade', value: '$25,000', stage: 'Negotiation' }
                  })}
                  className={`w-full p-5 border-2 border-dashed rounded-2xl text-[14px] font-bold flex items-center justify-center gap-2 hover:border-violet-500/50 hover:text-violet-500 transition-colors ${
                    darkMode ? 'border-slate-800 text-slate-400 bg-slate-900/20' : 'border-slate-300 text-slate-500 bg-slate-50/50'
                  }`}
                >
                  <Plus className="w-5 h-5" />
                  <span>Link Account Deal</span>
                </button>
              )}
            </div>
            
            {/* Attachments Section */}
            <div className="space-y-4 pt-4">
              <h4 className="text-[13px] font-bold uppercase text-[#332A55] dark:text-slate-400 tracking-wider">Attachments</h4>
              <div className="space-y-3">
                {task.attachments && task.attachments.map(att => (
                  <div 
                    key={att.id}
                    className={`p-4 rounded-xl border flex items-center justify-between ${
                      darkMode ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-2.5 bg-slate-100 dark:bg-slate-800 rounded-lg">
                        <Paperclip className="w-5 h-5 text-slate-500" />
                      </div>
                      <div>
                        <div className="text-[14px] font-bold">{att.name}</div>
                        <div className="text-[12px] text-slate-500 mt-0.5">{att.size} • {att.type}</div>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        const filteredAtts = task.attachments.filter(a => a.id !== att.id);
                        onUpdate({ ...task, attachments: filteredAtts });
                      }}
                      className="p-2 hover:text-rose-500 hover:bg-rose-500/10 rounded-lg transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>

              <button
                onClick={() => {
                  const demoAtt = { id: `at-${Date.now()}`, name: 'scanned_contract_revised.pdf', size: '1.8 MB', type: 'PDF' };
                  onUpdate({ ...task, attachments: [...(task.attachments || []), demoAtt] });
                }}
                className={`w-full py-4 border-2 border-dashed rounded-xl text-[14px] font-bold flex items-center justify-center gap-2 hover:border-violet-500/50 hover:text-violet-500 transition-colors ${
                  darkMode ? 'border-slate-800 text-slate-400 bg-slate-900/20' : 'border-slate-300 text-slate-500 bg-slate-50/50'
                }`}
              >
                <Paperclip className="w-5 h-5" />
                <span>Upload Document Mockup</span>
              </button>
            </div>
          </div>
        )}

        {activeTab === 'Subtasks' && (
          <div className="space-y-8 max-w-4xl">
            <div className="flex items-center justify-between bg-violet-50 dark:bg-violet-900/10 p-6 rounded-2xl border border-violet-100 dark:border-violet-900/30">
              <h4 className="text-[15px] font-bold text-violet-900 dark:text-violet-300">Progress Tracker</h4>
              {task.subtasks && task.subtasks.length > 0 && (
                <span className="text-xl font-black text-violet-600 dark:text-violet-400">
                  {Math.round((task.subtasks.filter(s => s.completed).length / task.subtasks.length) * 100)}% Complete
                </span>
              )}
            </div>

            {task.subtasks && task.subtasks.length > 0 && (
              <div className="w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-violet-500 to-indigo-500 transition-all duration-500 ease-out"
                  style={{ width: `${(task.subtasks.filter(s => s.completed).length / task.subtasks.length) * 100}%` }}
                />
              </div>
            )}

            <div className="space-y-3 mt-8">
              {task.subtasks && task.subtasks.map(s => (
                <div 
                  key={s.id} 
                  className={`flex items-center justify-between p-4 rounded-xl border transition-all group ${
                    darkMode ? 'bg-slate-900/30 border-slate-800 hover:bg-slate-900' : 'bg-white border-slate-200 hover:shadow-md'
                  }`}
                >
                  <label className="flex items-center gap-4 cursor-pointer flex-1 select-none">
                    <input
                      type="checkbox"
                      checked={s.completed}
                      onChange={() => toggleSubtask(s.id)}
                      className="w-5 h-5 rounded border-slate-300 text-violet-600 focus:ring-violet-500"
                    />
                    <span className={`text-[15px] font-medium transition-colors ${s.completed ? 'line-through text-slate-400' : (darkMode ? 'text-slate-200' : 'text-slate-800')}`}>
                      {s.title}
                    </span>
                  </label>
                  <button
                    onClick={() => deleteSubtask(s.id)}
                    className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 rounded-lg transition-colors"
                    title="Remove subtask"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>

            <form onSubmit={addSubtask} className="flex gap-4 mt-6">
              <input
                type="text"
                required
                placeholder="Add next checklist objective..."
                value={newSubtaskTitle}
                onChange={(e) => setNewSubtaskTitle(e.target.value)}
                className={`flex-1 px-5 py-4 text-[15px] font-medium rounded-xl border outline-none focus:ring-2 focus:ring-violet-500/50 ${
                  darkMode ? 'bg-slate-900 border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-800'
                }`}
              />
              <button
                type="submit"
                className="px-8 py-4 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-[15px] shadow-lg transition-colors"
              >
                Add Step
              </button>
            </form>
          </div>
        )}

        {activeTab === 'Comments' && (
          <div className="space-y-8 max-w-4xl h-full flex flex-col">
            <div className="flex-1 space-y-6">
              {task.comments && task.comments.map(c => (
                <div key={c.id} className="flex gap-4">
                  <img src={c.avatar} alt={c.author} className="w-12 h-12 rounded-full object-cover mt-1 shadow-sm" />
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="font-bold text-[15px]">{c.author}</span>
                      <span className="text-[12px] font-medium text-slate-400">{c.timestamp}</span>
                    </div>
                    <p className={`p-4 rounded-2xl text-[14px] leading-relaxed shadow-sm ${
                      darkMode ? 'bg-slate-900/80 border border-slate-800 text-slate-300' : 'bg-white border border-slate-100 text-slate-700'
                    }`}>
                      {c.text}
                    </p>
                  </div>
                </div>
              ))}
              
              {(!task.comments || task.comments.length === 0) && (
                <div className="py-20 text-center text-slate-400 font-medium text-[15px]">
                  No comments yet. Start the conversation!
                </div>
              )}
            </div>

            <form onSubmit={addComment} className={`mt-auto p-4 rounded-2xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
              <textarea
                value={commentInput}
                onChange={(e) => setCommentInput(e.target.value)}
                placeholder="Write an update..."
                className={`w-full p-2 text-[15px] bg-transparent border-none outline-none resize-none min-h-[80px] ${
                  darkMode ? 'text-slate-200' : 'text-slate-800'
                }`}
              />
              <div className="flex justify-end pt-3 border-t border-[var(--border)] mt-2">
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-[14px] shadow-md transition-colors"
                >
                  Post Comment
                </button>
              </div>
            </form>
          </div>
        )}

      </div>

      {/* Footer / Actions Container */}
      <div className={`p-6 flex justify-end gap-3 border-t ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
        <button
          onClick={onClose}
          className={`px-6 py-2.5 rounded-xl font-bold text-[14px] transition-colors border ${
            darkMode ? 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700' : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
          }`}
        >
          Close
        </button>
        <button
          onClick={onClose} 
          className="px-8 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-[14px] shadow-sm transition-colors"
        >
          Done
        </button>
      </div>

    </div>
  );
}

// 6. PRIORITY BADGE DECORATOR HELPER
function PriorityBadge({ priority, darkMode }) {
  const styles = {
    Low: darkMode ? 'bg-emerald-950/20 text-emerald-500 border-emerald-500/30' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    Medium: darkMode ? 'bg-indigo-950/20 text-indigo-400 border-indigo-500/30' : 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
    High: darkMode ? 'bg-amber-950/20 text-amber-500 border-amber-500/30' : 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    Urgent: darkMode ? 'bg-rose-950/20 text-rose-500 border-rose-500/30' : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
  };

  const icons = {
    Low: <Check className="w-2.5 h-2.5" />,
    Medium: <Clock className="w-2.5 h-2.5" />,
    High: <AlertTriangle className="w-2.5 h-2.5" />,
    Urgent: <Flame className="w-2.5 h-2.5 animate-pulse" />
  };

  return (
    <span className={`flex items-center gap-1.5 text-[9px] px-2 py-1 rounded-md border font-bold uppercase tracking-widest ${styles[priority] || styles.Medium}`}>
      {icons[priority] || icons.Medium}
      <span>{priority}</span>
    </span>
  );
}

// 7. NEW TASK CREATOR MODAL
function NewTaskModal({ onClose, onSubmit, columns, members, darkMode }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState(columns[0]);
  const [priority, setPriority] = useState('Medium');
  const [dueDate, setDueDate] = useState(new Date().toISOString().split('T')[0]);
  const [assignee, setAssignee] = useState(members[0]);
  const [selectedLabels, setSelectedLabels] = useState([]);

  const toggleLabel = (lbl) => {
    if (selectedLabels.includes(lbl)) {
      setSelectedLabels(prev => prev.filter(l => l !== lbl));
    } else {
      setSelectedLabels(prev => [...prev, lbl]);
    }
  };

  const handleSubmitForm = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSubmit({
      title,
      description,
      status,
      priority,
      dueDate,
      assignee,
      labels: selectedLabels
    });
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
      {/* Backdrop */}
      <div onClick={onClose} className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm" />

      {/* Modal Card */}
      <div className={`relative w-full max-w-xl rounded-2xl shadow-2xl border flex flex-col overflow-hidden max-h-[90vh] ${darkMode ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
        }`}>

        {/* Header */}
        <div className={`p-4 border-b flex justify-between items-center ${darkMode ? 'border-slate-800' : 'border-slate-200'
          }`}>
          <h3 className="text-base font-bold flex items-center gap-2">
            <Plus className="w-5 h-5 text-violet-500" />
            <span>Create New Task</span>
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmitForm} className="p-6 space-y-4 overflow-y-auto">

          {/* Title */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Task Title</label>
            <input
              type="text"
              required
              placeholder="e.g. Align indemnity with Legal advisors"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={`w-full px-3 py-2 text-xs rounded-xl border outline-none focus:ring-1 ${darkMode ? 'bg-slate-950 border-slate-800 text-slate-200 focus:border-violet-500' : 'bg-slate-50 border-slate-200 text-slate-800 focus:border-violet-400'
                }`}
            />
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Notes / Details</label>
            <textarea
              placeholder="Add key context descriptions..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={`w-full p-3 rounded-xl border outline-none text-xs h-20 resize-none focus:ring-1 ${darkMode ? 'bg-slate-950 border-slate-800 text-slate-200 focus:border-violet-500' : 'bg-slate-50 border-slate-200 text-slate-800 focus:border-violet-400'
                }`}
            />
          </div>

          {/* Inline Properties row */}
          <div className="grid grid-cols-2 gap-4">
            {/* Status select */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Start Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className={`w-full px-3 py-2 text-xs rounded-xl border outline-none cursor-pointer ${darkMode ? 'bg-slate-950 border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-800'
                  }`}
              >
                {columns.map(col => (
                  <option key={col} value={col}>{col}</option>
                ))}
              </select>
            </div>

            {/* Priority Select */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Priority Level</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className={`w-full px-3 py-2 text-xs rounded-xl border outline-none cursor-pointer ${darkMode ? 'bg-slate-950 border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-800'
                  }`}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Urgent">Urgent</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Due Date */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Due Date</label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className={`w-full px-3 py-2 text-xs rounded-xl border outline-none cursor-pointer ${darkMode ? 'bg-slate-950 border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-800'
                  }`}
              />
            </div>

            {/* Assignee select */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Lead Assignee</label>
              <select
                value={assignee.id}
                onChange={(e) => {
                  const sMember = members.find(m => m.id === e.target.value);
                  setAssignee(sMember);
                }}
                className={`w-full px-3 py-2 text-xs rounded-xl border outline-none cursor-pointer ${darkMode ? 'bg-slate-950 border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-800'
                  }`}
              >
                {members.map(m => (
                  <option key={m.id} value={m.id}>{m.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Preset Labels */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Class Label Tags</label>
            <div className="flex flex-wrap gap-1">
              {PRESET_LABELS.map(lbl => {
                const isSel = selectedLabels.includes(lbl);
                return (
                  <button
                    key={lbl}
                    type="button"
                    onClick={() => toggleLabel(lbl)}
                    className={`px-2 py-1 rounded text-xs font-bold transition-colors ${isSel
                        ? 'bg-violet-600 text-white'
                        : (darkMode ? 'bg-slate-850 hover:bg-slate-800 text-slate-400' : 'bg-slate-100 hover:bg-slate-200 text-slate-600')
                      }`}
                  >
                    {lbl}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Modal Actions */}
          <div className={`pt-4 border-t flex justify-end gap-3 ${darkMode ? 'border-slate-800' : 'border-slate-200'
            }`}>
            <button
              type="button"
              onClick={onClose}
              className={`px-4 py-2 text-xs font-bold rounded-xl border transition-colors ${darkMode ? 'border-slate-800 hover:bg-slate-800 text-slate-300' : 'border-slate-200 hover:bg-slate-100 text-slate-700'
                }`}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white shadow-lg active:scale-95 transition-all"
            >
              Save New Task
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}