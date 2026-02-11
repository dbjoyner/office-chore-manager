import { Component } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { CssBaseline, ThemeProvider, createTheme, Box, Typography } from '@mui/material';
import { AuthProvider } from './auth/AuthContext';
import ProtectedRoute from './auth/ProtectedRoute';
import LoginPage from './auth/LoginPage';
import SignupPage from './auth/SignupPage';
import AppShell from './components/Layout/AppShell';
import CalendarView from './components/Calendar/CalendarView';
import TeamPage from './components/Team/TeamPage';

const theme = createTheme({
  palette: {
    primary: { main: '#0078D4' },
    background: { default: '#fafafa' },
  },
  typography: {
    fontFamily: '"Segoe UI", -apple-system, BlinkMacSystemFont, sans-serif',
  },
});

class ErrorBoundary extends Component {
  state = { error: null };
  static getDerivedStateFromError(error) {
    return { error };
  }
  componentDidCatch(error, info) {
    console.error('React Error Boundary caught:', error, info);
  }
  render() {
    if (this.state.error) {
      return (
        <Box p={4}>
          <Typography color="error" variant="h6">Something went wrong</Typography>
          <Typography component="pre" sx={{ mt: 1, fontSize: 13, whiteSpace: 'pre-wrap' }}>
            {this.state.error.toString()}
            {'\n'}
            {this.state.error.stack}
          </Typography>
        </Box>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ErrorBoundary>
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <AppShell>
                      <CalendarView />
                    </AppShell>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/team"
                element={
                  <ProtectedRoute>
                    <AppShell>
                      <TeamPage />
                    </AppShell>
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </ErrorBoundary>
    </ThemeProvider>
  );
}
