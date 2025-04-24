import { useQuery } from '@tanstack/react-query';
import { useUsers } from './useUsers';
import { useDashboardTasks } from '@/context/tasks-context';
import { parseApiError } from '@/lib/error-handling';

// Query keys
export const teamKeys = {
  all: ['teams'] as const,
  tasks: () => [...teamKeys.all, 'tasks'] as const,
};

/**
 * Hook for fetching team tasks data
 * This uses the shared tasks data from TasksContext instead of making a separate API call
 */
export const useTeamTasks = () => {
  // Fetch all users
  const usersQuery = useUsers();

  // Get tasks from context instead of making a separate API call
  const { allTasks, isLoading: tasksLoading, isError: tasksError, refetch: refetchTasks } = useDashboardTasks();

  // Combine the queries
  return useQuery({
    queryKey: teamKeys.tasks(),
    queryFn: () => {
      // Wait for both data sources to be available
      if (!usersQuery.data || !allTasks) {
        return [];
      }

      // Handle different response structures
      const users = Array.isArray(usersQuery.data)
        ? usersQuery.data
        : (usersQuery.data?.items || usersQuery.data?.data || []);

      const tasks = allTasks?.items || [];

      // Check if users is an array before mapping
      if (!Array.isArray(users)) {
        console.error('Users data is not an array:', users);
        return [];
      }

      // Get team members with their assigned tasks
      return users
        .filter(user => user && user.id !== undefined) // Filter out invalid users
        .map(user => {
          try {
            // Get tasks assigned to this user
            const userTasks = tasks.filter(task =>
              task && task.assigneeId === user.id
            );

            // Skip users with no tasks
            if (userTasks.length === 0) return null;

            // Sort tasks by status and due date
            const sortedTasks = [...userTasks].sort((a, b) => {
              // First by status priority (in-progress, todo, completed)
              const statusOrder = { 'in-progress': 0, 'todo': 1, 'completed': 2 };
              const statusDiff =
                (statusOrder[a.status.toLowerCase()] || 99) -
                (statusOrder[b.status.toLowerCase()] || 99);

              if (statusDiff !== 0) return statusDiff;

              // Then by due date (earliest first)
              return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
            });

            return {
              id: user.id,
              name: user.name || 'Unknown User',
              role: user.role || 'Team Member',
              avatar: user.avatar || '',
              initials: user.initials || user.name?.substring(0, 2)?.toUpperCase() || 'UN',
              tasks: sortedTasks,
            };
          } catch (error) {
            console.error('Error processing user data:', error, user);
            return null;
          }
        })
        .filter(Boolean); // Remove any null entries
    },
    enabled: usersQuery.isSuccess && !tasksLoading && !tasksError,
    onError: (error) => {
      console.error('Error fetching team tasks:', parseApiError(error));
    },
    refetchOnWindowFocus: false,
  });
};
