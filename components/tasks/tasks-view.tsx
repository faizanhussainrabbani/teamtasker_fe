"use client"

import React, { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TasksList } from "@/components/tasks/tasks-list"
import { TasksKanban } from "@/components/tasks/tasks-kanban"
import { TasksCalendar } from "@/components/tasks/tasks-calendar"
import { TasksProvider } from "@/context/tasks-context"
import { LoadingStateProvider, useLoadingState } from "@/context/loading-state-context"
import { LoadingState } from "@/components/ui/api-state"

// Inner component that uses the loading state
function TasksViewInner() {
  // Use state to track the active tab
  const [activeTab, setActiveTab] = useState("list");
  const { resetLoadingState } = useLoadingState();

  // Reset loading state when component mounts or unmounts
  useEffect(() => {
    console.log("TasksViewInner mounted");
    resetLoadingState();

    return () => {
      console.log("TasksViewInner unmounted");
      resetLoadingState();
    };
  }, [resetLoadingState]);

  return (
    <TasksProvider>
      <Tabs
        defaultValue="list"
        className="space-y-4"
        onValueChange={(value) => {
          console.log("Tab changed to:", value);
          setActiveTab(value);
          // Reset loading state when changing tabs
          resetLoadingState();
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

// Main component that provides the loading state context
export function TasksView() {
  // Reset loading state when navigating to this page
  useEffect(() => {
    console.log("TasksView mounted");

    return () => {
      console.log("TasksView unmounted");
    };
  }, []);

  return (
    <LoadingStateProvider>
      <TasksViewContent />
    </LoadingStateProvider>
  )
}

// Component that shows loading state or content
function TasksViewContent() {
  const { isLoading } = useLoadingState();

  return (
    <>
      {isLoading ? (
        <LoadingState message="Loading tasks..." />
      ) : (
        <TasksViewInner />
      )}
    </>
  )
}
