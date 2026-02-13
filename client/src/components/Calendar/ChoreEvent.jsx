import { Box, Typography, Tooltip } from '@mui/material';
import { Repeat, CheckCircle } from '@mui/icons-material';

export default function ChoreEvent({ event }) {
  const hasRecurrence = !!event.resource?.recurrence;
  const isCompleted = !!event.resource?.completed;

  return (
    <Tooltip
      title={`${event.title}${event.resource?.assigneeName ? ` - ${event.resource.assigneeName}` : ''}${isCompleted ? ' (Completed)' : ''}`}
      arrow
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 0.5,
          overflow: 'hidden',
          width: '100%',
          opacity: isCompleted ? 0.6 : 1,
        }}
      >
        {isCompleted && <CheckCircle sx={{ fontSize: 12 }} />}
        <Typography
          variant="body2"
          sx={{
            fontSize: 12,
            fontWeight: 500,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            textDecoration: isCompleted ? 'line-through' : 'none',
          }}
        >
          {event.title}
        </Typography>
        {hasRecurrence && <Repeat sx={{ fontSize: 12, opacity: 0.7 }} />}
      </Box>
    </Tooltip>
  );
}
