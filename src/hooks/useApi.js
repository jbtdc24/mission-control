import { useState, useEffect, useCallback } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

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
    // Poll every 5 seconds for updates
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

  return { content, addContent, updateContent, refresh: fetchContent };
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