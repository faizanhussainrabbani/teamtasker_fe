"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TeamWorkloadView } from "@/components/team/team-workload-view"
import { TeamSkillsMatrix } from "@/components/team/team-skills-matrix"
import { TeamCapacityView } from "@/components/team/team-capacity-view"

export function TeamOverview() {
  const [activeTab, setActiveTab] = useState("workload")

  return (
    <Card>
      <CardHeader>
        <CardTitle>Team Performance</CardTitle>
        <CardDescription>Analyze workload distribution, skills, and capacity across your team</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="workload" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="workload">Workload Distribution</TabsTrigger>
            <TabsTrigger value="skills">Skills Matrix</TabsTrigger>
            <TabsTrigger value="capacity">Capacity Planning</TabsTrigger>
          </TabsList>
          <TabsContent value="workload">
            <TeamWorkloadView />
          </TabsContent>
          <TabsContent value="skills">
            <TeamSkillsMatrix />
          </TabsContent>
          <TabsContent value="capacity">
            <TeamCapacityView />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
