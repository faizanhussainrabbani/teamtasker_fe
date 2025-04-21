"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { ChevronRight } from "lucide-react"

// Sample activity data
const activities = [
  {
    id: "activity-1",
    user: {
      name: "John Smith",
      avatar: "/placeholder.svg?height=32&width=32",
      initials: "JS",
    },
    action: "completed",
    target: "User Authentication Feature",
    time: "2 hours ago",
  },
  {
    id: "activity-2",
    user: {
      name: "Emily Chen",
      avatar: "/placeholder.svg?height=32&width=32",
      initials: "EC",
    },
    action: "commented on",
    target: "API Integration",
    time: "4 hours ago",
    comment: "I've identified a potential issue with the authentication flow. Let's discuss this in our next meeting.",
  },
  {
    id: "activity-3",
    user: {
      name: "Michael Brown",
      avatar: "/placeholder.svg?height=32&width=32",
      initials: "MB",
    },
    action: "assigned",
    target: "Database Optimization",
    assignee: "Jane Doe",
    time: "Yesterday",
  },
  {
    id: "activity-4",
    user: {
      name: "Sarah Wilson",
      avatar: "/placeholder.svg?height=32&width=32",
      initials: "SW",
    },
    action: "updated",
    target: "Project Timeline",
    time: "Yesterday",
  },
]

export function RecentActivityCard() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Latest updates from your team</CardDescription>
        </div>
        <Button variant="outline" size="sm">
          View All <ChevronRight className="ml-1 h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex gap-4">
              <Avatar className="h-8 w-8">
                <AvatarImage src={activity.user.avatar || "/placeholder.svg"} alt={activity.user.name} />
                <AvatarFallback>{activity.user.initials}</AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <p className="text-sm">
                  <span className="font-medium">{activity.user.name}</span>{" "}
                  <span className="text-muted-foreground">{activity.action}</span>{" "}
                  <span className="font-medium">{activity.target}</span>
                  {activity.assignee && (
                    <>
                      {" "}
                      <span className="text-muted-foreground">to</span>{" "}
                      <span className="font-medium">{activity.assignee}</span>
                    </>
                  )}
                </p>
                {activity.comment && <p className="text-sm text-muted-foreground">"{activity.comment}"</p>}
                <p className="text-xs text-muted-foreground">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
