import Chip from '@mui/material/Chip';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import BlockIcon from '@mui/icons-material/Block';
import type { VisitorStatus } from '../types';

const colorMap: Record<VisitorStatus, 'warning' | 'success' | 'error'> = {
  pending: 'warning',
  approved: 'success',
  rejected: 'error',
};

const iconMap: Record<VisitorStatus, React.ReactElement> = {
  pending: <HourglassEmptyIcon />,
  approved: <TaskAltIcon />,
  rejected: <BlockIcon />,
};

export function StatusChip({ status }: { status: VisitorStatus }) {
  return (
    <Chip
      icon={iconMap[status]}
      label={status.charAt(0).toUpperCase() + status.slice(1)}
      color={colorMap[status]}
      size="small"
      variant="outlined"
      sx={{ bgcolor: (theme) => `${theme.palette[colorMap[status]].main}14` }}
    />
  );
}
