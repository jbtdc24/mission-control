import { useState, useEffect, useCallback } from 'react';
import { API_URL, getWebSocketUrl } from '../config/api';

// WebSocket connection for real-time updates
let ws = null;
let wsListeners = [];

function connectWebSocket() {
  if (ws?.readyState === WebSocket.OPEN) return;
  
  try {
    const wsUrl = getWebSocketUrl();
    ws = new WebSocket(wsUrl);
    
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      wsListeners.forEach(cb => cb(data));
    };
    
    ws.onclose = () => {
      setTimeout(connectWebSocket, 3000);
    };
  } catch (err) {
    console.error('WebSocket error:', err);
  }
}

export function useWebSocket() {
  useEffect(() => {
    connectWebSocket();
  }, []);
  
  const subscribe = useCallback((callback) => {
    wsListeners.push(callback);
    return () => {
      wsListeners = wsListeners.filter(cb => cb !== callback);
    };
  }, []);
  
  return { subscribe };
}

export function useTasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTasks = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/tasks`);
      const data = await res.json();
      setTasks(data);
    } catch (err) {
      console.error('Failed to fetch tasks:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
    const interval = setInterval(fetchTasks, 5000);
    return () => clearInterval(interval);
  }, [fetchTasks]);

  const addTask = async (task) => {
    const res = await fetch(`${API_URL}/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(task),
    });
    const newTask = await res.json();
    setTasks(prev => [newTask, ...prev]);
    return newTask;
  };

  const updateTask = async (id, updates) => {
    const res = await fetch(`${API_URL}/tasks/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    const updated = await res.json();
    setTasks(prev => prev.map(t => t.id === id ? updated : t));
    return updated;
  };

  const deleteTask = async (id) => {
    await fetch(`${API_URL}/tasks/${id}`, { method: 'DELETE' });
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  return { tasks, loading, addTask, updateTask, deleteTask, refresh: fetchTasks };
}

export function useActivities() {
  const [activities, setActivities] = useState([]);

  const fetchActivities = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/activities`);
      const data = await res.json();
      setActivities(data);
    } catch (err) {
      console.error('Failed to fetch activities:', err);
    }
  }, []);

  useEffect(() => {
    fetchActivities();
    const interval = setInterval(fetchActivities, 5000);
    return () => clearInterval(interval);
  }, [fetchActivities]);

  const addActivity = async (activity) => {
    const res = await fetch(`${API_URL}/activities`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(activity),
    });
    const newActivity = await res.json();
    setActivities(prev => [newActivity, ...prev]);
    return newActivity;
  };

  return { activities, addActivity, refresh: fetchActivities };
}

export function useContent() {
  const [content, setContent] = useState([]);

  const fetchContent = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/content`);
      const data = await res.json();
      setContent(data);
    } catch (err) {
      console.error('Failed to fetch content:', err);
    }
  }, []);

  useEffect(() => {
    fetchContent();
    const interval = setInterval(fetchContent, 5000);
    return () => clearInterval(interval);
  }, [fetchContent]);

  const addContent = async (item) => {
    const res = await fetch(`${API_URL}/content`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item),
    });
    const newItem = await res.json();
    setContent(prev => [newItem, ...prev]);
    return newItem;
  };

  const updateContent = async (id, updates) => {
    const res = await fetch(`${API_URL}/content/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    const updated = await res.json();
    setContent(prev => prev.map(c => c.id === id ? updated : c));
    return updated;
  };

  const deleteContent = async (id) => {
    await fetch(`${API_URL}/content/${id}`, { method: 'DELETE' });
    setContent(prev => prev.filter(c => c.id !== id));
  };

  return { content, addContent, updateContent, deleteContent, refresh: fetchContent };
}

export function useStats() {
  const [stats, setStats] = useState({
    activeTasks: 0,
    contentPipeline: '0 items',
    upcoming48h: 0,
    agentActivity: 'Idle'
  });

  const fetchStats = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/stats`);
      const data = await res.json();
      setStats(data);
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    }
  }, []);

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 5000);
    return () => clearInterval(interval);
  }, [fetchStats]);

  return { stats, refresh: fetchStats };
}

export function useCronJobs() {
  const [jobs, setJobs] = useState([]);

  const fetchJobs = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/cron-jobs`);
      const data = await res.json();
      setJobs(data);
    } catch (err) {
      console.error('Failed to fetch cron jobs:', err);
    }
  }, []);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  return { jobs, refresh: fetchJobs };
}

export function useAgents() {
  const [agents, setAgents] = useState([]);

  const fetchAgents = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/agents`);
      const data = await res.json();
      setAgents(data);
    } catch (err) {
      console.error('Failed to fetch agents:', err);
    }
  }, []);

  useEffect(() => {
    fetchAgents();
    const interval = setInterval(fetchAgents, 5000);
    return () => clearInterval(interval);
  }, [fetchAgents]);

  const addAgent = async (agent) => {
    const res = await fetch(`${API_URL}/agents`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(agent),
    });
    const newAgent = await res.json();
    setAgents(prev => [...prev, newAgent]);
    return newAgent;
  };

  const updateAgent = async (id, updates) => {
    const res = await fetch(`${API_URL}/agents/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    const updated = await res.json();
    setAgents(prev => prev.map(a => a.id === id ? updated : a));
    return updated;
  };

  const deleteAgent = async (id) => {
    await fetch(`${API_URL}/agents/${id}`, { method: 'DELETE' });
    setAgents(prev => prev.filter(a => a.id !== id));
  };

  return { agents, addAgent, updateAgent, deleteAgent, refresh: fetchAgents };
}

export function useSearch() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const search = useCallback(async (query) => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    
    setLoading(true);
    try {
      // Search across all data
      const [tasksRes, contentRes, agentsRes] = await Promise.all([
        fetch(`${API_URL}/tasks`),
        fetch(`${API_URL}/content`),
        fetch(`${API_URL}/agents`).catch(() => ({ json: () => [] })),
      ]);
      
      const [tasks, content, agents] = await Promise.all([
        tasksRes.json(),
        contentRes.json(),
        agentsRes.json(),
      ]);
      
      const q = query.toLowerCase();
      const searchResults = [
        ...tasks.filter(t => t.title?.toLowerCase().includes(q)).map(t => ({ ...t, type: 'task' })),
        ...content.filter(c => c.title?.toLowerCase().includes(q)).map(c => ({ ...c, type: 'content' })),
        ...agents.filter(a => a.name?.toLowerCase().includes(q)).map(a => ({ ...a, type: 'agent' })),
      ];
      
      setResults(searchResults);
    } catch (err) {
      console.error('Search failed:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  return { results, loading, search };
}
