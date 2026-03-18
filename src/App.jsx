import { useState } from 'react';
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
  Search
} from 'lucide-react';
import Dashboard from './components/Dashboard';
import TasksBoard from './components/TasksBoard';
import ContentPipeline from './components/ContentPipeline';
import CalendarView from './components/CalendarView';
import MemoryLibrary from './components/MemoryLibrary';
import AITeam from './components/AITeam';
import Contacts from './components/Contacts';
import SettingsView from './components/SettingsView';

const navItems = [
  { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
  { id: 'tasks', label: 'Tasks', icon: CheckSquare },
  { id: 'content', label: 'Content', icon: FileText },
  { id: 'calendar', label: 'Calendar', icon: Calendar },
  { id: 'memory', label: 'Memory', icon: BookOpen },
  { id: 'team', label: 'AI Team', icon: Users },
  { id: 'contacts', label: 'Contacts', icon: Users },
];

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
            <button className="p-2 text-white/40 hover:text-white rounded-lg hover:bg-white/[0.05] transition-colors">
              <Search className="w-4 h-4" />
            </button>
            <button className="p-2 text-white/40 hover:text-white rounded-lg hover:bg-white/[0.05] transition-colors relative">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#d4a574] rounded-full" />
            </button>
            <div className="w-px h-5 bg-white/10 mx-1" />
            <button className="btn btn-primary text-xs py-1.5 px-3">
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
    </div>
  );
}

export default App;