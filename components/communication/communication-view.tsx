"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TeamChat } from "@/components/communication/team-chat"
import { DirectMessages } from "@/components/communication/direct-messages"
import { Announcements } from "@/components/communication/announcements"

export function CommunicationView() {
  return (
    <Tabs defaultValue="team-chat" className="space-y-4">
      <TabsList>
        <TabsTrigger value="team-chat">Team Chat</TabsTrigger>
        <TabsTrigger value="direct-messages">Direct Messages</TabsTrigger>
        <TabsTrigger value="announcements">Announcements</TabsTrigger>
      </TabsList>
      <TabsContent value="team-chat">
        <TeamChat />
      </TabsContent>
      <TabsContent value="direct-messages">
        <DirectMessages />
      </TabsContent>
      <TabsContent value="announcements">
        <Announcements />
      </TabsContent>
    </Tabs>
  )
}
