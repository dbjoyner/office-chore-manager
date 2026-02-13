import { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, FormControl, InputLabel, Select, MenuItem,
  FormControlLabel, Switch, Box, IconButton,
} from '@mui/material';
import { Delete, CheckCircle, Undo } from '@mui/icons-material';
import RecurrenceSelect from './RecurrenceSelect';

export default function ChoreFormModal({ open, onClose, onSave, onDelete, onComplete, chore, initialDate, members }) {
  const [form, setForm] = useState({
    title: '',
    description: '',
    assigneeId: '',
    date: '',
    startTime: '',
    endTime: '',
    allDay: true,
    recurrence: null,
    recurrenceEndDate: '',
  });

  useEffect(() => {
    if (chore) {
      setForm({
        title: chore.title || '',
        description: chore.description || '',
        assigneeId: chore.assigneeId || '',
        date: chore.date || '',
        startTime: chore.startTime || '',
        endTime: chore.endTime || '',
        allDay: chore.allDay !== false,
        recurrence: chore.recurrence || null,
        recurrenceEndDate: chore.recurrenceEndDate || '',
      });
    } else {
      setForm({
        title: '',
        description: '',
        assigneeId: '',
        date: initialDate || '',
        startTime: '',
        endTime: '',
        allDay: true,
        recurrence: null,
        recurrenceEndDate: '',
      });
    }
  }, [chore, initialDate, open]);

  const handleChange = (field) => (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm((f) => ({ ...f, [field]: value }));
  };

  const handleSubmit = () => {
    if (!form.title || !form.date) return;
    onSave({
      ...form,
      assigneeId: form.assigneeId || null,
      recurrence: form.recurrence || null,
      recurrenceEndDate: form.recurrenceEndDate || null,
    });
  };

  const isEditing = !!chore;
  const choreId = chore?.parentId || chore?.id;
  const isCompleted = !!chore?.completed;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        {isEditing ? 'Edit Chore' : 'New Chore'}
        {isEditing && (
          <IconButton color="error" onClick={() => onDelete(choreId)} size="small">
            <Delete />
          </IconButton>
        )}
      </DialogTitle>
      <DialogContent>
        <Box display="flex" flexDirection="column" gap={2} mt={1}>
          <TextField
            label="Title"
            value={form.title}
            onChange={handleChange('title')}
            required
            fullWidth
          />
          <TextField
            label="Description"
            value={form.description}
            onChange={handleChange('description')}
            multiline
            rows={2}
            fullWidth
          />
          <FormControl fullWidth>
            <InputLabel>Assignee</InputLabel>
            <Select
              value={form.assigneeId}
              onChange={handleChange('assigneeId')}
              label="Assignee"
            >
              <MenuItem value="">Unassigned</MenuItem>
              {members?.map((m) => (
                <MenuItem key={m.id} value={m.id}>
                  <Box display="flex" alignItems="center" gap={1}>
                    <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: m.color }} />
                    {m.displayName}
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            label="Date"
            type="date"
            value={form.date}
            onChange={handleChange('date')}
            required
            fullWidth
            slotProps={{ inputLabel: { shrink: true } }}
          />
          <FormControlLabel
            control={<Switch checked={form.allDay} onChange={handleChange('allDay')} />}
            label="All day"
          />
          {!form.allDay && (
            <Box display="flex" gap={2}>
              <TextField
                label="Start Time"
                type="time"
                value={form.startTime}
                onChange={handleChange('startTime')}
                fullWidth
                slotProps={{ inputLabel: { shrink: true } }}
              />
              <TextField
                label="End Time"
                type="time"
                value={form.endTime}
                onChange={handleChange('endTime')}
                fullWidth
                slotProps={{ inputLabel: { shrink: true } }}
              />
            </Box>
          )}
          <RecurrenceSelect
            value={form.recurrence}
            onChange={(val) => setForm((f) => ({ ...f, recurrence: val }))}
          />
          {form.recurrence && (
            <TextField
              label="Repeat Until"
              type="date"
              value={form.recurrenceEndDate}
              onChange={handleChange('recurrenceEndDate')}
              fullWidth
              slotProps={{ inputLabel: { shrink: true } }}
            />
          )}
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2, justifyContent: 'space-between' }}>
        <Box>
          {isEditing && (
            <Button
              variant="outlined"
              startIcon={isCompleted ? <Undo /> : <CheckCircle />}
              onClick={() => onComplete(choreId)}
              color={isCompleted ? 'warning' : 'success'}
            >
              {isCompleted ? 'Mark Incomplete' : 'Mark Complete'}
            </Button>
          )}
        </Box>
        <Box display="flex" gap={1}>
          <Button onClick={onClose}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={!form.title || !form.date}
            sx={{ bgcolor: '#0078D4', '&:hover': { bgcolor: '#106EBE' } }}
          >
            {isEditing ? 'Update' : 'Create'}
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
}
