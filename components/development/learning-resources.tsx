"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BookOpen, ExternalLink, Filter, PlusCircle, Search, Share2, Star, ThumbsUp } from "lucide-react"

// Sample learning resources
const initialResources = [
  {
    id: "res-1",
    title: "Advanced React Patterns",
    description:
      "Learn advanced React patterns including compound components, render props, higher-order components, and hooks. This course covers best practices for building scalable and maintainable React applications.",
    url: "https://example.com/advanced-react",
    type: "course",
    tags: ["React", "Frontend", "Advanced"],
    rating: 4.8,
    recommendedBy: {
      name: "John Smith",
      avatar: "/placeholder.svg?height=32&width=32",
      initials: "JS",
    },
    likes: 24,
    hasLiked: true,
  },
  {
    id: "res-2",
    title: "System Design Interview Guide",
    description:
      "A comprehensive guide to system design interviews, covering scalability, reliability, availability, and performance. Includes real-world examples and case studies from top tech companies.",
    url: "https://example.com/system-design",
    type: "article",
    tags: ["System Design", "Architecture", "Interviews"],
    rating: 4.5,
    recommendedBy: {
      name: "Emily Chen",
      avatar: "/placeholder.svg?height=32&width=32",
      initials: "EC",
    },
    likes: 18,
    hasLiked: false,
  },
  {
    id: "res-3",
    title: "GraphQL Masterclass",
    description:
      "Master GraphQL from basics to advanced topics. Learn how to build efficient APIs, handle authentication, optimize performance, and integrate with various frontend frameworks.",
    url: "https://example.com/graphql-masterclass",
    type: "course",
    tags: ["GraphQL", "API", "Backend"],
    rating: 4.7,
    recommendedBy: {
      name: "Michael Brown",
      avatar: "/placeholder.svg?height=32&width=32",
      initials: "MB",
    },
    likes: 32,
    hasLiked: false,
  },
  {
    id: "res-4",
    title: "Microservices Architecture Patterns",
    description:
      "Explore common patterns and best practices for designing, implementing, and deploying microservices. Covers service discovery, API gateways, event-driven architecture, and more.",
    url: "https://example.com/microservices",
    type: "book",
    tags: ["Microservices", "Architecture", "DevOps"],
    rating: 4.6,
    recommendedBy: {
      name: "Sarah Wilson",
      avatar: "/placeholder.svg?height=32&width=32",
      initials: "SW",
    },
    likes: 15,
    hasLiked: true,
  },
  {
    id: "res-5",
    title: "Machine Learning for Software Engineers",
    description:
      "A practical introduction to machine learning concepts for software engineers. Learn how to integrate ML models into your applications without becoming a data scientist.",
    url: "https://example.com/ml-for-engineers",
    type: "video",
    tags: ["Machine Learning", "AI", "Data Science"],
    rating: 4.4,
    recommendedBy: {
      name: "Jane Doe",
      avatar: "/placeholder.svg?height=32&width=32",
      initials: "JD",
    },
    likes: 27,
    hasLiked: false,
  },
]

// Resource types with icons
const resourceTypes = [
  { value: "all", label: "All Types" },
  { value: "article", label: "Articles" },
  { value: "book", label: "Books" },
  { value: "course", label: "Courses" },
  { value: "video", label: "Videos" },
  { value: "podcast", label: "Podcasts" },
]

// Current user (for demo purposes)
const currentUser = {
  id: "user-1",
  name: "Jane Doe",
  avatar: "/placeholder.svg?height=32&width=32",
  initials: "JD",
}

export function LearningResources() {
  const [resources, setResources] = useState(initialResources)
  const [searchQuery, setSearchQuery] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [tagFilter, setTagFilter] = useState("all")
  const [activeTab, setActiveTab] = useState("all")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [newResource, setNewResource] = useState({
    title: "",
    description: "",
    url: "",
    type: "article",
    tags: [] as string[],
  })
  const [newTag, setNewTag] = useState("")

  // Get all unique tags from resources
  const allTags = Array.from(
    new Set(resources.flatMap((resource) => resource.tags))
  ).sort()

  // Filter resources based on search, type, tag, and tab
  const filteredResources = resources.filter((resource) => {
    const matchesSearch =
      resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesType = typeFilter === "all" || resource.type === typeFilter
    const matchesTag = tagFilter === "all" || resource.tags.includes(tagFilter)
    const matchesTab =
      activeTab === "all" ||
      (activeTab === "liked" && resource.hasLiked) ||
      (activeTab === "recommended" && resource.recommendedBy.name === currentUser.name)

    return matchesSearch && matchesType && matchesTag && matchesTab
  })

  const handleAddResource = () => {
    if (
      newResource.title.trim() === "" ||
      newResource.description.trim() === "" ||
      newResource.url.trim() === ""
    )
      return

    const resource = {
      id: `res-${Date.now()}`,
      title: newResource.title,
      description: newResource.description,
      url: newResource.url,
      type: newResource.type,
      tags: newResource.tags,
      rating: 0,
      recommendedBy: {
        name: currentUser.name,
        avatar: currentUser.avatar,
        initials: currentUser.initials,
      },
      likes: 0,
      hasLiked: false,
    }

    setResources([resource, ...resources])
    setNewResource({
      title: "",
      description: "",
      url: "",
      type: "article",
      tags: [],
    })
    setIsDialogOpen(false)
  }

  const handleAddTag = () => {
    if (newTag && !newResource.tags.includes(newTag)) {
      setNewResource({ ...newResource, tags: [...newResource.tags, newTag] })
      setNewTag("")
    }
  }

  const handleRemoveTag = (tag: string) => {
    setNewResource({
      ...newResource,
      tags: newResource.tags.filter((t) => t !== tag),
    })
  }

  const handleToggleLike = (id: string) => {
    setResources(
      resources.map((resource) => {
        if (resource.id === id) {
          const hasLiked = !resource.hasLiked
          return {
            ...resource,
            hasLiked,
            likes: hasLiked ? resource.likes + 1 : resource.likes - 1,
          }
        }
        return resource
      })
    )
  }

  const getResourceTypeIcon = (type: string) => {
    switch (type) {
      case "article":
        return <BookOpen className="h-4 w-4" />
      case "book":
        return <BookOpen className="h-4 w-4" />
      case "course":
        return <BookOpen className="h-4 w-4" />
      case "video":
        return <BookOpen className="h-4 w-4" />
      case "podcast":
        return <BookOpen className="h-4 w-4" />
      default:
        return <BookOpen className="h-4 w-4" />
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div>
          <CardTitle>Learning Resources</CardTitle>
          <CardDescription>Discover and share valuable learning materials</CardDescription>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Resource
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Learning Resource</DialogTitle>
              <DialogDescription>
                Share a valuable resource with your team
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  placeholder="Resource title"
                  value={newResource.title}
                  onChange={(e) =>
                    setNewResource({ ...newResource, title: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe the resource"
                  className="min-h-[100px]"
                  value={newResource.description}
                  onChange={(e) =>
                    setNewResource({ ...newResource, description: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="url">URL</Label>
                <Input
                  id="url"
                  placeholder="https://example.com/resource"
                  value={newResource.url}
                  onChange={(e) =>
                    setNewResource({ ...newResource, url: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Resource Type</Label>
                <Select
                  value={newResource.type}
                  onValueChange={(value) =>
                    setNewResource({ ...newResource, type: value })
                  }
                >
                  <SelectTrigger id="type">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="article">Article</SelectItem>
                    <SelectItem value="book">Book</SelectItem>
                    <SelectItem value="course">Course</SelectItem>
                    <SelectItem value="video">Video</SelectItem>
                    <SelectItem value="podcast">Podcast</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Tags</Label>
                <div className="flex flex-wrap gap-2">
                  {newResource.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                      {tag}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-4 w-4 rounded-full p-0"
                        onClick={() => handleRemoveTag(tag)}
                      >
                        <span className="sr-only">Remove {tag} tag</span>
                        ×
                      </Button>
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    placeholder="Add a tag"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && newTag.trim()) {
                        e.preventDefault()
                        handleAddTag()
                      }
                    }}
                  />
                  <Button onClick={handleAddTag} disabled={!newTag.trim()}>
                    Add
                  </Button>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleAddResource}
                disabled={
                  !newResource.title.trim() ||
                  !newResource.description.trim() ||
                  !newResource.url.trim()
                }
              >
                Share Resource
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent className="space-y-4">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="all">All Resources</TabsTrigger>
            <TabsTrigger value="liked">Liked</TabsTrigger>
            <TabsTrigger value="recommended">My Recommendations</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:space-x-2 sm:space-y-0">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search resources..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center space-x-2">
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[130px]">
                <Filter className="mr-2 h-4 w-4" />
                <span>Type</span>
              </SelectTrigger>
              <SelectContent>
                {resourceTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={tagFilter} onValueChange={setTagFilter}>
              <SelectTrigger className="w-[130px]">
                <Filter className="mr-2 h-4 w-4" />
                <span>Tag</span>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Tags</SelectItem>
                {allTags.map((tag) => (
                  <SelectItem key={tag} value={tag}>
                    {tag}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredResources.map((resource) => (
            <Card key={resource.id} className="flex h-full flex-col">
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div>
                    <Badge variant="outline" className="mb-2">
                      {getResourceTypeIcon(resource.type)}
                      <span className="ml-1 capitalize">{resource.type}</span>
                    </Badge>
                    <CardTitle className="text-lg">{resource.title}</CardTitle>
                  </div>
                  <div className="flex items-center">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < Math.floor(resource.rating)
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="ml-1 text-sm">{resource.rating}</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex-1 pb-2">
                <p className="line-clamp-3 text-sm text-muted-foreground">
                  {resource.description}
                </p>
                <div className="mt-2 flex flex-wrap gap-1">
                  {resource.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="flex items-center justify-between border-t pt-3">
                <div className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarImage
                      src={resource.recommendedBy.avatar}
                      alt={resource.recommendedBy.name}
                    />
                    <AvatarFallback>{resource.recommendedBy.initials}</AvatarFallback>
                  </Avatar>
                  <span className="text-xs text-muted-foreground">
                    Shared by {resource.recommendedBy.name}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleToggleLike(resource.id)}
                  >
                    <ThumbsUp
                      className={`h-4 w-4 ${
                        resource.hasLiked ? "fill-primary text-primary" : ""
                      }`}
                    />
                    <span className="sr-only">Like</span>
                  </Button>
                  <span className="text-xs">{resource.likes}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    asChild
                  >
                    <a href={resource.url} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4" />
                      <span className="sr-only">Open link</span>
                    </a>
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Share2 className="h-4 w-4" />
                    <span className="sr-only">Share</span>
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
