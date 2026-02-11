import { useState } from 'react';
import { useAuth } from './AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import {
  Box, Card, CardContent, TextField, Button, Typography, Alert,
} from '@mui/material';

export default function SignupPage() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await signup(email, displayName, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Signup failed');
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
            Create a new account
          </Typography>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          <form onSubmit={handleSubmit}>
            <TextField
              label="Display Name" fullWidth required
              value={displayName} onChange={(e) => setDisplayName(e.target.value)}
              sx={{ mb: 2 }}
            />
            <TextField
              label="Email" type="email" fullWidth required
              value={email} onChange={(e) => setEmail(e.target.value)}
              sx={{ mb: 2 }}
            />
            <TextField
              label="Password" type="password" fullWidth required
              value={password} onChange={(e) => setPassword(e.target.value)}
              helperText="At least 6 characters"
              sx={{ mb: 3 }}
            />
            <Button
              type="submit" variant="contained" fullWidth disabled={loading}
              sx={{ bgcolor: '#0078D4', '&:hover': { bgcolor: '#106EBE' } }}
            >
              {loading ? 'Creating account...' : 'Sign Up'}
            </Button>
          </form>
          <Typography variant="body2" mt={2} textAlign="center">
            Already have an account?{' '}
            <Link to="/login" style={{ color: '#0078D4' }}>Sign in</Link>
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}
