import { useState } from 'react';
import { 
  Bell, 
  Shield, 
  Database, 
  Palette,
  ChevronRight,
  ToggleLeft,
  ToggleRight
} from 'lucide-react';

const SettingItem = ({ icon: Icon, title, description, action, hasToggle, isEnabled, onToggle }) => (
  <div className="flex items-center justify-between py-4 border-b border-white/[0.04] last:border-0">
    <div className="flex items-center gap-4">
      <div className="p-2 rounded-lg bg-white/[0.05]">
        <Icon className="w-4 h-4 text-white/50" />
      </div>
      
      <div>
        <h4 className="text-sm font-medium text-white">{title}</h4>
        <p className="text-xs text-white/40 mt-0.5">{description}</p>
      </div>
    </div>

    {hasToggle ? (
      <button 
        onClick={onToggle}
        className={`p-1 rounded-full transition-colors ${isEnabled ? 'text-green-400' : 'text-white/20'}`}
      >
        {isEnabled ? <ToggleRight className="w-6 h-6" /> : <ToggleLeft className="w-6 h-6" />}
      </button>
    ) : (
      <button className="p-2 rounded-lg hover:bg-white/[0.05] text-white/30">
        <ChevronRight className="w-4 h-4" />
      </button>
    )}
  </div>
);

const SettingsView = () => {
  const [settings, setSettings] = useState({
    notifications: true,
    autoSync: true,
    darkMode: true,
  });

  const toggleSetting = (key) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="h-full overflow-y-auto">
      <div className="px-4 lg:px-8 py-6 border-b border-white/[0.06]">
        <h1 className="text-xl font-semibold text-white mb-1">Settings</h1>
        <p className="text-sm text-white/50">Manage your preferences and connections</p>
      </div>

      <div className="p-4 lg:p-8 max-w-3xl">
        {/* Notifications */}
        <div className="mb-8">
          <h2 className="text-xs font-medium text-white/40 uppercase tracking-wider mb-4">Notifications</h2>
          
          <div className="rounded-xl bg-[#111] border border-white/[0.06] px-5">
            <SettingItem
              icon={Bell}
              title="Push Notifications"
              description="Get notified about task updates and reminders"
              hasToggle
              isEnabled={settings.notifications}
              onToggle={() => toggleSetting('notifications')}
            />
          </div>
        </div>

        {/* Data & Sync */}
        <div className="mb-8">
          <h2 className="text-xs font-medium text-white/40 uppercase tracking-wider mb-4">Data & Sync</h2>
          
          <div className="rounded-xl bg-[#111] border border-white/[0.06] px-5">
            <SettingItem
              icon={Database}
              title="Auto Sync"
              description="Automatically sync data every 5 seconds"
              hasToggle
              isEnabled={settings.autoSync}
              onToggle={() => toggleSetting('autoSync')}
            />
            
            <SettingItem
              icon={Database}
              title="Export Data"
              description="Download a backup of all your data"
            />
          </div>
        </div>

        {/* Appearance */}
        <div className="mb-8">
          <h2 className="text-xs font-medium text-white/40 uppercase tracking-wider mb-4">Appearance</h2>
          
          <div className="rounded-xl bg-[#111] border border-white/[0.06] px-5">
            <SettingItem
              icon={Palette}
              title="Dark Mode"
              description="Use dark theme throughout the app"
              hasToggle
              isEnabled={settings.darkMode}
              onToggle={() => toggleSetting('darkMode')}
            />
          </div>
        </div>

        {/* API Connections */}
        <div className="mb-8">
          <h2 className="text-xs font-medium text-white/40 uppercase tracking-wider mb-4">API Connections</h2>
          
          <div className="rounded-xl bg-[#111] border border-white/[0.06] px-5">
            <SettingItem
              icon={Shield}
              title="Typefully API"
              description="Connected • Twitter automation ready"
            />
            
            <SettingItem
              icon={Shield}
              title="GitHub API"
              description="Connected • Repository access enabled"
            />
          </div>
        </div>

        {/* About */}
        <div className="rounded-xl bg-gradient-to-br from-[#1e3a5f]/20 to-transparent border border-[#1e3a5f]/30 p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#1e3a5f] to-[#254670] flex items-center justify-center">
              <span className="text-[#d4a574] font-bold text-xs">M</span>
            </div>
            <div>
              <h3 className="text-sm font-medium text-white">Mission Control</h3>
              <p className="text-xs text-white/40">Version 1.0.0</p>
            </div>
          </div>
          
          <p className="text-xs text-white/50">
            Built for Julz & Monday. Connected to live backend.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SettingsView;