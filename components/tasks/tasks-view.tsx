"use client"

import React, { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TasksList } from "@/components/tasks/tasks-list"
import { TasksKanban } from "@/components/tasks/tasks-kanban"
import { TasksCalendar } from "@/components/tasks/tasks-calendar"
import { TasksProvider } from "@/context/tasks-context"

export function TasksView() {
  // Use state to track the active tab
  const [activeTab, setActiveTab] = useState("list");

  // Log when the component mounts and unmounts
  React.useEffect(() => {
    console.log("TasksView mounted");

    return () => {
      console.log("TasksView unmounted");
    };
  }, []);

  return (
    <TasksProvider>
      <Tabs
        defaultValue="list"
        className="space-y-4"
        onValueChange={(value) => {
          console.log("Tab changed to:", value);
          setActiveTab(value);
        }}
      >
        <TabsList>
          <TabsTrigger value="list">List View</TabsTrigger>
          <TabsTrigger value="kanban">Kanban Board</TabsTrigger>
          <TabsTrigger value="calendar">Calendar</TabsTrigger>
        </TabsList>

        {/* Only render the active tab content to avoid unnecessary loading */}
        {activeTab === "list" && (
          <TabsContent value="list" forceMount>
            <TasksList />
          </TabsContent>
        )}

        {activeTab === "kanban" && (
          <TabsContent value="kanban" forceMount>
            <TasksKanban />
          </TabsContent>
        )}

        {activeTab === "calendar" && (
          <TabsContent value="calendar" forceMount>
            <TasksCalendar />
          </TabsContent>
        )}
      </Tabs>
    </TasksProvider>
  )
}
