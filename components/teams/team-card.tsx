"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { TeamDto } from "@/lib/api/types/teams"
import { Users } from "lucide-react"

interface TeamCardProps {
  team: TeamDto
  onClick?: () => void
}

export function TeamCard({ team, onClick }: TeamCardProps) {
  return (
    <Card className="overflow-hidden transition-all hover:border-primary/50 hover:shadow-sm" onClick={onClick}>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between">
          <span className="truncate">{team.name}</span>
          {team.department && (
            <Badge variant="outline" className="ml-2">
              {team.department}
            </Badge>
          )}
        </CardTitle>
        <CardDescription className="line-clamp-2 h-10">
          {team.description || "No description provided."}
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="flex items-center text-sm text-muted-foreground">
          <Users className="mr-1 h-4 w-4" />
          <span>{team.memberCount || 0} members</span>
        </div>
      </CardContent>
      <CardFooter className="pt-2">
        <Button variant="outline" size="sm" className="w-full" onClick={onClick}>
          View Team
        </Button>
      </CardFooter>
    </Card>
  )
}
