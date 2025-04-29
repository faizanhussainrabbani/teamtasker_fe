import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTasks } from './useTasks';
import { useUsers } from './useUsers';
import { parseApiError } from '@/lib/error-handling';
import { TasksQueryParams } from '../types/tasks';
import {
  getTeams,
  getTeamById,
  createTeam,
  updateTeam,
  deleteTeam,
  getTeamMembers,
  addTeamMember,
  updateTeamMember,
  removeTeamMember
} from '@/lib/api/endpoints/teams';
import {
  TeamCreateUpdateDto,
  TeamMemberCreateUpdateDto,
  TeamsQueryParams
} from '@/lib/api/types/teams';

// Query keys
export const teamKeys = {
  all: ['teams'] as const,
  workload: () => [...teamKeys.all, 'workload'] as const,
  lists: () => [...teamKeys.all, 'list'] as const,
  list: (filters: TeamsQueryParams) => [...teamKeys.lists(), { ...filters }] as const,
  details: () => [...teamKeys.all, 'detail'] as const,
  detail: (id: number) => [...teamKeys.details(), id] as const,
  members: (teamId: number) => [...teamKeys.detail(teamId), 'members'] as const,
  member: (teamId: number, memberId: number) => [...teamKeys.members(teamId), memberId] as const,
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

/**
 * Hook for fetching teams with optional filtering
 */
export const useTeams = (params?: TeamsQueryParams) => {
  return useQuery({
    queryKey: teamKeys.list(params || {}),
    queryFn: () => getTeams(params),
    onError: (error) => {
      console.error('Error fetching teams:', parseApiError(error));
    },
  });
};

/**
 * Hook for fetching a specific team by ID
 */
export const useTeam = (id: number) => {
  return useQuery({
    queryKey: teamKeys.detail(id),
    queryFn: () => getTeamById(id),
    enabled: !!id,
    onError: (error) => {
      console.error(`Error fetching team ${id}:`, parseApiError(error));
    },
  });
};

/**
 * Hook for creating a new team
 */
export const useCreateTeam = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (team: TeamCreateUpdateDto) => createTeam(team),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: teamKeys.lists() });
    },
    onError: (error) => {
      console.error('Error creating team:', parseApiError(error));
    },
  });
};

/**
 * Hook for updating an existing team
 */
export const useUpdateTeam = (id: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (team: TeamCreateUpdateDto) => updateTeam(id, team),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: teamKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: teamKeys.lists() });
    },
    onError: (error) => {
      console.error(`Error updating team ${id}:`, parseApiError(error));
    },
  });
};

/**
 * Hook for deleting a team
 */
export const useDeleteTeam = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteTeam(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: teamKeys.lists() });
      queryClient.removeQueries({ queryKey: teamKeys.detail(id) });
    },
    onError: (error, id) => {
      console.error(`Error deleting team ${id}:`, parseApiError(error));
    },
  });
};

/**
 * Hook for fetching team members
 */
export const useTeamMembers = (teamId: number) => {
  return useQuery({
    queryKey: teamKeys.members(teamId),
    queryFn: () => getTeamMembers(teamId),
    enabled: !!teamId,
    onError: (error) => {
      console.error(`Error fetching members for team ${teamId}:`, parseApiError(error));
    },
  });
};

/**
 * Hook for adding a member to a team
 */
export const useAddTeamMember = (teamId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (member: TeamMemberCreateUpdateDto) => addTeamMember(teamId, member),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: teamKeys.members(teamId) });
      queryClient.invalidateQueries({ queryKey: teamKeys.detail(teamId) });
    },
    onError: (error) => {
      console.error(`Error adding member to team ${teamId}:`, parseApiError(error));
    },
  });
};

/**
 * Hook for updating a team member's role
 */
export const useUpdateTeamMember = (teamId: number, memberId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (role: string) => updateTeamMember(teamId, memberId, role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: teamKeys.members(teamId) });
      queryClient.invalidateQueries({ queryKey: teamKeys.detail(teamId) });
    },
    onError: (error) => {
      console.error(`Error updating member ${memberId} in team ${teamId}:`, parseApiError(error));
    },
  });
};

/**
 * Hook for removing a member from a team
 */
export const useRemoveTeamMember = (teamId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (memberId: number) => removeTeamMember(teamId, memberId),
    onSuccess: (_, memberId) => {
      queryClient.invalidateQueries({ queryKey: teamKeys.members(teamId) });
      queryClient.invalidateQueries({ queryKey: teamKeys.detail(teamId) });
    },
    onError: (error, memberId) => {
      console.error(`Error removing member ${memberId} from team ${teamId}:`, parseApiError(error));
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
