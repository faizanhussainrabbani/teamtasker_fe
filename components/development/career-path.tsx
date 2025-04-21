"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckCircle2, ChevronRight, Clock, Lightbulb, Milestone, Target } from "lucide-react"

// Sample career path data
const careerPathData = {
  currentRole: {
    title: "Senior Frontend Developer",
    level: "L4",
    timeInRole: "1 year, 3 months",
    skills: [
      { name: "React", level: 85 },
      { name: "TypeScript", level: 80 },
      { name: "UI/UX Design", level: 75 },
      { name: "Performance Optimization", level: 70 },
      { name: "Testing", level: 65 },
    ],
  },
  nextRole: {
    title: "Lead Frontend Developer",
    level: "L5",
    estimatedTimeToReach: "1-2 years",
    requiredSkills: [
      { name: "React", level: 90, current: 85 },
      { name: "TypeScript", level: 85, current: 80 },
      { name: "UI/UX Design", level: 85, current: 75 },
      { name: "Performance Optimization", level: 85, current: 70 },
      { name: "Testing", level: 80, current: 65 },
      { name: "Team Leadership", level: 80, current: 60 },
      { name: "Project Management", level: 75, current: 55 },
      { name: "Mentoring", level: 80, current: 65 },
    ],
  },
  futureRoles: [
    {
      title: "Engineering Manager",
      level: "L6",
      timeframe: "3-5 years",
      keySkills: ["Leadership", "Project Management", "Team Building", "Strategic Planning"],
    },
    {
      title: "Director of Frontend Engineering",
      level: "L7",
      timeframe: "5-8 years",
      keySkills: ["Organizational Leadership", "Technical Strategy", "Cross-team Collaboration", "Business Acumen"],
    },
  ],
  milestones: [
    {
      id: "milestone-1",
      title: "Lead a Major Feature Implementation",
      description: "Take ownership of a significant feature from design to deployment",
      status: "completed",
      completedDate: "2023-02-15",
    },
    {
      id: "milestone-2",
      title: "Mentor Junior Developers",
      description: "Regularly mentor at least 2 junior developers",
      status: "in-progress",
      progress: 60,
    },
    {
      id: "milestone-3",
      title: "Improve Team's Testing Practices",
      description: "Implement and document improved testing strategies",
      status: "in-progress",
      progress: 40,
    },
    {
      id: "milestone-4",
      title: "Present at a Technical Conference",
      description: "Prepare and deliver a presentation at an industry conference",
      status: "planned",
    },
    {
      id: "milestone-5",
      title: "Lead a Cross-functional Project",
      description: "Successfully lead a project involving multiple teams",
      status: "planned",
    },
  ],
  recommendations: [
    {
      id: "rec-1",
      title: "Advanced React Patterns Course",
      type: "course",
      priority: "high",
      link: "https://example.com/course",
    },
    {
      id: "rec-2",
      title: "Join the Frontend Architecture Committee",
      type: "opportunity",
      priority: "medium",
    },
    {
      id: "rec-3",
      title: "Technical Leadership Workshop",
      type: "workshop",
      priority: "medium",
      date: "2023-07-15",
    },
    {
      id: "rec-4",
      title: "Volunteer to Lead the Next Sprint Planning",
      type: "opportunity",
      priority: "high",
    },
    {
      id: "rec-5",
      title: "Read 'The Manager's Path' by Camille Fournier",
      type: "book",
      priority: "low",
    },
  ],
}

export function CareerPath() {
  const [activeTab, setActiveTab] = useState("overview")

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="h-5 w-5 text-green-500" />
      case "in-progress":
        return <Clock className="h-5 w-5 text-blue-500" />
      default:
        return <Target className="h-5 w-5 text-gray-400" />
    }
  }

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high":
        return <Badge variant="destructive">High Priority</Badge>
      case "medium":
        return <Badge variant="default">Medium Priority</Badge>
      case "low":
        return <Badge variant="outline">Low Priority</Badge>
      default:
        return null
    }
  }

  const getRecommendationIcon = (type: string) => {
    switch (type) {
      case "course":
        return <Badge variant="outline" className="bg-blue-100 text-blue-800 dark:bg-blue-800/20 dark:text-blue-300">Course</Badge>
      case "opportunity":
        return <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-800/20 dark:text-green-300">Opportunity</Badge>
      case "workshop":
        return <Badge variant="outline" className="bg-purple-100 text-purple-800 dark:bg-purple-800/20 dark:text-purple-300">Workshop</Badge>
      case "book":
        return <Badge variant="outline" className="bg-amber-100 text-amber-800 dark:bg-amber-800/20 dark:text-amber-300">Book</Badge>
      default:
        return null
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Career Development Path</CardTitle>
        <CardDescription>Track your career progression and growth opportunities</CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full justify-start rounded-none border-b bg-transparent p-0">
            <TabsTrigger
              value="overview"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger
              value="skills"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
            >
              Skills Gap
            </TabsTrigger>
            <TabsTrigger
              value="milestones"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
            >
              Milestones
            </TabsTrigger>
            <TabsTrigger
              value="recommendations"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
            >
              Recommendations
            </TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="p-6">
            <div className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Current Role</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-xl font-bold">{careerPathData.currentRole.title}</h3>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{careerPathData.currentRole.level}</Badge>
                          <span className="text-sm text-muted-foreground">
                            {careerPathData.currentRole.timeInRole}
                          </span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium">Key Skills</h4>
                        <div className="flex flex-wrap gap-2">
                          {careerPathData.currentRole.skills.map((skill) => (
                            <Badge key={skill.name} variant="secondary">
                              {skill.name}: {skill.level}%
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Next Role</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-xl font-bold">{careerPathData.nextRole.title}</h3>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{careerPathData.nextRole.level}</Badge>
                          <span className="text-sm text-muted-foreground">
                            Est. {careerPathData.nextRole.estimatedTimeToReach}
                          </span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium">Required Skills</h4>
                        <div className="flex flex-wrap gap-2">
                          {careerPathData.nextRole.requiredSkills.slice(0, 4).map((skill) => (
                            <Badge key={skill.name} variant="secondary">
                              {skill.name}: {skill.level}%
                            </Badge>
                          ))}
                          {careerPathData.nextRole.requiredSkills.length > 4 && (
                            <Badge variant="outline">+{careerPathData.nextRole.requiredSkills.length - 4} more</Badge>
                          )}
                        </div>
                      </div>
                      <Button variant="outline" className="w-full" onClick={() => setActiveTab("skills")}>
                        View Skills Gap Analysis
                        <ChevronRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Career Trajectory</h3>
                <div className="relative">
                  <div className="absolute left-4 top-0 h-full w-0.5 bg-border" />
                  <div className="space-y-8">
                    <div className="relative pl-10">
                      <div className="absolute left-0 top-1 flex h-8 w-8 items-center justify-center rounded-full border bg-background">
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                      </div>
                      <h4 className="text-base font-medium">{careerPathData.currentRole.title}</h4>
                      <p className="text-sm text-muted-foreground">Current Role</p>
                    </div>
                    <div className="relative pl-10">
                      <div className="absolute left-0 top-1 flex h-8 w-8 items-center justify-center rounded-full border bg-background">
                        <Target className="h-4 w-4 text-blue-500" />
                      </div>
                      <h4 className="text-base font-medium">{careerPathData.nextRole.title}</h4>
                      <p className="text-sm text-muted-foreground">
                        {careerPathData.nextRole.estimatedTimeToReach} from now
                      </p>
                    </div>
                    {careerPathData.futureRoles.map((role, index) => (
                      <div key={index} className="relative pl-10">
                        <div className="absolute left-0 top-1 flex h-8 w-8 items-center justify-center rounded-full border bg-background">
                          <Target className="h-4 w-4 text-gray-400" />
                        </div>
                        <h4 className="text-base font-medium">{role.title}</h4>
                        <p className="text-sm text-muted-foreground">{role.timeframe} from now</p>
                        <div className="mt-1 flex flex-wrap gap-1">
                          {role.keySkills.map((skill) => (
                            <Badge key={skill} variant="outline" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="skills" className="p-6">
            <div className="space-y-6">
              <div className="rounded-lg border p-4">
                <h3 className="text-lg font-medium">Skills Gap Analysis</h3>
                <p className="text-sm text-muted-foreground">
                  Compare your current skill levels with those required for your next role
                </p>
              </div>

              <div className="space-y-4">
                {careerPathData.nextRole.requiredSkills.map((skill) => (
                  <div key={skill.name} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">{skill.name}</h4>
                      <div className="text-sm">
                        <span className="text-muted-foreground">Current: </span>
                        <span className="font-medium">{skill.current}%</span>
                        <span className="mx-1 text-muted-foreground">→</span>
                        <span className="text-muted-foreground">Required: </span>
                        <span className="font-medium">{skill.level}%</span>
                      </div>
                    </div>
                    <div className="relative h-2 overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full bg-primary"
                        style={{ width: `${(skill.current / skill.level) * 100}%` }}
                      />
                      <div
                        className="absolute top-0 h-full w-px bg-white"
                        style={{ left: `${skill.current}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Gap: {skill.level - skill.current}%</span>
                      <span>
                        {skill.current >= skill.level
                          ? "Meets requirement"
                          : `${Math.round((skill.current / skill.level) * 100)}% of target`}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="rounded-lg border bg-muted p-4">
                <div className="flex items-start gap-3">
                  <Lightbulb className="mt-1 h-5 w-5 text-yellow-500" />
                  <div>
                    <h4 className="font-medium">Recommendation</h4>
                    <p className="text-sm text-muted-foreground">
                      Focus on improving your Team Leadership and Project Management skills to
                      accelerate your path to the Lead Frontend Developer role.
                    </p>
                    <Button
                      variant="link"
                      className="px-0 text-sm"
                      onClick={() => setActiveTab("recommendations")}
                    >
                      View personalized recommendations
                      <ChevronRight className="ml-1 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="milestones" className="p-6">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Career Milestones</h3>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <div className="h-3 w-3 rounded-full bg-green-500" />
                    <span className="text-xs">Completed</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="h-3 w-3 rounded-full bg-blue-500" />
                    <span className="text-xs">In Progress</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="h-3 w-3 rounded-full bg-gray-300" />
                    <span className="text-xs">Planned</span>
                  </div>
                </div>
              </div>

              <div className="relative">
                <div className="absolute left-4 top-0 h-full w-0.5 bg-border" />
                <div className="space-y-8">
                  {careerPathData.milestones.map((milestone) => (
                    <div key={milestone.id} className="relative pl-10">
                      <div className="absolute left-0 top-1 flex h-8 w-8 items-center justify-center rounded-full border bg-background">
                        {getStatusIcon(milestone.status)}
                      </div>
                      <div className="space-y-1">
                        <h4 className="font-medium">{milestone.title}</h4>
                        <p className="text-sm text-muted-foreground">{milestone.description}</p>
                        {milestone.status === "completed" && milestone.completedDate && (
                          <p className="text-xs text-muted-foreground">
                            Completed on {new Date(milestone.completedDate).toLocaleDateString()}
                          </p>
                        )}
                        {milestone.status === "in-progress" && milestone.progress && (
                          <div className="pt-1">
                            <div className="flex items-center justify-between text-xs">
                              <span>Progress</span>
                              <span>{milestone.progress}%</span>
                            </div>
                            <Progress value={milestone.progress} className="h-1.5" />
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="recommendations" className="p-6">
            <div className="space-y-6">
              <div className="rounded-lg border p-4">
                <h3 className="text-lg font-medium">Personalized Recommendations</h3>
                <p className="text-sm text-muted-foreground">
                  Based on your career goals and skills gap analysis
                </p>
              </div>

              <div className="space-y-4">
                {careerPathData.recommendations.map((recommendation) => (
                  <Card key={recommendation.id}>
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between">
                        <div>
                          {getRecommendationIcon(recommendation.type)}
                          <CardTitle className="mt-2 text-base">{recommendation.title}</CardTitle>
                        </div>
                        {getPriorityBadge(recommendation.priority)}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        {recommendation.date && (
                          <span className="text-xs text-muted-foreground">
                            Date: {new Date(recommendation.date).toLocaleDateString()}
                          </span>
                        )}
                        {recommendation.link && (
                          <Button variant="link" className="h-auto p-0 text-sm" asChild>
                            <a href={recommendation.link} target="_blank" rel="noopener noreferrer">
                              View Resource
                              <ChevronRight className="ml-1 h-4 w-4" />
                            </a>
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
