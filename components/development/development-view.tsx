"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LearningResources } from "@/components/development/learning-resources"
import { SkillsTracker } from "@/components/development/skills-tracker"
import { CareerPath } from "@/components/development/career-path"

export function DevelopmentView() {
  return (
    <Tabs defaultValue="learning" className="space-y-4">
      <TabsList>
        <TabsTrigger value="learning">Learning Resources</TabsTrigger>
        <TabsTrigger value="skills">Skills Tracker</TabsTrigger>
        <TabsTrigger value="career">Career Path</TabsTrigger>
      </TabsList>
      <TabsContent value="learning">
        <LearningResources />
      </TabsContent>
      <TabsContent value="skills">
        <SkillsTracker />
      </TabsContent>
      <TabsContent value="career">
        <CareerPath />
      </TabsContent>
    </Tabs>
  )
}
