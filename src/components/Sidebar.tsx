import React from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Box,
  Typography,
} from '@mui/material';
import {
  Dashboard,
  Receipt,
  TrendingUp,
  Settings,
  AccountBalance,
  BuildCircle,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { MENU_ITEMS, APP_NAME } from '../constants';

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

const iconMap = {
  Dashboard,
  Receipt,
  TrendingUp,
  Settings,
  BuildCircle,
};

const menuItems = MENU_ITEMS.map(item => ({
  ...item,
  icon: React.createElement(iconMap[item.icon as keyof typeof iconMap]),
}));

export const Sidebar: React.FC<SidebarProps> = ({ open, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigation = (path: string) => {
    navigate(path);
    onClose();
  };

  return (
    <Drawer
      variant="temporary"
      open={open}
      onClose={onClose}
      ModalProps={{
        keepMounted: true, // Better open performance on mobile.
      }}
      sx={{
        display: { xs: 'block', sm: 'none' },
        '& .MuiDrawer-paper': {
          boxSizing: 'border-box',
          width: 240,
        },
      }}
    >
      <Box sx={{ overflow: 'auto' }}>
        <Box sx={{ p: 2 }}>
          <Typography variant="h6" noWrap component="div">
            <AccountBalance sx={{ mr: 1, verticalAlign: 'middle' }} />
            {APP_NAME}
          </Typography>
        </Box>
        <Divider />
        <List>
          {menuItems.map(item => (
            <ListItem key={item.text} disablePadding>
              <ListItemButton
                selected={location.pathname === item.path}
                onClick={() => handleNavigation(item.path)}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
    </Drawer>
  );
};

export const PermanentSidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        display: { xs: 'none', sm: 'block' },
        '& .MuiDrawer-paper': {
          boxSizing: 'border-box',
          width: 240,
          position: 'fixed',
          top: 0,
          left: 0,
          height: '100vh',
          zIndex: 1200,
        },
      }}
      open
    >
      <Box sx={{ overflow: 'auto' }}>
        <Box sx={{ p: 2 }}>
          <Typography variant="h6" noWrap component="div">
            <AccountBalance sx={{ mr: 1, verticalAlign: 'middle' }} />
            {APP_NAME}
          </Typography>
        </Box>
        <Divider />
        <List>
          {menuItems.map(item => (
            <ListItem key={item.text} disablePadding>
              <ListItemButton
                selected={location.pathname === item.path}
                onClick={() => handleNavigation(item.path)}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
    </Drawer>
  );
};
