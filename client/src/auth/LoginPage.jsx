import { useState } from 'react';
import { useAuth } from './AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import {
  Box, Card, CardContent, TextField, Button, Typography, Alert,
} from '@mui/material';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh" bgcolor="#f5f5f5">
      <Card sx={{ width: 400, p: 2 }}>
        <CardContent>
          <Typography variant="h5" fontWeight={600} color="#0078D4" gutterBottom>
            Office Chore Manager
          </Typography>
          <Typography variant="body2" color="text.secondary" mb={3}>
            Sign in to your account
          </Typography>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          <form onSubmit={handleSubmit}>
            <TextField
              label="Email" type="email" fullWidth required
              value={email} onChange={(e) => setEmail(e.target.value)}
              sx={{ mb: 2 }}
            />
            <TextField
              label="Password" type="password" fullWidth required
              value={password} onChange={(e) => setPassword(e.target.value)}
              sx={{ mb: 3 }}
            />
            <Button
              type="submit" variant="contained" fullWidth disabled={loading}
              sx={{ bgcolor: '#0078D4', '&:hover': { bgcolor: '#106EBE' } }}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>
          <Typography variant="body2" mt={2} textAlign="center">
            No account?{' '}
            <Link to="/signup" style={{ color: '#0078D4' }}>Sign up</Link>
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}
