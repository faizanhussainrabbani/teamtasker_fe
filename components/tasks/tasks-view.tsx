"use client"

import { useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TasksList } from "@/components/tasks/tasks-list"
import { TasksKanban } from "@/components/tasks/tasks-kanban"
import { TasksCalendar } from "@/components/tasks/tasks-calendar"
import { useFlushOfflineTaskStatusQueue } from "@/lib/api/hooks/useTasks"
import { useToast } from "@/components/ui/use-toast"

export function TasksView() {
  const flushOfflineTaskStatusQueue = useFlushOfflineTaskStatusQueue()
  const { toast } = useToast()

  useEffect(() => {
    let isDisposed = false

    const syncOfflineUpdates = async () => {
      const flushedCount = await flushOfflineTaskStatusQueue()

      if (!isDisposed && flushedCount > 0) {
        toast({
          title: "Offline updates synced",
          description: `${flushedCount} queued task status update(s) were applied.`,
        })
      }
    }

    void syncOfflineUpdates()

    const handleOnline = () => {
      void syncOfflineUpdates()
    }

    window.addEventListener("online", handleOnline)

    return () => {
      isDisposed = true
      window.removeEventListener("online", handleOnline)
    }
  }, [flushOfflineTaskStatusQueue, toast])

  return (
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
  )
}
