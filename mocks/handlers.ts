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

// Sample announcements data
const announcements = [
  {
    id: "ann-1",
    title: "New Project Launch: Team Tasker",
    content:
      "We're excited to announce the launch of our new project, Team Tasker! This platform will help teams manage tasks, track progress, and improve collaboration. The beta version will be available next week for internal testing.",
    author: {
      id: "user-5",
      name: "Sarah Wilson",
      role: "Product Manager",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "SW",
    },
    date: "2023-05-10T10:00:00Z",
    isPinned: true,
    likes: 12,
    hasLiked: false,
  },
  {
    id: "ann-2",
    title: "Office Closure: Memorial Day Weekend",
    content:
      "Please note that our office will be closed on Monday, May 29th, in observance of Memorial Day. All deadlines falling on this date will be extended to Tuesday, May 30th. Enjoy the long weekend!",
    author: {
      id: "user-4",
      name: "Michael Brown",
      role: "HR Manager",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "MB",
    },
    date: "2023-05-15T14:30:00Z",
    isPinned: false,
    likes: 8,
    hasLiked: true,
  },
  {
    id: "ann-3",
    title: "Quarterly Team Meeting",
    content:
      "Our Q2 team meeting is scheduled for June 5th at 10 AM in the main conference room. We'll be discussing our progress on current projects, setting goals for Q3, and recognizing team achievements. Please prepare a brief update on your current projects.",
    author: {
      id: "user-1",
      name: "Jane Doe",
      role: "Team Lead",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "JD",
    },
    date: "2023-05-18T09:15:00Z",
    isPinned: false,
    likes: 5,
    hasLiked: false,
  },
  {
    id: "ann-4",
    title: "New Team Member Introduction",
    content:
      "Please join me in welcoming Alex Johnson to our development team! Alex brings 5 years of experience in frontend development and will be focusing on our UI/UX improvements. Feel free to reach out and introduce yourself.",
    author: {
      id: "user-2",
      name: "John Smith",
      role: "Engineering Manager",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "JS",
    },
    date: "2023-05-20T11:45:00Z",
    isPinned: false,
    likes: 15,
    hasLiked: true,
  },
];

// Sample activities data
const activities = [
  {
    id: "activity-1",
    user: {
      id: "user-2",
      name: "John Smith",
      avatar: "/placeholder.svg?height=32&width=32",
      initials: "JS",
    },
    action: "completed",
    target: "User Authentication Feature",
    targetId: "task-4",
    targetType: "task",
    createdAt: "2023-05-15T10:30:00Z",
    timestamp: "2 hours ago",
  },
  {
    id: "activity-2",
    user: {
      id: "user-3",
      name: "Emily Chen",
      avatar: "/placeholder.svg?height=32&width=32",
      initials: "EC",
    },
    action: "commented",
    target: "API Integration",
    targetId: "task-1",
    targetType: "task",
    comment: "I've identified a potential issue with the authentication flow. Let's discuss this in our next meeting.",
    createdAt: "2023-05-15T08:30:00Z",
    timestamp: "4 hours ago",
  },
  {
    id: "activity-3",
    user: {
      id: "user-4",
      name: "Michael Brown",
      avatar: "/placeholder.svg?height=32&width=32",
      initials: "MB",
    },
    action: "assigned",
    target: "Database Optimization",
    targetId: "task-3",
    targetType: "task",
    assigneeId: "user-1",
    assignee: {
      id: "user-1",
      name: "Jane Doe",
      avatar: "/placeholder.svg?height=32&width=32",
      initials: "JD",
    },
    createdAt: "2023-05-14T15:30:00Z",
    timestamp: "Yesterday",
  },
  {
    id: "activity-4",
    user: {
      id: "user-5",
      name: "Sarah Wilson",
      avatar: "/placeholder.svg?height=32&width=32",
      initials: "SW",
    },
    action: "updated",
    target: "Project Timeline",
    targetId: "project-1",
    targetType: "project",
    createdAt: "2023-05-14T14:30:00Z",
    timestamp: "Yesterday",
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
  // Announcements endpoints
  http.get(`${API_CONFIG.baseURL}${API_CONFIG.endpoints.communication}/announcements`, ({ request }) => {
    const url = new URL(request.url);
    const search = url.searchParams.get('search')?.toLowerCase();
    const isPinned = url.searchParams.get('isPinned') === 'true';
    const authorId = url.searchParams.get('authorId');
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '10');

    let filteredAnnouncements = [...announcements];

    // Apply filters
    if (search) {
      filteredAnnouncements = filteredAnnouncements.filter(announcement =>
        announcement.title.toLowerCase().includes(search) ||
        announcement.content.toLowerCase().includes(search)
      );
    }

    if (isPinned) {
      filteredAnnouncements = filteredAnnouncements.filter(announcement => announcement.isPinned);
    }

    if (authorId) {
      filteredAnnouncements = filteredAnnouncements.filter(announcement => announcement.author.id === authorId);
    }

    // Sort: pinned first, then by date
    filteredAnnouncements.sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });

    // Paginate
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedAnnouncements = filteredAnnouncements.slice(startIndex, endIndex);

    return HttpResponse.json({
      data: paginatedAnnouncements,
      total: filteredAnnouncements.length,
      page,
      limit,
      totalPages: Math.ceil(filteredAnnouncements.length / limit),
    });
  }),

  http.get(`${API_CONFIG.baseURL}${API_CONFIG.endpoints.communication}/announcements/:id`, ({ params }) => {
    const { id } = params;
    const announcement = announcements.find(announcement => announcement.id === id);

    if (!announcement) {
      return new HttpResponse(null, { status: 404 });
    }

    return HttpResponse.json(announcement);
  }),

  http.post(`${API_CONFIG.baseURL}${API_CONFIG.endpoints.communication}/announcements`, async ({ request }) => {
    const data = await request.json();

    // Create a new announcement
    const newAnnouncement = {
      id: `ann-${Date.now()}`,
      title: data.title,
      content: data.content,
      author: {
        id: "user-1", // Current user
        name: "Jane Doe",
        role: "Team Lead",
        avatar: "/placeholder.svg?height=40&width=40",
        initials: "JD",
      },
      date: new Date().toISOString(),
      isPinned: data.isPinned || false,
      likes: 0,
      hasLiked: false,
    };

    // Add to the list
    announcements.unshift(newAnnouncement);

    return HttpResponse.json(newAnnouncement);
  }),

  http.patch(`${API_CONFIG.baseURL}${API_CONFIG.endpoints.communication}/announcements/:id`, async ({ request, params }) => {
    const { id } = params;
    const data = await request.json();

    const announcementIndex = announcements.findIndex(announcement => announcement.id === id);

    if (announcementIndex === -1) {
      return new HttpResponse(null, { status: 404 });
    }

    // Update the announcement
    const updatedAnnouncement = {
      ...announcements[announcementIndex],
      ...data,
    };

    announcements[announcementIndex] = updatedAnnouncement;

    return HttpResponse.json(updatedAnnouncement);
  }),

  http.delete(`${API_CONFIG.baseURL}${API_CONFIG.endpoints.communication}/announcements/:id`, ({ params }) => {
    const { id } = params;
    const announcementIndex = announcements.findIndex(announcement => announcement.id === id);

    if (announcementIndex === -1) {
      return new HttpResponse(null, { status: 404 });
    }

    // Remove the announcement
    announcements.splice(announcementIndex, 1);

    return new HttpResponse(null, { status: 204 });
  }),

  http.post(`${API_CONFIG.baseURL}${API_CONFIG.endpoints.communication}/announcements/:id/toggle-pin`, ({ params }) => {
    const { id } = params;
    const announcementIndex = announcements.findIndex(announcement => announcement.id === id);

    if (announcementIndex === -1) {
      return new HttpResponse(null, { status: 404 });
    }

    // Toggle pin status
    announcements[announcementIndex].isPinned = !announcements[announcementIndex].isPinned;

    return HttpResponse.json(announcements[announcementIndex]);
  }),

  http.post(`${API_CONFIG.baseURL}${API_CONFIG.endpoints.communication}/announcements/:id/toggle-like`, ({ params }) => {
    const { id } = params;
    const announcementIndex = announcements.findIndex(announcement => announcement.id === id);

    if (announcementIndex === -1) {
      return new HttpResponse(null, { status: 404 });
    }

    // Toggle like status
    const hasLiked = !announcements[announcementIndex].hasLiked;
    announcements[announcementIndex].hasLiked = hasLiked;
    announcements[announcementIndex].likes = hasLiked
      ? announcements[announcementIndex].likes + 1
      : announcements[announcementIndex].likes - 1;

    return HttpResponse.json(announcements[announcementIndex]);
  }),

  // Activities endpoints
  http.get(`${API_CONFIG.baseURL}${API_CONFIG.endpoints.activities}`, ({ request }) => {
    const url = new URL(request.url);
    const userId = url.searchParams.get('userId');
    const targetType = url.searchParams.get('targetType');
    const targetId = url.searchParams.get('targetId');
    const action = url.searchParams.get('action');
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '10');

    let filteredActivities = [...activities];

    // Apply filters
    if (userId) {
      filteredActivities = filteredActivities.filter(activity => activity.user.id === userId);
    }

    if (targetType) {
      filteredActivities = filteredActivities.filter(activity => activity.targetType === targetType);
    }

    if (targetId) {
      filteredActivities = filteredActivities.filter(activity => activity.targetId === targetId);
    }

    if (action) {
      filteredActivities = filteredActivities.filter(activity => activity.action === action);
    }

    // Sort by createdAt in descending order (newest first)
    filteredActivities.sort((a, b) => {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    // Paginate
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedActivities = filteredActivities.slice(startIndex, endIndex);

    return HttpResponse.json({
      data: paginatedActivities,
      total: filteredActivities.length,
      page,
      limit,
      totalPages: Math.ceil(filteredActivities.length / limit),
    });
  }),

  http.get(`${API_CONFIG.baseURL}${API_CONFIG.endpoints.activities}/:id`, ({ params }) => {
    const { id } = params;
    const activity = activities.find(activity => activity.id === id);

    if (!activity) {
      return new HttpResponse(null, { status: 404 });
    }

    return HttpResponse.json(activity);
  }),

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
