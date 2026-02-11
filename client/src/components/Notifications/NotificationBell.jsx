import { IconButton, Badge } from '@mui/material';
import { Notifications } from '@mui/icons-material';
import useNotifications from '../../hooks/useNotifications';

export default function NotificationBell({ onClick }) {
  const { unreadCount } = useNotifications();

  return (
    <IconButton color="inherit" onClick={onClick}>
      <Badge badgeContent={unreadCount} color="error">
        <Notifications />
      </Badge>
    </IconButton>
  );
}
