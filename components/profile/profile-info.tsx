"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

// Sample user data
const userData = {
  name: "Jane Doe",
  role: "Senior Developer",
  email: "jane.doe@example.com",
  phone: "+1 (555) 123-4567",
  location: "San Francisco, CA",
  bio: "Full-stack developer with 8 years of experience specializing in React, Node.js, and cloud architecture. Passionate about creating efficient, scalable applications and mentoring junior developers.",
  avatar: "/placeholder.svg?height=128&width=128",
  initials: "JD",
}

export function ProfileInfo() {
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState(userData)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSave = () => {
    // Here you would typically save the data to your backend
    setIsEditing(false)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Personal Information</CardTitle>
        <CardDescription>Manage your personal details and contact information</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col items-center space-y-3 sm:flex-row sm:space-x-4 sm:space-y-0">
          <Avatar className="h-24 w-24">
            <AvatarImage src={userData.avatar} alt={userData.name} />
            <AvatarFallback>{userData.initials}</AvatarFallback>
          </Avatar>
          {!isEditing && (
            <div>
              <h3 className="text-xl font-semibold">{userData.name}</h3>
              <p className="text-muted-foreground">{userData.role}</p>
            </div>
          )}
        </div>

        {isEditing ? (
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" name="name" value={formData.name} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Job Title</Label>
              <Input id="role" name="role" value={formData.role} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" name="phone" type="tel" value={formData.phone} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input id="location" name="location" value={formData.location} onChange={handleChange} />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                className="min-h-[120px]"
              />
            </div>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">Email</h4>
              <p>{userData.email}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">Phone</h4>
              <p>{userData.phone}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">Location</h4>
              <p>{userData.location}</p>
            </div>
            <div className="sm:col-span-2">
              <h4 className="text-sm font-medium text-muted-foreground">Bio</h4>
              <p className="whitespace-pre-line">{userData.bio}</p>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-end">
        {isEditing ? (
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>Save Changes</Button>
          </div>
        ) : (
          <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
        )}
      </CardFooter>
    </Card>
  )
}
