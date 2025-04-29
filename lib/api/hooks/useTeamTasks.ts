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
 * This uses the team tasks data from TasksContext which is filtered by the API
 */
export const useTeamTasks = () => {
  // Fetch all users
  const usersQuery = useUsers();

  // Get team tasks directly from context
  const {
    teamTasks,
    isLoading: tasksLoading,
    isError: tasksError,
    refetchType
  } = useDashboardTasks();

  // Combine the queries
  return useQuery({
    queryKey: teamKeys.tasks(),
    queryFn: () => {
      console.log("useTeamTasks: Running query function");

      // Wait for both data sources to be available
      if (!usersQuery.data || !teamTasks) {
        console.log("useTeamTasks: Missing data, returning empty array");
        return [];
      }

      // Handle different response structures
      const users = Array.isArray(usersQuery.data)
        ? usersQuery.data
        : (usersQuery.data?.items || usersQuery.data?.data || []);

      const tasks = teamTasks?.items || [];

      // Check if users is an array before mapping
      if (!Array.isArray(users)) {
        console.error('Users data is not an array:', users);
        return [];
      }

      // Create a map of users for quick lookup
      const userMap = new Map();
      users.forEach(user => {
        if (user && user.id) {
          userMap.set(user.id, user);
        }
      });

      // Group tasks by assignee
      const tasksByAssignee = new Map();

      tasks.forEach(task => {
        if (!task.assigneeId) return;

        if (!tasksByAssignee.has(task.assigneeId)) {
          tasksByAssignee.set(task.assigneeId, []);
        }

        tasksByAssignee.get(task.assigneeId).push(task);
      });

      // Get team members with their assigned tasks
      return Array.from(tasksByAssignee.entries())
        .map(([userId, userTasks]) => {
          try {
            const user = userMap.get(userId);

            // Skip if user not found
            if (!user) return null;

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
            console.error('Error processing user data:', error);
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
    refetchOnMount: false, // Don't refetch on mount to avoid duplicate requests
    staleTime: 60000, // Consider data fresh for 1 minute
  });
};
