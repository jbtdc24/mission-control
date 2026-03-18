import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  CheckSquare, 
  FileText, 
  Calendar, 
  BookOpen, 
  Users, 
  Contact, 
  Settings,
  Menu,
  X,
  Bell
} from 'lucide-react';
import Dashboard from './components/Dashboard';
import TasksBoard from './components/TasksBoard';
import ContentPipeline from './components/ContentPipeline';
import CalendarView from './components/CalendarView';
import Memory from './components/Memory';
import AITeam from './components/AITeam';
import Contacts from './components/Contacts';
import SettingsView from './components/Settings';

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'tasks', label: 'Tasks', icon: CheckSquare },
  { id: 'content', label: 'Content', icon: FileText },
  { id: 'calendar', label: 'Calendar', icon: Calendar },
  { id: 'memory', label: 'Memory', icon: BookOpen },
  { id: 'team', label: 'AI Team', icon: Users },
  { id: 'contacts', label: 'Contacts', icon: Contact },
  { id: 'settings', label: 'Settings', icon: Settings },
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
      case 'memory': return <Memory />;
      case 'team': return <AITeam />;
      case 'contacts': return <Contacts />;
      case 'settings': return <SettingsView />;
      default: return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-[#0a0a0a] text-[#f5f5f0]">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        w-64 bg-[#111] border-r border-[#222] transition-transform duration-300 ease-out flex flex-col
      `}>
        {/* Logo */}
        <div className="p-5 border-b border-[#222]">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg font-semibold tracking-tight">
                Mission
                <span className="text-[#d4a574]">Control</span>
              </h1>
              <p className="text-xs text-[#737373] mt-0.5">Julz & Monday</p>
            </div>
            <button 
              onClick={() => setSidebarOpen(false)} 
              className="lg:hidden p-2 hover:bg-[#1a1a1a] rounded-lg transition-colors"
            >
              <X size={18} className="text-[#737373]" />
            </button>
          </div>
        </div>
        
        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          <div className="text-xs font-medium text-[#737373] uppercase tracking-wider px-3 py-2">
            Menu
          </div>
          
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
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
                  isActive 
                    ? 'bg-[#1e3a5f] text-white shadow-lg shadow-blue-900/20' 
                    : 'text-[#a3a3a3] hover:bg-[#1a1a1a] hover:text-[#f5f5f0]'
                }`}
              >
                <Icon size={18} className={isActive ? 'text-[#d4a574]' : ''} />
                <span className="text-sm font-medium">{item.label}</span>
                
                {isActive && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-[#d4a574]"></div>
                )}
              </button>
            );
          })}
        </nav>
        
        {/* User Profile */}
        <div className="p-4 border-t border-[#222]">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-[#1e3a5f] flex items-center justify-center text-sm font-semibold border-2 border-[#d4a574]/30">
                M
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-[#22c55e] rounded-full border-2 border-[#111]"></div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">Monday</p>
              <p className="text-xs text-[#737373]">AI Assistant</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="bg-[#111]/80 backdrop-blur-md border-b border-[#222] px-4 lg:px-6 py-4 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 hover:bg-[#1a1a1a] rounded-lg transition-colors"
            >
              <Menu size={20} className="text-[#a3a3a3]" />
            </button>
            
            <div className="hidden sm:block">
              <p className="text-xs text-[#737373] uppercase tracking-wider">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button className="p-2 hover:bg-[#1a1a1a] rounded-lg transition-colors relative">
              <Bell size={18} className="text-[#a3a3a3]" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#d4a574] rounded-full"></span>
            </button>
            
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-[#1a1a1a] rounded-lg border border-[#262626]">
              <span className="w-2 h-2 rounded-full bg-[#22c55e] animate-pulse"></span>
              <span className="text-xs text-[#a3a3a3]">System Online</span>
            </div>
          </div>
        </header>
        
        {/* Page Content */}
        <div className="flex-1 overflow-auto">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}

export default App;