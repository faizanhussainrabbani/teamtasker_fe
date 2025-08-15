"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProfileInfo } from "@/components/profile/profile-info"
import { ProfileSkills } from "@/components/profile/profile-skills"
import { ProfileDevelopment } from "@/components/profile/profile-development"

export function ProfileView() {
  const [activeTab, setActiveTab] = useState("info")

  console.log('ProfileView rendered, activeTab:', activeTab)

  return (
    <Tabs defaultValue="info" className="space-y-4" onValueChange={setActiveTab}>
      <TabsList>
        <TabsTrigger value="info">Profile Information</TabsTrigger>
        <TabsTrigger value="skills">Skills & Expertise</TabsTrigger>
        <TabsTrigger value="development">Development Plan</TabsTrigger>
      </TabsList>
      <TabsContent value="info">
        <ProfileInfo />
      </TabsContent>
      <TabsContent value="skills" forceMount={activeTab === "skills"}>
        {activeTab === "skills" && <ProfileSkills />}
      </TabsContent>
      <TabsContent value="development">
        <ProfileDevelopment />
      </TabsContent>
    </Tabs>
  )
}
