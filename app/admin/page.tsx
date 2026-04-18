import type { Metadata } from 'next';
import { PageHeader } from '@/components/page-header';
import { AdminConsole } from '@/components/admin/admin-console';

export const metadata: Metadata = {
  title: 'Admin Console | Team-Centered Task Management',
  description: 'Admin-only user management and account oversight',
};

export default function AdminPage() {
  return (
    <div className="flex flex-col">
      <PageHeader
        title="Admin Console"
        description="Manage users, roles, and account metadata"
      />
      <div className="p-4">
        <AdminConsole />
      </div>
    </div>
  );
}
