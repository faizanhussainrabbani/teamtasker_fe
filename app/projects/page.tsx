import type { Metadata } from 'next';
import { PageHeader } from '@/components/page-header';
import { ProjectsView } from '@/components/projects/projects-view';

export const metadata: Metadata = {
  title: 'Projects | Team-Centered Task Management',
  description: 'Create, track, and manage project delivery across your team',
};

export default function ProjectsPage() {
  return (
    <div className="flex flex-col">
      <PageHeader
        title="Projects"
        description="Create, track, and manage project delivery across your team"
      />
      <div className="p-4">
        <ProjectsView />
      </div>
    </div>
  );
}
