import express from 'express';
import cors from 'cors';
import { WebSocketServer } from 'ws';
import { createServer } from 'http';
import { Database } from './database.js';

const app = express();
const server = createServer(app);
const wss = new WebSocketServer({ server });

app.use(cors());
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

// Cron jobs
app.get('/api/cron-jobs', async (req, res) => {
  const jobs = await db.getCronJobs();
  res.json(jobs);
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Mission Control API running on port ${PORT}`);
});

export { broadcast };