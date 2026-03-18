import React from 'react';
import { Settings, Clock, Bell, Link as LinkIcon, Check, AlertCircle } from 'lucide-react';

const cronJobs = [
  { name: 'Weather Check', schedule: '7:00 AM daily', status: 'active', lastRun: 'Today' },
  { name: 'News Briefing', schedule: '8:00 AM daily', status: 'active', lastRun: 'Today' },
  { name: 'Twitter Morning Post', schedule: '9:00 AM daily', status: 'active', lastRun: 'Pending' },
  { name: 'Higgsfield Reminder', schedule: 'April 1, 8:00 AM', status: 'scheduled', lastRun: '-' },
];

const integrations = [
  { name: 'Twitter / Typefully', status: 'connected', icon: '🐦' },
  { name: 'GitHub', status: 'connected', icon: '⚡' },
  { name: 'Telegram', status: 'connected', icon: '✈️' },
  { name: 'Gemini', status: 'error', icon: '🧠' },
  { name: 'Vercel', status: 'connected', icon: '▲' },
  { name: 'Notion', status: 'disconnected', icon: '📝' },
];

export default function SettingsView() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-monday-amber">Settings</h1>
        <p className="text-gray-400">Configure your Mission Control</p>
      </div>

      {/* Cron Jobs */}
      <div className="card mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Clock size={20} className="text-monday-amber" />
          <h2 className="text-lg font-semibold">Automations (Cron Jobs)</h2>
        </div>
        
        <div className="space-y-3">
          {cronJobs.map((job) => (
            <div key={job.name} className="flex items-center justify-between p-3 bg-julz-black rounded-lg">
              <div>
                <p className="font-medium">{job.name}</p>
                <p className="text-sm text-gray-500">{job.schedule}</p>
              </div>              
              
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-500">Last: {job.lastRun}</span>                
                <span className={`px-2 py-1 rounded text-xs ${
                  job.status === 'active' ? 'bg-accent-green text-black' : 'bg-accent-yellow text-black'
                }`}>
                  {job.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Integrations */}
      <div className="card">
        <div className="flex items-center gap-2 mb-4">
          <LinkIcon size={20} className="text-monday-amber" />
          <h2 className="text-lg font-semibold">Integrations</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {integrations.map((integration) => (
            <div key={integration.name} className="flex items-center justify-between p-3 bg-julz-black rounded-lg">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{integration.icon}</span>                
                <span>{integration.name}</span>
              </div>              
              
              <div className="flex items-center gap-2">
                {integration.status === 'connected' && <Check size={16} className="text-accent-green" />}
                {integration.status === 'error' && <AlertCircle size={16} className="text-accent-red" />}                
                <span className={`text-sm ${
                  integration.status === 'connected' ? 'text-accent-green' : 
                  integration.status === 'error' ? 'text-accent-red' : 'text-gray-500'
                }`}>
                  {integration.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}