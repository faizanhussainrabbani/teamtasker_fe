"use client"

import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { PlusCircle, X, Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { useCurrentUserProfile, useUpdateUserSkills } from "@/lib/api/hooks/useUsers"
import { UserSkill } from "@/lib/api/types/users"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/context/auth-context"
import { getAuthToken } from "@/lib/auth"

interface LocalSkill {
  id?: number;
  name: string;
  level: number;
  yearsOfExperience?: number;
}

export function ProfileSkills() {
  const [skills, setSkills] = useState<LocalSkill[]>([])
  const [isEditing, setIsEditing] = useState(false)
  const [newSkill, setNewSkill] = useState<LocalSkill>({ name: "", level: 50, yearsOfExperience: 1 })
  const { toast } = useToast()
  const { user, isAuthenticated } = useAuth()

  // Fetch current user profile
  const { data: profile, isLoading, error, refetch } = useCurrentUserProfile()
  const updateSkillsMutation = useUpdateUserSkills()

  // Debug logging
  console.log('ProfileSkills component mounted/updated')
  console.log('Auth user:', user)
  console.log('Is authenticated:', isAuthenticated)
  console.log('Auth token:', getAuthToken())
  console.log('Profile data:', profile)
  console.log('Is loading:', isLoading)
  console.log('Error:', error)
  console.log('Skills state:', skills)

  // Add effect to log when component mounts
  useEffect(() => {
    console.log('ProfileSkills component mounted - useEffect triggered')
    console.log('Auth token on mount:', getAuthToken())
  }, [])

  // Update skills when profile loads
  useEffect(() => {
    if (profile?.skills) {
      setSkills(profile.skills.map(skill => ({
        id: skill.id,
        name: skill.name,
        level: skill.level,
        yearsOfExperience: skill.yearsOfExperience
      })))
    }
  }, [profile])

  const handleAddSkill = () => {
    if (newSkill.name.trim() === "") return
    const skillToAdd = {
      ...newSkill,
      id: Date.now() // Temporary ID for new skills
    }
    setSkills([...skills, skillToAdd])
    setNewSkill({ name: "", level: 50, yearsOfExperience: 1 })
  }

  const handleRemoveSkill = (skillName: string) => {
    setSkills(skills.filter((skill) => skill.name !== skillName))
  }

  const handleSkillLevelChange = (skillName: string, level: number) => {
    setSkills(
      skills.map((skill) => (skill.name === skillName ? { ...skill, level } : skill))
    )
  }

  const handleYearsChange = (skillName: string, years: number) => {
    setSkills(
      skills.map((skill) => (skill.name === skillName ? { ...skill, yearsOfExperience: years } : skill))
    )
  }

  const handleSave = async () => {
    try {
      const skillsToSave: UserSkill[] = skills.map(skill => ({
        id: skill.id || 0,
        name: skill.name,
        level: skill.level,
        yearsOfExperience: skill.yearsOfExperience || 1
      }))

      await updateSkillsMutation.mutateAsync(skillsToSave)
      setIsEditing(false)
      toast({
        title: "Skills updated",
        description: "Your skills have been successfully updated.",
      })
      refetch() // Refresh the profile data
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update skills. Please try again.",
        variant: "destructive",
      })
    }
  }

  const getSkillLevelText = (level: number) => {
    if (level >= 90) return "Expert"
    if (level >= 70) return "Advanced"
    if (level >= 40) return "Intermediate"
    return "Beginner"
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Loading skills...</span>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-8">
          <div className="text-center">
            <p className="text-muted-foreground">Failed to load skills</p>
            <Button onClick={() => refetch()} className="mt-2">
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Skills & Expertise</CardTitle>
        <CardDescription>Manage your technical skills and proficiency levels</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Debug section */}
        <div className="p-4 bg-gray-100 rounded-md">
          <h4 className="font-semibold mb-2">Debug Info:</h4>
          <p><strong>Profile data:</strong> {profile ? 'Loaded' : 'Not loaded'}</p>
          <p><strong>Skills from profile:</strong> {profile?.skills?.length || 0} skills</p>
          <p><strong>Local skills state:</strong> {skills.length} skills</p>
          <p><strong>Is loading:</strong> {isLoading ? 'Yes' : 'No'}</p>
          <p><strong>Error:</strong> {error ? 'Yes' : 'No'}</p>
          {profile?.skills && (
            <div>
              <strong>Raw skills data:</strong>
              <pre className="text-xs mt-1">{JSON.stringify(profile.skills, null, 2)}</pre>
            </div>
          )}
        </div>

        {isEditing ? (
          <div className="space-y-4">
            {skills.map((skill) => (
              <div key={skill.name} className="space-y-3 rounded-lg border p-4">
                <div className="flex items-center justify-between">
                  <Label className="text-base font-medium">{skill.name}</Label>
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
                <div className="space-y-3">
                  <div>
                    <Label className="text-sm text-muted-foreground">Proficiency Level ({skill.level}%)</Label>
                    <div className="flex items-center gap-4 mt-2">
                      <Slider
                        value={[skill.level]}
                        min={0}
                        max={100}
                        step={5}
                        className="flex-1"
                        onValueChange={(value) => handleSkillLevelChange(skill.name, value[0])}
                      />
                      <span className="w-20 text-right text-sm font-medium">{getSkillLevelText(skill.level)}</span>
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground">Years of Experience</Label>
                    <div className="flex items-center gap-4 mt-2">
                      <Slider
                        value={[skill.yearsOfExperience || 1]}
                        min={1}
                        max={20}
                        step={1}
                        className="flex-1"
                        onValueChange={(value) => handleYearsChange(skill.name, value[0])}
                      />
                      <span className="w-20 text-right text-sm font-medium">{skill.yearsOfExperience || 1} year{(skill.yearsOfExperience || 1) !== 1 ? 's' : ''}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <div className="mt-6 space-y-4 rounded-lg border border-dashed p-4">
              <h4 className="text-sm font-medium">Add New Skill</h4>
              <div className="space-y-2">
                <Label htmlFor="skill-name">Skill Name</Label>
                <Input
                  id="skill-name"
                  placeholder="e.g., React, Python, Project Management"
                  value={newSkill.name}
                  onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Proficiency Level ({newSkill.level}%)</Label>
                <div className="flex items-center gap-4">
                  <Slider
                    value={[newSkill.level]}
                    min={0}
                    max={100}
                    step={5}
                    className="flex-1"
                    onValueChange={(value) => setNewSkill({ ...newSkill, level: value[0] })}
                  />
                  <span className="w-20 text-right text-sm font-medium">{getSkillLevelText(newSkill.level)}</span>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Years of Experience</Label>
                <div className="flex items-center gap-4">
                  <Slider
                    value={[newSkill.yearsOfExperience || 1]}
                    min={1}
                    max={20}
                    step={1}
                    className="flex-1"
                    onValueChange={(value) => setNewSkill({ ...newSkill, yearsOfExperience: value[0] })}
                  />
                  <span className="w-20 text-right text-sm font-medium">{newSkill.yearsOfExperience || 1} year{(newSkill.yearsOfExperience || 1) !== 1 ? 's' : ''}</span>
                </div>
              </div>
              <Button onClick={handleAddSkill} disabled={!newSkill.name.trim()} className="w-full">
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Skill
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {skills.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No skills added yet</p>
                <Button onClick={() => setIsEditing(true)} className="mt-2">
                  Add Your First Skill
                </Button>
              </div>
            ) : (
              <>
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill) => (
                    <Badge key={skill.name} variant="secondary" className="px-3 py-1 text-sm">
                      {skill.name}
                    </Badge>
                  ))}
                </div>

                <div className="space-y-4">
                  {skills.map((skill) => (
                    <div key={skill.name} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{skill.name}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground">
                            {skill.yearsOfExperience || 1} year{(skill.yearsOfExperience || 1) !== 1 ? 's' : ''}
                          </span>
                          <Badge variant="secondary" className="text-xs">
                            {getSkillLevelText(skill.level)}
                          </Badge>
                        </div>
                      </div>
                      <Progress value={skill.level} className="h-2" />
                      <div className="text-xs text-muted-foreground text-right">
                        {skill.level}% proficiency
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-end">
        {isEditing ? (
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setIsEditing(false)}
              disabled={updateSkillsMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={updateSkillsMutation.isPending}
            >
              {updateSkillsMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </Button>
          </div>
        ) : (
          <Button onClick={() => setIsEditing(true)}>Edit Skills</Button>
        )}
      </CardFooter>
    </Card>
  )
}
