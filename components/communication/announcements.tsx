"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Megaphone, Pin, PlusCircle, ThumbsUp } from "lucide-react"
import { useAnnouncements, useCreateAnnouncement, useToggleAnnouncementPin, useToggleAnnouncementLike } from "@/lib/api/hooks/useAnnouncements"
import { useCurrentUser } from "@/lib/api/hooks/useAuth"
import { LoadingState, ErrorState, EmptyState } from "@/components/ui/api-state"

export function Announcements() {
  const [searchQuery, setSearchQuery] = useState("")
  const [newAnnouncement, setNewAnnouncement] = useState({
    title: "",
    content: "",
  })
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  
  // Fetch current user
  const { data: currentUser } = useCurrentUser()
  
  // Fetch announcements with React Query
  const { data, isLoading, isError, error, refetch } = useAnnouncements({ 
    search: searchQuery || undefined,
    limit: 20
  })
  
  // Mutations for creating and updating announcements
  const createAnnouncementMutation = useCreateAnnouncement()
  const togglePinMutation = useToggleAnnouncementPin()
  const toggleLikeMutation = useToggleAnnouncementLike()
  
  const handleCreateAnnouncement = () => {
    if (newAnnouncement.title.trim() === "" || newAnnouncement.content.trim() === "") return
    
    createAnnouncementMutation.mutate({
      title: newAnnouncement.title,
      content: newAnnouncement.content,
      isPinned: false
    }, {
      onSuccess: () => {
        setNewAnnouncement({ title: "", content: "" })
        setIsDialogOpen(false)
      }
    })
  }
  
  const handleTogglePinned = (id: string) => {
    togglePinMutation.mutate(id)
  }
  
  const handleToggleLike = (id: string) => {
    toggleLikeMutation.mutate(id)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <Card className="flex h-[calc(80vh-8rem)] flex-col">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Announcements</CardTitle>
          <CardDescription>Important team and company announcements</CardDescription>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              New Announcement
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Announcement</DialogTitle>
              <DialogDescription>
                Share important information with your team
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  placeholder="Enter announcement title"
                  value={newAnnouncement.title}
                  onChange={(e) =>
                    setNewAnnouncement({ ...newAnnouncement, title: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="content">Content</Label>
                <Textarea
                  id="content"
                  placeholder="Enter announcement content"
                  className="min-h-[150px]"
                  value={newAnnouncement.content}
                  onChange={(e) =>
                    setNewAnnouncement({ ...newAnnouncement, content: e.target.value })
                  }
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleCreateAnnouncement}
                disabled={!newAnnouncement.title.trim() || !newAnnouncement.content.trim()}
              >
                Publish
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <div className="px-4 pb-2">
        <Input
          placeholder="Search announcements..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <CardContent className="flex-1 overflow-hidden p-0">
        {isLoading ? (
          <LoadingState message="Loading announcements..." />
        ) : isError ? (
          <ErrorState
            message={`Error loading announcements: ${error?.message || 'Unknown error'}`}
            onRetry={() => refetch()}
          />
        ) : !data?.data || data.data.length === 0 ? (
          <EmptyState
            title="No announcements found"
            description="There are no announcements to display."
            action={
              <Button onClick={() => setIsDialogOpen(true)}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Create Announcement
              </Button>
            }
          />
        ) : (
          <ScrollArea className="h-full px-4 pb-4">
            <div className="space-y-4">
              {data.data.map((announcement) => (
                <Card key={announcement.id} className={announcement.isPinned ? "border-primary" : ""}>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {announcement.isPinned && (
                          <Badge variant="outline" className="gap-1 border-primary text-primary">
                            <Pin className="h-3 w-3" />
                            Pinned
                          </Badge>
                        )}
                        <h3 className="text-lg font-semibold">{announcement.title}</h3>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleTogglePinned(announcement.id)}
                      >
                        <Pin
                          className={`h-4 w-4 ${
                            announcement.isPinned ? "fill-primary text-primary" : ""
                          }`}
                        />
                        <span className="sr-only">
                          {announcement.isPinned ? "Unpin" : "Pin"} announcement
                        </span>
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <p className="whitespace-pre-line text-sm">{announcement.content}</p>
                  </CardContent>
                  <CardFooter className="flex items-center justify-between border-t pt-3">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={announcement.author.avatar} alt={announcement.author.name} />
                        <AvatarFallback>{announcement.author.initials}</AvatarFallback>
                      </Avatar>
                      <div className="text-xs">
                        <span className="font-medium">{announcement.author.name}</span>
                        <span className="text-muted-foreground"> • {formatDate(announcement.date)}</span>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="gap-1"
                      onClick={() => handleToggleLike(announcement.id)}
                    >
                      <ThumbsUp
                        className={`h-4 w-4 ${
                          announcement.hasLiked ? "fill-primary text-primary" : ""
                        }`}
                      />
                      <span>{announcement.likes}</span>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  )
}
