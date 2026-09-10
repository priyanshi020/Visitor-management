import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Stack from '@mui/material/Stack';
import InputAdornment from '@mui/material/InputAdornment';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import BadgeIcon from '@mui/icons-material/Badge';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import FactCheckIcon from '@mui/icons-material/FactCheck';
import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { clearAuthError, login } from '../features/auth/authSlice';
import { isNonEmpty, isValidEmail } from '../utils/validators';

interface FormErrors {
  email?: string;
  password?: string;
}

export default function LoginPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { status, error } = useAppSelector((state) => state.auth);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});

  const validate = (): boolean => {
    const nextErrors: FormErrors = {};
    if (!isNonEmpty(email)) {
      nextErrors.email = 'Email is required';
    } else if (!isValidEmail(email)) {
      nextErrors.email = 'Enter a valid email address';
    }
    if (!isNonEmpty(password)) {
      nextErrors.password = 'Password is required';
    } else if (password.length < 6) {
      nextErrors.password = 'Password must be at least 6 characters';
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    dispatch(clearAuthError());
    if (!validate()) return;
    const result = await dispatch(login({ email, password }));
    if (login.fulfilled.match(result)) {
      navigate('/visitors');
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'radial-gradient(circle at 15% 20%, #eef2ff 0%, #f4f5fb 45%, #ecfeff 100%)',
        px: 2,
      }}
    >
      <Paper
        elevation={0}
        sx={{
          display: 'flex',
          width: '100%',
          maxWidth: 900,
          minHeight: 520,
          overflow: 'hidden',
          borderRadius: 5,
          boxShadow: '0 25px 60px -15px rgba(79, 70, 229, 0.35)',
        }}
      >
        {/* Left hero panel */}
        <Box
          sx={{
            display: { xs: 'none', md: 'flex' },
            flexDirection: 'column',
            justifyContent: 'space-between',
            width: '45%',
            p: 5,
            color: '#fff',
            background: 'linear-gradient(150deg, #4f46e5 0%, #4338ca 55%, #06b6d4 130%)',
          }}
        >
          <Box>
            <Stack direction="row" alignItems="center" spacing={1.25}>
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: '12px',
                  bgcolor: 'rgba(255,255,255,0.18)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <BadgeIcon />
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 800 }}>
                VisitorHub
              </Typography>
            </Stack>
            <Typography variant="h4" sx={{ mt: 5, fontWeight: 800, lineHeight: 1.25 }}>
              Front-desk visitor management, simplified.
            </Typography>
            <Typography variant="body2" sx={{ mt: 2, color: 'rgba(255,255,255,0.85)' }}>
              Track check-ins, approvals, and access in one clean dashboard built for busy
              reception teams.
            </Typography>
          </Box>
          <Stack spacing={1.5}>
            <Stack direction="row" spacing={1.25} alignItems="center">
              <HowToRegIcon fontSize="small" />
              <Typography variant="body2">Approve or reject visitors in one click</Typography>
            </Stack>
            <Stack direction="row" spacing={1.25} alignItems="center">
              <FactCheckIcon fontSize="small" />
              <Typography variant="body2">Live status tracking for every visit</Typography>
            </Stack>
          </Stack>
        </Box>

        {/* Right form panel */}
        <Box
          sx={{
            flex: 1,
            p: { xs: 4, sm: 6 },
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
          }}
        >
          <Typography variant="h5" component="h1" sx={{ fontWeight: 800 }}>
            Welcome back
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Sign in to the admin dashboard
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mt: 3, borderRadius: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 3 }}>
            <TextField
              label="Email"
              type="email"
              fullWidth
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={!!errors.email}
              helperText={errors.email}
              autoComplete="email"
              autoFocus
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <MailOutlineIcon fontSize="small" color="action" />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              label="Password"
              type="password"
              fullWidth
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={!!errors.password}
              helperText={errors.password}
              autoComplete="current-password"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockOutlinedIcon fontSize="small" color="action" />
                  </InputAdornment>
                ),
              }}
            />
            <Button
              type="submit"
              variant="contained"
              fullWidth
              size="large"
              sx={{ mt: 3, py: 1.4 }}
              disabled={status === 'loading'}
            >
              {status === 'loading' ? <CircularProgress size={24} color="inherit" /> : 'Login'}
            </Button>
            <Box
              sx={{
                mt: 3,
                p: 1.5,
                borderRadius: 2,
                bgcolor: 'grey.100',
                textAlign: 'center',
              }}
            >
              <Typography variant="caption" color="text.secondary">
                Demo credentials: <strong>admin@example.com</strong> / <strong>admin123</strong>
              </Typography>
            </Box>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}
