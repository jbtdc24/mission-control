import { useState } from 'react';
import { 
  Plus, 
  Filter, 
  Search, 
  MoreHorizontal, 
  Calendar,
  Tag,
  Clock,
  X,
  ChevronDown
} from 'lucide-react';
import { useTasks } from '../hooks/useApi';

const priorityConfig = {
  urgent: { color: 'text-red-400 bg-red-500/10 border-red-500/20', label: 'Urgent' },
  high: { color: 'text-amber-400 bg-amber-500/10 border-amber-500/20', label: 'High' },
  medium: { color: 'text-blue-400 bg-blue-500/10 border-blue-500/20', label: 'Medium' },
  low: { color: 'text-white/50 bg-white/5 border-white/10', label: 'Low' },
};

const statusColumns = [
  { id: 'todo', label: 'To Do', color: 'bg-white/20' },
  { id: 'in-progress', label: 'In Progress', color: 'bg-amber-400' },
  { id: 'review', label: 'Review', color: 'bg-blue-400' },
  { id: 'done', label: 'Done', color: 'bg-green-400' },
];

const TaskCard = ({ task, onUpdate }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group p-4 rounded-lg bg-[#161616] border border-white/[0.06] hover:border-white/[0.12] hover:bg-[#1c1c1c] transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <span className={`text-[10px] px-2 py-0.5 rounded-full border ${priorityConfig[task.priority].color}`}>
          {priorityConfig[task.priority].label}
        </span>
        
        <button className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-white/[0.1] transition-all">
          <MoreHorizontal className="w-4 h-4 text-white/40" />
        </button>
      </div>

      {/* Title */}
      <h4 className="text-sm font-medium text-white/90 mb-2 line-clamp-2">
        {task.title}
      </h4>

      {/* Meta */}
      <div className="flex items-center gap-3 text-xs text-white/40">
        {task.due_date && (
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>{task.due_date}</span>
          </div>
        )}
        
        {task.project && (
          <div className="flex items-center gap-1">
            <Tag className="w-3 h-3" />
            <span>{task.project}</span>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="mt-3 pt-3 border-t border-white/[0.04] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-medium ${
            task.assignee === 'Monday' 
              ? 'bg-[#1e3a5f] text-[#d4a574]' 
              : 'bg-white/10 text-white/70'
          }`}>
            {task.assignee[0]}
          </div>
          <span className="text-xs text-white/50">{task.assignee}</span>
        </div>
      </div>
    </div>
  );
};

const NewTaskModal = ({ isOpen, onClose, onSubmit }) => {
  const [task, setTask] = useState({
    title: '',
    assignee: 'Julz',
    priority: 'medium',
    due_date: '',
    project: '',
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ ...task, status: 'todo' });
    onClose();
    setTask({ title: '', assignee: 'Julz', priority: 'medium', due_date: '', project: '' });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-full max-w-md rounded-xl bg-[#111] border border-white/[0.08] shadow-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-white/[0.06] flex items-center justify-between">
          <h3 className="text-sm font-semibold text-white">New Task</h3>
          <button onClick={onClose} className="p-1 rounded hover:bg-white/[0.1]">
            <X className="w-4 h-4 text-white/50" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs text-white/50 mb-1.5">Title</label>
            <input
              type="text"
              value={task.title}
              onChange={(e) => setTask({ ...task, title: e.target.value })}
              className="input"
              placeholder="What needs to be done?"
              autoFocus
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-white/50 mb-1.5">Assignee</label>
              <select
                value={task.assignee}
                onChange={(e) => setTask({ ...task, assignee: e.target.value })}
                className="input"
              >
                <option value="Julz">Julz</option>
                <option value="Monday">Monday</option>
              </select>
            </div>

            <div>
              <label className="block text-xs text-white/50 mb-1.5">Priority</label>
              <select
                value={task.priority}
                onChange={(e) => setTask({ ...task, priority: e.target.value })}
                className="input"
              >
                <option value="urgent">Urgent</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-white/50 mb-1.5">Due Date</label>
              <input
                type="text"
                value={task.due_date}
                onChange={(e) => setTask({ ...task, due_date: e.target.value })}
                className="input"
                placeholder="e.g. Tomorrow"
              />
            </div>

            <div>
              <label className="block text-xs text-white/50 mb-1.5">Project</label>
              <input
                type="text"
                value={task.project}
                onChange={(e) => setTask({ ...task, project: e.target.value })}
                className="input"
                placeholder="Project name"
              />
            </div>
          </div>

          <div className="pt-4 flex gap-3">
            <button type="button" onClick={onClose} className="btn btn-secondary flex-1">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary flex-1">
              Create Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const TasksBoard = () => {
  const { tasks, addTask } = useTasks();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTasks = tasks.filter(task =>
    task.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="px-4 lg:px-8 py-6 border-b border-white/[0.06]">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-semibold text-white mb-1">Tasks</h1>
            <p className="text-sm text-white/50">Manage your missions and track progress</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search tasks..."
                className="input pl-10 w-64"
              />
            </div>

            <button className="btn btn-secondary">
              <Filter className="w-4 h-4" />
              Filter
            </button>

            <button 
              onClick={() => setIsModalOpen(true)}
              className="btn btn-primary"
            >
              <Plus className="w-4 h-4" />
              New Task
            </button>
          </div>
        </div>
      </div>

      {/* Board */}
      <div className="flex-1 overflow-x-auto overflow-y-hidden">
        <div className="h-full flex gap-6 p-4 lg:p-8 min-w-max">
          {statusColumns.map((column) => {
            const columnTasks = filteredTasks.filter(t => t.status === column.id);

            return (
              <div key={column.id} className="w-80 flex flex-col">
                {/* Column Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${column.color}`} />
                    <span className="text-sm font-medium text-white/80">{column.label}</span>
                    <span className="text-xs text-white/30 px-2 py-0.5 rounded-full bg-white/[0.05]">
                      {columnTasks.length}
                    </span>
                  </div>

                  <button className="p-1 rounded hover:bg-white/[0.1] text-white/30">
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                {/* Tasks */}
                <div className="flex-1 overflow-y-auto space-y-3 pr-2">
                  {columnTasks.map((task) => (
                    <TaskCard key={task.id} task={task} />
                  ))}

                  {columnTasks.length === 0 && (
                    <div className="h-32 flex flex-col items-center justify-center text-white/20 border border-dashed border-white/[0.08] rounded-lg">
                      <div className="w-8 h-8 rounded-full bg-white/[0.03] flex items-center justify-center mb-2">
                        <Plus className="w-4 h-4" />
                      </div>
                      <p className="text-xs">No tasks</p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <NewTaskModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        onSubmit={addTask}
      />
    </div>
  );
};

export default TasksBoard;