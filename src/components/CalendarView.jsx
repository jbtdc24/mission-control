import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock } from 'lucide-react';

const events = [
  { id: 1, title: 'Twitter Post - Morning', date: '2026-03-19', time: '09:00', type: 'content', category: 'Twitter' },
  { id: 2, title: 'Weather Check', date: '2026-03-19', time: '07:00', type: 'automation', category: 'Daily' },
  { id: 3, title: 'Team Meeting', date: '2026-03-19', time: '14:00', type: 'meeting', category: 'Work' },
  { id: 4, title: 'Twitter Post - Afternoon', date: '2026-03-19', time: '15:00', type: 'content', category: 'Twitter' },
  { id: 5, title: 'Gemini Billing Setup', date: '2026-03-20', time: '09:00', type: 'task', category: 'Setup' },
];

const categoryColors = {
  Twitter: 'bg-accent-blue',
  Daily: 'bg-accent-green',
  Work: 'bg-accent-purple',
  Setup: 'bg-accent-yellow',
};

export default function CalendarView() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState('month');

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold text-monday-amber">Calendar</h1>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))}
              className="p-1 hover:bg-gray-800 rounded"
            >
              <ChevronLeft size={20} />
            </button>
            <span className="text-lg font-medium">
              {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </span>
            <button 
              onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))}
              className="p-1 hover:bg-gray-800 rounded"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
        
        <div className="flex bg-julz-dark rounded-lg p-1">
          {['month', 'week', 'day'].map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`px-3 py-1 rounded text-sm capitalize ${view === v ? 'bg-monday-navy text-white' : 'text-gray-400'}`}
            >
              {v}
            </button>
          ))}
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="card">
        <div className="grid grid-cols-7 gap-2 mb-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="text-center text-sm text-gray-500 py-2 font-medium">{day}</div>
          ))}
        </div>
        
        <div className="grid grid-cols-7 gap-2">
          {Array.from({ length: firstDay }, (_, i) => i).map((_, i) => (
            <div key={`empty-${i}`} className="min-h-24"></div>
          ))}
          
          {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((date) => {
            const dateStr = `2026-03-${date.toString().padStart(2, '0')}`;
            const dayEvents = events.filter(e => e.date === dateStr);
            
            return (
              <div key={date} className="bg-julz-black p-2 rounded-lg min-h-24 border border-gray-800">
                <span className={`text-sm ${date === new Date().getDate() ? 'text-monday-amber font-bold' : 'text-gray-500'}`}>
                  {date}
                </span>
                
                <div className="mt-1 space-y-1">
                  {dayEvents.map(event => (
                    <div key={event.id} className={`text-xs px-2 py-1 rounded text-white ${categoryColors[event.category] || 'bg-gray-600'}`}>
                      <div className="flex items-center gap-1">
                        <Clock size={10} />
                        {event.time}
                      </div>
                      <div className="truncate">{event.title}</div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="flex gap-4 mt-4 text-sm">
        {Object.entries(categoryColors).map(([cat, color]) => (
          <div key={cat} className="flex items-center gap-2">
            <span className={`w-3 h-3 rounded ${color}`}></span>
            <span className="text-gray-400">{cat}</span>
          </div>
        ))}
      </div>
    </div>
  );
}