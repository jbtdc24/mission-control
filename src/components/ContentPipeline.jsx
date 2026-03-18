import React, { useState } from 'react';
import { Plus, Calendar, Video, FileText, Twitter, Linkedin, Instagram, Check } from 'lucide-react';

const stages = [
  { id: 'idea', label: 'Idea' },
  { id: 'script', label: 'Script' },
  { id: 'record', label: 'Record' },
  { id: 'edit', label: 'Edit' },
  { id: 'review', label: 'Review' },
  { id: 'scheduled', label: 'Scheduled' },
  { id: 'published', label: 'Published' },
];

const contentItems = [
  { id: 1, title: 'Anichess Tournament Update', platform: 'Twitter', stage: 'scheduled', day: 'Monday', type: 'text' },
  { id: 2, title: 'Vibe Coding Tutorial', platform: 'YouTube', stage: 'script', day: 'Tuesday', type: 'video' },
  { id: 3, title: 'Web3 Gaming Trends', platform: 'LinkedIn', stage: 'idea', day: 'Wednesday', type: 'text' },
  { id: 4, title: 'Behind the Scenes', platform: 'Instagram', stage: 'edit', day: 'Thursday', type: 'video' },
  { id: 5, title: 'Weekly Recap', platform: 'Twitter', stage: 'published', day: 'Friday', type: 'text' },
];

const weeklyThemes = {
  Monday: 'Industry News & Updates',
  Tuesday: 'Creative Work & Tutorials',
  Wednesday: 'Community & Engagement',
  Thursday: 'Behind the Scenes',
  Friday: 'Weekly Recap & Reflections',
};

const platformIcons = {
  Twitter: Twitter,
  YouTube: Video,
  LinkedIn: Linkedin,
  Instagram: Instagram,
};

const stageColors = {
  idea: 'bg-gray-700',
  script: 'bg-accent-blue',
  record: 'bg-accent-purple',
  edit: 'bg-accent-yellow',
  review: 'bg-orange-500',
  scheduled: 'bg-monday-amber',
  published: 'bg-accent-green',
};

export default function ContentPipeline() {
  const [view, setView] = useState('kanban');

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-monday-amber">Content Pipeline</h1>
          <p className="text-gray-400">Track content from idea to published</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex bg-julz-dark rounded-lg p-1">
            <button 
              onClick={() => setView('kanban')}
              className={`px-3 py-1 rounded text-sm ${view === 'kanban' ? 'bg-monday-navy text-white' : 'text-gray-400'}`}
            >
              Kanban
            </button>
            <button 
              onClick={() => setView('calendar')}
              className={`px-3 py-1 rounded text-sm ${view === 'calendar' ? 'bg-monday-navy text-white' : 'text-gray-400'}`}
            >
              Calendar
            </button>
          </div>
          
          <button className="btn-primary flex items-center gap-2">
            <Plus size={16} />
            New Content
          </button>
        </div>
      </div>

      {/* Weekly Schedule */}
      <div className="card mb-6">
        <h3 className="text-lg font-semibold mb-4">Weekly Content Themes</h3>
        <div className="grid grid-cols-5 gap-4">
          {Object.entries(weeklyThemes).map(([day, theme]) => (
            <div key={day} className="bg-julz-black p-3 rounded-lg">
              <p className="font-medium text-monday-amber">{day}</p>
              <p className="text-sm text-gray-400">{theme}</p>
            </div>
          ))}
        </div>
      </div>

      {view === 'kanban' ? (
        /* Kanban View */
        <div className="overflow-x-auto">
          <div className="flex gap-4 min-w-max">
            {stages.map((stage) => (
              <div key={stage.id} className="w-64">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-sm">{stage.label}</h3>
                  <span className={`text-xs px-2 py-0.5 rounded ${stageColors[stage.id]} text-white`}>
                    {contentItems.filter(c => c.stage === stage.id).length}
                  </span>
                </div>
                
                <div className="space-y-3">
                  {contentItems.filter(c => c.stage === stage.id).map((item) => {
                    const Icon = platformIcons[item.platform] || FileText;
                    return (
                      <div key={item.id} className="bg-julz-dark p-3 rounded-lg border border-gray-800">
                        <div className="flex items-start justify-between mb-2">
                          <p className="font-medium text-sm">{item.title}</p>
                          <Icon size={16} className="text-gray-500" />
                        </div>
                        
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <span className="bg-gray-800 px-2 py-0.5 rounded">{item.platform}</span>
                          <span>{item.day}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Calendar View */
        <div className="card">
          <div className="grid grid-cols-7 gap-2">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
              <div key={day} className="text-center text-sm text-gray-500 py-2">{day}</div>
            ))}
            
            {Array.from({ length: 31 }, (_, i) => i + 1).map(date => (
              <div key={date} className="bg-julz-black p-2 rounded-lg min-h-24">
                <span className="text-sm text-gray-500">{date}</span>
                
                {contentItems
                  .filter(c => {
                    const dayMap = { Monday: 1, Tuesday: 2, Wednesday: 3, Thursday: 4, Friday: 5 };
                    return dayMap[c.day] === date % 7 + 1;
                  })
                  .map(c => (
                    <div key={c.id} className={`mt-1 text-xs px-2 py-1 rounded ${stageColors[c.stage]} text-white truncate`}>
                      {c.title}
                    </div>
                  ))
                }
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}