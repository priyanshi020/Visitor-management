import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { useAppDispatch } from '../app/hooks';
import { addVisitor } from '../features/visitors/visitorsSlice';
import { isNonEmpty, isValidPhone, isValidUnit, isFutureOrTodayDate } from '../utils/validators';

interface FormState {
  name: string;
  phone: string;
  unit: string;
  visitDate: string;
}

type FormErrors = Partial<Record<keyof FormState, string>>;

const initialForm: FormState = { name: '', phone: '', unit: '', visitDate: '' };

export default function AddVisitorPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const [form, setForm] = useState<FormState>(initialForm);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (field: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const validate = (): boolean => {
    const nextErrors: FormErrors = {};
    if (!isNonEmpty(form.name)) nextErrors.name = 'Name is required';
    else if (form.name.trim().length < 2) nextErrors.name = 'Name must be at least 2 characters';

    if (!isNonEmpty(form.phone)) nextErrors.phone = 'Phone is required';
    else if (!isValidPhone(form.phone)) nextErrors.phone = 'Enter a valid phone number';

    if (!isNonEmpty(form.unit)) nextErrors.unit = 'Unit number is required';
    else if (!isValidUnit(form.unit)) nextErrors.unit = 'Unit must be alphanumeric (e.g. A-101)';

    if (!isNonEmpty(form.visitDate)) nextErrors.visitDate = 'Visit date is required';
    else if (!isFutureOrTodayDate(form.visitDate)) nextErrors.visitDate = 'Visit date cannot be in the past';

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      const result = await dispatch(addVisitor(form));
      if (addVisitor.fulfilled.match(result)) {
        enqueueSnackbar('Visitor added successfully', { variant: 'success' });
        navigate('/visitors');
      } else {
        enqueueSnackbar((result.payload as string) || 'Failed to add visitor', { variant: 'error' });
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 520, mx: 'auto' }}>
      <Typography variant="h5" component="h1" sx={{ mb: 3 }}>
        Add Visitor
      </Typography>
      <Paper sx={{ p: 3 }}>
        <Box component="form" onSubmit={handleSubmit} noValidate>
          <TextField
            label="Name"
            fullWidth
            margin="normal"
            value={form.name}
            onChange={handleChange('name')}
            error={!!errors.name}
            helperText={errors.name}
          />
          <TextField
            label="Phone"
            fullWidth
            margin="normal"
            value={form.phone}
            onChange={handleChange('phone')}
            error={!!errors.phone}
            helperText={errors.phone}
          />
          <TextField
            label="Unit Number"
            fullWidth
            margin="normal"
            value={form.unit}
            onChange={handleChange('unit')}
            error={!!errors.unit}
            helperText={errors.unit}
          />
          <TextField
            label="Visit Date"
            type="date"
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
            value={form.visitDate}
            onChange={handleChange('visitDate')}
            error={!!errors.visitDate}
            helperText={errors.visitDate}
          />
          <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
            <Button
              type="submit"
              variant="contained"
              disabled={submitting}
              startIcon={submitting ? <CircularProgress size={18} color="inherit" /> : undefined}
            >
              Submit
            </Button>
            <Button variant="outlined" onClick={() => navigate('/visitors')} disabled={submitting}>
              Cancel
            </Button>
          </Stack>
        </Box>
      </Paper>
    </Box>
  );
}
