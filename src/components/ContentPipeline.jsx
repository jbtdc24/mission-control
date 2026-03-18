import React, { useState } from 'react';
import { Plus, Calendar, Video, FileText, Twitter, Linkedin, Instagram, Youtube, MoreHorizontal } from 'lucide-react';
import { useContent, useActivities } from '../hooks/useApi';

const stages = [
  { id: 'idea', label: 'Idea', color: 'bg-[#737373]', border: 'border-l-[#737373]' },
  { id: 'script', label: 'Script', color: 'bg-[#3b82f6]', border: 'border-l-[#3b82f6]' },
  { id: 'record', label: 'Record', color: 'bg-[#8b5cf6]', border: 'border-l-[#8b5cf6]' },
  { id: 'edit', label: 'Edit', color: 'bg-[#f59e0b]', border: 'border-l-[#f59e0b]' },
  { id: 'review', label: 'Review', color: 'bg-[#f97316]', border: 'border-l-[#f97316]' },
  { id: 'scheduled', label: 'Scheduled', color: 'bg-[#d4a574]', border: 'border-l-[#d4a574]' },
  { id: 'published', label: 'Published', color: 'bg-[#22c55e]', border: 'border-l-[#22c55e]' },
];

const weeklyThemes = {
  Monday: 'Industry News & Updates',
  Tuesday: 'Creative Work & Tutorials', 
  Wednesday: 'Community & Engagement',
  Thursday: 'Behind the Scenes',
  Friday: 'Weekly Recap',
};

const platformIcons = {
  Twitter: Twitter,
  YouTube: Youtube,
  LinkedIn: Linkedin,
  Instagram: Instagram,
};

const platformColors = {
  Twitter: 'text-[#1da1f2]',
  YouTube: 'text-[#ff0000]',
  LinkedIn: 'text-[#0077b5]',
  Instagram: 'text-[#e4405f]',
};

export default function ContentPipeline() {
  const { content, loading, updateContent } = useContent();
  const { addActivity } = useActivities();
  const [view, setView] = useState('kanban');

  const moveContent = async (id, newStage, title) => {
    await updateContent(id, { stage: newStage });
    await addActivity({
      action: `Moved "${title}" to ${stages.find(s => s.id === newStage)?.label}`,
      agent: 'Julz',
      status: 'completed'
    });
  };

  if (loading) return (
    <div className="p-6 flex items-center justify-center h-full">
      <div className="text-[#737373]">Loading content...</div>
    </div>
  );

  return (
    <div className="p-4 lg:p-6 h-full flex flex-col max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl font-semibold">Content Pipeline</h1>
          <p className="text-sm text-[#737373] mt-0.5">Track content from idea to published</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex bg-[#1a1a1a] rounded-lg p-1 border border-[#262626]">
            <button 
              onClick={() => setView('kanban')}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${view === 'kanban' ? 'bg-[#1e3a5f] text-white' : 'text-[#737373] hover:text-[#f5f5f0]'}`}
            >
              Kanban
            </button>
            <button 
              onClick={() => setView('calendar')}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${view === 'calendar' ? 'bg-[#1e3a5f] text-white' : 'text-[#737373] hover:text-[#f5f5f0]'}`}
            >
              Calendar
            </button>
          </div>
          
          <button className="btn-primary flex items-center gap-2">
            <Plus size={16} />
            <span className="hidden sm:inline">New Content</span>
          </button>
        </div>
      </div>

      {/* Weekly Schedule */}
      <div className="card p-5 mb-6">
        <h3 className="text-sm font-medium text-[#737373] uppercase tracking-wider mb-4">Weekly Content Themes</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {Object.entries(weeklyThemes).map(([day, theme]) => (
            <div key={day} className="bg-[#111] rounded-lg p-3 border border-[#1a1a1a]">
              <p className="text-sm font-medium text-[#d4a574]">{day}</p>
              <p className="text-xs text-[#737373] mt-1">{theme}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Kanban Board */}
      <div className="flex-1 overflow-x-auto pb-4 -mx-4 px-4">
        <div className="flex gap-5 min-w-max">
          {stages.map((stage) => {
            const stageContent = content.filter(c => c.stage === stage.id);
            return (
              <div key={stage.id} className="w-72 flex flex-col">
                {/* Column Header */}
                <div className="flex items-center justify-between mb-3 px-1">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${stage.color}`}></div>
                    <h3 className="font-medium text-sm">{stage.label}</h3>
                    <span className="text-xs text-[#737373] bg-[#1a1a1a] px-2 py-0.5 rounded-full">
                      {stageContent.length}
                    </span>
                  </div>
                </div>
                
                {/* Content Cards */}
                <div className="flex-1 bg-[#111] rounded-xl border border-[#1a1a1a] p-2 space-y-2 overflow-y-auto">
                  {stageContent.map((item) => {
                    const Icon = platformIcons[item.platform] || FileText;
                    return (
                      <div 
                        key={item.id} 
                        className={`group bg-[#1a1a1a] rounded-lg p-4 border-l-2 ${stage.border} hover:bg-[#1f1f1f] transition-all cursor-pointer`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-sm font-medium flex-1">{item.title}</p>
                          <Icon size={16} className={platformColors[item.platform] || 'text-[#737373]'} />
                        </div>
                        
                        <div className="flex items-center gap-3 mt-3 text-xs text-[#737373]">
                          <span className="bg-[#252525] px-2 py-0.5 rounded">{item.platform}</span>
                          <span>{item.day}</span>
                          <span className="bg-[#252525] px-2 py-0.5 rounded uppercase text-[10px]">{item.type}</span>
                        </div>
                        
                        {/* Move Buttons */}
                        <div className="flex flex-wrap gap-1 mt-3 pt-3 border-t border-[#262626] opacity-0 group-hover:opacity-100 transition-opacity">
                          {stages.filter(s => s.id !== item.stage).slice(0, 3).map(s => (
                            <button
                              key={s.id}
                              onClick={() => moveContent(item.id, s.id, item.title)}
                              className="text-[10px] px-2 py-1 bg-[#252525] hover:bg-[#303030] rounded transition-colors"
                            >
                              → {s.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                  
                  
                  {stageContent.length === 0 && (
                    <div className="text-center py-8 text-[#737373] text-sm">
                      No content
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}