"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useCurrentUserProfile, useUpdateCurrentUserProfile } from "@/lib/api/hooks/useUsers"
import { UserUpdateRequest } from "@/lib/api/types/users"
import { useToast } from "@/components/ui/use-toast"
import { Loader2 } from "lucide-react"

export function ProfileInfo() {
  const [isEditing, setIsEditing] = useState(false)
  const { toast } = useToast()

  // Fetch current user profile
  const { data: profile, isLoading, error, refetch } = useCurrentUserProfile()
  const updateProfileMutation = useUpdateCurrentUserProfile()

  // Form state
  const [formData, setFormData] = useState<UserUpdateRequest>({})

  // Update form data when profile loads
  React.useEffect(() => {
    if (profile) {
      setFormData({
        firstName: profile.firstName || '',
        lastName: profile.lastName || '',
        email: profile.email || '',
        department: profile.department || '',
        bio: profile.bio || '',
        location: profile.location || '',
        phone: profile.phone || '',
        address: {
          street: profile.address?.street || '',
          city: profile.address?.city || '',
          state: profile.address?.state || '',
          country: profile.address?.country || '',
          zipCode: profile.address?.zipCode || '',
        }
      })
    }
  }, [profile])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    if (name.startsWith('address.')) {
      const addressField = name.split('.')[1]
      setFormData((prev) => ({
        ...prev,
        address: {
          ...prev.address,
          [addressField]: value
        }
      }))
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }))
    }
  }

  const handleSave = async () => {
    try {
      await updateProfileMutation.mutateAsync(formData)
      setIsEditing(false)
      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
      })
      refetch() // Refresh the profile data
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      })
    }
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Loading profile...</span>
        </CardContent>
      </Card>
    )
  }

  if (error || !profile) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-8">
          <div className="text-center">
            <p className="text-muted-foreground">Failed to load profile</p>
            <Button onClick={() => refetch()} className="mt-2">
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    )
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
            <AvatarImage src={profile.avatar} alt={profile.fullName} />
            <AvatarFallback>{profile.initials}</AvatarFallback>
          </Avatar>
          {!isEditing && (
            <div>
              <h3 className="text-xl font-semibold">{profile.fullName}</h3>
              <p className="text-muted-foreground">{profile.role}</p>
              <p className="text-sm text-muted-foreground">{profile.department}</p>
            </div>
          )}
        </div>

        {isEditing ? (
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input id="firstName" name="firstName" value={formData.firstName || ''} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input id="lastName" name="lastName" value={formData.lastName || ''} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" value={formData.email || ''} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="department">Department</Label>
              <Input id="department" name="department" value={formData.department || ''} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" name="phone" type="tel" value={formData.phone || ''} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input id="location" name="location" value={formData.location || ''} onChange={handleChange} />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                name="bio"
                value={formData.bio || ''}
                onChange={handleChange}
                className="min-h-[120px]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address.street">Street Address</Label>
              <Input id="address.street" name="address.street" value={formData.address?.street || ''} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address.city">City</Label>
              <Input id="address.city" name="address.city" value={formData.address?.city || ''} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address.state">State</Label>
              <Input id="address.state" name="address.state" value={formData.address?.state || ''} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address.country">Country</Label>
              <Input id="address.country" name="address.country" value={formData.address?.country || ''} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address.zipCode">Zip Code</Label>
              <Input id="address.zipCode" name="address.zipCode" value={formData.address?.zipCode || ''} onChange={handleChange} />
            </div>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">Email</h4>
              <p>{profile.email || 'Not provided'}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">Username</h4>
              <p>{profile.username || 'Not provided'}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">Phone</h4>
              <p>{profile.phone || 'Not provided'}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">Department</h4>
              <p>{profile.department || 'Not provided'}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">Location</h4>
              <p>{profile.location || 'Not provided'}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">Address</h4>
              <p>
                {profile.address ? (
                  <>
                    {profile.address.street && <>{profile.address.street}<br /></>}
                    {profile.address.city && profile.address.state && (
                      <>{profile.address.city}, {profile.address.state} {profile.address.zipCode}<br /></>
                    )}
                    {profile.address.country && <>{profile.address.country}</>}
                  </>
                ) : (
                  'Not provided'
                )}
              </p>
            </div>
            <div className="sm:col-span-2">
              <h4 className="text-sm font-medium text-muted-foreground">Bio</h4>
              <p className="whitespace-pre-line">{profile.bio || 'No bio provided'}</p>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-end">
        {isEditing ? (
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setIsEditing(false)}
              disabled={updateProfileMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={updateProfileMutation.isPending}
            >
              {updateProfileMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </Button>
          </div>
        ) : (
          <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
        )}
      </CardFooter>
    </Card>
  )
}
