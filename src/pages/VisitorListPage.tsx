import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import AddIcon from '@mui/icons-material/Add';
import GroupsIcon from '@mui/icons-material/Groups';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import BlockIcon from '@mui/icons-material/Block';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { StatusChip } from '../components/StatusChip';
import {
  approveVisitor,
  deleteVisitor,
  fetchVisitors,
  rejectVisitor,
} from '../features/visitors/visitorsSlice';
import type { Visitor } from '../types';

function initialsOf(name: string) {
  return name
    .split(' ')
    .map((p) => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

const avatarPalette = ['#4f46e5', '#0891b2', '#d97706', '#db2777', '#16a34a', '#7c3aed'];

function colorFor(id: string) {
  let hash = 0;
  for (let i = 0; i < id.length; i += 1) hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
  return avatarPalette[hash % avatarPalette.length];
}

interface StatCardProps {
  label: string;
  value: number;
  icon: React.ReactNode;
  color: string;
}

function StatCard({ label, value, icon, color }: StatCardProps) {
  return (
    <Paper sx={{ p: 2.5, display: 'flex', alignItems: 'center', gap: 2, height: '100%' }}>
      <Box
        sx={{
          width: 46,
          height: 46,
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: `${color}1a`,
          color,
        }}
      >
        {icon}
      </Box>
      <Box>
        <Typography variant="h5" sx={{ fontWeight: 800, lineHeight: 1.1 }}>
          {value}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {label}
        </Typography>
      </Box>
    </Paper>
  );
}

export default function VisitorListPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { items, status, error, mutatingIds } = useAppSelector((state) => state.visitors);
  const [deleteTarget, setDeleteTarget] = useState<Visitor | null>(null);

  useEffect(() => {
    dispatch(fetchVisitors());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      enqueueSnackbar(error, { variant: 'error' });
    }
  }, [error, enqueueSnackbar]);

  const counts = useMemo(
    () => ({
      total: items.length,
      pending: items.filter((v) => v.status === 'pending').length,
      approved: items.filter((v) => v.status === 'approved').length,
      rejected: items.filter((v) => v.status === 'rejected').length,
    }),
    [items]
  );

  const handleApprove = async (visitor: Visitor) => {
    const result = await dispatch(approveVisitor(visitor.id));
    if (approveVisitor.fulfilled.match(result)) {
      enqueueSnackbar(`${visitor.name} approved`, { variant: 'success' });
    }
  };

  const handleReject = async (visitor: Visitor) => {
    const result = await dispatch(rejectVisitor(visitor.id));
    if (rejectVisitor.fulfilled.match(result)) {
      enqueueSnackbar(`${visitor.name} rejected`, { variant: 'info' });
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    const result = await dispatch(deleteVisitor(deleteTarget.id));
    if (deleteVisitor.fulfilled.match(result)) {
      enqueueSnackbar(`${deleteTarget.name} deleted`, { variant: 'success' });
    }
    setDeleteTarget(null);
  };

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Box>
          <Typography variant="h5" component="h1" sx={{ fontWeight: 800 }}>
            Visitors
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Review, approve, and manage all visitor check-ins.
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => navigate('/visitors/new')}>
          Add Visitor
        </Button>
      </Stack>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(4, 1fr)' },
          gap: 2.5,
          mb: 3,
        }}
      >
        <StatCard label="Total Visitors" value={counts.total} icon={<GroupsIcon />} color="#4f46e5" />
        <StatCard label="Pending" value={counts.pending} icon={<HourglassEmptyIcon />} color="#d97706" />
        <StatCard label="Approved" value={counts.approved} icon={<TaskAltIcon />} color="#16a34a" />
        <StatCard label="Rejected" value={counts.rejected} icon={<BlockIcon />} color="#dc2626" />
      </Box>

      <Paper>
        <TableContainer sx={{ overflowX: 'auto' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>Unit</TableCell>
                <TableCell>Visit Date</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {status === 'loading' && items.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                    <CircularProgress size={28} />
                  </TableCell>
                </TableRow>
              )}
              {status !== 'loading' && items.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                    No visitors found.
                  </TableCell>
                </TableRow>
              )}
              {items.map((visitor) => {
                const isMutating = mutatingIds.includes(visitor.id);
                return (
                  <TableRow key={visitor.id} hover>
                    <TableCell>
                      <Stack direction="row" spacing={1.5} alignItems="center">
                        <Avatar
                          sx={{
                            width: 34,
                            height: 34,
                            fontSize: 13,
                            fontWeight: 700,
                            bgcolor: colorFor(visitor.id),
                          }}
                        >
                          {initialsOf(visitor.name)}
                        </Avatar>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {visitor.name}
                        </Typography>
                      </Stack>
                    </TableCell>
                    <TableCell>{visitor.phone}</TableCell>
                    <TableCell>{visitor.unit}</TableCell>
                    <TableCell>{visitor.visitDate}</TableCell>
                    <TableCell>
                      <StatusChip status={visitor.status} />
                    </TableCell>
                    <TableCell align="right">
                      <Stack direction="row" spacing={0.5} justifyContent="flex-end">
                        <Tooltip title="Approve">
                          <span>
                            <IconButton
                              size="small"
                              color="success"
                              disabled={isMutating || visitor.status === 'approved'}
                              onClick={() => handleApprove(visitor)}
                              aria-label={`approve-${visitor.id}`}
                            >
                              <CheckCircleOutlineIcon fontSize="small" />
                            </IconButton>
                          </span>
                        </Tooltip>
                        <Tooltip title="Reject">
                          <span>
                            <IconButton
                              size="small"
                              color="warning"
                              disabled={isMutating || visitor.status === 'rejected'}
                              onClick={() => handleReject(visitor)}
                              aria-label={`reject-${visitor.id}`}
                            >
                              <HighlightOffIcon fontSize="small" />
                            </IconButton>
                          </span>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <span>
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => setDeleteTarget(visitor)}
                              aria-label={`delete-${visitor.id}`}
                            >
                              <DeleteOutlineIcon fontSize="small" />
                            </IconButton>
                          </span>
                        </Tooltip>
                      </Stack>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete Visitor"
        message={`Are you sure you want to delete ${deleteTarget?.name}? This action cannot be undone.`}
        confirmLabel="Delete"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </Box>
  );
}
