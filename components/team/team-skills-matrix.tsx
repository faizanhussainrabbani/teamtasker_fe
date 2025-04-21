"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

// Sample skills data
const skills = [
  "React",
  "TypeScript",
  "Node.js",
  "Python",
  "Django",
  "SQL",
  "Docker",
  "AWS",
  "CI/CD",
  "GraphQL",
  "UI/UX",
  "CSS",
  "Product Management",
  "Agile",
]

// Sample team data with skill levels
const teamSkills = [
  {
    id: "user-1",
    name: "Jane Doe",
    avatar: "/placeholder.svg?height=32&width=32",
    initials: "JD",
    skills: {
      React: 4,
      TypeScript: 5,
      "Node.js": 4,
      GraphQL: 3,
      Docker: 2,
    },
  },
  {
    id: "user-2",
    name: "John Smith",
    avatar: "/placeholder.svg?height=32&width=32",
    initials: "JS",
    skills: {
      React: 5,
      CSS: 5,
      "UI/UX": 4,
      TypeScript: 3,
      GraphQL: 2,
    },
  },
  {
    id: "user-3",
    name: "Emily Chen",
    avatar: "/placeholder.svg?height=32&width=32",
    initials: "EC",
    skills: {
      Python: 5,
      Django: 5,
      SQL: 4,
      Docker: 3,
      AWS: 2,
    },
  },
  {
    id: "user-4",
    name: "Michael Brown",
    avatar: "/placeholder.svg?height=32&width=32",
    initials: "MB",
    skills: {
      Docker: 5,
      AWS: 5,
      "CI/CD": 5,
      Python: 3,
      SQL: 2,
    },
  },
  {
    id: "user-5",
    name: "Sarah Wilson",
    avatar: "/placeholder.svg?height=32&width=32",
    initials: "SW",
    skills: {
      "Product Management": 5,
      Agile: 5,
      "UI/UX": 4,
      React: 2,
      TypeScript: 1,
    },
  },
]

// Function to get skill level indicator
const getSkillLevel = (level: number | undefined) => {
  if (!level) return null

  const colors = [
    "bg-gray-200 dark:bg-gray-700",
    "bg-slate-300 dark:bg-slate-700",
    "bg-blue-200 dark:bg-blue-800",
    "bg-blue-300 dark:bg-blue-700",
    "bg-blue-400 dark:bg-blue-600",
  ]

  return <div className={`h-4 w-4 rounded-full ${colors[level - 1]}`} title={`Level ${level}`} />
}

export function TeamSkillsMatrix() {
  return (
    <Card>
      <CardContent className="p-0">
        <div className="overflow-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="sticky left-0 bg-background p-2 text-left">Team Member</th>
                {skills.map((skill) => (
                  <th key={skill} className="p-2 text-center text-xs font-medium">
                    {skill}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {teamSkills.map((member) => (
                <tr key={member.id} className="border-t">
                  <td className="sticky left-0 bg-background p-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={member.avatar || "/placeholder.svg"} alt={member.name} />
                        <AvatarFallback>{member.initials}</AvatarFallback>
                      </Avatar>
                      <span>{member.name}</span>
                    </div>
                  </td>
                  {skills.map((skill) => (
                    <td key={skill} className="p-2 text-center">
                      <div className="flex justify-center">
                        {getSkillLevel(member.skills[skill as keyof typeof member.skills])}
                      </div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-end gap-4 border-t p-2">
          <div className="flex items-center gap-1">
            <div className="h-3 w-3 rounded-full bg-gray-200 dark:bg-gray-700" />
            <span className="text-xs">Beginner</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="h-3 w-3 rounded-full bg-slate-300 dark:bg-slate-700" />
            <span className="text-xs">Basic</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="h-3 w-3 rounded-full bg-blue-200 dark:bg-blue-800" />
            <span className="text-xs">Intermediate</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="h-3 w-3 rounded-full bg-blue-300 dark:bg-blue-700" />
            <span className="text-xs">Advanced</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="h-3 w-3 rounded-full bg-blue-400 dark:bg-blue-600" />
            <span className="text-xs">Expert</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
