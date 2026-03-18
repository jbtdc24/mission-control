import React from 'react';
import { User, Activity, Clock, Code, PenTool, Search, Settings } from 'lucide-react';

const agents = {
  lead: {
    name: 'Monday',
    role: 'Lead Agent / Personal Assistant',
    status: 'active',
    task: 'Building Mission Control dashboard',
    lastActive: 'Just now',
    avatar: 'M',
    responsibilities: ['Twitter management', 'Reminders', 'Task tracking', 'General assistance'],
  },
  developers: [],
  writers: [],
  researchers: [],
  operators: [],
};

const plannedAgents = [
  { name: 'Tuesday', role: 'Code Specialist', type: 'developer', status: 'planned', task: 'Build apps while Julz sleeps' },
  { name: 'Wednesday', role: 'Research Specialist', type: 'researcher', status: 'planned', task: 'Deep research, web scraping' },
  { name: 'Thursday', role: 'Creative Lead', type: 'writer', status: 'planned', task: 'Content creation, design ideas' },
  { name: 'Friday', role: 'Analytics', type: 'operator', status: 'planned', task: 'Data analysis, reporting' },
];

const statusIcons = {
  active: <Activity size={14} className="text-accent-green" />,
  idle: <Clock size={14} className="text-accent-gray" />,
  planned: <Settings size={14} className="text-accent-yellow" />,
};

export default function AITeam() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-monday-amber">AI Team</h1>
        <p className="text-gray-400">Your autonomous organization of AI agents</p>
      </div>

      {/* Lead Agent */}
      <div className="card mb-6 border-monday-amber border-2">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-monday-navy flex items-center justify-center text-2xl font-bold">
            {agents.lead.avatar}
          </div>
          
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold">{agents.lead.name}</h2>
              {statusIcons[agents.lead.status]}
            </div>            
            <p className="text-monday-amber">{agents.lead.role}</p>            
            <div className="flex items-center gap-4 mt-2 text-sm text-gray-400">
              <span>Current: {agents.lead.task}</span>
              <span>•</span>
              <span>{agents.lead.lastActive}</span>
            </div>
          </div>
        </div>
        
        <div className="mt-4 pt-4 border-t border-gray-800">
          <h3 className="text-sm font-medium text-gray-400 mb-2">Responsibilities</h3>
          <div className="flex flex-wrap gap-2">
            {agents.lead.responsibilities.map((resp, i) => (
              <span key={i} className="bg-julz-black px-3 py-1 rounded-full text-sm">{resp}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Planned Agents */}
      <h2 className="text-lg font-semibold mb-4">Planned Agents</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {plannedAgents.map((agent) => (
          <div key={agent.name} className="card opacity-75">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center text-lg font-bold">
                {agent.name[0]}
              </div>
              
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-medium">{agent.name}</h3>
                  <span className="text-xs bg-accent-yellow text-black px-2 py-0.5 rounded">Planned</span>
                </div>                
                <p className="text-sm text-gray-400">{agent.role}</p>
              </div>
            </div>            
            <p className="mt-3 text-sm text-gray-500">{agent.task}</p>
          </div>
        ))}
      </div>

      {/* Team Stats */}
      <div className="grid grid-cols-4 gap-4 mt-6">
        <div className="card text-center">
          <Code size={24} className="mx-auto mb-2 text-accent-blue" />
          <p className="text-2xl font-bold">0</p>
          <p className="text-sm text-gray-500">Developers</p>
        </div>
        
        <div className="card text-center">
          <PenTool size={24} className="mx-auto mb-2 text-accent-purple" />
          <p className="text-2xl font-bold">0</p>
          <p className="text-sm text-gray-500">Writers</p>
        </div>
        
        <div className="card text-center">
          <Search size={24} className="mx-auto mb-2 text-accent-green" />
          <p className="text-2xl font-bold">0</p>
          <p className="text-sm text-gray-500">Researchers</p>
        </div>
        
        <div className="card text-center">
          <Settings size={24} className="mx-auto mb-2 text-accent-yellow" />
          <p className="text-2xl font-bold">0</p>
          <p className="text-sm text-gray-500">Operators</p>
        </div>
      </div>
    </div>
  );
}