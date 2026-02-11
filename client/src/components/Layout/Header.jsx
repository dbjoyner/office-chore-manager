import { AppBar, Toolbar, Typography, Box, IconButton, Avatar, Menu, MenuItem } from '@mui/material';
import { Logout } from '@mui/icons-material';
import { useState } from 'react';
import { useAuth } from '../../auth/AuthContext';
import NotificationBell from '../Notifications/NotificationBell';

export default function Header({ onToggleNotifications }) {
  const { user, logout } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);

  return (
    <AppBar position="fixed" sx={{ bgcolor: '#0078D4', zIndex: (theme) => theme.zIndex.drawer + 1 }}>
      <Toolbar>
        <Typography variant="h6" fontWeight={600} sx={{ flexGrow: 1 }}>
          Office Chore Manager
        </Typography>
        <Box display="flex" alignItems="center" gap={1}>
          <NotificationBell onClick={onToggleNotifications} />
          <IconButton onClick={(e) => setAnchorEl(e.currentTarget)} size="small">
            <Avatar sx={{ width: 32, height: 32, bgcolor: user?.color || '#fff', fontSize: 14 }}>
              {user?.displayName?.[0]?.toUpperCase()}
            </Avatar>
          </IconButton>
          <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
            <MenuItem disabled>
              <Typography variant="body2">{user?.displayName} ({user?.role})</Typography>
            </MenuItem>
            <MenuItem onClick={() => { setAnchorEl(null); logout(); }}>
              <Logout fontSize="small" sx={{ mr: 1 }} /> Sign out
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
