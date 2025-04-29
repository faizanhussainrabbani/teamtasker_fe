// Utility to create a test task for development
import { createTask } from './api/endpoints/tasks';
import { TaskCreateRequest } from './api/types/tasks';

/**
 * Create a test task for development purposes
 */
export const createTestTask = async (): Promise<any> => {
  try {
    console.log('Creating test task...');

    // Generate a random ID for the task title to avoid duplicates
    const randomId = Math.floor(Math.random() * 10000);

    const testTask: TaskCreateRequest = {
      title: `Test Task #${randomId}`,
      description: 'This is a test task created for development purposes. It was automatically generated because no tasks were found.',
      status: 'todo',
      priority: 'medium',
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 1 week from now
      tags: ['test', 'development', 'auto-generated'],
      progress: 0,
      assigneeId: null, // Unassigned
      projectId: null, // No project
    };

    console.log('Sending test task to API:', testTask);
    const result = await createTask(testTask);
    console.log('Test task created successfully:', result);

    // Add some default properties that might be expected by the UI
    if (result && !result.progress) {
      result.progress = 0;
    }

    if (result && !result.tags) {
      result.tags = testTask.tags;
    }

    if (result && !result.assignee) {
      result.assignee = { name: 'Unassigned', initials: 'UA', avatar: null };
    }

    return result;
  } catch (error) {
    console.error('Error creating test task:', error);
    // Return a mock task if the API call fails
    return {
      id: `local-${Date.now()}`,
      title: 'Test Task (Local)',
      description: 'This is a local test task created because the API call failed.',
      status: 'todo',
      priority: 'medium',
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      tags: ['test', 'development', 'local'],
      progress: 0,
      assignee: { name: 'Unassigned', initials: 'UA', avatar: null },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  }
};
