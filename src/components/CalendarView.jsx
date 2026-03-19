import { useState } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon, 
  Clock,
  Plus,
  X,
  Trash2,
  MoreHorizontal
} from 'lucide-react';

const CalendarView = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [events, setEvents] = useState({
    19: [
      { id: 1, time: '7:00 AM', title: 'Weather Check', type: 'auto' },
      { id: 2, time: '8:00 AM', title: 'News Briefing', type: 'auto' },
      { id: 3, time: '9:00 AM', title: 'Twitter Draft', type: 'reminder' },
      { id: 4, time: '10:00 PM', title: 'Vitamin Reminder', type: 'reminder' },
    ],
    20: [
      { id: 5, time: '9:00 AM', title: 'Workspace Setup', type: 'task' },
    ],
  });

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

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const today = new Date().getDate();
  const isCurrentMonth = currentDate.getMonth() === new Date().getMonth();

  const handleDayClick = (day) => {
    setSelectedDate(day);
    setIsModalOpen(true);
  };

  const addEvent = (day, event) => {
    setEvents(prev => ({
      ...prev,
      [day]: [...(prev[day] || []), { ...event, id: Date.now() }]
    }));
  };

  const deleteEvent = (day, eventId) => {
    setEvents(prev => ({
      ...prev,
      [day]: prev[day]?.filter(e => e.id !== eventId) || []
    }));
  };

  // Get events for today
  const todayEvents = events[today] || [];

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

      <div className="flex-1 p-4 lg:p-8 overflow-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calendar Grid */}
          <div className="lg:col-span-2">
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
                    <button
                      key={day}
                      onClick={() => handleDayClick(day)}
                      className={`min-h-[100px] p-2 border-b border-r border-white/[0.04] hover:bg-white/[0.04] transition-colors text-left ${
                        isToday ? 'bg-[#1e3a5f]/10' : ''
                      }`}
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
                        {dayEvents.slice(0, 2).map((event) => (
                          <div
                            key={event.id}
                            className={`text-[10px] px-1.5 py-1 rounded truncate ${
                              event.type === 'auto'
                                ? 'bg-blue-500/10 text-blue-400'
                                : event.type === 'reminder'
                                ? 'bg-amber-500/10 text-amber-400'
                                : 'bg-white/5 text-white/60'
                            }`}
                          >
                            {event.time} {event.title}
                          </div>
                        ))}

                        {dayEvents.length > 2 && (
                          <div className="text-[10px] text-white/30 px-1.5">
                            +{dayEvents.length - 2} more
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Sidebar - Today's Schedule */}
          <div className="space-y-6">
            <div className="rounded-xl bg-[#111] border border-white/[0.06] overflow-hidden">
              <div className="px-5 py-4 border-b border-white/[0.06] flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-white">Today's Schedule</h3>
                  <p className="text-xs text-white/40 mt-0.5">{todayEvents.length} events</p>
                </div>
                <button 
                  onClick={() => { setSelectedDate(today); setIsModalOpen(true); }}
                  className="p-2 rounded-lg hover:bg-white/[0.05] text-white/40 hover:text-white"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <div className="p-2">
                {todayEvents.length > 0 ? (
                  todayEvents.map((event) => (
                    <div
                      key={event.id}
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/[0.03] transition-colors group"
                    >
                      <div className="flex items-center gap-2 text-white/50 min-w-[70px]">
                        <Clock className="w-3.5 h-3.5" />
                        <span className="text-xs">{event.time}</span>
                      </div>

                      <span className="text-sm text-white/80 flex-1">{event.title}</span>

                      <div className="flex items-center gap-2">
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full ${
                            event.type === 'auto'
                              ? 'bg-blue-500/10 text-blue-400'
                              : event.type === 'reminder'
                              ? 'bg-amber-500/10 text-amber-400'
                              : 'bg-white/5 text-white/50'
                          }`}
                        >
                          {event.type}
                        </span>

                        <button 
                          onClick={() => deleteEvent(today, event.id)}
                          className="p-1.5 rounded hover:bg-red-500/10 text-white/20 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center text-white/30">
                    <Clock className="w-10 h-10 mx-auto mb-3 opacity-20" />
                    <p className="text-sm">No events today</p>
                    <button 
                      onClick={() => { setSelectedDate(today); setIsModalOpen(true); }}
                      className="mt-2 text-[#d4a574] hover:text-[#e8c4a0] text-xs"
                    >
                      Add event →
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="rounded-xl bg-gradient-to-br from-[#1e3a5f]/20 to-transparent border border-[#1e3a5f]/30 p-5">
              <h3 className="text-xs font-medium text-white/40 uppercase tracking-wider mb-4">This Month</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-white/50">Total Events</span>
                  <span className="text-white">{Object.values(events).flat().length}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-white/50">Auto Tasks</span>
                  <span className="text-blue-400">{Object.values(events).flat().filter(e => e.type === 'auto').length}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-white/50">Reminders</span>
                  <span className="text-amber-400">{Object.values(events).flat().filter(e => e.type === 'reminder').length}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Event Modal */}
      {isModalOpen && selectedDate && (
        <AddEventModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          day={selectedDate}
          onAdd={(event) => addEvent(selectedDate, event)}
        />
      )}
    </div>
  );
};

// Add Event Modal Component
const AddEventModal = ({ isOpen, onClose, day, onAdd }) => {
  const [formData, setFormData] = useState({
    title: '',
    time: '9:00 AM',
    type: 'task',
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd(formData);
    onClose();
  };

  const eventTypes = [
    { id: 'auto', label: 'Auto', color: 'bg-blue-500/10 text-blue-400' },
    { id: 'reminder', label: 'Reminder', color: 'bg-amber-500/10 text-amber-400' },
    { id: 'task', label: 'Task', color: 'bg-white/5 text-white/60' },
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-full max-w-sm rounded-xl bg-[#111] border border-white/[0.08] shadow-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-white/[0.06] flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-white">Add Event</h3>
            <p className="text-xs text-white/40">Day {day}</p>
          </div>
          <button onClick={onClose} className="p-1 rounded hover:bg-white/[0.1]">
            <X className="w-4 h-4 text-white/50" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs text-white/50 mb-1.5">Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="input"
              placeholder="Event name..."
              autoFocus
              required
            />
          </div>

          <div>
            <label className="block text-xs text-white/50 mb-1.5">Time</label>
            <input
              type="text"
              value={formData.time}
              onChange={(e) => setFormData({ ...formData, time: e.target.value })}
              className="input"
              placeholder="e.g. 9:00 AM"
            />
          </div>

          <div>
            <label className="block text-xs text-white/50 mb-2">Type</label>
            <div className="flex gap-2">
              {eventTypes.map(({ id, label, color }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setFormData({ ...formData, type: id })}
                  className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all ${
                    formData.type === id 
                      ? color + ' ring-1 ring-white/20' 
                      : 'bg-white/[0.05] text-white/50 hover:bg-white/[0.08]'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-4 flex gap-3">
            <button type="button" onClick={onClose} className="btn btn-secondary flex-1">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary flex-1">
              Add Event
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CalendarView;
