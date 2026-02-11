import { useState } from 'react';
import { Box, Typography, Snackbar, Alert, Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import { useAuth } from '../../auth/AuthContext';
import useTeam from '../../hooks/useTeam';
import MemberCard from './MemberCard';

export default function TeamPage() {
  const { user } = useAuth();
  const { members, removeMember } = useTeam();
  const [confirmId, setConfirmId] = useState(null);
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });

  const isAdmin = user?.role === 'admin';
  const memberToRemove = members.find((m) => m.id === confirmId);

  const handleRemove = async () => {
    try {
      await removeMember(confirmId);
      setToast({ open: true, message: 'Member removed', severity: 'success' });
    } catch {
      setToast({ open: true, message: 'Failed to remove member', severity: 'error' });
    }
    setConfirmId(null);
  };

  return (
    <Box>
      <Typography variant="h5" fontWeight={600} mb={3}>
        Team Members
      </Typography>
      <Box display="flex" flexDirection="column" gap={1.5} maxWidth={600}>
        {members.map((m) => (
          <MemberCard
            key={m.id}
            member={m}
            isAdmin={isAdmin}
            canRemove={isAdmin && m.id !== user?.id}
            onRemove={setConfirmId}
          />
        ))}
        {members.length === 0 && (
          <Typography color="text.secondary">No team members yet.</Typography>
        )}
      </Box>

      <Dialog open={!!confirmId} onClose={() => setConfirmId(null)}>
        <DialogTitle>Remove Member</DialogTitle>
        <DialogContent>
          Remove <strong>{memberToRemove?.displayName}</strong> from the team?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmId(null)}>Cancel</Button>
          <Button color="error" variant="contained" onClick={handleRemove}>Remove</Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={toast.open}
        autoHideDuration={3000}
        onClose={() => setToast((t) => ({ ...t, open: false }))}
      >
        <Alert severity={toast.severity}>{toast.message}</Alert>
      </Snackbar>
    </Box>
  );
}
