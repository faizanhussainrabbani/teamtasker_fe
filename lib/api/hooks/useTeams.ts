import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTasks } from './useTasks';
import { useUsers } from './useUsers';
import { parseApiError } from '@/lib/error-handling';
import { TasksQueryParams } from '../types/tasks';

// Query keys
export const teamKeys = {
  all: ['teams'] as const,
  workload: () => [...teamKeys.all, 'workload'] as const,
};

/**
 * Hook for fetching team workload data
 * This combines user data with their assigned tasks to calculate workload
 */
export const useTeamWorkload = () => {
  // Fetch all users
  const usersQuery = useUsers();

  // Fetch all tasks
  const tasksQuery = useTasks();

  // Combine the queries
  return useQuery({
    queryKey: teamKeys.workload(),
    queryFn: () => {
      // Wait for both queries to complete
      if (!usersQuery.data || !tasksQuery.data) {
        return [];
      }

      // Handle different response structures
      const users = Array.isArray(usersQuery.data)
        ? usersQuery.data
        : (usersQuery.data.data || []);

      const tasks = Array.isArray(tasksQuery.data)
        ? tasksQuery.data
        : (tasksQuery.data.data || []);

      // Check if users is an array before mapping
      if (!Array.isArray(users)) {
        console.error('Users data is not an array:', users);
        return [];
      }

      // Calculate workload for each user
      return users.map(user => {
        if (!user) return null;

        try {
          // Get tasks assigned to this user
          const userTasks = tasks.filter(task => task && task.assigneeId === user.id);

          // Calculate workload based on number of tasks and their priority
          const workload = calculateWorkload(userTasks);

          // Get top skills from user profile (if available)
          const skills = user.skills?.slice?.(0, 3)?.map?.(skill => skill.name) || [];

          return {
            id: user.id || 'unknown',
            name: user.name || 'Unknown User',
            role: user.role || 'Team Member',
            avatar: user.avatar || '',
            initials: user.initials || user.name?.substring(0, 2)?.toUpperCase() || 'UN',
            workload,
            tasks: userTasks.length,
            skills,
          };
        } catch (error) {
          console.error('Error processing user data:', error, user);
          return null;
        }
      }).filter(Boolean); // Remove any null entries
    },
    enabled: usersQuery.isSuccess && tasksQuery.isSuccess,
    onError: (error) => {
      console.error('Error calculating team workload:', parseApiError(error));
    },
  });
};

// Helper function to calculate workload percentage based on tasks
const calculateWorkload = (tasks: any[]) => {
  if (!Array.isArray(tasks) || tasks.length === 0) return 0;

  // Simple calculation: base workload on number of tasks and their priority
  let workloadScore = 0;

  tasks.forEach(task => {
    if (!task) return;

    try {
      // Add weight based on priority
      switch (task.priority) {
        case 'high':
          workloadScore += 20;
          break;
        case 'medium':
          workloadScore += 15;
          break;
        case 'low':
          workloadScore += 10;
          break;
        default:
          workloadScore += 10;
      }

      // Add weight based on status
      if (task.status === 'in-progress') {
        workloadScore += 5;
      }
    } catch (error) {
      console.error('Error processing task for workload calculation:', error, task);
    }
  });

  // Cap at 100%
  return Math.min(workloadScore, 100);
};
