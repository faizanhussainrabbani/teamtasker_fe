"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProfileInfo } from "@/components/profile/profile-info"
import { ProfileSkills } from "@/components/profile/profile-skills"
import { ProfileDevelopment } from "@/components/profile/profile-development"

export function ProfileView() {
  return (
    <Tabs defaultValue="info" className="space-y-4">
      <TabsList>
        <TabsTrigger value="info">Profile Information</TabsTrigger>
        <TabsTrigger value="skills">Skills & Expertise</TabsTrigger>
        <TabsTrigger value="development">Development Plan</TabsTrigger>
      </TabsList>
      <TabsContent value="info">
        <ProfileInfo />
      </TabsContent>
      <TabsContent value="skills">
        <ProfileSkills />
      </TabsContent>
      <TabsContent value="development">
        <ProfileDevelopment />
      </TabsContent>
    </Tabs>
  )
}
