"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TasksList } from "@/components/tasks/tasks-list"
import { TasksKanban } from "@/components/tasks/tasks-kanban"
import { TasksCalendar } from "@/components/tasks/tasks-calendar"
import { TasksProvider } from "@/context/tasks-context"

export function TasksView() {
  return (
    <TasksProvider>
      <Tabs defaultValue="list" className="space-y-4">
        <TabsList>
          <TabsTrigger value="list">List View</TabsTrigger>
          <TabsTrigger value="kanban">Kanban Board</TabsTrigger>
          <TabsTrigger value="calendar">Calendar</TabsTrigger>
        </TabsList>
        <TabsContent value="list">
          <TasksList />
        </TabsContent>
        <TabsContent value="kanban">
          <TasksKanban />
        </TabsContent>
        <TabsContent value="calendar">
          <TasksCalendar />
        </TabsContent>
      </Tabs>
    </TasksProvider>
  )
}
