import React from 'react';
import { CheckCircle, Clock, AlertCircle, Activity, Calendar } from 'lucide-react';

const metrics = [
  { label: 'Active Tasks', value: 12, icon: CheckCircle, color: 'text-accent-green' },
  { label: 'Content Pipeline', value: '8 items', icon: Clock, color: 'text-accent-blue' },
  { label: 'Upcoming (48h)', value: 3, icon: Calendar, color: 'text-accent-purple' },
  { label: 'Agent Activity', value: 'High', icon: Activity, color: 'text-monday-amber' },
];

const recentActivity = [
  { id: 1, action: 'Drafted Twitter post', time: '5 min ago', status: 'completed', agent: 'Monday' },
  { id: 2, action: 'Set up Mission Control dashboard', time: '15 min ago', status: 'completed', agent: 'Monday' },
  { id: 3, action: 'Deployed Star Office to Vercel', time: '1 hour ago', status: 'completed', agent: 'Monday' },
  { id: 4, action: 'Scheduled daily weather alerts', time: '2 hours ago', status: 'completed', agent: 'Monday' },
  { id: 5, action: 'Creating additional AI agents', time: 'Pending', status: 'pending', agent: 'Monday' },
];

const getStatusColor = (status) => {
  switch (status) {
    case 'completed': return 'bg-accent-green';
    case 'active': return 'bg-accent-green animate-pulse';
    case 'pending': return 'bg-accent-yellow';
    case 'error': return 'bg-accent-red';
    default: return 'bg-accent-gray';
  }
};

export default function Dashboard() {
  return (
    <div className="p-6 space-y-6">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-monday-amber">Dashboard</h1>
        <p className="text-gray-400">Welcome back, Julz. Here's what's happening.</p>
      </header>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, idx) => {
          const Icon = metric.icon;
          return (
            <div key={idx} className="card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">{metric.label}</p>
                  <p className="text-2xl font-bold text-white">{metric.value}</p>
                </div>
                <Icon className={metric.color} size={24} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Activity Feed */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Live Activity Feed</h2>
          <div className="flex items-center gap-2">
            <span className="status-dot status-active"></span>
            <span className="text-sm text-gray-400">Monday is active</span>
          </div>
        </div>
        
        <div className="space-y-3">
          {recentActivity.map((activity) => (
            <div key={activity.id} className="flex items-start gap-3 p-3 bg-julz-black rounded-lg">
              <span className={`status-dot ${getStatusColor(activity.status)} mt-1`}></span>
              <div className="flex-1">
                <p className="text-sm">{activity.action}</p>
                <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                  <span>{activity.agent}</span>
                  <span>•</span>
                  <span>{activity.time}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card">
          <h3 className="text-sm font-medium text-gray-400 mb-2">Today's Tasks</h3>
          <div className="text-3xl font-bold text-white">5/12</div>
          <p className="text-xs text-gray-500">42% completed</p>
        </div>
        
        <div className="card">
          <h3 className="text-sm font-medium text-gray-400 mb-2">Content This Week</h3>
          <div className="text-3xl font-bold text-white">15</div>
          <p className="text-xs text-gray-500">3 scheduled for today</p>
        </div>
        
        <div className="card">
          <h3 className="text-sm font-medium text-gray-400 mb-2">AI Agents</h3>
          <div className="text-3xl font-bold text-white">1</div>
          <p className="text-xs text-gray-500">4 more planned</p>
        </div>
      </div>
    </div>
  );
}