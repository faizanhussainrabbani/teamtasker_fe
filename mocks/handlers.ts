import { http, HttpResponse } from 'msw';
import { API_CONFIG } from '@/lib/api/config';

// Sample task data
const tasks = [
  {
    id: "task-1",
    title: "API Integration",
    description: "Integrate the new payment gateway API with our checkout system",
    status: "in-progress",
    priority: "high",
    dueDate: "2023-05-15",
    progress: 45,
    assigneeId: "user-1",
    assignee: {
      id: "user-1",
      name: "Jane Doe",
      avatar: "/placeholder.svg?height=32&width=32",
      initials: "JD",
    },
    tags: ["Backend", "API"],
    createdAt: "2023-05-01T10:00:00Z",
    updatedAt: "2023-05-10T15:30:00Z",
  },
  {
    id: "task-2",
    title: "User Dashboard Redesign",
    description: "Redesign the user dashboard for better UX and accessibility",
    status: "in-progress",
    priority: "medium",
    dueDate: "2023-05-18",
    progress: 30,
    assigneeId: "user-2",
    assignee: {
      id: "user-2",
      name: "John Smith",
      avatar: "/placeholder.svg?height=32&width=32",
      initials: "JS",
    },
    tags: ["UI/UX", "Frontend"],
    createdAt: "2023-05-02T09:00:00Z",
    updatedAt: "2023-05-12T11:30:00Z",
  },
  {
    id: "task-3",
    title: "Database Optimization",
    description: "Optimize database queries for better performance",
    status: "todo",
    priority: "medium",
    dueDate: "2023-05-20",
    progress: 0,
    assigneeId: "user-3",
    assignee: {
      id: "user-3",
      name: "Emily Chen",
      avatar: "/placeholder.svg?height=32&width=32",
      initials: "EC",
    },
    tags: ["Database", "Performance"],
    createdAt: "2023-05-03T14:00:00Z",
    updatedAt: "2023-05-03T14:00:00Z",
  },
  {
    id: "task-4",
    title: "Documentation Update",
    description: "Update API documentation with new endpoints",
    status: "completed",
    priority: "low",
    dueDate: "2023-05-10",
    progress: 100,
    assigneeId: "user-4",
    assignee: {
      id: "user-4",
      name: "Michael Brown",
      avatar: "/placeholder.svg?height=32&width=32",
      initials: "MB",
    },
    tags: ["Documentation"],
    createdAt: "2023-05-04T11:00:00Z",
    updatedAt: "2023-05-09T16:30:00Z",
  },
  {
    id: "task-5",
    title: "Security Audit",
    description: "Perform security audit on authentication system",
    status: "todo",
    priority: "high",
    dueDate: "2023-05-25",
    progress: 0,
    assigneeId: "user-1",
    assignee: {
      id: "user-1",
      name: "Jane Doe",
      avatar: "/placeholder.svg?height=32&width=32",
      initials: "JD",
    },
    tags: ["Security", "Audit"],
    createdAt: "2023-05-05T13:00:00Z",
    updatedAt: "2023-05-05T13:00:00Z",
  },
];

// Sample users data
const users = [
  {
    id: "user-1",
    name: "Jane Doe",
    email: "jane.doe@example.com",
    role: "admin",
    avatar: "/placeholder.svg?height=32&width=32",
    initials: "JD",
    bio: "Full-stack developer with 8 years of experience",
    phone: "+1 (555) 123-4567",
    location: "San Francisco, CA",
    createdAt: "2022-01-01T00:00:00Z",
    updatedAt: "2023-01-01T00:00:00Z",
  },
  {
    id: "user-2",
    name: "John Smith",
    email: "john.smith@example.com",
    role: "developer",
    avatar: "/placeholder.svg?height=32&width=32",
    initials: "JS",
    bio: "Frontend developer specializing in React",
    phone: "+1 (555) 234-5678",
    location: "New York, NY",
    createdAt: "2022-02-01T00:00:00Z",
    updatedAt: "2023-02-01T00:00:00Z",
  },
  {
    id: "user-3",
    name: "Emily Chen",
    email: "emily.chen@example.com",
    role: "developer",
    avatar: "/placeholder.svg?height=32&width=32",
    initials: "EC",
    bio: "Backend developer with expertise in Node.js and databases",
    phone: "+1 (555) 345-6789",
    location: "Seattle, WA",
    createdAt: "2022-03-01T00:00:00Z",
    updatedAt: "2023-03-01T00:00:00Z",
  },
  {
    id: "user-4",
    name: "Michael Brown",
    email: "michael.brown@example.com",
    role: "developer",
    avatar: "/placeholder.svg?height=32&width=32",
    initials: "MB",
    bio: "DevOps engineer with cloud expertise",
    phone: "+1 (555) 456-7890",
    location: "Austin, TX",
    createdAt: "2022-04-01T00:00:00Z",
    updatedAt: "2023-04-01T00:00:00Z",
  },
  {
    id: "user-5",
    name: "Sarah Wilson",
    email: "sarah.wilson@example.com",
    role: "manager",
    avatar: "/placeholder.svg?height=32&width=32",
    initials: "SW",
    bio: "Product manager with 5 years of experience",
    phone: "+1 (555) 567-8901",
    location: "Chicago, IL",
    createdAt: "2022-05-01T00:00:00Z",
    updatedAt: "2023-05-01T00:00:00Z",
  },
];

// Define handlers
export const handlers = [
  // Tasks endpoints
  http.get(`${API_CONFIG.baseURL}${API_CONFIG.endpoints.tasks}`, ({ request }) => {
    const url = new URL(request.url);
    const status = url.searchParams.get('status');
    const priority = url.searchParams.get('priority');
    const search = url.searchParams.get('search');
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '10');
    
    let filteredTasks = [...tasks];
    
    // Apply filters
    if (status) {
      filteredTasks = filteredTasks.filter(task => task.status === status);
    }
    
    if (priority) {
      filteredTasks = filteredTasks.filter(task => task.priority === priority);
    }
    
    if (search) {
      const searchLower = search.toLowerCase();
      filteredTasks = filteredTasks.filter(task => 
        task.title.toLowerCase().includes(searchLower) || 
        task.description.toLowerCase().includes(searchLower) ||
        task.tags.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }
    
    // Calculate pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedTasks = filteredTasks.slice(startIndex, endIndex);
    
    return HttpResponse.json({
      data: paginatedTasks,
      total: filteredTasks.length,
      page,
      limit,
      totalPages: Math.ceil(filteredTasks.length / limit),
    });
  }),
  
  http.get(`${API_CONFIG.baseURL}${API_CONFIG.endpoints.tasks}/:id`, ({ params }) => {
    const { id } = params;
    const task = tasks.find(task => task.id === id);
    
    if (!task) {
      return new HttpResponse(null, { status: 404 });
    }
    
    return HttpResponse.json(task);
  }),
  
  http.post(`${API_CONFIG.baseURL}${API_CONFIG.endpoints.tasks}`, async ({ request }) => {
    const newTask = await request.json();
    const taskId = `task-${Date.now()}`;
    
    const createdTask = {
      id: taskId,
      ...newTask,
      progress: newTask.progress || 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      assignee: newTask.assigneeId ? users.find(user => user.id === newTask.assigneeId) : null,
    };
    
    tasks.push(createdTask);
    
    return HttpResponse.json(createdTask, { status: 201 });
  }),
  
  http.patch(`${API_CONFIG.baseURL}${API_CONFIG.endpoints.tasks}/:id`, async ({ request, params }) => {
    const { id } = params;
    const updates = await request.json();
    const taskIndex = tasks.findIndex(task => task.id === id);
    
    if (taskIndex === -1) {
      return new HttpResponse(null, { status: 404 });
    }
    
    const updatedTask = {
      ...tasks[taskIndex],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    
    // Update assignee if assigneeId changed
    if (updates.assigneeId && updates.assigneeId !== tasks[taskIndex].assigneeId) {
      updatedTask.assignee = users.find(user => user.id === updates.assigneeId) || null;
    }
    
    tasks[taskIndex] = updatedTask;
    
    return HttpResponse.json(updatedTask);
  }),
  
  http.delete(`${API_CONFIG.baseURL}${API_CONFIG.endpoints.tasks}/:id`, ({ params }) => {
    const { id } = params;
    const taskIndex = tasks.findIndex(task => task.id === id);
    
    if (taskIndex === -1) {
      return new HttpResponse(null, { status: 404 });
    }
    
    tasks.splice(taskIndex, 1);
    
    return new HttpResponse(null, { status: 204 });
  }),
  
  http.patch(`${API_CONFIG.baseURL}${API_CONFIG.endpoints.tasks}/:id/status`, async ({ request, params }) => {
    const { id } = params;
    const { status } = await request.json();
    const taskIndex = tasks.findIndex(task => task.id === id);
    
    if (taskIndex === -1) {
      return new HttpResponse(null, { status: 404 });
    }
    
    const updatedTask = {
      ...tasks[taskIndex],
      status,
      updatedAt: new Date().toISOString(),
    };
    
    // Update progress based on status
    if (status === 'completed') {
      updatedTask.progress = 100;
    } else if (status === 'todo' && updatedTask.progress === 100) {
      updatedTask.progress = 0;
    }
    
    tasks[taskIndex] = updatedTask;
    
    return HttpResponse.json(updatedTask);
  }),
  
  http.patch(`${API_CONFIG.baseURL}${API_CONFIG.endpoints.tasks}/:id/progress`, async ({ request, params }) => {
    const { id } = params;
    const { progress } = await request.json();
    const taskIndex = tasks.findIndex(task => task.id === id);
    
    if (taskIndex === -1) {
      return new HttpResponse(null, { status: 404 });
    }
    
    const updatedTask = {
      ...tasks[taskIndex],
      progress,
      updatedAt: new Date().toISOString(),
    };
    
    // Update status based on progress
    if (progress === 100 && updatedTask.status !== 'completed') {
      updatedTask.status = 'completed';
    } else if (progress < 100 && updatedTask.status === 'completed') {
      updatedTask.status = 'in-progress';
    } else if (progress > 0 && updatedTask.status === 'todo') {
      updatedTask.status = 'in-progress';
    }
    
    tasks[taskIndex] = updatedTask;
    
    return HttpResponse.json(updatedTask);
  }),
  
  // Users endpoints
  http.get(`${API_CONFIG.baseURL}${API_CONFIG.endpoints.users}`, ({ request }) => {
    const url = new URL(request.url);
    const role = url.searchParams.get('role');
    const search = url.searchParams.get('search');
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '10');
    
    let filteredUsers = [...users];
    
    // Apply filters
    if (role) {
      filteredUsers = filteredUsers.filter(user => user.role === role);
    }
    
    if (search) {
      const searchLower = search.toLowerCase();
      filteredUsers = filteredUsers.filter(user => 
        user.name.toLowerCase().includes(searchLower) || 
        user.email.toLowerCase().includes(searchLower)
      );
    }
    
    // Calculate pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedUsers = filteredUsers.slice(startIndex, endIndex);
    
    return HttpResponse.json({
      data: paginatedUsers,
      total: filteredUsers.length,
      page,
      limit,
      totalPages: Math.ceil(filteredUsers.length / limit),
    });
  }),
  
  http.get(`${API_CONFIG.baseURL}${API_CONFIG.endpoints.users}/:id`, ({ params }) => {
    const { id } = params;
    const user = users.find(user => user.id === id);
    
    if (!user) {
      return new HttpResponse(null, { status: 404 });
    }
    
    return HttpResponse.json(user);
  }),
  
  // Auth endpoints
  http.post(`${API_CONFIG.baseURL}${API_CONFIG.endpoints.auth}/login`, async ({ request }) => {
    const { email, password } = await request.json();
    
    // Simple mock authentication
    const user = users.find(user => user.email === email);
    
    if (!user || password !== 'password') {
      return new HttpResponse(
        JSON.stringify({ message: 'Invalid email or password' }),
        { status: 401 }
      );
    }
    
    return HttpResponse.json({
      token: 'mock-jwt-token',
      user,
    });
  }),
  
  http.get(`${API_CONFIG.baseURL}${API_CONFIG.endpoints.auth}/me`, ({ request }) => {
    const authHeader = request.headers.get('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new HttpResponse(
        JSON.stringify({ message: 'Unauthorized' }),
        { status: 401 }
      );
    }
    
    // In a real app, you would validate the token
    // For mock purposes, we'll just return the first user
    return HttpResponse.json(users[0]);
  }),
];
