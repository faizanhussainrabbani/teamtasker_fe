# TeamTasker

TeamTasker is a people-focused task management application designed to help teams collaborate effectively, manage workloads, and track development goals.

## Features

- **Dashboard Overview**: Get a quick glance at your tasks, team workload, and development goals
- **Task Management**: Create, assign, and track tasks with priority levels and progress tracking
- **Team Workload Visualization**: See how work is distributed across your team
- **Skills Matrix**: Track and visualize team skills and competencies
- **Development Goals**: Set and monitor personal and team development objectives
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (React framework)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) with [shadcn/ui](https://ui.shadcn.com/) components
- **State Management**: React hooks and context
- **Charts and Visualization**: [Recharts](https://recharts.org/)
- **Form Handling**: [React Hook Form](https://react-hook-form.com/) with [Zod](https://github.com/colinhacks/zod) validation

## Getting Started

### Prerequisites

- Node.js (version 18.x or higher recommended)
- npm or yarn package manager

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/faizanhussainrabbani/teamtasker_fe.git
   cd teamtasker_fe
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Project Structure

- `/app`: Next.js app router pages and layouts
- `/components`: Reusable React components
  - `/components/ui`: UI components from shadcn/ui
  - `/components/dashboard`: Dashboard-specific components
  - `/components/team`: Team management components
  - `/components/profile`: User profile components
- `/hooks`: Custom React hooks
- `/lib`: Utility functions and shared code
- `/public`: Static assets
- `/styles`: Global CSS styles

## Current Status

This project is currently a frontend prototype with mock data. Future development plans include:

- Backend API integration
- Authentication and user management
- Real-time updates and notifications
- Advanced filtering and search capabilities
- Mobile app version

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
