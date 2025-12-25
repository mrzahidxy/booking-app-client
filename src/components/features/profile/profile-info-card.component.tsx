"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { User, Mail, Phone, Calendar, Shield, Hash } from "lucide-react"

interface UserData {
  id: number
  name?: string
  email: string
  phone?: string
  createdAt: string
  updateAt: string
  Role?: {
    id: number
    name: string
  }
  bookings?: any[]
  Review?: any[]
  Notification?: any[]
}

interface ProfileInfoCardProps {
  userData: UserData
}

export const ProfileInfoCard = ({ userData }: ProfileInfoCardProps) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Personal Information Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Personal Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Full Name</label>
            <p className="text-lg font-medium">{userData?.name ?? "Not provided"}</p>
          </div>

          <Separator />

          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Email Address
            </label>
            <p className="text-lg">{userData?.email}</p>
          </div>

          <Separator />

          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Phone className="h-4 w-4" />
              Phone Number
            </label>
            <p className="text-lg">{userData?.phone ?? "Not provided"}</p>
          </div>
        </CardContent>
      </Card>

      {/* Account Information Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Account Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Hash className="h-4 w-4" />
              User ID
            </label>
            <p className="text-lg font-mono">#{userData?.id}</p>
          </div>

          <Separator />

          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Role</label>
            <div>
              <Badge variant="secondary" className="text-sm">
                {userData?.Role?.name ?? "User"}
              </Badge>
            </div>
          </div>

          <Separator />

          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Member Since
            </label>
            <p className="text-lg">{formatDate(userData?.createdAt)}</p>
          </div>

          <Separator />

          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Last Updated</label>
            <p className="text-lg">{formatDate(userData?.updateAt)}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
