import React from 'react';
import { CheckCircle, Clock, Calendar, Activity, ArrowUpRight } from 'lucide-react';
import { useStats, useActivities } from '../hooks/useApi';

const MetricCard = ({ title, value, icon: Icon, color, subtitle }) => (
  <div className="card p-5">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-xs font-medium text-[#737373] uppercase tracking-wider">{title}</p>
        <p className="text-2xl font-semibold mt-1">{value}</p>
        {subtitle && <p className="text-xs text-[#737373] mt-1">{subtitle}</p>}
      </div>
      <div className={`p-2.5 rounded-lg ${color}`}>
        <Icon size={20} />
      </div>
    </div>
  </div>
);

const getStatusColor = (status) => {
  switch (status) {
    case 'completed': return 'bg-[#22c55e]';
    case 'active': return 'bg-[#22c55e] animate-pulse';
    case 'pending': return 'bg-[#f59e0b]';
    case 'error': return 'bg-[#ef4444]';
    default: return 'bg-[#737373]';
  }
};

const getStatusLabel = (status) => {
  switch (status) {
    case 'completed': return 'Completed';
    case 'active': return 'In Progress';
    case 'pending': return 'Pending';
    case 'error': return 'Failed';
    default: return 'Idle';
  }
};

export default function Dashboard() {
  const { stats } = useStats();
  const { activities } = useActivities();

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = Math.floor((now - date) / 1000 / 60);
    
    if (diff < 1) return 'Just now';
    if (diff < 60) return `${diff}m ago`;
    if (diff < 1440) return `${Math.floor(diff / 60)}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="p-4 lg:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold">Dashboard</h1>
          <p className="text-sm text-[#737373] mt-0.5">Welcome back. Here's your command center overview.</p>
        </div>
        <button className="btn-primary flex items-center gap-2 text-sm self-start sm:self-auto">
          View Reports
          <ArrowUpRight size={16} />
        </button>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Active Tasks"
          value={stats.activeTasks}
          icon={CheckCircle}
          color="bg-[#22c55e]/10 text-[#22c55e]"
          subtitle="Across all projects"
        />
        
        <MetricCard
          title="Content Pipeline"
          value={stats.contentPipeline}
          icon={Clock}
          color="bg-[#3b82f6]/10 text-[#3b82f6]"
          subtitle="In production"
        />
        
        <MetricCard
          title="Upcoming (48h)"
          value={stats.upcoming48h}
          icon={Calendar}
          color="bg-[#8b5cf6]/10 text-[#8b5cf6]"
          subtitle="Tasks due soon"
        />
        
        <MetricCard
          title="Agent Status"
          value={stats.agentActivity}
          icon={Activity}
          color="bg-[#d4a574]/10 text-[#d4a574]"
          subtitle="Monday is active"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Activity Feed */}
        <div className="lg:col-span-2 card">
          <div className="p-5 border-b border-[#222] flex items-center justify-between">
            <div>
              <h2 className="font-semibold">Recent Activity</h2>
              <p className="text-xs text-[#737373] mt-0.5">Live updates from your AI team</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#22c55e] animate-pulse"></span>
              <span className="text-xs text-[#22c55e]">Live</span>
            </div>
          </div>
          
          <div className="p-2">
            {activities.slice(0, 8).map((activity, idx) => (
              <div 
                key={activity.id} 
                className={`flex items-start gap-4 p-3 rounded-lg hover:bg-[#1a1a1a] transition-colors ${idx !== activities.length - 1 ? '' : ''}`}
              >
                <div className="relative mt-0.5">
                  <div className={`w-2.5 h-2.5 rounded-full ${getStatusColor(activity.status)}`}></div>
                  {idx !== 7 && (
                    <div className="absolute top-3 left-1 w-px h-full bg-[#262626]"></div>
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{activity.action}</p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-xs text-[#737373]">{activity.agent}</span>
                    <span className="w-1 h-1 rounded-full bg-[#333]"></span>
                    <span className="text-xs text-[#737373]">{formatTime(activity.created_at)}</span>
                    <span className="w-1 h-1 rounded-full bg-[#333]"></span>
                    <span className={`text-xs ${activity.status === 'completed' ? 'text-[#22c55e]' : activity.status === 'pending' ? 'text-[#f59e0b]' : 'text-[#737373]'}`}>
                      {getStatusLabel(activity.status)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Side Panel */}
        <div className="space-y-4">
          {/* Quick Stats */}
          <div className="card p-5">
            <h3 className="font-semibold mb-4">Today's Overview</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#1e3a5f]/30 flex items-center justify-center">
                    <CheckCircle size={18} className="text-[#d4a574]" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Tasks Completed</p>
                    <p className="text-xs text-[#737373]">5 of 12 done</p>
                  </div>
                </div>
                <span className="text-lg font-semibold">42%</span>
              </div>
              
              <div className="w-full bg-[#1a1a1a] rounded-full h-2">
                <div className="bg-[#d4a574] h-2 rounded-full" style={{ width: '42%' }}></div>
              </div>
            </div>
          </div>

          {/* Team Status */}
          <div className="card p-5">
            <h3 className="font-semibold mb-4">AI Team Status</h3>
            
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-[#1e3a5f] flex items-center justify-center text-sm font-semibold">M</div>
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-[#22c55e] rounded-full border-2 border-[#1a1a1a]"></div>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Monday</p>
                  <p className="text-xs text-[#22c55e]">Online — Working</p>
                </div>
              </div>
              
              <div className="pt-3 border-t border-[#222]">
                <p className="text-xs text-[#737373] mb-2">Planned Agents</p>
                <div className="flex gap-2">
                  {['T', 'W', 'T', 'F'].map((letter, i) => (
                    <div key={i} className="w-8 h-8 rounded-full bg-[#1a1a1a] border border-[#333] flex items-center justify-center text-xs text-[#737373]">
                      {letter}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}