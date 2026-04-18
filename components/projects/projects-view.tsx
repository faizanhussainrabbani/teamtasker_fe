"use client"

import { useMemo, useState } from 'react';
import { Plus, Trash2, Edit3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { LoadingState, ErrorState, EmptyState } from '@/components/ui/api-state';
import {
  useCreateProject,
  useDeleteProject,
  useProject,
  useProjects,
  useUpdateProject,
  useUpdateProjectStatus,
} from '@/lib/api/hooks/useProjects';
import { Project, ProjectCreateRequest, ProjectStatus } from '@/lib/api/types/projects';
import { ProjectStatusBadge } from '@/components/projects/project-status-badge';
import { ProjectDialog } from '@/components/projects/project-dialog';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/context/auth-context';

const statusOptions: Array<{ value: ProjectStatus; label: string }> = [
  { value: 'not-started', label: 'Not Started' },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
  { value: 'on-hold', label: 'On Hold' },
  { value: 'cancelled', label: 'Cancelled' },
];

export function ProjectsView() {
  const { user } = useAuth();
  const { toast } = useToast();
  const isAdmin = (user?.role || '').toLowerCase() === 'admin';

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | ProjectStatus>('all');
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | undefined>(undefined);

  const projectParams = useMemo(
    () => ({
      pageNumber: 1,
      pageSize: 50,
      searchTerm: searchTerm || undefined,
      status: statusFilter === 'all' ? undefined : statusFilter,
    }),
    [searchTerm, statusFilter],
  );

  const projectsQuery = useProjects(projectParams);
  const selectedProjectQuery = useProject(selectedProjectId);

  const createProjectMutation = useCreateProject();
  const updateProjectMutation = useUpdateProject();
  const deleteProjectMutation = useDeleteProject();
  const updateStatusMutation = useUpdateProjectStatus();

  const projects = projectsQuery.data?.data || [];

  const openCreateDialog = () => {
    setEditingProject(undefined);
    setIsDialogOpen(true);
  };

  const openEditDialog = (project: Project) => {
    setEditingProject(project);
    setIsDialogOpen(true);
  };

  const handleDialogSubmit = async (payload: ProjectCreateRequest) => {
    try {
      if (editingProject) {
        const updatedProject = await updateProjectMutation.mutateAsync({
          id: editingProject.id,
          ...payload,
        });

        setSelectedProjectId(updatedProject.id);
        toast({
          title: 'Project updated',
          description: 'Project details were saved successfully.',
        });
      } else {
        const createdProject = await createProjectMutation.mutateAsync(payload);
        setSelectedProjectId(createdProject.id);
        toast({
          title: 'Project created',
          description: 'New project is now available in your workspace.',
        });
      }

      setIsDialogOpen(false);
    } catch {
      toast({
        title: editingProject ? 'Failed to update project' : 'Failed to create project',
        description: 'Please review your input and try again.',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteProject = async (project: Project) => {
    if (!isAdmin) {
      toast({
        title: 'Admin access required',
        description: 'Only admins can delete projects.',
        variant: 'destructive',
      });
      return;
    }

    if (!confirm(`Delete project "${project.name}"? This action cannot be undone.`)) {
      return;
    }

    try {
      await deleteProjectMutation.mutateAsync(project.id);
      if (selectedProjectId === project.id) {
        setSelectedProjectId('');
      }

      toast({
        title: 'Project deleted',
        description: 'The project was removed successfully.',
      });
    } catch {
      toast({
        title: 'Failed to delete project',
        description: 'Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleStatusChange = async (projectId: string, status: ProjectStatus) => {
    if (!isAdmin) {
      toast({
        title: 'Admin access required',
        description: 'Only admins can change project status.',
        variant: 'destructive',
      });
      return;
    }

    try {
      await updateStatusMutation.mutateAsync({ id: projectId, status });
      toast({
        title: 'Status updated',
        description: 'Project status has been updated.',
      });
    } catch {
      toast({
        title: 'Failed to update status',
        description: 'Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between gap-4">
            <div>
              <CardTitle>Projects</CardTitle>
              <CardDescription>Track active initiatives and timelines</CardDescription>
            </div>
            {isAdmin ? (
              <Button onClick={openCreateDialog}>
                <Plus className="mr-2 h-4 w-4" />
                New Project
              </Button>
            ) : null}
          </div>

          <div className="grid gap-3 pt-4 sm:grid-cols-2">
            <div className="space-y-1">
              <Label htmlFor="project-search">Search</Label>
              <Input
                id="project-search"
                placeholder="Find project by name or description"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="project-status-filter">Status</Label>
              <Select
                value={statusFilter}
                onValueChange={(value) => setStatusFilter(value as 'all' | ProjectStatus)}
              >
                <SelectTrigger id="project-status-filter">
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All statuses</SelectItem>
                  {statusOptions.map((statusOption) => (
                    <SelectItem key={statusOption.value} value={statusOption.value}>
                      {statusOption.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {projectsQuery.isLoading ? (
            <LoadingState message="Loading projects..." />
          ) : projectsQuery.isError ? (
            <ErrorState
              message="Failed to load projects"
              onRetry={() => projectsQuery.refetch()}
            />
          ) : projects.length === 0 ? (
            <EmptyState
              title="No projects found"
              description="Create your first project to start planning work."
              action={
                isAdmin ? (
                  <Button onClick={openCreateDialog}>
                    <Plus className="mr-2 h-4 w-4" />
                    Create Project
                  </Button>
                ) : undefined
              }
            />
          ) : (
            <div className="space-y-2">
              {projects.map((project) => (
                <button
                  key={project.id}
                  type="button"
                  className={`w-full rounded-lg border p-3 text-left transition-colors hover:bg-muted/50 ${
                    selectedProjectId === project.id ? 'border-primary bg-muted/50' : ''
                  }`}
                  onClick={() => setSelectedProjectId(project.id)}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <p className="font-medium">{project.name}</p>
                      <p className="line-clamp-2 text-sm text-muted-foreground">{project.description}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>Start {new Date(project.startDate).toLocaleDateString()}</span>
                        {project.endDate ? (
                          <>
                            <span>•</span>
                            <span>End {new Date(project.endDate).toLocaleDateString()}</span>
                          </>
                        ) : null}
                      </div>
                    </div>
                    <ProjectStatusBadge status={project.status} />
                  </div>

                  {isAdmin ? (
                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <Select
                        value={project.status}
                        onValueChange={(value) => handleStatusChange(project.id, value as ProjectStatus)}
                      >
                        <SelectTrigger className="h-8 w-[170px] text-xs">
                          <SelectValue placeholder="Update status" />
                        </SelectTrigger>
                        <SelectContent>
                          {statusOptions.map((statusOption) => (
                            <SelectItem key={statusOption.value} value={statusOption.value}>
                              {statusOption.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        className="h-8"
                        onClick={(event) => {
                          event.stopPropagation();
                          openEditDialog(project);
                        }}
                      >
                        <Edit3 className="mr-2 h-3.5 w-3.5" />
                        Edit
                      </Button>

                      <Button
                        type="button"
                        size="sm"
                        variant="destructive"
                        className="h-8"
                        onClick={(event) => {
                          event.stopPropagation();
                          void handleDeleteProject(project);
                        }}
                      >
                        <Trash2 className="mr-2 h-3.5 w-3.5" />
                        Delete
                      </Button>
                    </div>
                  ) : null}
                </button>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Project Details</CardTitle>
          <CardDescription>
            {selectedProjectId ? 'Review timeline and linked tasks' : 'Select a project to inspect details'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!selectedProjectId ? (
            <EmptyState
              title="No project selected"
              description="Choose a project from the list to view details and related tasks."
            />
          ) : selectedProjectQuery.isLoading ? (
            <LoadingState message="Loading project details..." />
          ) : selectedProjectQuery.isError ? (
            <ErrorState
              message="Failed to load project details"
              onRetry={() => selectedProjectQuery.refetch()}
            />
          ) : selectedProjectQuery.data ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">{selectedProjectQuery.data.name}</h3>
                <ProjectStatusBadge status={selectedProjectQuery.data.status} />
                <p className="text-sm text-muted-foreground">{selectedProjectQuery.data.description}</p>
              </div>

              <Separator />

              <div className="grid gap-3 text-sm">
                <div>
                  <p className="font-medium">Start Date</p>
                  <p className="text-muted-foreground">
                    {new Date(selectedProjectQuery.data.startDate).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="font-medium">End Date</p>
                  <p className="text-muted-foreground">
                    {selectedProjectQuery.data.endDate
                      ? new Date(selectedProjectQuery.data.endDate).toLocaleDateString()
                      : 'Not specified'}
                  </p>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <p className="font-medium">Linked Tasks ({selectedProjectQuery.data.tasks.length})</p>
                {selectedProjectQuery.data.tasks.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    No tasks are linked to this project yet.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {selectedProjectQuery.data.tasks.slice(0, 6).map((task) => (
                      <div key={task.id} className="rounded-md border p-2">
                        <p className="font-medium text-sm">{task.title}</p>
                        <p className="text-xs text-muted-foreground line-clamp-2">{task.description}</p>
                      </div>
                    ))}
                    {selectedProjectQuery.data.tasks.length > 6 ? (
                      <p className="text-xs text-muted-foreground">
                        +{selectedProjectQuery.data.tasks.length - 6} more tasks
                      </p>
                    ) : null}
                  </div>
                )}
              </div>
            </div>
          ) : null}
        </CardContent>
      </Card>

      <ProjectDialog
        project={editingProject}
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSubmit={handleDialogSubmit}
        isSaving={createProjectMutation.isPending || updateProjectMutation.isPending}
      />
    </div>
  );
}
