"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PlusCircle, TrendingUp } from "lucide-react"

// Sample skill categories
const skillCategories = [
  { id: "technical", name: "Technical Skills" },
  { id: "soft", name: "Soft Skills" },
  { id: "domain", name: "Domain Knowledge" },
  { id: "tools", name: "Tools & Platforms" },
]

// Sample skills data
const initialSkills = [
  {
    id: "skill-1",
    name: "React",
    category: "technical",
    currentLevel: 75,
    targetLevel: 90,
    progress: [
      { date: "2023-01-15", level: 60 },
      { date: "2023-03-10", level: 65 },
      { date: "2023-04-20", level: 70 },
      { date: "2023-05-15", level: 75 },
    ],
  },
  {
    id: "skill-2",
    name: "TypeScript",
    category: "technical",
    currentLevel: 70,
    targetLevel: 85,
    progress: [
      { date: "2023-01-15", level: 50 },
      { date: "2023-03-10", level: 60 },
      { date: "2023-04-20", level: 65 },
      { date: "2023-05-15", level: 70 },
    ],
  },
  {
    id: "skill-3",
    name: "Node.js",
    category: "technical",
    currentLevel: 65,
    targetLevel: 80,
    progress: [
      { date: "2023-01-15", level: 45 },
      { date: "2023-03-10", level: 55 },
      { date: "2023-04-20", level: 60 },
      { date: "2023-05-15", level: 65 },
    ],
  },
  {
    id: "skill-4",
    name: "Communication",
    category: "soft",
    currentLevel: 80,
    targetLevel: 90,
    progress: [
      { date: "2023-01-15", level: 70 },
      { date: "2023-03-10", level: 75 },
      { date: "2023-04-20", level: 75 },
      { date: "2023-05-15", level: 80 },
    ],
  },
  {
    id: "skill-5",
    name: "Problem Solving",
    category: "soft",
    currentLevel: 85,
    targetLevel: 95,
    progress: [
      { date: "2023-01-15", level: 75 },
      { date: "2023-03-10", level: 80 },
      { date: "2023-04-20", level: 80 },
      { date: "2023-05-15", level: 85 },
    ],
  },
  {
    id: "skill-6",
    name: "Docker",
    category: "tools",
    currentLevel: 60,
    targetLevel: 80,
    progress: [
      { date: "2023-01-15", level: 40 },
      { date: "2023-03-10", level: 50 },
      { date: "2023-04-20", level: 55 },
      { date: "2023-05-15", level: 60 },
    ],
  },
  {
    id: "skill-7",
    name: "AWS",
    category: "tools",
    currentLevel: 55,
    targetLevel: 75,
    progress: [
      { date: "2023-01-15", level: 35 },
      { date: "2023-03-10", level: 45 },
      { date: "2023-04-20", level: 50 },
      { date: "2023-05-15", level: 55 },
    ],
  },
  {
    id: "skill-8",
    name: "E-commerce",
    category: "domain",
    currentLevel: 70,
    targetLevel: 85,
    progress: [
      { date: "2023-01-15", level: 60 },
      { date: "2023-03-10", level: 65 },
      { date: "2023-04-20", level: 65 },
      { date: "2023-05-15", level: 70 },
    ],
  },
]

export function SkillsTracker() {
  const [skills, setSkills] = useState(initialSkills)
  const [activeCategory, setActiveCategory] = useState("all")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [newSkill, setNewSkill] = useState({
    name: "",
    category: "technical",
    currentLevel: 50,
    targetLevel: 80,
  })
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false)
  const [selectedSkill, setSelectedSkill] = useState<any>(null)
  const [newLevel, setNewLevel] = useState(0)

  // Filter skills by category
  const filteredSkills = skills.filter(
    (skill) => activeCategory === "all" || skill.category === activeCategory
  )

  const handleAddSkill = () => {
    if (newSkill.name.trim() === "") return

    const skill = {
      id: `skill-${Date.now()}`,
      name: newSkill.name,
      category: newSkill.category,
      currentLevel: newSkill.currentLevel,
      targetLevel: newSkill.targetLevel,
      progress: [
        {
          date: new Date().toISOString().split("T")[0],
          level: newSkill.currentLevel,
        },
      ],
    }

    setSkills([...skills, skill])
    setNewSkill({
      name: "",
      category: "technical",
      currentLevel: 50,
      targetLevel: 80,
    })
    setIsDialogOpen(false)
  }

  const handleOpenUpdateDialog = (skill: any) => {
    setSelectedSkill(skill)
    setNewLevel(skill.currentLevel)
    setIsUpdateDialogOpen(true)
  }

  const handleUpdateSkill = () => {
    if (!selectedSkill) return

    const today = new Date().toISOString().split("T")[0]

    setSkills(
      skills.map((skill) => {
        if (skill.id === selectedSkill.id) {
          const updatedProgress = [
            ...skill.progress,
            { date: today, level: newLevel },
          ]
          return {
            ...skill,
            currentLevel: newLevel,
            progress: updatedProgress,
          }
        }
        return skill
      })
    )

    setIsUpdateDialogOpen(false)
    setSelectedSkill(null)
  }

  const getSkillLevelText = (level: number) => {
    if (level >= 90) return "Expert"
    if (level >= 70) return "Advanced"
    if (level >= 40) return "Intermediate"
    return "Beginner"
  }

  const getProgressColor = (current: number, target: number) => {
    const ratio = current / target
    if (ratio >= 0.9) return "bg-green-500"
    if (ratio >= 0.7) return "bg-blue-500"
    if (ratio >= 0.5) return "bg-yellow-500"
    return "bg-red-500"
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "technical":
        return "bg-blue-100 text-blue-800 dark:bg-blue-800/20 dark:text-blue-300"
      case "soft":
        return "bg-green-100 text-green-800 dark:bg-green-800/20 dark:text-green-300"
      case "domain":
        return "bg-purple-100 text-purple-800 dark:bg-purple-800/20 dark:text-purple-300"
      case "tools":
        return "bg-amber-100 text-amber-800 dark:bg-amber-800/20 dark:text-amber-300"
      default:
        return ""
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div>
          <CardTitle>Skills Tracker</CardTitle>
          <CardDescription>Track and improve your professional skills</CardDescription>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Skill
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Skill</DialogTitle>
              <DialogDescription>
                Track a new skill you want to develop
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="skill-name">Skill Name</Label>
                <Input
                  id="skill-name"
                  placeholder="Enter skill name"
                  value={newSkill.name}
                  onChange={(e) =>
                    setNewSkill({ ...newSkill, name: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="skill-category">Category</Label>
                <Select
                  value={newSkill.category}
                  onValueChange={(value) =>
                    setNewSkill({ ...newSkill, category: value })
                  }
                >
                  <SelectTrigger id="skill-category">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {skillCategories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="current-level">
                    Current Level: {newSkill.currentLevel}%
                  </Label>
                  <span className="text-sm text-muted-foreground">
                    {getSkillLevelText(newSkill.currentLevel)}
                  </span>
                </div>
                <Slider
                  id="current-level"
                  min={0}
                  max={100}
                  step={5}
                  value={[newSkill.currentLevel]}
                  onValueChange={(value) =>
                    setNewSkill({ ...newSkill, currentLevel: value[0] })
                  }
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="target-level">
                    Target Level: {newSkill.targetLevel}%
                  </Label>
                  <span className="text-sm text-muted-foreground">
                    {getSkillLevelText(newSkill.targetLevel)}
                  </span>
                </div>
                <Slider
                  id="target-level"
                  min={0}
                  max={100}
                  step={5}
                  value={[newSkill.targetLevel]}
                  onValueChange={(value) =>
                    setNewSkill({ ...newSkill, targetLevel: value[0] })
                  }
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleAddSkill}
                disabled={!newSkill.name.trim()}
              >
                Add Skill
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={isUpdateDialogOpen} onOpenChange={setIsUpdateDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Update Skill Progress</DialogTitle>
              <DialogDescription>
                Record your progress for {selectedSkill?.name}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="new-level">
                    New Level: {newLevel}%
                  </Label>
                  <span className="text-sm text-muted-foreground">
                    {getSkillLevelText(newLevel)}
                  </span>
                </div>
                <Slider
                  id="new-level"
                  min={0}
                  max={100}
                  step={5}
                  value={[newLevel]}
                  onValueChange={(value) => setNewLevel(value[0])}
                />
              </div>
              <div className="rounded-lg border p-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Current Level</span>
                  <span className="text-sm">{selectedSkill?.currentLevel}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Target Level</span>
                  <span className="text-sm">{selectedSkill?.targetLevel}%</span>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsUpdateDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleUpdateSkill}>
                Update Progress
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent className="space-y-4">
        <Tabs value={activeCategory} onValueChange={setActiveCategory}>
          <TabsList className="w-full">
            <TabsTrigger value="all">All Skills</TabsTrigger>
            {skillCategories.map((category) => (
              <TabsTrigger key={category.id} value={category.id}>
                {category.name}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredSkills.map((skill) => (
            <Card key={skill.id} className="overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div>
                    <Badge
                      variant="outline"
                      className={`mb-2 ${getCategoryColor(skill.category)}`}
                    >
                      {skillCategories.find((c) => c.id === skill.category)?.name}
                    </Badge>
                    <CardTitle className="text-lg">{skill.name}</CardTitle>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-1"
                    onClick={() => handleOpenUpdateDialog(skill)}
                  >
                    <TrendingUp className="h-4 w-4" />
                    Update
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="space-y-4">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span>Current: {skill.currentLevel}%</span>
                      <span className="text-muted-foreground">
                        {getSkillLevelText(skill.currentLevel)}
                      </span>
                    </div>
                    <Progress
                      value={(skill.currentLevel / skill.targetLevel) * 100}
                      className={`h-2 ${getProgressColor(
                        skill.currentLevel,
                        skill.targetLevel
                      )}`}
                    />
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Target: {skill.targetLevel}%</span>
                    <span className="text-muted-foreground">
                      {getSkillLevelText(skill.targetLevel)}
                    </span>
                  </div>
                </div>
              </CardContent>
              <div className="border-t px-6 py-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">Progress History</span>
                  <span className="text-muted-foreground">
                    {skill.progress.length} updates
                  </span>
                </div>
                <div className="mt-2 flex h-10 items-end gap-1">
                  {skill.progress.map((entry, index) => (
                    <div
                      key={index}
                      className="relative flex-1 rounded-t bg-primary/20"
                      style={{ height: `${(entry.level / 100) * 100}%` }}
                      title={`${entry.date}: ${entry.level}%`}
                    />
                  ))}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
