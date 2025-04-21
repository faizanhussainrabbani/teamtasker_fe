"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { CalendarIcon, CheckCircle2, Clock, PlusCircle, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Sample development goals data
const initialGoals = [
  {
    id: "goal-1",
    title: "Learn GraphQL Advanced Concepts",
    description: "Master GraphQL schema design, resolvers, and performance optimization techniques",
    category: "Technical",
    deadline: "2023-08-30",
    progress: 65,
    status: "in-progress",
  },
  {
    id: "goal-2",
    title: "Improve Technical Writing Skills",
    description: "Write at least 5 technical blog posts about React best practices and architecture",
    category: "Communication",
    deadline: "2023-09-15",
    progress: 40,
    status: "in-progress",
  },
  {
    id: "goal-3",
    title: "Obtain AWS Solutions Architect Certification",
    description: "Study and pass the AWS Solutions Architect Associate exam",
    category: "Certification",
    deadline: "2023-10-30",
    progress: 25,
    status: "in-progress",
  },
  {
    id: "goal-4",
    title: "Mentor Junior Developers",
    description: "Provide regular code reviews and mentoring sessions for at least 2 junior developers",
    category: "Leadership",
    deadline: "2023-12-31",
    progress: 50,
    status: "in-progress",
  },
]

export function ProfileDevelopment() {
  const [goals, setGoals] = useState(initialGoals)
  const [isEditing, setIsEditing] = useState(false)
  const [editingGoalId, setEditingGoalId] = useState<string | null>(null)

  const emptyGoal = {
    id: "",
    title: "",
    description: "",
    category: "Technical",
    deadline: "",
    progress: 0,
    status: "in-progress",
  }

  const [newGoal, setNewGoal] = useState(emptyGoal)

  const handleAddGoal = () => {
    if (newGoal.title.trim() === "") return
    const goalToAdd = {
      ...newGoal,
      id: `goal-${Date.now()}`,
    }
    setGoals([...goals, goalToAdd])
    setNewGoal(emptyGoal)
  }

  const handleRemoveGoal = (goalId: string) => {
    setGoals(goals.filter((goal) => goal.id !== goalId))
  }

  const handleUpdateGoal = (goalId: string, field: string, value: string | number) => {
    setGoals(
      goals.map((goal) => (goal.id === goalId ? { ...goal, [field]: value } : goal))
    )
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="h-5 w-5 text-green-500" />
      case "in-progress":
        return <Clock className="h-5 w-5 text-blue-500" />
      default:
        return null
    }
  }

  const getCategoryBadgeColor = (category: string) => {
    switch (category) {
      case "Technical":
        return "bg-blue-100 text-blue-800 dark:bg-blue-800/20 dark:text-blue-300"
      case "Communication":
        return "bg-purple-100 text-purple-800 dark:bg-purple-800/20 dark:text-purple-300"
      case "Certification":
        return "bg-green-100 text-green-800 dark:bg-green-800/20 dark:text-green-300"
      case "Leadership":
        return "bg-amber-100 text-amber-800 dark:bg-amber-800/20 dark:text-amber-300"
      default:
        return ""
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Development Goals</CardTitle>
        <CardDescription>Track your professional development objectives and progress</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {isEditing ? (
          <div className="space-y-6">
            {goals.map((goal) => (
              <div key={goal.id} className="rounded-lg border p-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-4 flex-1">
                    <div className="space-y-2">
                      <Label htmlFor={`title-${goal.id}`}>Goal Title</Label>
                      <Input
                        id={`title-${goal.id}`}
                        value={goal.title}
                        onChange={(e) => handleUpdateGoal(goal.id, "title", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`description-${goal.id}`}>Description</Label>
                      <Textarea
                        id={`description-${goal.id}`}
                        value={goal.description}
                        onChange={(e) => handleUpdateGoal(goal.id, "description", e.target.value)}
                      />
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor={`category-${goal.id}`}>Category</Label>
                        <Select
                          value={goal.category}
                          onValueChange={(value) => handleUpdateGoal(goal.id, "category", value)}
                        >
                          <SelectTrigger id={`category-${goal.id}`}>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Technical">Technical</SelectItem>
                            <SelectItem value="Communication">Communication</SelectItem>
                            <SelectItem value="Certification">Certification</SelectItem>
                            <SelectItem value="Leadership">Leadership</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`deadline-${goal.id}`}>Deadline</Label>
                        <div className="relative">
                          <Input
                            id={`deadline-${goal.id}`}
                            type="date"
                            value={goal.deadline}
                            onChange={(e) => handleUpdateGoal(goal.id, "deadline", e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor={`progress-${goal.id}`}>Progress ({goal.progress}%)</Label>
                      </div>
                      <Input
                        id={`progress-${goal.id}`}
                        type="range"
                        min="0"
                        max="100"
                        step="5"
                        value={goal.progress}
                        onChange={(e) => handleUpdateGoal(goal.id, "progress", parseInt(e.target.value))}
                        className="w-full"
                      />
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleRemoveGoal(goal.id)}
                  >
                    <X className="h-4 w-4" />
                    <span className="sr-only">Remove goal</span>
                  </Button>
                </div>
              </div>
            ))}

            <div className="rounded-lg border border-dashed p-4">
              <h4 className="mb-4 text-sm font-medium">Add New Goal</h4>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="new-goal-title">Goal Title</Label>
                  <Input
                    id="new-goal-title"
                    placeholder="Enter goal title"
                    value={newGoal.title}
                    onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-goal-description">Description</Label>
                  <Textarea
                    id="new-goal-description"
                    placeholder="Describe your goal"
                    value={newGoal.description}
                    onChange={(e) => setNewGoal({ ...newGoal, description: e.target.value })}
                  />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="new-goal-category">Category</Label>
                    <Select
                      value={newGoal.category}
                      onValueChange={(value) => setNewGoal({ ...newGoal, category: value })}
                    >
                      <SelectTrigger id="new-goal-category">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Technical">Technical</SelectItem>
                        <SelectItem value="Communication">Communication</SelectItem>
                        <SelectItem value="Certification">Certification</SelectItem>
                        <SelectItem value="Leadership">Leadership</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new-goal-deadline">Deadline</Label>
                    <div className="relative">
                      <Input
                        id="new-goal-deadline"
                        type="date"
                        value={newGoal.deadline}
                        onChange={(e) => setNewGoal({ ...newGoal, deadline: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
                <Button
                  onClick={handleAddGoal}
                  disabled={!newGoal.title.trim() || !newGoal.deadline}
                  className="w-full"
                >
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Goal
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {goals.map((goal) => (
              <div key={goal.id} className="rounded-lg border p-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(goal.status)}
                      <h3 className="font-medium">{goal.title}</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">{goal.description}</p>
                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      <Badge variant="secondary" className={getCategoryBadgeColor(goal.category)}>
                        {goal.category}
                      </Badge>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <CalendarIcon className="mr-1 h-3 w-3" />
                        <span>Due {new Date(goal.deadline).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="flex items-center justify-between text-xs">
                    <span>Progress</span>
                    <span>{goal.progress}%</span>
                  </div>
                  <Progress value={goal.progress} className="h-2" />
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-end">
        {isEditing ? (
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
            <Button onClick={() => setIsEditing(false)}>Save Changes</Button>
          </div>
        ) : (
          <Button onClick={() => setIsEditing(true)}>Edit Goals</Button>
        )}
      </CardFooter>
    </Card>
  )
}
