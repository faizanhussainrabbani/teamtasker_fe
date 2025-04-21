"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Paperclip, Search, Send, Smile } from "lucide-react"

// Sample team members
const teamMembers = [
  {
    id: "user-2",
    name: "John Smith",
    role: "Frontend Developer",
    avatar: "/placeholder.svg?height=40&width=40",
    initials: "JS",
    status: "online",
    lastSeen: "now",
    unread: 0,
  },
  {
    id: "user-3",
    name: "Emily Chen",
    role: "Backend Developer",
    avatar: "/placeholder.svg?height=40&width=40",
    initials: "EC",
    status: "online",
    lastSeen: "now",
    unread: 2,
  },
  {
    id: "user-4",
    name: "Michael Brown",
    role: "DevOps Engineer",
    avatar: "/placeholder.svg?height=40&width=40",
    initials: "MB",
    status: "offline",
    lastSeen: "2 hours ago",
    unread: 0,
  },
  {
    id: "user-5",
    name: "Sarah Wilson",
    role: "Product Manager",
    avatar: "/placeholder.svg?height=40&width=40",
    initials: "SW",
    status: "away",
    lastSeen: "30 minutes ago",
    unread: 0,
  },
]

// Sample conversations
const conversations: Record<string, any[]> = {
  "user-2": [
    {
      id: "msg-1",
      sender: "user-2",
      content: "Hey, how's the dashboard redesign coming along?",
      timestamp: "2023-05-15T14:30:00Z",
    },
    {
      id: "msg-2",
      sender: "user-1",
      content: "It's going well! I've finished the main layout and working on the charts now.",
      timestamp: "2023-05-15T14:32:00Z",
    },
    {
      id: "msg-3",
      sender: "user-2",
      content: "Great! Let me know if you need any help with the UI components.",
      timestamp: "2023-05-15T14:35:00Z",
    },
  ],
  "user-3": [
    {
      id: "msg-1",
      sender: "user-3",
      content: "I've updated the API endpoints for the user profile. Can you test them?",
      timestamp: "2023-05-15T10:15:00Z",
    },
    {
      id: "msg-2",
      sender: "user-1",
      content: "Sure, I'll test them this afternoon.",
      timestamp: "2023-05-15T10:20:00Z",
    },
    {
      id: "msg-3",
      sender: "user-3",
      content: "Thanks! The documentation is in the shared folder.",
      timestamp: "2023-05-15T10:22:00Z",
    },
    {
      id: "msg-4",
      sender: "user-3",
      content: "Also, there's a new authentication flow we need to discuss.",
      timestamp: "2023-05-15T13:45:00Z",
    },
    {
      id: "msg-5",
      sender: "user-3",
      content: "Do you have time for a quick call today?",
      timestamp: "2023-05-15T13:46:00Z",
    },
  ],
  "user-4": [
    {
      id: "msg-1",
      sender: "user-1",
      content: "Hi Michael, can you help me set up the new CI/CD pipeline?",
      timestamp: "2023-05-14T09:10:00Z",
    },
    {
      id: "msg-2",
      sender: "user-4",
      content: "Of course! Let's schedule a time tomorrow morning.",
      timestamp: "2023-05-14T09:15:00Z",
    },
    {
      id: "msg-3",
      sender: "user-1",
      content: "Perfect, how about 10 AM?",
      timestamp: "2023-05-14T09:17:00Z",
    },
    {
      id: "msg-4",
      sender: "user-4",
      content: "Works for me. I'll send a calendar invite.",
      timestamp: "2023-05-14T09:20:00Z",
    },
  ],
  "user-5": [
    {
      id: "msg-1",
      sender: "user-5",
      content: "Jane, can you prepare a demo of the new features for the client meeting next week?",
      timestamp: "2023-05-13T15:30:00Z",
    },
    {
      id: "msg-2",
      sender: "user-1",
      content: "Yes, I'll have it ready by Friday for review.",
      timestamp: "2023-05-13T15:35:00Z",
    },
    {
      id: "msg-3",
      sender: "user-5",
      content: "Great, thank you!",
      timestamp: "2023-05-13T15:36:00Z",
    },
  ],
}

// Current user (for demo purposes)
const currentUser = {
  id: "user-1",
  name: "Jane Doe",
  avatar: "/placeholder.svg?height=40&width=40",
  initials: "JD",
}

export function DirectMessages() {
  const [selectedUser, setSelectedUser] = useState(teamMembers[0])
  const [searchQuery, setSearchQuery] = useState("")
  const [newMessage, setNewMessage] = useState("")
  const [activeConversations, setActiveConversations] = useState(conversations)

  const filteredMembers = teamMembers.filter((member) =>
    member.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleSendMessage = () => {
    if (newMessage.trim() === "") return

    const message = {
      id: `msg-${Date.now()}`,
      sender: "user-1",
      content: newMessage,
      timestamp: new Date().toISOString(),
    }

    setActiveConversations({
      ...activeConversations,
      [selectedUser.id]: [...(activeConversations[selectedUser.id] || []), message],
    })
    setNewMessage("")
  }

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return "bg-green-500"
      case "away":
        return "bg-yellow-500"
      case "offline":
        return "bg-gray-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <Card className="flex h-[calc(80vh-8rem)] flex-col">
      <CardHeader className="p-4">
        <CardTitle>Direct Messages</CardTitle>
        <CardDescription>Private conversations with team members</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-1 gap-4 overflow-hidden p-0">
        {/* Contacts sidebar */}
        <div className="w-64 border-r">
          <div className="p-3">
            <div className="relative mb-3">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search contacts..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <ScrollArea className="h-[calc(80vh-16rem)]">
              <div className="space-y-1">
                {filteredMembers.map((member) => (
                  <Button
                    key={member.id}
                    variant={selectedUser.id === member.id ? "secondary" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => setSelectedUser(member)}
                  >
                    <div className="flex w-full items-center gap-2">
                      <div className="relative">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={member.avatar} alt={member.name} />
                          <AvatarFallback>{member.initials}</AvatarFallback>
                        </Avatar>
                        <span
                          className={`absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-background ${getStatusColor(
                            member.status
                          )}`}
                        />
                      </div>
                      <div className="flex-1 truncate text-left">
                        <div className="flex items-center justify-between">
                          <span className="truncate font-medium">{member.name}</span>
                          {member.unread > 0 && (
                            <Badge variant="destructive" className="ml-auto h-5 w-5 rounded-full p-0 text-center">
                              {member.unread}
                            </Badge>
                          )}
                        </div>
                        <p className="truncate text-xs text-muted-foreground">
                          {member.status === "online" ? "Online" : `Last seen ${member.lastSeen}`}
                        </p>
                      </div>
                    </div>
                  </Button>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>

        {/* Chat area */}
        <div className="flex flex-1 flex-col">
          <div className="border-b p-3">
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src={selectedUser.avatar} alt={selectedUser.name} />
                <AvatarFallback>{selectedUser.initials}</AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium">{selectedUser.name}</div>
                <div className="flex items-center gap-1">
                  <span
                    className={`h-2 w-2 rounded-full ${getStatusColor(selectedUser.status)}`}
                  />
                  <span className="text-xs text-muted-foreground">
                    {selectedUser.status === "online" ? "Online" : `Last seen ${selectedUser.lastSeen}`}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {activeConversations[selectedUser.id]?.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === currentUser.id ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`rounded-lg p-3 ${
                      message.sender === currentUser.id
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                    <div className="mt-1 text-right text-xs opacity-70">
                      {formatTime(message.timestamp)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>

          <div className="border-t p-3">
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" className="shrink-0">
                <Paperclip className="h-4 w-4" />
                <span className="sr-only">Attach file</span>
              </Button>
              <Input
                placeholder={`Message ${selectedUser.name}...`}
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault()
                    handleSendMessage()
                  }
                }}
                className="flex-1"
              />
              <Button variant="outline" size="icon" className="shrink-0">
                <Smile className="h-4 w-4" />
                <span className="sr-only">Add emoji</span>
              </Button>
              <Button
                size="icon"
                className="shrink-0"
                onClick={handleSendMessage}
                disabled={!newMessage.trim()}
              >
                <Send className="h-4 w-4" />
                <span className="sr-only">Send message</span>
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
