import { useState, useCallback, useEffect } from 'react';
import api from '../api/axiosInstance';

export default function useTeam() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchMembers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/users');
      setMembers(res.data);
      return res.data;
    } catch {
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const removeMember = useCallback(async (id) => {
    await api.delete(`/users/${id}`);
    setMembers((prev) => prev.filter((m) => m.id !== id));
  }, []);

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  return { members, loading, fetchMembers, removeMember };
}
