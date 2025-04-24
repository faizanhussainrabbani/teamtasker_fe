# TeamTasker

<div align="center">

![TeamTasker Logo](public/logo.svg)

[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![React Query](https://img.shields.io/badge/React%20Query-5-FF4154?style=for-the-badge&logo=react-query)](https://tanstack.com/query/)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

</div>

TeamTasker is a people-focused task management application designed to help teams collaborate effectively, manage workloads, and track development goals. It puts team members at the center of project management, focusing on skills development alongside task completion.

## ✨ Features

- **📊 Dashboard Overview**: Get a quick glance at your tasks, team workload, and development goals
- **📝 Task Management**: Create, assign, and track tasks with priority levels and progress tracking
- **👥 Team Workload Visualization**: See how work is distributed across your team
- **🧠 Skills Matrix**: Track and visualize team skills and competencies
- **🎯 Development Goals**: Set and monitor personal and team development objectives
- **📱 Responsive Design**: Works seamlessly on desktop and mobile devices
- **🔒 Authentication**: Secure user authentication and authorization
- **🌓 Dark Mode**: Toggle between light and dark themes

## 🛠️ Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) with App Router
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) with [shadcn/ui](https://ui.shadcn.com/) components
- **State Management**: [React Query](https://tanstack.com/query/) for server state, React hooks and context for UI state
- **API Integration**: Axios with custom interceptors for API requests
- **Charts and Visualization**: [Recharts](https://recharts.org/)
- **Form Handling**: [React Hook Form](https://react-hook-form.com/) with [Zod](https://github.com/colinhacks/zod) validation
- **Testing**: Jest and React Testing Library for component testing

## 🚀 Getting Started

### Prerequisites

- Node.js (version 18.x or higher recommended)
- npm, yarn, or pnpm package manager

### Environment Setup

1. Copy the example environment file:
   ```bash
   cp .env.example .env.local
   ```

2. Update the environment variables in `.env.local` as needed:
   ```
   # API URL for backend connection
   NEXT_PUBLIC_API_URL=http://localhost:5220/api
   ```

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



## 📂 Project Structure

```
├── app/                  # Next.js app router pages and layouts
│   ├── (auth)/           # Authentication route group (login, register, forgot-password)
│   ├── (dashboard)/      # Dashboard route group (authenticated pages)
│   └── template.tsx      # Application template with providers
├── components/           # Reusable React components
│   ├── ui/               # UI components from shadcn/ui
│   ├── dashboard/        # Dashboard-specific components
│   ├── team/             # Team management components
│   ├── profile/          # User profile components
│   └── tasks/            # Task management components
├── constants/            # Application constants
├── context/              # React context providers
├── hooks/                # Custom React hooks
├── lib/                  # Utility functions and shared code
│   ├── api/              # API client and endpoints
│   │   ├── endpoints/    # API endpoint functions
│   │   ├── hooks/        # React Query hooks
│   │   └── types/        # TypeScript types for API
│   └── utils/            # General utility functions
├── public/               # Static assets
├── styles/               # Global CSS styles
├── types/                # TypeScript type definitions
└── utils/                # Utility functions
```

## 💬 API Integration

The application uses React Query for data fetching and state management. API calls are made using Axios with custom interceptors for authentication and error handling.



## 🛠 Development

### Code Style

This project uses ESLint and Prettier for code formatting. To lint the code, run:

```bash
npm run lint
```

### Building for Production

To build the application for production, run:

```bash
npm run build
```

The build output will be in the `.next` directory.

## 📝 Roadmap

Future development plans include:

- [x] Backend API integration with a real server
- [ ] Real-time updates and notifications
- [ ] Advanced filtering and search capabilities
- [ ] Team permissions and role management
- [ ] Mobile app version
- [ ] Integration with third-party tools (GitHub, Jira, etc.)
- [ ] Comprehensive test coverage

## 👮‍♂️ Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📜 License

This project is licensed under the MIT License - see the LICENSE file for details.
