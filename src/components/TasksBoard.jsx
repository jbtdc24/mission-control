import React, { useState } from 'react';
import { Plus, Filter, Calendar, User, Flag } from 'lucide-react';

const initialTasks = [
  { id: 1, title: 'Draft morning Twitter post', assignee: 'Monday', priority: 'high', due: 'Today', status: 'todo', project: 'Twitter' },
  { id: 2, title: 'Fix Gemini billing setup', assignee: 'Julz', priority: 'urgent', due: 'Tomorrow', status: 'todo', project: 'Setup' },
  { id: 3, title: 'Research Anichess updates', assignee: 'Monday', priority: 'medium', due: 'Today', status: 'in-progress', project: 'Research' },
  { id: 4, title: 'Set up Google Calendar', assignee: 'Julz', priority: 'high', due: 'Tomorrow', status: 'todo', project: 'Setup' },
  { id: 5, title: 'Deploy Star Office', assignee: 'Monday', priority: 'medium', due: 'Yesterday', status: 'done', project: 'Dev' },
  { id: 6, title: 'Create Tuesday agent', assignee: 'Monday', priority: 'medium', due: 'Tomorrow', status: 'in-progress', project: 'AI Team' },
];

const columns = [
  { id: 'todo', label: 'To Do', color: 'border-gray-600' },
  { id: 'in-progress', label: 'In Progress', color: 'border-accent-blue' },
  { id: 'review', label: 'Review', color: 'border-accent-yellow' },
  { id: 'done', label: 'Done', color: 'border-accent-green' },
];

const priorityColors = {
  urgent: 'bg-accent-red text-white',
  high: 'bg-accent-yellow text-black',
  medium: 'bg-accent-blue text-white',
  low: 'bg-accent-gray text-white',
};

export default function TasksBoard() {
  const [tasks, setTasks] = useState(initialTasks);
  const [filter, setFilter] = useState('all');
  const [showNewTask, setShowNewTask] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', assignee: 'Monday', priority: 'medium', status: 'todo' });

  const handleAddTask = () => {
    if (newTask.title) {
      setTasks([...tasks, { ...newTask, id: Date.now(), due: 'Today', project: 'General' }]);
      setNewTask({ title: '', assignee: 'Monday', priority: 'medium', status: 'todo' });
      setShowNewTask(false);
    }
  };

  const moveTask = (taskId, newStatus) => {
    setTasks(tasks.map(t => t.id === taskId ? { ...t, status: newStatus } : t));
  };

  const filteredTasks = filter === 'all' ? tasks : tasks.filter(t => t.assignee === filter || t.priority === filter);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-monday-amber">Tasks Board</h1>
          <p className="text-gray-400">Organize work between you and your AI team</p>
        </div>
        <div className="flex items-center gap-3">
          <select 
            value={filter} 
            onChange={(e) => setFilter(e.target.value)}
            className="bg-julz-dark border border-gray-700 rounded-lg px-3 py-2 text-sm"
          >
            <option value="all">All Tasks</option>
            <option value="Julz">My Tasks</option>
            <option value="Monday">Monday's Tasks</option>
            <option value="urgent">Urgent</option>
          </select>
          
          <button onClick={() => setShowNewTask(true)} className="btn-primary flex items-center gap-2">
            <Plus size={16} />
            New Task
          </button>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {columns.map((column) => (
          <div key={column.id} className={`bg-julz-dark rounded-lg p-4 border-t-4 ${column.color}`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">{column.label}</h3>
              <span className="text-sm text-gray-500">{filteredTasks.filter(t => t.status === column.id).length}</span>
            </div>
            
            <div className="space-y-3">
              {filteredTasks.filter(t => t.status === column.id).map((task) => (
                <div key={task.id} className="bg-julz-black p-3 rounded-lg border border-gray-800 hover:border-gray-700 transition-colors cursor-pointer">
                  <p className="font-medium text-sm mb-2">{task.title}</p>
                  
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`text-xs px-2 py-0.5 rounded ${priorityColors[task.priority]}`}>
                      {task.priority}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <User size={12} />
                      {task.assignee}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar size={12} />
                      {task.due}
                    </div>
                  </div>
                  
                  {/* Quick move buttons */}
                  <div className="flex gap-1 mt-2 pt-2 border-t border-gray-800">
                    {columns.map(col => col.id !== task.status && (
                      <button
                        key={col.id}
                        onClick={() => moveTask(task.id, col.id)}
                        className="text-xs px-2 py-1 bg-gray-800 hover:bg-gray-700 rounded"
                      >
                        → {col.label}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* New Task Modal */}
      {showNewTask && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-julz-dark p-6 rounded-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">New Task</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Title</label>
                <input
                  type="text"
                  value={newTask.title}
                  onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                  className="w-full bg-julz-black border border-gray-700 rounded-lg px-3 py-2"
                  placeholder="What needs to be done?"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Assignee</label>
                  <select
                    value={newTask.assignee}
                    onChange={(e) => setNewTask({...newTask, assignee: e.target.value})}
                    className="w-full bg-julz-black border border-gray-700 rounded-lg px-3 py-2"
                  >
                    <option value="Julz">Julz</option>
                    <option value="Monday">Monday</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Priority</label>
                  <select
                    value={newTask.priority}
                    onChange={(e) => setNewTask({...newTask, priority: e.target.value})}
                    className="w-full bg-julz-black border border-gray-700 rounded-lg px-3 py-2"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button onClick={handleAddTask} className="btn-primary flex-1">Add Task</button>
              <button onClick={() => setShowNewTask(false)} className="btn-secondary flex-1">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}