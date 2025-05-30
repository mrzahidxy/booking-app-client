"use client"

import { useQuery } from "@tanstack/react-query"
import { useSession } from "next-auth/react"
import privateRequest from "@/healper/privateRequest"
import { Button } from "@/components/ui/button"
import { Edit, Settings } from "lucide-react"
import DefaultLoader from "@/components/common/DefaultLoacer.component"
import { useState } from "react"


import { ProfileEdit } from "./profile-edit.component"
import { ProfileInfoCard } from "./profile-info-card.component"
import { ProfileStatsCard } from "./profile-stats-card.component"

const fetchUserProfile = async (userId: string) => {
  const response = await privateRequest.get(`/users/${userId}`)
  return response.data.data
}

export const ProfileView = () => {
  const { data: session } = useSession()
  const [isEditing, setIsEditing] = useState(false)
  const userId = session?.user?.id

  // Fetch user profile data
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["user-profile", userId],
    queryFn: () => fetchUserProfile(userId),
    enabled: !!userId,
    staleTime: 0,
    refetchOnMount: true,
  })

  if (isLoading) {
    return <DefaultLoader showImage={false} />
  }

  if (isError) {
    return (
      <div className="text-center py-10">
        <p className="text-red-500">Error loading profile: {error?.message}</p>
      </div>
    )
  }

  if (isEditing) {
    return (
      <div className="container max-w-4xl mx-auto py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Edit Profile</h1>
        </div>
        <ProfileEdit onCancel={() => setIsEditing(false)} />
      </div>
    )
  }

  return (
    <div className="container max-w-4xl mx-auto py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">My Profile</h1>
          <p className="text-muted-foreground mt-1">Manage your personal information and account settings</p>
        </div>
        <div className="flex gap-2">
          {/* <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button> */}
          <Button onClick={() => setIsEditing(true)} size="sm">
            <Edit className="h-4 w-4 mr-2" />
            Edit Profile
          </Button>
        </div>
      </div>

      {/* Profile Information Cards */}
      <div className="space-y-6">
        <ProfileInfoCard userData={data} />
        <ProfileStatsCard userData={data} />
      </div>
    </div>
  )
}
