import { useState, useEffect } from 'react';
import { 
  Bot, 
  Sparkles, 
  Plus, 
  Settings,
  Activity,
  Clock,
  CheckCircle2,
  Power,
  MoreHorizontal,
  Edit3,
  Trash2,
  X,
  Zap
} from 'lucide-react';
import { useAgents } from '../hooks/useApi';

// Format relative time
const getRelativeTime = (dateString) => {
  if (!dateString) return 'Never';
  
  const date = new Date(dateString);
  const now = new Date();
  const diffSeconds = Math.floor((now - date) / 1000);
  
  if (diffSeconds < 60) return 'Just now';
  if (diffSeconds < 3600) return `${Math.floor(diffSeconds / 60)}m ago`;
  if (diffSeconds < 86400) return `${Math.floor(diffSeconds / 3600)}h ago`;
  return `${Math.floor(diffSeconds / 86400)}d ago`;
};

// Get status based on lastActive
const getAgentStatus = (lastActive) => {
  if (!lastActive) return { status: 'offline', label: 'Offline', color: 'bg-white/20' };
  
  const lastActiveTime = new Date(lastActive).getTime();
  const now = Date.now();
  const diffMinutes = (now - lastActiveTime) / 1000 / 60;
  
  if (diffMinutes < 2) {
    return { status: 'online', label: 'Active now', color: 'bg-green-400 animate-pulse' };
  } else if (diffMinutes < 10) {
    return { status: 'idle', label: `Active ${Math.floor(diffMinutes)}m ago`, color: 'bg-amber-400' };
  } else if (diffMinutes < 60) {
    return { status: 'idle', label: 'Idle', color: 'bg-white/30' };
  } else {
    return { status: 'offline', label: 'Offline', color: 'bg-white/10' };
  }
};

const AgentCard = ({ agent, onEdit, onDelete, onToggleStatus }) => {
  const [showMenu, setShowMenu] = useState(false);
  const agentStatus = getAgentStatus(agent.lastActive);
  
  const isOnline = agentStatus.status === 'online';
  const isIdle = agentStatus.status === 'idle';

  return (
    <div className="group relative p-5 rounded-xl bg-[#161616] border border-white/[0.06] hover:border-white/[0.12] transition-all duration-300">
      <div className="flex items-start justify-between mb-4">
        <div 
          className="w-12 h-12 rounded-xl flex items-center justify-center text-lg font-semibold text-white relative"
          style={{ backgroundColor: agent.color }}
        >
          {agent.avatar}
          {(isOnline || isIdle) && (
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-[#0a0a0a] rounded-full flex items-center justify-center">
              <div className={`w-2.5 h-2.5 rounded-full ${agentStatus.color}`} />
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-white/[0.05]">
            <div className={`w-1.5 h-1.5 rounded-full ${agentStatus.color}`} />
            <span className="text-[10px] text-white/50 uppercase">{agentStatus.label}</span>
          </div>
          
          <div className="relative">
            <button 
              onClick={() => setShowMenu(!showMenu)}
              className="p-1.5 rounded hover:bg-white/[0.1] opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <MoreHorizontal className="w-4 h-4 text-white/40" />
            </button>
            
            {showMenu && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowMenu(false)} />
                <div className="absolute right-0 top-8 w-40 rounded-lg bg-[#1a1a1a] border border-white/[0.08] shadow-xl z-50 overflow-hidden">
                  <button
                    onClick={() => { onEdit(agent); setShowMenu(false); }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-white/70 hover:bg-white/[0.05] hover:text-white transition-colors"
                  >
                    <Edit3 className="w-4 h-4" />
                    Edit
                  </button>
                  <button
                    onClick={() => { onToggleStatus(agent); setShowMenu(false); }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-white/70 hover:bg-white/[0.05] hover:text-white transition-colors"
                  >
                    <Power className="w-4 h-4" />
                    {agent.status === 'online' ? 'Set Offline' : 'Set Online'}
                  </button>
                  <div className="border-t border-white/[0.06]" />
                  <button
                    onClick={() => { onDelete(agent.id); setShowMenu(false); }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <h3 className="text-base font-semibold text-white mb-0.5">{agent.name}</h3>
      <p className="text-xs text-[#d4a574] mb-3">{agent.role}</p>
      <p className="text-sm text-white/50 mb-4 line-clamp-2">{agent.description}</p>

      <div className="flex items-center gap-4 text-xs text-white/40">
        <div className="flex items-center gap-1.5">
          <Activity className="w-3.5 h-3.5" />
          <span>{agent.tasks || 0} tasks</span>
        </div>
        <div className="flex items-center gap-1.5">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>{agent.completed || 0} done</span>
        </div>
        {agent.lastActive && (
          <div className="flex items-center gap-1.5 ml-auto">
            <Clock className="w-3.5 h-3.5" />
            <span>{getRelativeTime(agent.lastActive)}</span>
          </div>
        )}
      </div>
    </div>
  );
};

// Add/Edit Agent Modal
const AgentModal = ({ isOpen, onClose, agent, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    description: '',
    color: '#1e3a5f',
    status: 'offline',
    ...agent
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  const colors = [
    '#1e3a5f', '#8b5cf6', '#22c55e', '#f59e0b', 
    '#ef4444', '#3b82f6', '#ec4899', '#14b8a6'
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-full max-w-md rounded-xl bg-[#111] border border-white/[0.08] shadow-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-white/[0.06] flex items-center justify-between">
          <h3 className="text-sm font-semibold text-white">{agent ? 'Edit Agent' : 'New Agent'}</h3>
          <button onClick={onClose} className="p-1 rounded hover:bg-white/[0.1]">
            <X className="w-4 h-4 text-white/50" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs text-white/50 mb-1.5">Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="input"
              placeholder="Agent name"
              autoFocus
              required
            />
          </div>

          <div>
            <label className="block text-xs text-white/50 mb-1.5">Role</label>
            <input
              type="text"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              className="input"
              placeholder="e.g. Content Creator"
              required
            />
          </div>

          <div>
            <label className="block text-xs text-white/50 mb-1.5">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="input min-h-[80px] resize-none"
              placeholder="What does this agent do?"
            />
          </div>

          <div>
            <label className="block text-xs text-white/50 mb-2">Color</label>
            <div className="flex items-center gap-2 flex-wrap">
              {colors.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setFormData({ ...formData, color })}
                  className={`w-8 h-8 rounded-lg transition-all ${
                    formData.color === color ? 'ring-2 ring-white scale-110' : 'hover:scale-105'
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          <div className="pt-4 flex gap-3">
            <button type="button" onClick={onClose} className="btn btn-secondary flex-1">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary flex-1">
              {agent ? 'Save Changes' : 'Create Agent'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const AITeam = () => {
  const { agents, addAgent, updateAgent, deleteAgent } = useAgents();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAgent, setEditingAgent] = useState(null);
  
  // Calculate stats
  const activeAgents = agents.filter(a => {
    const status = getAgentStatus(a.lastActive);
    return status.status === 'online' || status.status === 'idle';
  }).length;
  
  const totalTasks = agents.reduce((sum, a) => sum + (a.tasks || 0), 0);
  const totalCompleted = agents.reduce((sum, a) => sum + (a.completed || 0), 0);

  const handleEdit = (agent) => {
    setEditingAgent(agent);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setEditingAgent(null);
    setIsModalOpen(true);
  };

  const handleSubmit = (formData) => {
    if (editingAgent) {
      updateAgent(editingAgent.id, formData);
    } else {
      addAgent({
        ...formData,
        avatar: formData.name.substring(0, 2),
        tasks: 0,
        completed: 0
      });
    }
  };

  const handleToggleStatus = (agent) => {
    const newStatus = agent.status === 'online' ? 'offline' : 'online';
    updateAgent(agent.id, { 
      status: newStatus,
      lastActive: newStatus === 'online' ? new Date().toISOString() : null
    });
  };

  // Ping activity when this page is viewed
  useEffect(() => {
    const pingActivity = () => {
      fetch('https://dealers-dallas-cat-sing.trycloudflare.com/api/agents/ping', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ agentId: 1 })
      });
    };
    
    pingActivity();
    const interval = setInterval(pingActivity, 30000); // Ping every 30 seconds
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-full overflow-y-auto">
      <div className="px-4 lg:px-8 py-6 border-b border-white/[0.06]">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-[#d4a574]" />
              <span className="text-xs font-medium text-[#d4a574] uppercase tracking-wider">AI Team</span>
            </div>
            <h1 className="text-xl font-semibold text-white mb-1">Your AI Workforce</h1>
            <p className="text-sm text-white/50">
              {activeAgents} of {agents.length} agents active
            </p>
          </div>

          <button onClick={handleAdd} className="btn btn-primary">
            <Plus className="w-4 h-4" />
            Add Agent
          </button>
        </div>
      </div>

      <div className="p-4 lg:p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {agents.map((agent) => (
            <AgentCard 
              key={agent.id} 
              agent={agent}
              onEdit={handleEdit}
              onDelete={deleteAgent}
              onToggleStatus={handleToggleStatus}
            />
          ))}
        </div>

        {/* Team Stats */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-5 rounded-xl bg-[#111] border border-white/[0.06]">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-green-500/10">
                <Activity className="w-4 h-4 text-green-400" />
              </div>
              <span className="text-sm text-white/50">Total Tasks</span>
            </div>
            <p className="text-2xl font-semibold text-white">{totalTasks}</p>
          </div>

          <div className="p-5 rounded-xl bg-[#111] border border-white/[0.06]">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-blue-500/10">
                <CheckCircle2 className="w-4 h-4 text-blue-400" />
              </div>
              <span className="text-sm text-white/50">Completed</span>
            </div>
            <p className="text-2xl font-semibold text-white">{totalCompleted}</p>
          </div>

          <div className="p-5 rounded-xl bg-[#111] border border-white/[0.06]">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-amber-500/10">
                <Zap className="w-4 h-4 text-amber-400" />
              </div>
              <span className="text-sm text-white/50">Efficiency</span>
            </div>
            <p className="text-2xl font-semibold text-white">
              {totalTasks > 0 ? Math.round((totalCompleted / (totalCompleted + totalTasks)) * 100) : 0}%
            </p>
          </div>
        </div>
      </div>

      <AgentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        agent={editingAgent}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default AITeam;
