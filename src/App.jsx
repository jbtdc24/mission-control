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
  X
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
  { id: 'content', label: 'Content Pipeline', icon: FileText },
  { id: 'calendar', label: 'Calendar', icon: Calendar },
  { id: 'memory', label: 'Memory', icon: BookOpen },
  { id: 'team', label: 'AI Team', icon: Users },
  { id: 'contacts', label: 'Contacts', icon: Contact },
  { id: 'settings', label: 'Settings', icon: Settings },
];

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);

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
    <div className="flex h-screen bg-julz-black text-julz-cream">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-16'} bg-julz-dark border-r border-gray-800 transition-all duration-300 flex flex-col`}>
        <div className="p-4 border-b border-gray-800 flex items-center justify-between">
          {sidebarOpen && (
            <div>
              <h1 className="text-lg font-bold text-monday-amber">Mission Control</h1>
              <p className="text-xs text-gray-500">Julz & Monday</p>
            </div>
          )}
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-1 hover:bg-gray-800 rounded">
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
        
        <nav className="flex-1 p-2 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                  activeTab === item.id 
                    ? 'bg-monday-navy text-white' 
                    : 'hover:bg-gray-800 text-gray-400'
                }`}
              >
                <Icon size={20} />
                {sidebarOpen && <span>{item.label}</span>}
              </button>
            );
          })}
        </nav>
        
        {sidebarOpen && (
          <div className="p-4 border-t border-gray-800">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-monday-navy flex items-center justify-center text-sm font-bold">M</div>
              <div>
                <p className="text-sm font-medium">Monday</p>
                <p className="text-xs text-gray-500">Online</p>
              </div>
            </div>
          </div>
        )}
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {renderContent()}
      </main>
    </div>
  );
}

export default App;