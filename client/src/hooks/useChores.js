import { useState, useCallback } from 'react';
import api from '../api/axiosInstance';

export default function useChores() {
  const [chores, setChores] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchChores = useCallback(async (from, to) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/chores', { params: { from, to } });
      setChores(res.data);
      return res.data;
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch chores');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const createChore = useCallback(async (data) => {
    const res = await api.post('/chores', data);
    setChores((prev) => [...prev, res.data]);
    return res.data;
  }, []);

  const updateChore = useCallback(async (id, data) => {
    const res = await api.put(`/chores/${id}`, data);
    setChores((prev) => prev.map((c) => (c.id === id ? res.data : c)));
    return res.data;
  }, []);

  const deleteChore = useCallback(async (id) => {
    await api.delete(`/chores/${id}`);
    setChores((prev) => prev.filter((c) => c.id !== id && c.parentId !== id));
  }, []);

  const moveChore = useCallback(async (id, date) => {
    const res = await api.patch(`/chores/${id}/move`, { date });
    setChores((prev) => prev.map((c) => (c.id === id ? res.data : c)));
    return res.data;
  }, []);

  const assignChore = useCallback(async (id, assigneeId) => {
    const res = await api.patch(`/chores/${id}/assign`, { assigneeId });
    setChores((prev) => prev.map((c) => (c.id === id ? res.data : c)));
    return res.data;
  }, []);

  const completeChore = useCallback(async (id) => {
    const res = await api.patch(`/chores/${id}/complete`);
    setChores((prev) => prev.map((c) => (c.id === id ? res.data : c)));
    return res.data;
  }, []);

  return { chores, loading, error, fetchChores, createChore, updateChore, deleteChore, moveChore, assignChore, completeChore };
}
