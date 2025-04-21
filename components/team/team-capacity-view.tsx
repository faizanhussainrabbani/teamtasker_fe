"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Sample capacity data
const capacityData = {
  current: [
    { id: "user-1", name: "Jane Doe", avatar: "/placeholder.svg?height=32&width=32", initials: "JD", capacity: 85 },
    { id: "user-2", name: "John Smith", avatar: "/placeholder.svg?height=32&width=32", initials: "JS", capacity: 60 },
    { id: "user-3", name: "Emily Chen", avatar: "/placeholder.svg?height=32&width=32", initials: "EC", capacity: 45 },
    {
      id: "user-4",
      name: "Michael Brown",
      avatar: "/placeholder.svg?height=32&width=32",
      initials: "MB",
      capacity: 70,
    },
    { id: "user-5", name: "Sarah Wilson", avatar: "/placeholder.svg?height=32&width=32", initials: "SW", capacity: 75 },
  ],
  nextWeek: [
    { id: "user-1", name: "Jane Doe", avatar: "/placeholder.svg?height=32&width=32", initials: "JD", capacity: 90 },
    { id: "user-2", name: "John Smith", avatar: "/placeholder.svg?height=32&width=32", initials: "JS", capacity: 75 },
    { id: "user-3", name: "Emily Chen", avatar: "/placeholder.svg?height=32&width=32", initials: "EC", capacity: 60 },
    {
      id: "user-4",
      name: "Michael Brown",
      avatar: "/placeholder.svg?height=32&width=32",
      initials: "MB",
      capacity: 80,
    },
    { id: "user-5", name: "Sarah Wilson", avatar: "/placeholder.svg?height=32&width=32", initials: "SW", capacity: 65 },
  ],
  nextMonth: [
    { id: "user-1", name: "Jane Doe", avatar: "/placeholder.svg?height=32&width=32", initials: "JD", capacity: 70 },
    { id: "user-2", name: "John Smith", avatar: "/placeholder.svg?height=32&width=32", initials: "JS", capacity: 50 },
    { id: "user-3", name: "Emily Chen", avatar: "/placeholder.svg?height=32&width=32", initials: "EC", capacity: 80 },
    {
      id: "user-4",
      name: "Michael Brown",
      avatar: "/placeholder.svg?height=32&width=32",
      initials: "MB",
      capacity: 60,
    },
    { id: "user-5", name: "Sarah Wilson", avatar: "/placeholder.svg?height=32&width=32", initials: "SW", capacity: 55 },
  ],
}

const getCapacityColor = (capacity: number) => {
  if (capacity > 80) return "bg-blue-600"
  if (capacity > 60) return "bg-blue-400"
  return "bg-blue-300"
}

export function TeamCapacityView() {
  const [timeframe, setTimeframe] = useState("current")

  const data =
    timeframe === "current"
      ? capacityData.current
      : timeframe === "nextWeek"
        ? capacityData.nextWeek
        : capacityData.nextMonth

  const averageCapacity = Math.round(data.reduce((sum, member) => sum + member.capacity, 0) / data.length)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">Team Capacity</h3>
          <p className="text-sm text-muted-foreground">
            Average: <span className="font-medium">{averageCapacity}%</span>
          </p>
        </div>
        <Select value={timeframe} onValueChange={setTimeframe}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select timeframe" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="current">Current</SelectItem>
            <SelectItem value="nextWeek">Next Week</SelectItem>
            <SelectItem value="nextMonth">Next Month</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="space-y-4">
            {data.map((member) => (
              <div key={member.id} className="flex items-center gap-4">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={member.avatar || "/placeholder.svg"} alt={member.name} />
                  <AvatarFallback>{member.initials}</AvatarFallback>
                </Avatar>
                <div className="min-w-[100px] text-sm">{member.name}</div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs">{member.capacity}% Allocated</span>
                    <span className="text-xs">{100 - member.capacity}% Available</span>
                  </div>
                  <Progress value={member.capacity} className={`h-2 ${getCapacityColor(member.capacity)}`} />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
