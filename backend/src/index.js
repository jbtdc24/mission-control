import express from 'express';
import cors from 'cors';
import { WebSocketServer } from 'ws';
import { createServer } from 'http';
import { Database } from './database.js';

const app = express();
const server = createServer(app);
const wss = new WebSocketServer({ server });

// Configure CORS for production
const allowedOrigins = process.env.CORS_ORIGINS 
  ? process.env.CORS_ORIGINS.split(',') 
  : ['http://localhost:5173', 'http://localhost:3000', 'https://jbtdc24.github.io'];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, curl, etc.)
    if (!origin) return callback(null, true);
    if (allowedOrigins.some(allowed => origin.startsWith(allowed))) {
      callback(null, true);
    } else {
      console.warn(`CORS blocked origin: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

const db = new Database();
await db.init();

// WebSocket for real-time updates
const clients = new Set();
wss.on('connection', (ws) => {
  clients.add(ws);
  ws.on('close', () => clients.delete(ws));
});

const broadcast = (data) => {
  clients.forEach(client => {
    if (client.readyState === 1) {
      client.send(JSON.stringify(data));
    }
  });
};

// Dashboard stats
app.get('/api/stats', async (req, res) => {
  const stats = await db.getStats();
  res.json(stats);
});

// Activity feed
app.get('/api/activities', async (req, res) => {
  const activities = await db.getActivities();
  res.json(activities);
});

app.post('/api/activities', async (req, res) => {
  const activity = await db.addActivity(req.body);
  broadcast({ type: 'activity', data: activity });
  res.json(activity);
});

// Tasks
app.get('/api/tasks', async (req, res) => {
  const tasks = await db.getTasks();
  res.json(tasks);
});

app.post('/api/tasks', async (req, res) => {
  const task = await db.addTask(req.body);
  broadcast({ type: 'task', action: 'created', data: task });
  res.json(task);
});

app.put('/api/tasks/:id', async (req, res) => {
  const task = await db.updateTask(req.params.id, req.body);
  broadcast({ type: 'task', action: 'updated', data: task });
  res.json(task);
});

app.delete('/api/tasks/:id', async (req, res) => {
  await db.deleteTask(req.params.id);
  broadcast({ type: 'task', action: 'deleted', id: req.params.id });
  res.json({ success: true });
});

// Content
app.get('/api/content', async (req, res) => {
  const content = await db.getContent();
  res.json(content);
});

app.post('/api/content', async (req, res) => {
  const item = await db.addContent(req.body);
  broadcast({ type: 'content', action: 'created', data: item });
  res.json(item);
});

app.put('/api/content/:id', async (req, res) => {
  const item = await db.updateContent(req.params.id, req.body);
  broadcast({ type: 'content', action: 'updated', data: item });
  res.json(item);
});

app.delete('/api/content/:id', async (req, res) => {
  await db.deleteContent(req.params.id);
  broadcast({ type: 'content', action: 'deleted', id: req.params.id });
  res.json({ success: true });
});

// Cron jobs
app.get('/api/cron-jobs', async (req, res) => {
  const jobs = await db.getCronJobs();
  res.json(jobs);
});

// Agents
app.get('/api/agents', async (req, res) => {
  const agents = await db.getAgents();
  res.json(agents);
});

app.get('/api/agents/:id', async (req, res) => {
  const agents = await db.getAgents();
  const agent = agents.find(a => a.id == req.params.id);
  if (agent) {
    res.json(agent);
  } else {
    res.status(404).json({ error: 'Agent not found' });
  }
});

app.post('/api/agents', async (req, res) => {
  const agent = await db.addAgent(req.body);
  broadcast({ type: 'agent', action: 'created', data: agent });
  res.json(agent);
});

app.put('/api/agents/:id', async (req, res) => {
  const agent = await db.updateAgent(req.params.id, req.body);
  broadcast({ type: 'agent', action: 'updated', data: agent });
  res.json(agent);
});

app.delete('/api/agents/:id', async (req, res) => {
  await db.deleteAgent(req.params.id);
  broadcast({ type: 'agent', action: 'deleted', id: req.params.id });
  res.json({ success: true });
});

// Agent activity ping
app.post('/api/agents/ping', async (req, res) => {
  const { agentId } = req.body;
  const agent = await db.updateAgentActivity(agentId || 1);
  broadcast({ type: 'agent', action: 'activity', data: agent });
  res.json(agent);
});

// Settings
app.get('/api/settings', async (req, res) => {
  const settings = await db.getSettings();
  res.json(settings);
});

app.put('/api/settings', async (req, res) => {
  const settings = await db.updateSettings(req.body);
  broadcast({ type: 'settings', data: settings });
  res.json(settings);
});

// Search
app.get('/api/search', async (req, res) => {
  const { q } = req.query;
  if (!q) return res.json([]);
  
  const query = q.toLowerCase();
  const [tasks, content, agents] = await Promise.all([
    db.getTasks(),
    db.getContent(),
    db.getAgents(),
  ]);
  
  const results = [
    ...tasks.filter(t => t.title?.toLowerCase().includes(query)).map(t => ({ ...t, type: 'task' })),
    ...content.filter(c => c.title?.toLowerCase().includes(query)).map(c => ({ ...c, type: 'content' })),
    ...agents.filter(a => a.name?.toLowerCase().includes(query)).map(a => ({ ...a, type: 'agent' })),
  ];
  
  res.json(results);
});

// Health check endpoint for Railway/Render
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    time: new Date().toISOString(),
    uptime: process.uptime(),
    version: process.env.npm_package_version || '1.0.0'
  });
});

const PORT = process.env.PORT || 3001;
const HOST = process.env.HOST || '0.0.0.0';
server.listen(PORT, HOST, () => {
  console.log(`Mission Control API running on http://${HOST}:${PORT}`);
});

export { broadcast };
