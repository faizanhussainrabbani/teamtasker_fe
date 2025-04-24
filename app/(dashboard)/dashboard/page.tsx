'use client';

import { useAuth } from '@/context/auth-context';

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      {user && (
        <p>Welcome, {user.name}!</p>
      )}
    </div>
  );
}
