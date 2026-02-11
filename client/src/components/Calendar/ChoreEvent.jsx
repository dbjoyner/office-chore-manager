import { Box, Typography, Tooltip } from '@mui/material';
import { Repeat } from '@mui/icons-material';

export default function ChoreEvent({ event }) {
  const hasRecurrence = !!event.resource?.recurrence;

  return (
    <Tooltip
      title={`${event.title}${event.resource?.assigneeName ? ` - ${event.resource.assigneeName}` : ''}`}
      arrow
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 0.5,
          overflow: 'hidden',
          width: '100%',
        }}
      >
        <Typography
          variant="body2"
          sx={{ fontSize: 12, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
        >
          {event.title}
        </Typography>
        {hasRecurrence && <Repeat sx={{ fontSize: 12, opacity: 0.7 }} />}
      </Box>
    </Tooltip>
  );
}
