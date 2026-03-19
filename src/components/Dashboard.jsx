import { useState, useEffect } from 'react';
import { 
  CheckCircle2, 
  Clock, 
  Calendar, 
  TrendingUp, 
  Sparkles,
  ArrowUpRight,
  MoreHorizontal,
  Zap,
  Target
} from 'lucide-react';
import { useStats, useActivities, useTasks } from '../hooks/useApi';
import { formatDistanceToNow } from 'date-fns';

const MetricCard = ({ title, value, subtitle, icon: Icon, trend, color = 'amber' }) => {
  const colorClasses = {
    amber: 'from-[#d4a574]/20 to-[#d4a574]/5 text-[#d4a574]',
    navy: 'from-[#1e3a5f]/40 to-[#1e3a5f]/10 text-blue-400',
    green: 'from-green-500/20 to-green-500/5 text-green-400',
    purple: 'from-purple-500/20 to-purple-500/5 text-purple-400',
  };

  return (
    <div className="group relative overflow-hidden rounded-xl bg-[#111] border border-white/[0.06] p-5 hover:border-white/[0.1] transition-all duration-300 hover:-translate-y-0.5">
      <div className={`absolute inset-0 bg-gradient-to-br ${colorClasses[color]} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
      
      <div className="relative flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-white/40 uppercase tracking-wider mb-1">{title}</p>
          <h3 className="text-2xl font-semibold text-white mb-1">{value}</h3>
          {subtitle && (
            <p className="text-xs text-white/50">{subtitle}</p>
          )}
        </div>
        
        <div className={`p-2.5 rounded-lg bg-gradient-to-br ${colorClasses[color]}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      
      {trend && (
        <div className="relative mt-4 flex items-center gap-1.5 text-xs">
          <ArrowUpRight className="w-3.5 h-3.5 text-green-400" />
          <span className="text-green-400 font-medium">{trend}</span>
          <span className="text-white/30">vs last week</span>
        </div>
      )}
    </div>
  );
};

const ActivityItem = ({ activity }) => {
  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return <CheckCircle2 className="w-3.5 h-3.5 text-green-400" />;
      case 'pending': return <Clock className="w-3.5 h-3.5 text-amber-400" />;
      default: return <Zap className="w-3.5 h-3.5 text-blue-400" />;
    }
  };

  return (
    <div className="flex items-start gap-3 py-3 group">
      <div className="mt-0.5 p-1.5 rounded-md bg-white/[0.03] group-hover:bg-white/[0.06] transition-colors">
        {getStatusIcon(activity.status)}
      </div>
      
      <div className="flex-1 min-w-0">
        <p className="text-sm text-white/80 group-hover:text-white transition-colors">
          {activity.action}
        </p>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-xs text-[#d4a574]">{activity.agent}</span>
          <span className="text-xs text-white/20">•</span>
          <span className="text-xs text-white/40">
            {formatDistanceToNow(new Date(activity.created_at), { addSuffix: true })}
          </span>
        </div>
      </div>
    </div>
  );
};

const TaskItem = ({ task }) => {
  const priorityColors = {
    urgent: 'bg-red-500/10 text-red-400 border-red-500/20',
    high: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    medium: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    low: 'bg-white/5 text-white/50 border-white/10',
  };

  return (
    <div className="flex items-center gap-3 p-3 rounded-lg bg-white/[0.02] hover:bg-white/[0.04] border border-transparent hover:border-white/[0.06] transition-all cursor-pointer group">
      <div className={`w-2 h-2 rounded-full ${
        task.status === 'done' ? 'bg-green-400' : 
        task.status === 'in-progress' ? 'bg-amber-400' : 'bg-white/20'
      }`} />
      
      <div className="flex-1 min-w-0">
        <p className={`text-sm truncate ${task.status === 'done' ? 'text-white/40 line-through' : 'text-white/90'}`}>
          {task.title}
        </p>
        <p className="text-xs text-white/40 mt-0.5">{task.project}</p>
      </div>
      
      <span className={`text-[10px] px-2 py-0.5 rounded-full border ${priorityColors[task.priority]}`}>
        {task.priority}
      </span>
    </div>
  );
};

const Dashboard = () => {
  const { stats } = useStats();
  const { activities } = useActivities();
  const { tasks } = useTasks();

  const urgentTasks = tasks.filter(t => t.priority === 'urgent' && t.status !== 'done').slice(0, 3);

  // Determine agent status display
  const getAgentStatusDisplay = () => {
    const activityText = stats.agentActivity;
    if (activityText === 'Active now') {
      return { text: 'Active now', color: 'text-green-400', dot: 'bg-green-400' };
    } else if (activityText?.includes('ago')) {
      return { text: activityText, color: 'text-amber-400', dot: 'bg-amber-400' };
    } else if (activityText === 'Idle') {
      return { text: 'Idle', color: 'text-white/50', dot: 'bg-white/30' };
    }
    return { text: activityText || 'Offline', color: 'text-white/50', dot: 'bg-white/10' };
  };

  const agentStatus = getAgentStatusDisplay();

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-4 h-4 text-[#d4a574]" />
          <span className="text-xs font-medium text-[#d4a574] uppercase tracking-wider">Dashboard</span>
        </div>
        <h1 className="text-2xl lg:text-3xl font-semibold text-white mb-2">
          Good morning, Julz
        </h1>
        <p className="text-white/50">
          Here's what's happening with your missions today.
        </p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <MetricCard
          title="Active Tasks"
          value={stats.activeTasks}
          subtitle="Across all projects"
          icon={Target}
          trend="+12%"
          color="amber"
        />
        <MetricCard
          title="Content Pipeline"
          value={stats.contentPipeline}
          subtitle="In production"
          icon={Calendar}
          color="navy"
        />
        <MetricCard
          title="Due Soon"
          value={stats.upcoming48h}
          subtitle="Next 48 hours"
          icon={Clock}
          color="purple"
        />
        <MetricCard
          title="Agent Activity"
          value={stats.agentActivity}
          subtitle="Monday is active"
          icon={TrendingUp}
          color="green"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Activity Feed */}
        <div className="lg:col-span-2">
          <div className="rounded-xl bg-[#111] border border-white/[0.06] overflow-hidden">
            <div className="px-5 py-4 border-b border-white/[0.06] flex items-center justify-between">
              <div>
                <h2 className="text-sm font-semibold text-white">Recent Activity</h2>
                <p className="text-xs text-white/40 mt-0.5">Latest actions from your AI team</p>
              </div>
              <button className="p-2 rounded-lg hover:bg-white/[0.05] text-white/40 hover:text-white transition-colors">
                <MoreHorizontal className="w-4 h-4" />
              </button>
            </div>
            
            <div className="p-2">
              {activities.slice(0, 6).map((activity) => (
                <ActivityItem key={activity.id} activity={activity} />
              ))}
            </div>
            
            <div className="px-5 py-3 border-t border-white/[0.06]">
              <button className="text-xs text-[#d4a574] hover:text-[#e8c4a0] transition-colors font-medium">
                View all activity →
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar Content */}
        <div className="space-y-6">
          {/* System Status */}
          <div className="rounded-xl bg-gradient-to-br from-[#1e3a5f]/20 to-[#0a0a0a] border border-[#1e3a5f]/30 p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className={`w-2 h-2 rounded-full ${agentStatus.dot} animate-pulse`} />
              <span className="text-xs font-medium text-white/70">Monday Status</span>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-white/50">Activity</span>
                <span className={agentStatus.color}>{agentStatus.text}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-white/50">Backend</span>
                <span className="text-green-400">Online</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-white/50">Database</span>
                <span className="text-green-400">Connected</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-white/50">Last Sync</span>
                <span className="text-white/70">Just now</span>
              </div>
            </div>
          </div>

          {/* Priority Tasks */}
          {urgentTasks.length > 0 && (
            <div className="rounded-xl bg-[#111] border border-white/[0.06] overflow-hidden">
              <div className="px-5 py-4 border-b border-white/[0.06]">
                <h2 className="text-sm font-semibold text-white">Priority Tasks</h2>
                <p className="text-xs text-white/40 mt-0.5">Needs attention</p>
              </div>
              <div className="p-2 space-y-1">
                {urgentTasks.map((task) => (
                  <TaskItem key={task.id} task={task} />
                ))}
              </div>
            </div>
          )}

          {/* Today's Schedule */}
          <div className="rounded-xl bg-[#111] border border-white/[0.06] overflow-hidden">
            <div className="px-5 py-4 border-b border-white/[0.06]">
              <h2 className="text-sm font-semibold text-white">Today's Schedule</h2>
            </div>
            <div className="p-4 space-y-3">
              <div className="flex items-start gap-3">
                <div className="text-xs text-white/30 w-12">7:00 AM</div>
                <div className="flex-1">
                  <p className="text-sm text-white/70">Weather Check</p>
                  <p className="text-xs text-white/40">Auto-run</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="text-xs text-white/30 w-12">8:00 AM</div>
                <div className="flex-1">
                  <p className="text-sm text-white/70">News Briefing</p>
                  <p className="text-xs text-white/40">Auto-run</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="text-xs text-[#d4a574] w-12">9:00 AM</div>
                <div className="flex-1">
                  <p className="text-sm text-white">Twitter Draft</p>
                  <p className="text-xs text-white/40">Reminder</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;