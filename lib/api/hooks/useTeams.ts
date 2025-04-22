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
      
      const users = usersQuery.data.data;
      const tasks = tasksQuery.data.data;
      
      // Calculate workload for each user
      return users.map(user => {
        // Get tasks assigned to this user
        const userTasks = tasks.filter(task => task.assigneeId === user.id);
        
        // Calculate workload based on number of tasks and their priority
        const workload = calculateWorkload(userTasks);
        
        // Get top skills from user profile (if available)
        const skills = user.skills?.slice(0, 3).map(skill => skill.name) || [];
        
        return {
          id: user.id,
          name: user.name,
          role: user.role,
          avatar: user.avatar,
          initials: user.initials,
          workload,
          tasks: userTasks.length,
          skills,
        };
      });
    },
    enabled: usersQuery.isSuccess && tasksQuery.isSuccess,
    onError: (error) => {
      console.error('Error calculating team workload:', parseApiError(error));
    },
  });
};

// Helper function to calculate workload percentage based on tasks
const calculateWorkload = (tasks: any[]) => {
  if (tasks.length === 0) return 0;
  
  // Simple calculation: base workload on number of tasks and their priority
  let workloadScore = 0;
  
  tasks.forEach(task => {
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
  });
  
  // Cap at 100%
  return Math.min(workloadScore, 100);
};
