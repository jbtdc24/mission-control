import { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock } from 'lucide-react';

const CalendarView = () => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const daysInMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  ).getDate();

  const firstDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  ).getDay();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Sample events
  const events = {
    19: [
      { time: '7:00 AM', title: 'Weather Check', type: 'auto' },
      { time: '8:00 AM', title: 'News Briefing', type: 'auto' },
      { time: '9:00 AM', title: 'Twitter Draft', type: 'reminder' },
    ],
    20: [
      { time: '9:00 AM', title: 'Workspace Setup', type: 'task' },
    ],
  };

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const today = new Date().getDate();
  const isCurrentMonth = currentDate.getMonth() === new Date().getMonth();

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="px-4 lg:px-8 py-6 border-b border-white/[0.06]">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-white mb-1">Calendar</h1>
            <p className="text-sm text-white/50">Schedule and upcoming events</p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={prevMonth}
              className="p-2 rounded-lg hover:bg-white/[0.1] text-white/50 hover:text-white transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <h2 className="text-lg font-medium text-white min-w-[140px] text-center">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h2>

            <button
              onClick={nextMonth}
              className="p-2 rounded-lg hover:bg-white/[0.1] text-white/50 hover:text-white transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="flex-1 p-4 lg:p-8 overflow-auto">
        <div className="rounded-xl bg-[#111] border border-white/[0.06] overflow-hidden">
          {/* Week Days Header */}
          <div className="grid grid-cols-7 border-b border-white/[0.06]">
            {weekDays.map((day) => (
              <div
                key={day}
                className="py-3 text-center text-xs font-medium text-white/40 uppercase tracking-wider"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <div className="grid grid-cols-7">
            {/* Empty cells for days before month starts */}
            {Array.from({ length: firstDayOfMonth }).map((_, i) => (
              <div key={`empty-${i}`} className="min-h-[100px] border-b border-r border-white/[0.04]" />
            ))}

            {/* Days */}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const dayEvents = events[day] || [];
              const isToday = isCurrentMonth && day === today;

              return (
                <div
                  key={day}
                  className="min-h-[100px] p-2 border-b border-r border-white/[0.04] hover:bg-white/[0.02] transition-colors"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span
                      className={`text-sm font-medium w-7 h-7 flex items-center justify-center rounded-full ${
                        isToday
                          ? 'bg-[#d4a574] text-black'
                          : 'text-white/70'
                      }`}
                    >
                      {day}
                    </span>

                    {dayEvents.length > 0 && (
                      <span className="text-[10px] text-white/30">
                        {dayEvents.length}
                      </span>
                    )}
                  </div>

                  <div className="space-y-1">
                    {dayEvents.slice(0, 2).map((event, idx) => (
                      <div
                        key={idx}
                        className={`text-[10px] px-1.5 py-1 rounded truncate ${
                          event.type === 'auto'
                            ? 'bg-blue-500/10 text-blue-400'
                            : event.type === 'reminder'
                            ? 'bg-amber-500/10 text-amber-400'
                            : 'bg-white/5 text-white/60'
                        }`}
                      >
                        {event.title}
                      </div>
                    ))}

                    {dayEvents.length > 2 && (
                      <div className="text-[10px] text-white/30 px-1.5">
                        +{dayEvents.length - 2} more
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="mt-6">
          <h3 className="text-sm font-medium text-white/70 mb-4">Upcoming Today</h3>

          <div className="space-y-2">
            {(events[today] || []).map((event, idx) => (
              <div
                key={idx}
                className="flex items-center gap-4 p-3 rounded-lg bg-[#161616] border border-white/[0.06]"
              >
                <div className="flex items-center gap-2 text-white/50 min-w-[80px]">
                  <Clock className="w-3.5 h-3.5" />
                  <span className="text-xs">{event.time}</span>
                </div>

                <span className="text-sm text-white/80">{event.title}</span>

                <span
                  className={`ml-auto text-[10px] px-2 py-0.5 rounded-full ${
                    event.type === 'auto'
                      ? 'bg-blue-500/10 text-blue-400'
                      : event.type === 'reminder'
                      ? 'bg-amber-500/10 text-amber-400'
                      : 'bg-white/5 text-white/50'
                  }`}
                >
                  {event.type}
                </span>
              </div>
            ))}

            {(!events[today] || events[today].length === 0) && (
              <div className="text-sm text-white/30 py-8 text-center">
                No events scheduled for today
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarView;