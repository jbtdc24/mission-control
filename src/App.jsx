import { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  CheckSquare, 
  FileText, 
  Calendar, 
  BookOpen, 
  Users, 
  Settings,
  Menu,
  X,
  Sparkles,
  Zap,
  Bell,
  Search,
  Command
} from 'lucide-react';
import Dashboard from './components/Dashboard';
import TasksBoard from './components/TasksBoard';
import ContentPipeline from './components/ContentPipeline';
import CalendarView from './components/CalendarView';
import MemoryLibrary from './components/MemoryLibrary';
import AITeam from './components/AITeam';
import Contacts from './components/Contacts';
import SettingsView from './components/SettingsView';
import { useSearch } from './hooks/useApi';

const navItems = [
  { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
  { id: 'tasks', label: 'Tasks', icon: CheckSquare },
  { id: 'content', label: 'Content', icon: FileText },
  { id: 'calendar', label: 'Calendar', icon: Calendar },
  { id: 'memory', label: 'Memory', icon: BookOpen },
  { id: 'team', label: 'AI Team', icon: Users },
  { id: 'contacts', label: 'Contacts', icon: Users },
];

// Search Modal Component
const SearchModal = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const { results, loading, search } = useSearch();

  useEffect(() => {
    const timeout = setTimeout(() => {
      search(query);
    }, 300);
    return () => clearTimeout(timeout);
  }, [query, search]);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const getResultIcon = (type) => {
    switch (type) {
      case 'task': return '⚡';
      case 'content': return '📝';
      case 'agent': return '🤖';
      default: return '📄';
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-20 p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-full max-w-2xl rounded-xl bg-[#111] border border-white/[0.08] shadow-2xl overflow-hidden">
        <div className="flex items-center gap-3 px-4 py-4 border-b border-white/[0.06]">
          <Search className="w-5 h-5 text-white/30" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search tasks, content, agents..."
            className="flex-1 bg-transparent text-white placeholder-white/30 outline-none text-base"
            autoFocus
          />
          <div className="flex items-center gap-1 px-2 py-1 rounded bg-white/[0.05]">
            <Command className="w-3 h-3 text-white/30" />
            <span className="text-xs text-white/30">ESC</span>
          </div>
        </div>

        <div className="max-h-[400px] overflow-y-auto">
          {loading && (
            <div className="p-8 text-center text-white/30">
              <div className="w-6 h-6 border-2 border-white/20 border-t-[#d4a574] rounded-full animate-spin mx-auto mb-2" />
              Searching...
            </div>
          )}

          {!loading && query && results.length === 0 && (
            <div className="p-8 text-center text-white/30">
              No results found for "{query}"
            </div>
          )}

          {!loading && results.length > 0 && (
            <div className="p-2">
              {results.map((result) => (
                <button
                  key={`${result.type}-${result.id}`}
                  onClick={onClose}
                  className="w-full flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-white/[0.05] text-left transition-colors"
                >
                  <span className="text-lg">{getResultIcon(result.type)}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white truncate">{result.title || result.name}</p>
                    <p className="text-xs text-white/40 capitalize">{result.type}</p>
                  </div>
                </button>
              ))}
            </div>
          )}

          {!query && (
            <div className="p-6 text-center text-white/30">
              <Search className="w-12 h-12 mx-auto mb-3 opacity-20" />
              <p>Type to search across your workspace</p>
              <p className="text-xs mt-1">Tasks, content, agents, and more</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Notification Panel Component
const NotificationPanel = ({ isOpen, onClose }) => {
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'Twitter Morning Post', message: 'Draft ready for review', time: '1 hour ago', read: false },
    { id: 2, title: 'Task Completed', message: 'Star Office deployed successfully', time: '2 hours ago', read: false },
    { id: 3, title: 'Weather Alert', message: 'Pampanga: 24°C, light winds', time: '2 hours ago', read: true },
    { id: 4, title: 'System', message: 'Mission Control dashboard updated', time: '3 hours ago', read: true },
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <div className="absolute right-4 top-14 w-80 rounded-xl bg-[#111] border border-white/[0.08] shadow-2xl z-50 overflow-hidden">
        <div className="px-4 py-3 border-b border-white/[0.06] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-white/50" />
            <span className="text-sm font-medium text-white">Notifications</span>
            {unreadCount > 0 && (
              <span className="px-1.5 py-0.5 rounded-full bg-[#d4a574] text-black text-[10px] font-bold">{unreadCount}</span>
            )}
          </div>
          {unreadCount > 0 && (
            <button 
              onClick={markAllAsRead}
              className="text-xs text-[#d4a574] hover:text-[#e8c4a0]"
            >
              Mark all read
            </button>
          )}
        </div>

        <div className="max-h-[300px] overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="p-6 text-center text-white/30 text-sm">
              No notifications
            </div>
          ) : (
            notifications.map((notification) => (
              <button
                key={notification.id}
                onClick={() => markAsRead(notification.id)}
                className={`w-full px-4 py-3 text-left hover:bg-white/[0.03] transition-colors border-b border-white/[0.04] last:border-0 ${
                  !notification.read ? 'bg-[#1e3a5f]/10' : ''
                }`}
              >
                <div className="flex items-start gap-2">
                  {!notification.read && <div className="w-1.5 h-1.5 rounded-full bg-[#d4a574] mt-1.5 flex-shrink-0" />}
                  <div className={notification.read ? 'ml-3.5' : ''}>
                    <p className="text-sm text-white">{notification.title}</p>
                    <p className="text-xs text-white/50 mt-0.5">{notification.message}</p>
                    <p className="text-[10px] text-white/30 mt-1">{notification.time}</p>
                  </div>
                </div>
              </button>
            ))
          )}
        </div>
      </div>
    </>
  );
};

// New Task Modal Component
const NewTaskModal = ({ isOpen, onClose, onSubmit }) => {
  const [task, setTask] = useState({
    title: '',
    assignee: 'Julz',
    priority: 'medium',
    due_date: '',
    project: '',
    status: 'todo'
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(task);
    onClose();
    setTask({ title: '', assignee: 'Julz', priority: 'medium', due_date: '', project: '', status: 'todo' });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-full max-w-md rounded-xl bg-[#111] border border-white/[0.08] shadow-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-white/[0.06] flex items-center justify-between">
          <h3 className="text-sm font-semibold text-white">New Task</h3>
          <button onClick={onClose} className="p-1 rounded hover:bg-white/[0.1]">
            <X className="w-4 h-4 text-white/50" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs text-white/50 mb-1.5">Title</label>
            <input
              type="text"
              value={task.title}
              onChange={(e) => setTask({ ...task, title: e.target.value })}
              className="input"
              placeholder="What needs to be done?"
              autoFocus
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-white/50 mb-1.5">Assignee</label>
              <select
                value={task.assignee}
                onChange={(e) => setTask({ ...task, assignee: e.target.value })}
                className="input"
              >
                <option value="Julz">Julz</option>
                <option value="Monday">Monday</option>
              </select>
            </div>

            <div>
              <label className="block text-xs text-white/50 mb-1.5">Priority</label>
              <select
                value={task.priority}
                onChange={(e) => setTask({ ...task, priority: e.target.value })}
                className="input"
              >
                <option value="urgent">Urgent</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-white/50 mb-1.5">Due Date</label>
              <input
                type="text"
                value={task.due_date}
                onChange={(e) => setTask({ ...task, due_date: e.target.value })}
                className="input"
                placeholder="e.g. Tomorrow"
              />
            </div>

            <div>
              <label className="block text-xs text-white/50 mb-1.5">Project</label>
              <input
                type="text"
                value={task.project}
                onChange={(e) => setTask({ ...task, project: e.target.value })}
                className="input"
                placeholder="Project name"
              />
            </div>
          </div>

          <div className="pt-4 flex gap-3">
            <button type="button" onClick={onClose} className="btn btn-secondary flex-1">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary flex-1">
              Create Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [newTaskOpen, setNewTaskOpen] = useState(false);

  // Ping activity when app is being used
  useEffect(() => {
    const pingActivity = () => {
      fetch('https://drawings-exhibit-meat-compound.trycloudflare.com/api/agents/ping', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ agentId: 1 }),
        keepalive: true
      }).catch(() => {});
    };
    
    // Ping immediately and every 30 seconds while app is open
    pingActivity();
    const interval = setInterval(pingActivity, 30000);
    
    // Also ping on user interactions
    const events = ['click', 'keydown', 'mousemove', 'scroll'];
    let debounceTimer;
    const handleActivity = () => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(pingActivity, 1000);
    };
    
    events.forEach(e => window.addEventListener(e, handleActivity));
    
    return () => {
      clearInterval(interval);
      events.forEach(e => window.removeEventListener(e, handleActivity));
    };
  }, []);
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Cmd/Ctrl + K for search
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(prev => !prev);
      }
      // Escape to close modals
      if (e.key === 'Escape') {
        setSearchOpen(false);
        setNotificationsOpen(false);
        setNewTaskOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard />;
      case 'tasks': return <TasksBoard />;
      case 'content': return <ContentPipeline />;
      case 'calendar': return <CalendarView />;
      case 'memory': return <MemoryLibrary />;
      case 'team': return <AITeam />;
      case 'contacts': return <Contacts />;
      case 'settings': return <SettingsView />;
      default: return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-[#0a0a0a] overflow-hidden">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`
          fixed lg:static inset-y-0 left-0 z-50
          w-64 bg-[#0a0a0a] border-r border-white/[0.06]
          flex flex-col
          transition-transform duration-300 ease-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Logo Section */}
        <div className="p-4 border-b border-white/[0.06]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#1e3a5f] to-[#254670] flex items-center justify-center shadow-lg shadow-[#1e3a5f]/20">
              <Sparkles className="w-5 h-5 text-[#d4a574]" />
            </div>
            <div>
              <h1 className="text-sm font-semibold text-white tracking-tight">Mission Control</h1>
              <p className="text-[11px] text-white/40">Julz & Monday</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setSidebarOpen(false);
                }}
                className={`
                  w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-150
                  ${isActive 
                    ? 'bg-white/10 text-white font-medium' 
                    : 'text-white/50 hover:text-white hover:bg-white/[0.05]'
                  }
                `}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#d4a574]' : ''}`} />
                {item.label}
                {isActive && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-[#d4a574]" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Bottom Section */}
        <div className="p-3 border-t border-white/[0.06] space-y-1">
          <button
            onClick={() => setActiveTab('settings')}
            className={`
              w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-150
              ${activeTab === 'settings' 
                ? 'bg-white/10 text-white font-medium' 
                : 'text-white/50 hover:text-white hover:bg-white/[0.05]'
              }
            `}
          >
            <Settings className="w-4 h-4" />
            Settings
          </button>

          {/* Agent Status */}
          <div className="mt-3 p-3 rounded-lg bg-gradient-to-br from-[#1e3a5f]/20 to-transparent border border-[#1e3a5f]/30">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-xs font-medium text-white/70">Monday is online</span>
            </div>
            <p className="text-[11px] text-white/40">Ready to assist</p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 bg-[#0a0a0a]">
        {/* Top Bar */}
        <header className="h-14 border-b border-white/[0.06] flex items-center justify-between px-4 lg:px-6 bg-[#0a0a0a]/80 backdrop-blur-xl sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 -ml-2 text-white/50 hover:text-white rounded-lg hover:bg-white/[0.05]"
            >
              <Menu className="w-5 h-5" />
            </button>
            
            {/* Breadcrumb */}
            <div className="hidden sm:flex items-center gap-2 text-sm">
              <span className="text-white/30">Mission Control</span>
              <span className="text-white/20">/</span>
              <span className="text-white font-medium capitalize">{activeTab}</span>
            </div>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setSearchOpen(true)}
              className="p-2 text-white/40 hover:text-white rounded-lg hover:bg-white/[0.05] transition-colors hidden sm:flex items-center gap-2"
            >
              <Search className="w-4 h-4" />
              <span className="text-xs text-white/30 hidden lg:inline">⌘K</span>
            </button>

            <div className="relative">
              <button 
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="p-2 text-white/40 hover:text-white rounded-lg hover:bg-white/[0.05] transition-colors relative"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#d4a574] rounded-full" />
              </button>

              <NotificationPanel 
                isOpen={notificationsOpen} 
                onClose={() => setNotificationsOpen(false)} 
              />
            </div>

            <div className="w-px h-5 bg-white/10 mx-1" />

            <button 
              onClick={() => setNewTaskOpen(true)}
              className="btn btn-primary text-xs py-1.5 px-3"
            >
              <Zap className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">New Task</span>
            </button>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="animate-fade-in">
            {renderContent()}
          </div>
        </div>
      </main>

      {/* Modals */}
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
      <NewTaskModal 
        isOpen={newTaskOpen} 
        onClose={() => setNewTaskOpen(false)}
        onSubmit={(task) => {
          fetch('https://dealers-dallas-cat-sing.trycloudflare.com/api/tasks', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(task)
          });
        }}
      />
    </div>
  );
}

export default App;
