import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

export class Database {
  constructor() {
    this.db = null;
  }

  async init() {
    this.db = await open({
      filename: join(__dirname, '../data/mission-control.db'),
      driver: sqlite3.Database
    });

    await this.createTables();
    await this.seedData();
  }

  async createTables() {
    await this.db.exec(`
      CREATE TABLE IF NOT EXISTS tasks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        assignee TEXT DEFAULT 'Julz',
        priority TEXT DEFAULT 'medium',
        status TEXT DEFAULT 'todo',
        due_date TEXT,
        project TEXT DEFAULT 'General',
        description TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS activities (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        action TEXT NOT NULL,
        agent TEXT DEFAULT 'Monday',
        status TEXT DEFAULT 'completed',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS content (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        platform TEXT,
        stage TEXT DEFAULT 'idea',
        day TEXT,
        type TEXT DEFAULT 'text',
        script TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS cron_jobs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        schedule TEXT NOT NULL,
        status TEXT DEFAULT 'active',
        last_run TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);
  }

  async seedData() {
    // Check if we already have data
    const count = await this.db.get('SELECT COUNT(*) as count FROM tasks');
    if (count.count > 0) return;

    // Seed tasks
    const tasks = [
      { title: 'Draft morning Twitter post', assignee: 'Monday', priority: 'high', status: 'todo', due_date: 'Today', project: 'Twitter' },
      { title: 'Fix Gemini billing setup', assignee: 'Julz', priority: 'urgent', status: 'todo', due_date: 'Tomorrow', project: 'Setup' },
      { title: 'Set up Google Calendar', assignee: 'Julz', priority: 'high', status: 'todo', due_date: 'Tomorrow', project: 'Setup' },
      { title: 'Research Anichess updates', assignee: 'Monday', priority: 'medium', status: 'in-progress', due_date: 'Today', project: 'Research' },
      { title: 'Create Tuesday agent', assignee: 'Monday', priority: 'medium', status: 'in-progress', due_date: 'Tomorrow', project: 'AI Team' },
      { title: 'Deploy Star Office', assignee: 'Monday', priority: 'medium', status: 'done', due_date: 'Yesterday', project: 'Dev' },
    ];

    for (const task of tasks) {
      await this.db.run(
        'INSERT INTO tasks (title, assignee, priority, status, due_date, project) VALUES (?, ?, ?, ?, ?, ?)',
        [task.title, task.assignee, task.priority, task.status, task.due_date, task.project]
      );
    }

    // Seed activities
    const activities = [
      { action: 'Drafted Twitter post', agent: 'Monday', status: 'completed' },
      { action: 'Set up Mission Control dashboard', agent: 'Monday', status: 'completed' },
      { action: 'Deployed Star Office to Vercel', agent: 'Monday', status: 'completed' },
      { action: 'Scheduled daily weather alerts', agent: 'Monday', status: 'completed' },
      { action: 'Creating additional AI agents', agent: 'Monday', status: 'pending' },
    ];

    for (const act of activities) {
      await this.db.run(
        'INSERT INTO activities (action, agent, status) VALUES (?, ?, ?)',
        [act.action, act.agent, act.status]
      );
    }

    // Seed content
    const content = [
      { title: 'Anichess Tournament Update', platform: 'Twitter', stage: 'scheduled', day: 'Monday', type: 'text' },
      { title: 'Vibe Coding Tutorial', platform: 'YouTube', stage: 'script', day: 'Tuesday', type: 'video' },
      { title: 'Web3 Gaming Trends', platform: 'LinkedIn', stage: 'idea', day: 'Wednesday', type: 'text' },
      { title: 'Behind the Scenes', platform: 'Instagram', stage: 'edit', day: 'Thursday', type: 'video' },
      { title: 'Weekly Recap', platform: 'Twitter', stage: 'published', day: 'Friday', type: 'text' },
    ];

    for (const item of content) {
      await this.db.run(
        'INSERT INTO content (title, platform, stage, day, type) VALUES (?, ?, ?, ?, ?)',
        [item.title, item.platform, item.stage, item.day, item.type]
      );
    }

    // Seed cron jobs
    const jobs = [
      { name: 'Weather Check', schedule: '7:00 AM daily', status: 'active', last_run: 'Today' },
      { name: 'News Briefing', schedule: '8:00 AM daily', status: 'active', last_run: 'Today' },
      { name: 'Twitter Morning Post', schedule: '9:00 AM daily', status: 'active', last_run: 'Pending' },
      { name: 'Higgsfield Reminder', schedule: 'April 1, 8:00 AM', status: 'scheduled', last_run: '-' },
    ];

    for (const job of jobs) {
      await this.db.run(
        'INSERT INTO cron_jobs (name, schedule, status, last_run) VALUES (?, ?, ?, ?)',
        [job.name, job.schedule, job.status, job.last_run]
      );
    }
  }

  // Tasks
  async getTasks() {
    return await this.db.all('SELECT * FROM tasks ORDER BY created_at DESC');
  }

  async addTask(task) {
    const result = await this.db.run(
      'INSERT INTO tasks (title, assignee, priority, status, due_date, project, description) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [task.title, task.assignee || 'Julz', task.priority || 'medium', task.status || 'todo', task.due_date || 'Today', task.project || 'General', task.description]
    );
    return await this.db.get('SELECT * FROM tasks WHERE id = ?', result.lastID);
  }

  async updateTask(id, updates) {
    const sets = Object.keys(updates).map(k => `${k} = ?`).join(', ');
    const values = [...Object.values(updates), id];
    await this.db.run(`UPDATE tasks SET ${sets}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`, values);
    return await this.db.get('SELECT * FROM tasks WHERE id = ?', id);
  }

  async deleteTask(id) {
    await this.db.run('DELETE FROM tasks WHERE id = ?', id);
  }

  // Activities
  async getActivities() {
    return await this.db.all('SELECT * FROM activities ORDER BY created_at DESC LIMIT 20');
  }

  async addActivity(activity) {
    const result = await this.db.run(
      'INSERT INTO activities (action, agent, status) VALUES (?, ?, ?)',
      [activity.action, activity.agent || 'Monday', activity.status || 'completed']
    );
    return await this.db.get('SELECT * FROM activities WHERE id = ?', result.lastID);
  }

  // Content
  async getContent() {
    return await this.db.all('SELECT * FROM content ORDER BY created_at DESC');
  }

  async addContent(item) {
    const result = await this.db.run(
      'INSERT INTO content (title, platform, stage, day, type, script) VALUES (?, ?, ?, ?, ?, ?)',
      [item.title, item.platform, item.stage || 'idea', item.day, item.type || 'text', item.script]
    );
    return await this.db.get('SELECT * FROM content WHERE id = ?', result.lastID);
  }

  async updateContent(id, updates) {
    const sets = Object.keys(updates).map(k => `${k} = ?`).join(', ');
    const values = [...Object.values(updates), id];
    await this.db.run(`UPDATE content SET ${sets}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`, values);
    return await this.db.get('SELECT * FROM content WHERE id = ?', id);
  }

  // Cron jobs
  async getCronJobs() {
    return await this.db.all('SELECT * FROM cron_jobs ORDER BY created_at DESC');
  }

  // Stats
  async getStats() {
    const taskCount = await this.db.get('SELECT COUNT(*) as count FROM tasks WHERE status != "done"');
    const contentCount = await this.db.get('SELECT COUNT(*) as count FROM content');
    const upcoming = await this.db.get('SELECT COUNT(*) as count FROM tasks WHERE due_date = "Today" OR due_date = "Tomorrow"');
    
    return {
      activeTasks: taskCount.count,
      contentPipeline: `${contentCount.count} items`,
      upcoming48h: upcoming.count,
      agentActivity: 'High'
    };
  }
}