import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_DIR = join(__dirname, '../data');
const DB_FILE = join(DATA_DIR, 'db.json');

// Initial data
const initialData = {
  tasks: [
    { id: 1, title: 'Draft morning Twitter post', assignee: 'Monday', priority: 'high', status: 'todo', due_date: 'Today', project: 'Twitter', created_at: new Date().toISOString() },
    { id: 2, title: 'Fix Gemini billing setup', assignee: 'Julz', priority: 'urgent', status: 'todo', due_date: 'Tomorrow', project: 'Setup', created_at: new Date().toISOString() },
    { id: 3, title: 'Set up Google Calendar', assignee: 'Julz', priority: 'high', status: 'todo', due_date: 'Tomorrow', project: 'Setup', created_at: new Date().toISOString() },
    { id: 4, title: 'Research Anichess updates', assignee: 'Monday', priority: 'medium', status: 'in-progress', due_date: 'Today', project: 'Research', created_at: new Date().toISOString() },
    { id: 5, title: 'Create Tuesday agent', assignee: 'Monday', priority: 'medium', status: 'in-progress', due_date: 'Tomorrow', project: 'AI Team', created_at: new Date().toISOString() },
    { id: 6, title: 'Deploy Star Office', assignee: 'Monday', priority: 'medium', status: 'done', due_date: 'Yesterday', project: 'Dev', created_at: new Date().toISOString() },
  ],
  activities: [
    { id: 1, action: 'Drafted Twitter post', agent: 'Monday', status: 'completed', created_at: new Date(Date.now() - 5 * 60000).toISOString() },
    { id: 2, action: 'Set up Mission Control dashboard', agent: 'Monday', status: 'completed', created_at: new Date(Date.now() - 15 * 60000).toISOString() },
    { id: 3, action: 'Deployed Star Office to Vercel', agent: 'Monday', status: 'completed', created_at: new Date(Date.now() - 60 * 60000).toISOString() },
    { id: 4, action: 'Scheduled daily weather alerts', agent: 'Monday', status: 'completed', created_at: new Date(Date.now() - 120 * 60000).toISOString() },
    { id: 5, action: 'Creating additional AI agents', agent: 'Monday', status: 'pending', created_at: new Date().toISOString() },
  ],
  content: [
    { id: 1, title: 'Anichess Tournament Update', platform: 'Twitter', stage: 'scheduled', day: 'Monday', type: 'text', created_at: new Date().toISOString() },
    { id: 2, title: 'Vibe Coding Tutorial', platform: 'YouTube', stage: 'script', day: 'Tuesday', type: 'video', created_at: new Date().toISOString() },
    { id: 3, title: 'Web3 Gaming Trends', platform: 'LinkedIn', stage: 'idea', day: 'Wednesday', type: 'text', created_at: new Date().toISOString() },
    { id: 4, title: 'Behind the Scenes', platform: 'Instagram', stage: 'edit', day: 'Thursday', type: 'video', created_at: new Date().toISOString() },
    { id: 5, title: 'Weekly Recap', platform: 'Twitter', stage: 'published', day: 'Friday', type: 'text', created_at: new Date().toISOString() },
  ],
  cronJobs: [
    { id: 1, name: 'Weather Check', schedule: '7:00 AM daily', status: 'active', last_run: 'Today' },
    { id: 2, name: 'News Briefing', schedule: '8:00 AM daily', status: 'active', last_run: 'Today' },
    { id: 3, name: 'Twitter Morning Post', schedule: '9:00 AM daily', status: 'active', last_run: 'Pending' },
    { id: 4, name: 'Higgsfield Reminder', schedule: 'April 1, 8:00 AM', status: 'scheduled', last_run: '-' },
  ],
  agents: [
    { id: 1, name: 'Monday', role: 'Personal Assistant', status: 'online', lastActive: new Date().toISOString(), avatar: 'M', color: '#1e3a5f', tasks: 12, completed: 89, description: 'Your guardian-archivist. Handles tasks, remembers everything, manages Twitter.' },
    { id: 2, name: 'Tuesday', role: 'Content Creator', status: 'offline', lastActive: null, avatar: 'T', color: '#8b5cf6', tasks: 0, completed: 0, description: 'Specializes in video scripts and creative writing. Coming soon.' },
    { id: 3, name: 'Wednesday', role: 'Research Analyst', status: 'offline', lastActive: null, avatar: 'W', color: '#22c55e', tasks: 0, completed: 0, description: 'Deep research on web3, gaming trends, and market analysis. Coming soon.' },
    { id: 4, name: 'Thursday', role: 'Code Assistant', status: 'offline', lastActive: null, avatar: 'Th', color: '#f59e0b', tasks: 0, completed: 0, description: 'Vibe coding specialist. Builds apps and automations. Coming soon.' },
  ],
  settings: {
    notifications: true,
    autoSync: true,
    darkMode: true,
  },
};

export class Database {
  constructor() {
    this.data = null;
    this.init();
  }

  init() {
    if (!existsSync(DATA_DIR)) {
      mkdirSync(DATA_DIR, { recursive: true });
    }
    
    if (!existsSync(DB_FILE)) {
      this.data = initialData;
      this.save();
    } else {
      this.load();
    }
  }

  load() {
    try {
      this.data = JSON.parse(readFileSync(DB_FILE, 'utf8'));
    } catch {
      this.data = initialData;
      this.save();
    }
  }

  save() {
    writeFileSync(DB_FILE, JSON.stringify(this.data, null, 2));
  }

  // Tasks
  getTasks() {
    return this.data.tasks.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  }

  addTask(task) {
    const newTask = {
      id: Date.now(),
      ...task,
      created_at: new Date().toISOString(),
    };
    this.data.tasks.push(newTask);
    this.save();
    return newTask;
  }

  updateTask(id, updates) {
    const index = this.data.tasks.findIndex(t => t.id == id);
    if (index !== -1) {
      this.data.tasks[index] = { ...this.data.tasks[index], ...updates };
      this.save();
      return this.data.tasks[index];
    }
    return null;
  }

  deleteTask(id) {
    this.data.tasks = this.data.tasks.filter(t => t.id != id);
    this.save();
  }

  // Activities
  getActivities() {
    return this.data.activities.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  }

  addActivity(activity) {
    const newActivity = {
      id: Date.now(),
      ...activity,
      created_at: new Date().toISOString(),
    };
    this.data.activities.unshift(newActivity);
    if (this.data.activities.length > 50) {
      this.data.activities = this.data.activities.slice(0, 50);
    }
    this.save();
    return newActivity;
  }

  // Content
  getContent() {
    return this.data.content;
  }

  addContent(item) {
    const newItem = {
      id: Date.now(),
      ...item,
      created_at: new Date().toISOString(),
    };
    this.data.content.push(newItem);
    this.save();
    return newItem;
  }

  updateContent(id, updates) {
    const index = this.data.content.findIndex(c => c.id == id);
    if (index !== -1) {
      this.data.content[index] = { ...this.data.content[index], ...updates };
      this.save();
      return this.data.content[index];
    }
    return null;
  }

  deleteContent(id) {
    this.data.content = this.data.content.filter(c => c.id != id);
    this.save();
  }

  // Cron Jobs
  getCronJobs() {
    return this.data.cronJobs;
  }

  // Agents
  getAgents() {
    return this.data.agents;
  }

  addAgent(agent) {
    const newAgent = {
      id: Date.now(),
      ...agent,
      created_at: new Date().toISOString(),
    };
    this.data.agents.push(newAgent);
    this.save();
    return newAgent;
  }

  updateAgent(id, updates) {
    const index = this.data.agents.findIndex(a => a.id == id);
    if (index !== -1) {
      this.data.agents[index] = { ...this.data.agents[index], ...updates };
      this.save();
      return this.data.agents[index];
    }
    return null;
  }

  updateAgentActivity(agentId) {
    return this.updateAgent(agentId, { 
      lastActive: new Date().toISOString(),
      status: 'online'
    });
  }

  deleteAgent(id) {
    this.data.agents = this.data.agents.filter(a => a.id != id);
    this.save();
  }

  // Settings
  getSettings() {
    return this.data.settings;
  }

  updateSettings(updates) {
    this.data.settings = { ...this.data.settings, ...updates };
    this.save();
    return this.data.settings;
  }

  // Stats
  getStats() {
    const activeTasks = this.data.tasks.filter(t => t.status !== 'done').length;
    const contentCount = this.data.content.length;
    const upcoming = this.data.tasks.filter(t => t.due_date === 'Today' || t.due_date === 'Tomorrow').length;
    
    // Calculate actual agent activity based on lastActive timestamp
    const monday = this.data.agents.find(a => a.name === 'Monday');
    let agentStatus = 'Idle';
    
    if (monday && monday.lastActive) {
      const lastActiveTime = new Date(monday.lastActive).getTime();
      const now = Date.now();
      const diffMinutes = (now - lastActiveTime) / 1000 / 60;
      
      if (diffMinutes < 2) {
        agentStatus = 'Active now';
      } else if (diffMinutes < 10) {
        agentStatus = `Active ${Math.floor(diffMinutes)}m ago`;
      } else if (diffMinutes < 60) {
        agentStatus = 'Idle';
      } else {
        agentStatus = 'Offline';
      }
    }
    
    return {
      activeTasks,
      contentPipeline: `${contentCount} items`,
      upcoming48h: upcoming,
      agentActivity: agentStatus,
      lastActive: monday?.lastActive || null
    };
  }
}
