import {
  Drawer, List, ListItemButton, ListItemIcon, ListItemText, Toolbar,
} from '@mui/material';
import { CalendarMonth, Group } from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

const DRAWER_WIDTH = 220;

const navItems = [
  { label: 'Calendar', path: '/', icon: <CalendarMonth /> },
  { label: 'Team', path: '/team', icon: <Group /> },
];

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: DRAWER_WIDTH,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: DRAWER_WIDTH,
          boxSizing: 'border-box',
          borderRight: '1px solid #e0e0e0',
        },
      }}
    >
      <Toolbar />
      <List>
        {navItems.map((item) => (
          <ListItemButton
            key={item.path}
            selected={location.pathname === item.path}
            onClick={() => navigate(item.path)}
            sx={{
              '&.Mui-selected': { bgcolor: '#E6F2FB', color: '#0078D4' },
              '&.Mui-selected .MuiListItemIcon-root': { color: '#0078D4' },
            }}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.label} />
          </ListItemButton>
        ))}
      </List>
    </Drawer>
  );
}
