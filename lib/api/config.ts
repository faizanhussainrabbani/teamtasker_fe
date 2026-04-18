// API configuration
export const API_CONFIG = {
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5220/api',
  timeout: 15000,
  version: 'v1',
  endpoints: {
    tasks: '/tasks',
    projects: '/projects',
    teams: '/teams',
    users: '/users',
    auth: '/auth',
    profile: '/users/profile',
    communication: '/communication',
    activities: '/activities',
  }
};
