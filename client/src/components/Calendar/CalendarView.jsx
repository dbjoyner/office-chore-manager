import { useState, useCallback, useMemo, useEffect } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop';
import { format, parse, startOfWeek, getDay, startOfMonth, endOfMonth, addMonths, subMonths } from 'date-fns';
import { enUS } from 'date-fns/locale/en-US';
import { Box, Fab, Snackbar, Alert } from '@mui/material';
import { Add } from '@mui/icons-material';
import useChores from '../../hooks/useChores';
import useTeam from '../../hooks/useTeam';
import CalendarToolbar from './CalendarToolbar';
import ChoreEvent from './ChoreEvent';
import ChoreFormModal from '../Chores/ChoreFormModal';
import './calendarStyles.css';

const locales = { 'en-US': enUS };
const localizer = dateFnsLocalizer({ format, parse, startOfWeek, getDay, locales });
const DnDCalendar = withDragAndDrop(Calendar);

export default function CalendarView() {
  const { chores, fetchChores, moveChore, assignChore, createChore, updateChore, deleteChore, completeChore } = useChores();
  const { members } = useTeam();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState('month');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedChore, setSelectedChore] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });
  const [hideCompleted, setHideCompleted] = useState(false);

  // Fetch chores for visible range
  const loadChores = useCallback((date) => {
    const from = format(subMonths(startOfMonth(date), 1), 'yyyy-MM-dd');
    const to = format(addMonths(endOfMonth(date), 1), 'yyyy-MM-dd');
    fetchChores(from, to);
  }, [fetchChores]);

  useEffect(() => {
    loadChores(currentDate);
  }, [currentDate, loadChores]);

  // Map chores to calendar events
  const events = useMemo(() => {
    const memberMap = {};
    members.forEach((m) => { memberMap[m.id] = m; });

    const filtered = hideCompleted ? chores.filter((c) => !c.completed) : chores;

    return filtered.map((chore) => {
      const assignee = memberMap[chore.assigneeId];
      const dateStr = chore.date;
      let start, end;

      if (chore.allDay || !chore.startTime) {
        start = new Date(dateStr + 'T00:00:00');
        end = new Date(dateStr + 'T23:59:59');
      } else {
        start = new Date(dateStr + 'T' + chore.startTime);
        end = new Date(dateStr + 'T' + (chore.endTime || chore.startTime));
      }

      return {
        id: chore.id,
        title: chore.title,
        start,
        end,
        allDay: chore.allDay !== false,
        resource: {
          ...chore,
          assigneeName: assignee?.displayName,
          assigneeColor: assignee?.color,
        },
      };
    });
  }, [chores, members, hideCompleted]);

  // Event style based on assignee color
  const eventPropGetter = useCallback((event) => {
    const color = event.resource?.assigneeColor || '#0078D4';
    const isCompleted = !!event.resource?.completed;
    return {
      style: {
        backgroundColor: color,
        color: '#fff',
        borderLeft: `3px solid ${color}`,
        opacity: isCompleted ? 0.5 : (event.resource?.recurrence ? 0.9 : 1),
      },
    };
  }, []);

  // Drag and drop - reschedule
  const handleEventDrop = useCallback(async ({ event, start }) => {
    const choreId = event.resource?.parentId || event.id;
    const newDate = format(start, 'yyyy-MM-dd');
    try {
      await moveChore(choreId, newDate);
      setToast({ open: true, message: 'Chore rescheduled', severity: 'success' });
      loadChores(currentDate);
    } catch {
      setToast({ open: true, message: 'Failed to reschedule', severity: 'error' });
    }
  }, [moveChore, loadChores, currentDate]);

  // Click on event to edit
  const handleSelectEvent = useCallback((event) => {
    setSelectedChore(event.resource);
    setModalOpen(true);
  }, []);

  // Click on empty slot to create
  const handleSelectSlot = useCallback((slotInfo) => {
    setSelectedChore(null);
    setSelectedSlot({ date: format(slotInfo.start, 'yyyy-MM-dd') });
    setModalOpen(true);
  }, []);

  // Save handler for modal
  const handleSave = useCallback(async (data) => {
    try {
      if (selectedChore) {
        const choreId = selectedChore.parentId || selectedChore.id;
        await updateChore(choreId, data);
        setToast({ open: true, message: 'Chore updated', severity: 'success' });
      } else {
        await createChore(data);
        setToast({ open: true, message: 'Chore created', severity: 'success' });
      }
      setModalOpen(false);
      loadChores(currentDate);
    } catch {
      setToast({ open: true, message: 'Failed to save chore', severity: 'error' });
    }
  }, [selectedChore, updateChore, createChore, loadChores, currentDate]);

  // Delete handler
  const handleDelete = useCallback(async (id) => {
    try {
      await deleteChore(id);
      setToast({ open: true, message: 'Chore deleted', severity: 'success' });
      setModalOpen(false);
      loadChores(currentDate);
    } catch {
      setToast({ open: true, message: 'Failed to delete chore', severity: 'error' });
    }
  }, [deleteChore, loadChores, currentDate]);

  // Complete handler
  const handleComplete = useCallback(async (id) => {
    try {
      const updated = await completeChore(id);
      const msg = updated.completed ? 'Chore marked complete' : 'Chore marked incomplete';
      setToast({ open: true, message: msg, severity: 'success' });
      setModalOpen(false);
      loadChores(currentDate);
    } catch {
      setToast({ open: true, message: 'Failed to update completion', severity: 'error' });
    }
  }, [completeChore, loadChores, currentDate]);

  const handleNavigate = useCallback((newDate) => {
    setCurrentDate(newDate);
  }, []);

  return (
    <Box>
      <DnDCalendar
        localizer={localizer}
        events={events}
        date={currentDate}
        view={view}
        views={['month', 'week', 'day', 'agenda']}
        onNavigate={handleNavigate}
        onView={setView}
        onEventDrop={handleEventDrop}
        onSelectEvent={handleSelectEvent}
        onSelectSlot={handleSelectSlot}
        selectable
        resizable={false}
        popup
        eventPropGetter={eventPropGetter}
        components={{
          toolbar: (props) => (
            <CalendarToolbar
              {...props}
              hideCompleted={hideCompleted}
              onToggleHideCompleted={() => setHideCompleted((h) => !h)}
            />
          ),
          event: ChoreEvent,
        }}
        style={{ height: 'calc(100vh - 140px)' }}
      />

      <Fab
        color="primary"
        onClick={() => {
          setSelectedChore(null);
          setSelectedSlot({ date: format(new Date(), 'yyyy-MM-dd') });
          setModalOpen(true);
        }}
        sx={{
          position: 'fixed',
          bottom: 32,
          right: 32,
          bgcolor: '#0078D4',
          '&:hover': { bgcolor: '#106EBE' },
        }}
      >
        <Add />
      </Fab>

      <ChoreFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        onDelete={handleDelete}
        onComplete={handleComplete}
        chore={selectedChore}
        initialDate={selectedSlot?.date}
        members={members}
      />

      <Snackbar
        open={toast.open}
        autoHideDuration={3000}
        onClose={() => setToast((t) => ({ ...t, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity={toast.severity} onClose={() => setToast((t) => ({ ...t, open: false }))}>
          {toast.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
