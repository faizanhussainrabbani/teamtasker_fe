"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { PlusCircle, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"

// Sample skills data
const initialSkills = [
  { name: "React", level: 90 },
  { name: "TypeScript", level: 85 },
  { name: "Node.js", level: 80 },
  { name: "GraphQL", level: 75 },
  { name: "AWS", level: 70 },
  { name: "Docker", level: 65 },
  { name: "CI/CD", level: 60 },
  { name: "UI/UX", level: 55 },
]

export function ProfileSkills() {
  const [skills, setSkills] = useState(initialSkills)
  const [isEditing, setIsEditing] = useState(false)
  const [newSkill, setNewSkill] = useState({ name: "", level: 50 })

  const handleAddSkill = () => {
    if (newSkill.name.trim() === "") return
    setSkills([...skills, newSkill])
    setNewSkill({ name: "", level: 50 })
  }

  const handleRemoveSkill = (skillName: string) => {
    setSkills(skills.filter((skill) => skill.name !== skillName))
  }

  const handleSkillLevelChange = (skillName: string, level: number) => {
    setSkills(
      skills.map((skill) => (skill.name === skillName ? { ...skill, level } : skill))
    )
  }

  const getSkillLevelText = (level: number) => {
    if (level >= 90) return "Expert"
    if (level >= 70) return "Advanced"
    if (level >= 40) return "Intermediate"
    return "Beginner"
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Skills & Expertise</CardTitle>
        <CardDescription>Manage your technical skills and proficiency levels</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {isEditing ? (
          <div className="space-y-4">
            {skills.map((skill) => (
              <div key={skill.name} className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>{skill.name}</Label>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleRemoveSkill(skill.name)}
                  >
                    <X className="h-4 w-4" />
                    <span className="sr-only">Remove skill</span>
                  </Button>
                </div>
                <div className="flex items-center gap-4">
                  <Slider
                    value={[skill.level]}
                    min={0}
                    max={100}
                    step={5}
                    className="flex-1"
                    onValueChange={(value) => handleSkillLevelChange(skill.name, value[0])}
                  />
                  <span className="w-16 text-right text-sm">{getSkillLevelText(skill.level)}</span>
                </div>
              </div>
            ))}

            <div className="mt-6 space-y-2">
              <Label>Add New Skill</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="Skill name"
                  value={newSkill.name}
                  onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
                  className="flex-1"
                />
                <Button onClick={handleAddSkill} disabled={!newSkill.name.trim()}>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add
                </Button>
              </div>
              <div className="flex items-center gap-4 pt-2">
                <Slider
                  value={[newSkill.level]}
                  min={0}
                  max={100}
                  step={5}
                  className="flex-1"
                  onValueChange={(value) => setNewSkill({ ...newSkill, level: value[0] })}
                />
                <span className="w-16 text-right text-sm">{getSkillLevelText(newSkill.level)}</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex flex-wrap gap-2">
              {skills.map((skill) => (
                <Badge key={skill.name} variant="secondary" className="px-3 py-1 text-sm">
                  {skill.name}
                </Badge>
              ))}
            </div>

            <div className="space-y-4">
              {skills.map((skill) => (
                <div key={skill.name} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{skill.name}</span>
                    <span className="text-xs text-muted-foreground">{getSkillLevelText(skill.level)}</span>
                  </div>
                  <Progress value={skill.level} className="h-2" />
                </div>
              ))}
            </div>
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
          <Button onClick={() => setIsEditing(true)}>Edit Skills</Button>
        )}
      </CardFooter>
    </Card>
  )
}
