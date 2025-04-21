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

// Sample announcements
const initialAnnouncements = [
  {
    id: "ann-1",
    title: "New Project Launch: Team Tasker",
    content:
      "We're excited to announce the launch of our new project, Team Tasker! This platform will help teams manage tasks, track progress, and improve collaboration. The beta version will be available next week for internal testing.",
    author: {
      name: "Sarah Wilson",
      role: "Product Manager",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "SW",
    },
    date: "2023-05-10T10:00:00Z",
    isPinned: true,
    likes: 12,
    hasLiked: false,
  },
  {
    id: "ann-2",
    title: "Office Closure: Memorial Day Weekend",
    content:
      "Please note that our office will be closed on Monday, May 29th, in observance of Memorial Day. All deadlines falling on this date will be extended to Tuesday, May 30th. Enjoy the long weekend!",
    author: {
      name: "Michael Brown",
      role: "HR Manager",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "MB",
    },
    date: "2023-05-15T14:30:00Z",
    isPinned: false,
    likes: 8,
    hasLiked: true,
  },
  {
    id: "ann-3",
    title: "Quarterly Team Meeting",
    content:
      "Our Q2 team meeting is scheduled for June 5th at 10 AM in the main conference room. We'll be discussing our progress on current projects, setting goals for Q3, and recognizing team achievements. Please prepare a brief update on your current projects.",
    author: {
      name: "Jane Doe",
      role: "Team Lead",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "JD",
    },
    date: "2023-05-18T09:15:00Z",
    isPinned: false,
    likes: 5,
    hasLiked: false,
  },
  {
    id: "ann-4",
    title: "New Team Member Introduction",
    content:
      "Please join me in welcoming Alex Johnson to our development team! Alex brings 5 years of experience in frontend development and will be focusing on our UI/UX improvements. Feel free to reach out and introduce yourself.",
    author: {
      name: "John Smith",
      role: "Engineering Manager",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "JS",
    },
    date: "2023-05-20T11:45:00Z",
    isPinned: false,
    likes: 15,
    hasLiked: true,
  },
]

// Current user (for demo purposes)
const currentUser = {
  id: "user-1",
  name: "Jane Doe",
  role: "Team Lead",
  avatar: "/placeholder.svg?height=40&width=40",
  initials: "JD",
}

export function Announcements() {
  const [announcements, setAnnouncements] = useState(initialAnnouncements)
  const [searchQuery, setSearchQuery] = useState("")
  const [newAnnouncement, setNewAnnouncement] = useState({
    title: "",
    content: "",
  })
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const filteredAnnouncements = announcements.filter(
    (announcement) =>
      announcement.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      announcement.content.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Sort announcements: pinned first, then by date
  const sortedAnnouncements = [...filteredAnnouncements].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1
    if (!a.isPinned && b.isPinned) return 1
    return new Date(b.date).getTime() - new Date(a.date).getTime()
  })

  const handleCreateAnnouncement = () => {
    if (newAnnouncement.title.trim() === "" || newAnnouncement.content.trim() === "") return

    const announcement = {
      id: `ann-${Date.now()}`,
      title: newAnnouncement.title,
      content: newAnnouncement.content,
      author: currentUser,
      date: new Date().toISOString(),
      isPinned: false,
      likes: 0,
      hasLiked: false,
    }

    setAnnouncements([announcement, ...announcements])
    setNewAnnouncement({ title: "", content: "" })
    setIsDialogOpen(false)
  }

  const handleTogglePinned = (id: string) => {
    setAnnouncements(
      announcements.map((announcement) =>
        announcement.id === id
          ? { ...announcement, isPinned: !announcement.isPinned }
          : announcement
      )
    )
  }

  const handleToggleLike = (id: string) => {
    setAnnouncements(
      announcements.map((announcement) => {
        if (announcement.id === id) {
          const hasLiked = !announcement.hasLiked
          return {
            ...announcement,
            hasLiked,
            likes: hasLiked ? announcement.likes + 1 : announcement.likes - 1,
          }
        }
        return announcement
      })
    )
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
        <ScrollArea className="h-full px-4 pb-4">
          <div className="space-y-4">
            {sortedAnnouncements.map((announcement) => (
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
      </CardContent>
    </Card>
  )
}
