"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Hash, Mail, Phone, Shield, User } from "lucide-react"

interface UserData {
  id: number
  name?: string
  email: string
  phone?: string
  createdAt?: string
  updateAt?: string
  role?: {
    id: number
    name: string
  }
  bookings?: any[]
  review?: any[]
  notification?: any[]
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
          <CardTitle className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
              <User className="h-5 w-5" />
            </span>
            Personal Information
          </CardTitle>
        </CardHeader>
        <CardContent className="divide-y">
          <div className="py-3 space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Full Name</label>
            <p className="text-lg font-medium">{userData?.name ?? "Not provided"}</p>
          </div>
          <div className="py-3 space-y-2">
            <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Email Address
            </label>
            <p className="text-lg">{userData?.email}</p>
          </div>
          <div className="py-3 space-y-2">
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
          <CardTitle className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-50 text-orange-500">
              <Shield className="h-5 w-5" />
            </span>
            Account Information
          </CardTitle>
        </CardHeader>
        <CardContent className="divide-y">
          <div className="py-3 space-y-2">
            <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Hash className="h-4 w-4" />
              User ID
            </label>
            <p className="text-lg font-mono">#{userData?.id}</p>
          </div>
          <div className="py-3 space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Role</label>
            <div>
              <Badge className="bg-primary/10 text-primary hover:bg-primary/15">
                {userData?.role?.name ?? "User"}
              </Badge>
            </div>
          </div>
          <div className="py-3 space-y-2">
            <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Member Since
            </label>
            <p className="text-lg">
              {userData?.createdAt ? formatDate(userData.createdAt) : "—"}
            </p>
          </div>
          <div className="py-3 space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Last Updated</label>
            <p className="text-lg">
              {userData?.updateAt ? formatDate(userData.updateAt) : "—"}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
