import {
  Drawer, Box, Typography, List, ListItem, ListItemText, Button, Chip, Toolbar, IconButton,
} from '@mui/material';
import { Close } from '@mui/icons-material';
import { formatDistanceToNow, parseISO } from 'date-fns';
import useNotifications from '../../hooks/useNotifications';

export default function NotificationPanel({ open, onClose }) {
  const { notifications, markRead, markAllRead, unreadCount } = useNotifications();

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Box sx={{ width: 360, p: 2 }}>
        <Toolbar disableGutters sx={{ justifyContent: 'space-between' }}>
          <Typography variant="h6" fontWeight={600}>Notifications</Typography>
          <IconButton onClick={onClose}><Close /></IconButton>
        </Toolbar>
        {unreadCount > 0 && (
          <Button size="small" onClick={markAllRead} sx={{ mb: 1, color: '#0078D4' }}>
            Mark all as read
          </Button>
        )}
        {notifications.length === 0 ? (
          <Typography color="text.secondary" mt={2}>No notifications yet</Typography>
        ) : (
          <List disablePadding>
            {notifications.map((n) => (
              <ListItem
                key={n.id}
                sx={{
                  bgcolor: n.read ? 'transparent' : '#E6F2FB',
                  borderRadius: 1,
                  mb: 0.5,
                  cursor: n.read ? 'default' : 'pointer',
                }}
                onClick={() => !n.read && markRead(n.id)}
              >
                <ListItemText
                  primary={n.message}
                  secondary={formatDistanceToNow(parseISO(n.createdAt), { addSuffix: true })}
                />
                <Chip
                  label={n.type}
                  size="small"
                  sx={{ ml: 1, textTransform: 'capitalize' }}
                  color={n.type === 'assigned' ? 'primary' : n.type === 'overdue' ? 'error' : 'default'}
                />
              </ListItem>
            ))}
          </List>
        )}
      </Box>
    </Drawer>
  );
}
