"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useAddTeamMember } from "@/lib/api/hooks/useTeams"
import { useUsers } from "@/lib/api/hooks/useUsers"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { TeamMemberRole } from "@/lib/api/types/teams"

// Form schema
const formSchema = z.object({
  userId: z.number({
    required_error: "Please select a user",
  }),
  role: z.enum(["Member", "Admin", "Lead"] as const, {
    required_error: "Please select a role",
  }),
})

type FormValues = z.infer<typeof formSchema>

interface AddTeamMemberDialogProps {
  teamId: number
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export function AddTeamMemberDialog({ teamId, open, onOpenChange, onSuccess }: AddTeamMemberDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // Get users for selection - only fetch when dialog is open
  const { data: usersData, isLoading: usersLoading, error: usersError } = useUsers(undefined, { enabled: open })
  const users = usersData?.items || []
  
  // Add team member mutation
  const addTeamMemberMutation = useAddTeamMember(teamId)
  
  // Form setup
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      role: "Member",
    },
  })
  
  // Handle form submission
  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true)
    
    try {
      await addTeamMemberMutation.mutateAsync({
        userId: values.userId,
        role: values.role,
      })
      
      toast.success("Team member added successfully")
      form.reset({
        role: "Member",
      })
      onSuccess?.()
    } catch (error) {
      toast.error("Failed to add team member")
      console.error("Error adding team member:", error)
    } finally {
      setIsSubmitting(false)
    }
  }
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add Team Member</DialogTitle>
          <DialogDescription>
            Add a new member to your team.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="userId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>User</FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(parseInt(value))}
                    value={field.value?.toString()}
                    disabled={usersLoading}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          placeholder={
                            usersLoading ? "Loading users..." :
                            usersError ? "Error loading users" :
                            users.length === 0 ? "No users available" :
                            "Select a user"
                          }
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {!usersLoading && !usersError && users.length > 0 && users.map((user) => {
                        const displayName = user.fullName || `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email || `User ${user.id}`;
                        return (
                          <SelectItem
                            key={user.id}
                            value={user.id.toString()}
                          >
                            {displayName}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                  {usersError && (
                    <p className="text-sm text-red-500 mt-1">
                      Failed to load users. Please try again.
                    </p>
                  )}
                  <FormDescription>
                    Select the user you want to add to the team.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    defaultValue="Member"
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Member">Member</SelectItem>
                      <SelectItem value="Admin">Admin</SelectItem>
                      <SelectItem value="Lead">Lead</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    The role determines what permissions the member will have.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting || usersLoading || !form.watch('userId')}
              >
                {isSubmitting ? "Adding..." : "Add Member"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
