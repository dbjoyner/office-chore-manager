import { Box, Button, IconButton, Typography, ToggleButton, ToggleButtonGroup, FormControlLabel, Switch } from '@mui/material';
import { ChevronLeft, ChevronRight, Today } from '@mui/icons-material';
import { format } from 'date-fns';

export default function CalendarToolbar({ date, view, onNavigate, onView, views, hideCompleted, onToggleHideCompleted }) {
  const label = view === 'month'
    ? format(date, 'MMMM yyyy')
    : view === 'week'
    ? `Week of ${format(date, 'MMM d, yyyy')}`
    : format(date, 'EEEE, MMMM d, yyyy');

  return (
    <Box display="flex" alignItems="center" justifyContent="space-between" mb={2} flexWrap="wrap" gap={1}>
      <Box display="flex" alignItems="center" gap={1}>
        <Button
          variant="outlined"
          size="small"
          startIcon={<Today />}
          onClick={() => onNavigate('TODAY')}
          sx={{ borderColor: '#0078D4', color: '#0078D4' }}
        >
          Today
        </Button>
        <IconButton onClick={() => onNavigate('PREV')} size="small">
          <ChevronLeft />
        </IconButton>
        <IconButton onClick={() => onNavigate('NEXT')} size="small">
          <ChevronRight />
        </IconButton>
        <Typography variant="h6" fontWeight={600} sx={{ ml: 1 }}>
          {label}
        </Typography>
      </Box>
      <Box display="flex" alignItems="center" gap={2}>
        <FormControlLabel
          control={
            <Switch
              size="small"
              checked={hideCompleted}
              onChange={onToggleHideCompleted}
            />
          }
          label="Hide completed"
          sx={{ mr: 0, '& .MuiTypography-root': { fontSize: 14 } }}
        />
        <ToggleButtonGroup
          value={view}
          exclusive
          onChange={(_, v) => v && onView(v)}
          size="small"
        >
          {views.map((v) => (
            <ToggleButton
              key={v}
              value={v}
              sx={{
                textTransform: 'capitalize',
                '&.Mui-selected': { bgcolor: '#0078D4', color: '#fff' },
                '&.Mui-selected:hover': { bgcolor: '#106EBE' },
              }}
            >
              {v}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      </Box>
    </Box>
  );
}
