import type { Metadata } from "next"
import { PageHeader } from "@/components/page-header"
import { ProfileView } from "@/components/profile/profile-view"

export const metadata: Metadata = {
  title: "My Profile | Team-Centered Task Management",
  description: "View and manage your profile, skills, and development goals",
}

export default function ProfilePage() {
  return (
    <div className="flex flex-col">
      <PageHeader title="My Profile" description="View and manage your profile, skills, and development goals" />
      <div className="p-4">
        <ProfileView />
      </div>
    </div>
  )
}
