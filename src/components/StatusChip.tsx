import Chip from '@mui/material/Chip';
import type { VisitorStatus } from '../types';

const colorMap: Record<VisitorStatus, 'warning' | 'success' | 'error'> = {
  pending: 'warning',
  approved: 'success',
  rejected: 'error',
};

export function StatusChip({ status }: { status: VisitorStatus }) {
  return (
    <Chip
      label={status.charAt(0).toUpperCase() + status.slice(1)}
      color={colorMap[status]}
      size="small"
    />
  );
}
