import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  addTeamMember,
  createTeam,
  deleteTeam,
  getTeamById,
  getTeams,
  removeTeamMember,
  updateTeam,
} from '../endpoints/teams';
import {
  AddTeamMemberRequest,
  TeamCreateRequest,
  TeamsQueryParams,
  TeamUpdateRequest,
} from '../types/teams';
import { useTasks } from './useTasks';
import { useUsers } from './useUsers';
import { Task } from '../types/tasks';
import { parseApiError } from '@/lib/error-handling';

// Query keys
export const teamKeys = {
  all: ['teams'] as const,
  lists: () => [...teamKeys.all, 'list'] as const,
  list: (filters: TeamsQueryParams) => [...teamKeys.lists(), filters] as const,
  details: () => [...teamKeys.all, 'detail'] as const,
  detail: (id: string) => [...teamKeys.details(), id] as const,
  workload: () => [...teamKeys.all, 'workload'] as const,
};

/**
 * Hook for fetching teams with optional filtering.
 */
export const useTeams = (params?: TeamsQueryParams) => {
  return useQuery({
    queryKey: teamKeys.list(params || {}),
    queryFn: () => getTeams(params),
  });
};

/**
 * Hook for fetching a single team detail by id.
 */
export const useTeam = (id: string) => {
  return useQuery({
    queryKey: teamKeys.detail(id),
    queryFn: () => getTeamById(id),
    enabled: !!id,
  });
};

/**
 * Hook for creating a team.
 */
export const useCreateTeam = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: TeamCreateRequest) => createTeam(payload),
    onSuccess: (team) => {
      queryClient.setQueryData(teamKeys.detail(team.id), team);
      queryClient.invalidateQueries({ queryKey: teamKeys.lists() });
      queryClient.invalidateQueries({ queryKey: teamKeys.workload() });
    },
    onError: (error) => {
      console.error('Error creating team:', parseApiError(error));
    },
  });
};

/**
 * Hook for updating a team.
 */
export const useUpdateTeam = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: TeamUpdateRequest) => updateTeam(payload),
    onSuccess: (team) => {
      queryClient.setQueryData(teamKeys.detail(team.id), team);
      queryClient.invalidateQueries({ queryKey: teamKeys.lists() });
      queryClient.invalidateQueries({ queryKey: teamKeys.workload() });
    },
    onError: (error, team) => {
      console.error(`Error updating team ${team.id}:`, parseApiError(error));
    },
  });
};

/**
 * Hook for deleting a team.
 */
export const useDeleteTeam = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteTeam(id),
    onSuccess: (_, id) => {
      queryClient.removeQueries({ queryKey: teamKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: teamKeys.lists() });
      queryClient.invalidateQueries({ queryKey: teamKeys.workload() });
    },
    onError: (error, id) => {
      console.error(`Error deleting team ${id}:`, parseApiError(error));
    },
  });
};

/**
 * Hook for adding a member to a team.
 */
export const useAddTeamMember = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ teamId, payload }: { teamId: string; payload: AddTeamMemberRequest }) =>
      addTeamMember(teamId, payload),
    onSuccess: (_, { teamId }) => {
      queryClient.invalidateQueries({ queryKey: teamKeys.detail(teamId) });
      queryClient.invalidateQueries({ queryKey: teamKeys.lists() });
      queryClient.invalidateQueries({ queryKey: teamKeys.workload() });
    },
    onError: (error, { teamId }) => {
      console.error(`Error adding team member to team ${teamId}:`, parseApiError(error));
    },
  });
};

/**
 * Hook for removing a member from a team.
 */
export const useRemoveTeamMember = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ teamId, userId }: { teamId: string; userId: string }) =>
      removeTeamMember(teamId, userId),
    onSuccess: (_, { teamId }) => {
      queryClient.invalidateQueries({ queryKey: teamKeys.detail(teamId) });
      queryClient.invalidateQueries({ queryKey: teamKeys.lists() });
      queryClient.invalidateQueries({ queryKey: teamKeys.workload() });
    },
    onError: (error, { teamId, userId }) => {
      console.error(
        `Error removing user ${userId} from team ${teamId}:`,
        parseApiError(error),
      );
    },
  });
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
        
        // Expose basic profile tags until backend user-skills are available.
        const skills = [user.department, user.role].filter(Boolean) as string[];
        
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
  });
};

// Helper function to calculate workload percentage based on tasks
const calculateWorkload = (tasks: Task[]) => {
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
