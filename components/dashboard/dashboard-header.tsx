"use client"

import { useState } from "react"
import { Bell, Calendar, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { SidebarTrigger } from "@/components/ui/sidebar"

import { useAuth } from "@/context/auth-context"

interface DashboardHeaderProps {
  isLoading?: boolean;
}

export function DashboardHeader({ isLoading }: DashboardHeaderProps) {
  const [notifications, setNotifications] = useState(3)
  const { user } = useAuth();

  const firstName = user?.name?.split(' ')[0] || 'User';

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-4">
      <SidebarTrigger className="md:hidden" />
      <div className="flex-1">
        <h1 className="text-xl font-semibold">Dashboard</h1>
        <p className="text-sm text-muted-foreground">Welcome back, {firstName}. You have {notifications} new notifications.</p>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon">
          <Calendar className="h-4 w-4" />
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" className="relative">
              <Bell className="h-4 w-4" />
              {notifications > 0 && (
                <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-medium text-destructive-foreground">
                  {notifications}
                </span>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Notifications</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>New task assigned: API Integration</DropdownMenuItem>
            <DropdownMenuItem>Sarah mentioned you in a comment</DropdownMenuItem>
            <DropdownMenuItem>Team meeting in 30 minutes</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Filter View</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>All Tasks</DropdownMenuItem>
            <DropdownMenuItem>My Tasks</DropdownMenuItem>
            <DropdownMenuItem>High Priority</DropdownMenuItem>
            <DropdownMenuItem>Due This Week</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
