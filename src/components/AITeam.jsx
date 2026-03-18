import { 
  Bot, 
  Sparkles, 
  Plus, 
  Settings,
  Activity,
  Clock,
  CheckCircle2
} from 'lucide-react';

const agents = [
  {
    id: 1,
    name: 'Monday',
    role: 'Personal Assistant',
    status: 'online',
    avatar: 'M',
    color: '#1e3a5f',
    tasks: 12,
    completed: 89,
    description: 'Your guardian-archivist. Handles tasks, remembers everything, manages Twitter.',
  },
  {
    id: 2,
    name: 'Tuesday',
    role: 'Content Creator',
    status: 'offline',
    avatar: 'T',
    color: '#8b5cf6',
    tasks: 0,
    completed: 0,
    description: 'Specializes in video scripts and creative writing. Coming soon.',
  },
  {
    id: 3,
    name: 'Wednesday',
    role: 'Research Analyst',
    status: 'offline',
    avatar: 'W',
    color: '#22c55e',
    tasks: 0,
    completed: 0,
    description: 'Deep research on web3, gaming trends, and market analysis. Coming soon.',
  },
  {
    id: 4,
    name: 'Thursday',
    role: 'Code Assistant',
    status: 'offline',
    avatar: 'Th',
    color: '#f59e0b',
    tasks: 0,
    completed: 0,
    description: 'Vibe coding specialist. Builds apps and automations. Coming soon.',
  },
];

const AgentCard = ({ agent }) => {
  const isOnline = agent.status === 'online';

  return (
    <div className="group relative p-5 rounded-xl bg-[#161616] border border-white/[0.06] hover:border-white/[0.12] transition-all duration-300">
      <div className="flex items-start justify-between mb-4">
        <div 
          className="w-12 h-12 rounded-xl flex items-center justify-center text-lg font-semibold text-white"
          style={{ backgroundColor: agent.color }}
        >
          {agent.avatar}
        </div>

        <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-white/[0.05]">
          <div className={`w-1.5 h-1.5 rounded-full ${isOnline ? 'bg-green-400 animate-pulse' : 'bg-white/20'}`} />
          <span className="text-[10px] text-white/50 uppercase">{isOnline ? 'Online' : 'Offline'}</span>
        </div>
      </div>

      <h3 className="text-base font-semibold text-white mb-0.5">{agent.name}</h3>
      <p className="text-xs text-[#d4a574] mb-3">{agent.role}</p>
      <p className="text-sm text-white/50 mb-4 line-clamp-2">{agent.description}</p>

      <div className="flex items-center gap-4 text-xs text-white/40">
        <div className="flex items-center gap-1.5">
          <Activity className="w-3.5 h-3.5" />
          <span>{agent.tasks} tasks</span>
        </div>
        <div className="flex items-center gap-1.5">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>{agent.completed} done</span>
        </div>
      </div>
    </div>
  );
};

const AITeam = () => {
  const activeAgents = agents.filter(a => a.status === 'online').length;

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
            <p className="text-sm text-white/50">{activeAgents} of {agents.length} agents active
            </p>
          </div>

          <button className="btn btn-primary">
            <Plus className="w-4 h-4" />
            Add Agent
          </button>
        </div>
      </div>

      <div className="p-4 lg:p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {agents.map((agent) => (
            <AgentCard key={agent.id} agent={agent} />
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
            <p className="text-2xl font-semibold text-white">89</p>
          </div>

          <div className="p-5 rounded-xl bg-[#111] border border-white/[0.06]">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-blue-500/10">
                <CheckCircle2 className="w-4 h-4 text-blue-400" />
              </div>
              <span className="text-sm text-white/50">Completed</span>
            </div>
            <p className="text-2xl font-semibold text-white">89</p>
          </div>

          <div className="p-5 rounded-xl bg-[#111] border border-white/[0.06]">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-amber-500/10">
                <Clock className="w-4 h-4 text-amber-400" />
              </div>
              <span className="text-sm text-white/50">Avg Response</span>
            </div>
            <p className="text-2xl font-semibold text-white">{'< 1s'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AITeam;