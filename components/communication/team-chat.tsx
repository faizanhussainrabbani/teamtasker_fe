"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Paperclip, Send, Smile } from "lucide-react"

// Sample chat messages
const initialMessages = [
  {
    id: "msg-1",
    sender: {
      id: "user-1",
      name: "Jane Doe",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "JD",
    },
    content: "Hey team, I've just pushed the latest changes to the repository. Please review when you get a chance.",
    timestamp: "2023-05-15T09:30:00Z",
  },
  {
    id: "msg-2",
    sender: {
      id: "user-2",
      name: "John Smith",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "JS",
    },
    content: "I'll take a look at it this afternoon. Is there anything specific you want me to focus on?",
    timestamp: "2023-05-15T09:32:00Z",
  },
  {
    id: "msg-3",
    sender: {
      id: "user-1",
      name: "Jane Doe",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "JD",
    },
    content: "Mainly the authentication flow and the new dashboard components.",
    timestamp: "2023-05-15T09:33:00Z",
  },
  {
    id: "msg-4",
    sender: {
      id: "user-3",
      name: "Emily Chen",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "EC",
    },
    content: "I noticed some performance issues with the API calls. I'll optimize those today.",
    timestamp: "2023-05-15T09:35:00Z",
  },
  {
    id: "msg-5",
    sender: {
      id: "user-4",
      name: "Michael Brown",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "MB",
    },
    content: "Great! I'll update the CI/CD pipeline to include the new tests.",
    timestamp: "2023-05-15T09:40:00Z",
  },
  {
    id: "msg-6",
    sender: {
      id: "user-5",
      name: "Sarah Wilson",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "SW",
    },
    content: "Team, don't forget we have a sprint planning meeting tomorrow at 10 AM.",
    timestamp: "2023-05-15T10:00:00Z",
  },
  {
    id: "msg-7",
    sender: {
      id: "user-2",
      name: "John Smith",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "JS",
    },
    content: "Thanks for the reminder, Sarah. I'll prepare the UI mockups for discussion.",
    timestamp: "2023-05-15T10:05:00Z",
  },
]

// Current user (for demo purposes)
const currentUser = {
  id: "user-1",
  name: "Jane Doe",
  avatar: "/placeholder.svg?height=40&width=40",
  initials: "JD",
}

export function TeamChat() {
  const [messages, setMessages] = useState(initialMessages)
  const [newMessage, setNewMessage] = useState("")

  const handleSendMessage = () => {
    if (newMessage.trim() === "") return

    const message = {
      id: `msg-${Date.now()}`,
      sender: currentUser,
      content: newMessage,
      timestamp: new Date().toISOString(),
    }

    setMessages([...messages, message])
    setNewMessage("")
  }

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <Card className="flex h-[calc(80vh-8rem)] flex-col">
      <CardHeader>
        <CardTitle>Team Chat</CardTitle>
        <CardDescription>Communicate with your entire team</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden p-0">
        <ScrollArea className="h-full p-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.sender.id === currentUser.id ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`flex max-w-[80%] items-start gap-2 ${
                    message.sender.id === currentUser.id ? "flex-row-reverse" : "flex-row"
                  }`}
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={message.sender.avatar} alt={message.sender.name} />
                    <AvatarFallback>{message.sender.initials}</AvatarFallback>
                  </Avatar>
                  <div
                    className={`rounded-lg p-3 ${
                      message.sender.id === currentUser.id
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    }`}
                  >
                    <div className="mb-1 flex items-center gap-2">
                      <span className="text-xs font-medium">
                        {message.sender.id === currentUser.id ? "You" : message.sender.name}
                      </span>
                      <span className="text-xs opacity-70">{formatTime(message.timestamp)}</span>
                    </div>
                    <p className="text-sm">{message.content}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
      <CardFooter className="border-t p-3">
        <div className="flex w-full items-center gap-2">
          <Button variant="outline" size="icon" className="shrink-0">
            <Paperclip className="h-4 w-4" />
            <span className="sr-only">Attach file</span>
          </Button>
          <Input
            placeholder="Type your message..."
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
          <Button size="icon" className="shrink-0" onClick={handleSendMessage} disabled={!newMessage.trim()}>
            <Send className="h-4 w-4" />
            <span className="sr-only">Send message</span>
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}
