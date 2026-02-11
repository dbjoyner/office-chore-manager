import { Box, Toolbar } from '@mui/material';
import { useState } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import NotificationPanel from '../Notifications/NotificationPanel';

export default function AppShell({ children }) {
  const [notifOpen, setNotifOpen] = useState(false);

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <Header onToggleNotifications={() => setNotifOpen((o) => !o)} />
      <Sidebar />
      <Box component="main" sx={{ flexGrow: 1, bgcolor: '#fafafa', p: 3 }}>
        <Toolbar />
        {children}
      </Box>
      <NotificationPanel open={notifOpen} onClose={() => setNotifOpen(false)} />
    </Box>
  );
}
