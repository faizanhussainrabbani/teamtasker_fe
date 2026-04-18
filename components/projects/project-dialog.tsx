"use client"

import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Project, ProjectCreateRequest } from '@/lib/api/types/projects';

interface ProjectDialogProps {
  project?: Project;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (payload: ProjectCreateRequest) => Promise<void>;
  isSaving: boolean;
}

type FormErrors = {
  name?: string;
  description?: string;
  startDate?: string;
  endDate?: string;
};

const toDateInput = (value?: string): string => {
  if (!value) {
    return '';
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return '';
  }

  return parsed.toISOString().split('T')[0] || '';
};

export function ProjectDialog({ project, open, onOpenChange, onSubmit, isSaving }: ProjectDialogProps) {
  const isEdit = Boolean(project);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    if (!open) {
      return;
    }

    setName(project?.name ?? '');
    setDescription(project?.description ?? '');
    setStartDate(toDateInput(project?.startDate));
    setEndDate(toDateInput(project?.endDate));
    setErrors({});
  }, [open, project]);

  const validate = (): FormErrors => {
    const nextErrors: FormErrors = {};

    if (!name.trim()) {
      nextErrors.name = 'Project name is required.';
    } else if (name.trim().length > 100) {
      nextErrors.name = 'Project name must not exceed 100 characters.';
    }

    if (description.trim().length > 500) {
      nextErrors.description = 'Description must not exceed 500 characters.';
    }

    if (!startDate) {
      nextErrors.startDate = 'Start date is required.';
    }

    if (endDate && startDate && endDate < startDate) {
      nextErrors.endDate = 'End date must be greater than or equal to start date.';
    }

    return nextErrors;
  };

  const handleSubmit = async () => {
    const nextErrors = validate();
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    await onSubmit({
      name: name.trim(),
      description: description.trim() || undefined,
      startDate,
      endDate: endDate || undefined,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[560px]">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Edit Project' : 'Create Project'}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? 'Update project details and timeline.'
              : 'Add a new project and define the initial timeline.'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="project-name">Project Name</Label>
            <Input
              id="project-name"
              value={name}
              onChange={(event) => {
                setName(event.target.value);
                setErrors((prev) => ({ ...prev, name: undefined }));
              }}
              placeholder="Sprint Alpha"
            />
            {errors.name ? <p className="text-sm text-destructive">{errors.name}</p> : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="project-description">Description</Label>
            <Textarea
              id="project-description"
              value={description}
              onChange={(event) => {
                setDescription(event.target.value);
                setErrors((prev) => ({ ...prev, description: undefined }));
              }}
              placeholder="Describe scope, outcomes, and major milestones"
              className="min-h-[110px]"
            />
            {errors.description ? (
              <p className="text-sm text-destructive">{errors.description}</p>
            ) : null}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="project-start-date">Start Date</Label>
              <Input
                id="project-start-date"
                type="date"
                value={startDate}
                onChange={(event) => {
                  setStartDate(event.target.value);
                  setErrors((prev) => ({ ...prev, startDate: undefined, endDate: undefined }));
                }}
              />
              {errors.startDate ? (
                <p className="text-sm text-destructive">{errors.startDate}</p>
              ) : null}
            </div>

            <div className="space-y-2">
              <Label htmlFor="project-end-date">End Date</Label>
              <Input
                id="project-end-date"
                type="date"
                value={endDate}
                onChange={(event) => {
                  setEndDate(event.target.value);
                  setErrors((prev) => ({ ...prev, endDate: undefined }));
                }}
              />
              {errors.endDate ? <p className="text-sm text-destructive">{errors.endDate}</p> : null}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSaving}>
            {isSaving ? 'Saving...' : isEdit ? 'Save Changes' : 'Create Project'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
