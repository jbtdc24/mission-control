import React, { useState } from 'react';
import { Plus, Filter, Calendar, User, Flag, X, MoreHorizontal } from 'lucide-react';
import { useTasks, useActivities } from '../hooks/useApi';

const columns = [
  { id: 'todo', label: 'To Do', color: 'border-l-gray-500' },
  { id: 'in-progress', label: 'In Progress', color: 'border-l-blue-500' },
  { id: 'review', label: 'Review', color: 'border-l-yellow-500' },
  { id: 'done', label: 'Done', color: 'border-l-green-500' },
];

const priorityConfig = {
  urgent: { class: 'badge-urgent', label: 'Urgent' },
  high: { class: 'badge-high', label: 'High' },
  medium: { class: 'badge-medium', label: 'Medium' },
  low: { class: 'badge-low', label: 'Low' },
};

export default function TasksBoard() {
  const { tasks, loading, addTask, updateTask } = useTasks();
  const { addActivity } = useActivities();
  const [filter, setFilter] = useState('all');
  const [showNewTask, setShowNewTask] = useState(false);
  const [newTask, setNewTask] = useState({ 
    title: '', 
    assignee: 'Monday', 
    priority: 'medium', 
    status: 'todo',
    due_date: 'Today',
    project: 'General'
  });

  const handleAddTask = async () => {
    if (newTask.title) {
      const task = await addTask(newTask);
      await addActivity({
        action: `Created task: ${task.title}`,
        agent: 'Julz',
        status: 'completed'
      });
      setNewTask({ title: '', assignee: 'Monday', priority: 'medium', status: 'todo', due_date: 'Today', project: 'General' });
      setShowNewTask(false);
    }
  };

  const moveTask = async (taskId, newStatus, taskTitle) => {
    await updateTask(taskId, { status: newStatus });
    await addActivity({
      action: `Moved "${taskTitle}" to ${columns.find(c => c.id === newStatus)?.label}`,
      agent: 'Julz',
      status: 'completed'
    });
  };

  const filteredTasks = filter === 'all' ? tasks : 
    filter === 'Julz' || filter === 'Monday' ? tasks.filter(t => t.assignee === filter) :
    tasks.filter(t => t.priority === filter);

  if (loading) return (
    <div className="p-6 flex items-center justify-center h-full">
      <div className="text-[#737373]">Loading tasks...</div>
    </div>
  );

  return (
    <div className="p-4 lg:p-6 h-full flex flex-col max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl font-semibold">Tasks</h1>
          <p className="text-sm text-[#737373] mt-0.5">Organize work between you and Monday</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <Filter size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#737373]" />
            <select 
              value={filter} 
              onChange={(e) => setFilter(e.target.value)}
              className="pl-10 pr-8 py-2 text-sm"
            >
              <option value="all">All Tasks</option>
              <option value="Julz">My Tasks</option>
              <option value="Monday">Monday's Tasks</option>
              <option value="urgent">Urgent Priority</option>
            </select>
          </div>
          
          <button 
            onClick={() => setShowNewTask(true)} 
            className="btn-primary flex items-center gap-2"
          >
            <Plus size={16} />
            <span className="hidden sm:inline">New Task</span>
          </button>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="flex-1 overflow-x-auto pb-4 -mx-4 px-4">
        <div className="flex gap-5 min-w-max h-full">
          {columns.map((column) => {
            const columnTasks = filteredTasks.filter(t => t.status === column.id);
            return (
              <div key={column.id} className="w-80 flex flex-col">
                {/* Column Header */}
                <div className="flex items-center justify-between mb-3 px-1">
                  <div className="flex items-center gap-2">
                    <div className={`w-1 h-4 rounded-full ${column.color.replace('border-l-', 'bg-')}`}></div>
                    <h3 className="font-medium text-sm">{column.label}</h3>
                    <span className="text-xs text-[#737373] bg-[#1a1a1a] px-2 py-0.5 rounded-full">
                      {columnTasks.length}
                    </span>
                  </div>
                  
                  <button className="p-1 hover:bg-[#1a1a1a] rounded">
                    <MoreHorizontal size={16} className="text-[#737373]" />
                  </button>
                </div>
                
                {/* Tasks */}
                <div className="flex-1 bg-[#111] rounded-xl border border-[#1a1a1a] p-2 space-y-2 overflow-y-auto">
                  {columnTasks.map((task) => (
                    <div 
                      key={task.id} 
                      className={`group bg-[#1a1a1a] rounded-lg p-4 border-l-2 ${column.color} hover:bg-[#1f1f1f] transition-all cursor-pointer`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm font-medium flex-1">{task.title}</p>
                        <span className={`badge text-[10px] ${priorityConfig[task.priority].class}`}>
                          {priorityConfig[task.priority].label}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-4 mt-3 text-xs text-[#737373]">
                        <div className="flex items-center gap-1.5">
                          <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-medium ${
                            task.assignee === 'Julz' ? 'bg-[#d4a574]/20 text-[#d4a574]' : 'bg-[#1e3a5f] text-white'
                          }`}>
                            {task.assignee[0]}
                          </div>
                          <span>{task.assignee}</span>
                        </div>
                        
                        <div className="flex items-center gap-1">
                          <Calendar size={12} />
                          <span>{task.due_date}</span>
                        </div>
                      </div>
                      
                      {/* Move Buttons - Show on hover */}
                      <div className="flex gap-1 mt-3 pt-3 border-t border-[#262626] opacity-0 group-hover:opacity-100 transition-opacity">
                        {columns.filter(col => col.id !== task.status).map(col => (
                          <button
                            key={col.id}
                            onClick={() => moveTask(task.id, col.id, task.title)}
                            className="text-[10px] px-2 py-1 bg-[#252525] hover:bg-[#303030] rounded transition-colors"
                          >
                            → {col.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                  
                  
                  {columnTasks.length === 0 && (
                    <div className="text-center py-8 text-[#737373] text-sm">
                      No tasks
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* New Task Modal */}
      {showNewTask && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#1a1a1a] rounded-xl w-full max-w-md border border-[#333] shadow-2xl">
            <div className="p-5 border-b border-[#262626] flex items-center justify-between">
              <h2 className="font-semibold">Create New Task</h2>
              <button 
                onClick={() => setShowNewTask(false)}
                className="p-1 hover:bg-[#252525] rounded-lg transition-colors"
              >
                <X size={18} className="text-[#737373]" />
              </button>
            </div>
            
            <div className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-medium text-[#737373] uppercase tracking-wider mb-2">Task Title</label>
                <input
                  type="text"
                  value={newTask.title}
                  onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                  placeholder="What needs to be done?"
                  className="w-full"
                  autoFocus
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[#737373] uppercase tracking-wider mb-2">Assignee</label>
                  <select
                    value={newTask.assignee}
                    onChange={(e) => setNewTask({...newTask, assignee: e.target.value})}
                    className="w-full"
                  >
                    <option value="Julz">Julz (You)</option>
                    <option value="Monday">Monday (AI)</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-xs font-medium text-[#737373] uppercase tracking-wider mb-2">Priority</label>
                  <select
                    value={newTask.priority}
                    onChange={(e) => setNewTask({...newTask, priority: e.target.value})}
                    className="w-full"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[#737373] uppercase tracking-wider mb-2">Due Date</label>
                  <select
                    value={newTask.due_date}
                    onChange={(e) => setNewTask({...newTask, due_date: e.target.value})}
                    className="w-full"
                  >
                    <option value="Today">Today</option>
                    <option value="Tomorrow">Tomorrow</option>
                    <option value="This Week">This Week</option>
                    <option value="Next Week">Next Week</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-xs font-medium text-[#737373] uppercase tracking-wider mb-2">Project</label>
                  <select
                    value={newTask.project}
                    onChange={(e) => setNewTask({...newTask, project: e.target.value})}
                    className="w-full"
                  >
                    <option value="General">General</option>
                    <option value="Twitter">Twitter</option>
                    <option value="Development">Development</option>
                    <option value="AI Team">AI Team</option>
                    <option value="Content">Content</option>
                  </select>
                </div>
              </div>
            </div>
            
            <div className="p-5 border-t border-[#262626] flex gap-3">
              <button 
                onClick={handleAddTask} 
                className="btn-primary flex-1"
                disabled={!newTask.title}
              >
                Create Task
              </button>
              <button 
                onClick={() => setShowNewTask(false)} 
                className="btn-secondary flex-1"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}