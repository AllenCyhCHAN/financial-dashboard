import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, CssBaseline, Box } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { darkPurpleTheme } from './theme';
// Components
import { TopBar } from './components/TopBar';
import { Sidebar, PermanentSidebar } from './components/Sidebar';
import { NotificationContainer } from './components/Notification';

// Pages
import { Dashboard } from './pages/Dashboard';
import { Transactions } from './pages/Transactions';
import { Investments } from './pages/Investments';
import { Settings } from './pages/Settings';
import { InitialSetup } from './pages/InitialSetup';

// Hooks
import { useDataInitialization } from './hooks/useDataInitialization';

const App: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  // Initialize data
  useDataInitialization();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <ThemeProvider theme={darkPurpleTheme}>
        <CssBaseline />
        <Router>
          <Box sx={{ display: 'flex' }}>
            {/* Top Bar */}
            <TopBar onMenuClick={handleDrawerToggle} />

            {/* Sidebar */}
            <Sidebar open={mobileOpen} onClose={handleDrawerToggle} />
            <PermanentSidebar />

            {/* Main Content */}
            <Box
              component="main"
              sx={{
                flexGrow: 1,
                p: 3,
                width: { xs: '100%', sm: `calc(100% - 240px)` },
                ml: { xs: 0, sm: '240px' },
                mt: 8, // Account for top bar
              }}
            >
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/setup" element={<InitialSetup />} />
                <Route path="/transactions" element={<Transactions />} />
                <Route path="/investments" element={<Investments />} />
                <Route path="/settings" element={<Settings />} />
              </Routes>
            </Box>

            {/* Notifications */}
            <NotificationContainer />
          </Box>
        </Router>
      </ThemeProvider>
    </LocalizationProvider>
  );
};

export default App;
