// API configuration
export const API_CONFIG = {
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5220/api',
  timeout: 10000,
  version: 'v1',
  endpoints: {
    tasks: '/tasks',
    users: '/users',
    teams: '/teams',
    auth: '/auth',
    profile: '/users/profile',
    skills: '/skills',
    development: '/development',
    communication: '/communication',
    activities: '/activities',
  }
};
