"use client"

import { useState } from 'react';
import { ShieldAlert, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LoadingState, ErrorState, EmptyState } from '@/components/ui/api-state';
import { useUsers } from '@/lib/api/hooks/useUsers';
import { useAuth } from '@/context/auth-context';

export function AdminConsole() {
  const { user } = useAuth();
  const isAdmin = (user?.role || '').toLowerCase() === 'admin';

  const [search, setSearch] = useState('');
  const [role, setRole] = useState<'all' | 'Admin' | 'User'>('all');

  const usersQuery = useUsers({
    pageNumber: 1,
    pageSize: 50,
    search: search || undefined,
    role: role === 'all' ? undefined : role,
  });

  if (!isAdmin) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShieldAlert className="h-5 w-5 text-destructive" />
            Access Restricted
          </CardTitle>
          <CardDescription>
            You need admin privileges to access the user-management console.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Admin Console</CardTitle>
        <CardDescription>Review users, roles, and account activity metadata</CardDescription>

        <div className="grid gap-3 pt-2 sm:grid-cols-3">
          <div className="space-y-1 sm:col-span-2">
            <Label htmlFor="admin-user-search">Search users</Label>
            <Input
              id="admin-user-search"
              placeholder="Search by name, email, or username"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="admin-role-filter">Role</Label>
            <Select value={role} onValueChange={(value) => setRole(value as 'all' | 'Admin' | 'User')}>
              <SelectTrigger id="admin-role-filter">
                <SelectValue placeholder="All roles" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All roles</SelectItem>
                <SelectItem value="Admin">Admin</SelectItem>
                <SelectItem value="User">User</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {usersQuery.isLoading ? (
          <LoadingState message="Loading users..." />
        ) : usersQuery.isError ? (
          <ErrorState
            message="Failed to load users"
            onRetry={() => usersQuery.refetch()}
          />
        ) : (usersQuery.data?.data || []).length === 0 ? (
          <EmptyState
            title="No users found"
            description="Try adjusting your filters and search query."
            action={
              <Button onClick={() => usersQuery.refetch()} variant="outline">
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh
              </Button>
            }
          />
        ) : (
          <div className="space-y-2">
            {(usersQuery.data?.data || []).map((member) => (
              <div key={member.id} className="rounded-lg border p-3">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-medium">{member.name || member.fullName || 'Unnamed user'}</p>
                    <p className="text-sm text-muted-foreground">{member.email}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{member.role || 'User'}</Badge>
                    {member.department ? <Badge variant="secondary">{member.department}</Badge> : null}
                  </div>
                </div>

                <div className="mt-2 text-xs text-muted-foreground">
                  <span>
                    Joined:{' '}
                    {member.createdDate || member.createdAt
                      ? new Date(member.createdDate || member.createdAt || '').toLocaleDateString()
                      : 'Unknown'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
