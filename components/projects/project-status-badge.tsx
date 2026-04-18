import { Badge } from '@/components/ui/badge';
import { ProjectStatus } from '@/lib/api/types/projects';

const statusMeta: Record<ProjectStatus, { label: string; className: string }> = {
  'not-started': {
    label: 'Not Started',
    className: 'text-slate-600 border-slate-300 bg-slate-100',
  },
  'in-progress': {
    label: 'In Progress',
    className: 'text-blue-600 border-blue-200 bg-blue-50',
  },
  completed: {
    label: 'Completed',
    className: 'text-green-700 border-green-200 bg-green-50',
  },
  'on-hold': {
    label: 'On Hold',
    className: 'text-amber-700 border-amber-200 bg-amber-50',
  },
  cancelled: {
    label: 'Cancelled',
    className: 'text-rose-700 border-rose-200 bg-rose-50',
  },
};

interface ProjectStatusBadgeProps {
  status: ProjectStatus;
}

export function ProjectStatusBadge({ status }: ProjectStatusBadgeProps) {
  const meta = statusMeta[status];

  return (
    <Badge variant="outline" className={meta.className}>
      {meta.label}
    </Badge>
  );
}
