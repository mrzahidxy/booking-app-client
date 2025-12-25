"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, MessageSquare, Bell } from "lucide-react"

interface UserData {
  bookings?: any[]
  review?: any[]
  notification?: any[]
}

interface ProfileStatsCardProps {
  userData: UserData
}

export const ProfileStatsCard = ({ userData }: ProfileStatsCardProps) => {
  const stats = [
    {
      title: "Total Bookings",
      value: userData?.bookings?.length ?? 0,
      icon: BookOpen,
      description: "Completed bookings",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Reviews Written",
      value: userData?.review?.length ?? 0,
      icon: MessageSquare,
      description: "Reviews submitted",
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Notifications",
      value: userData?.notification?.length ?? 0,
      icon: Bell,
      description: "Total notifications",
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Account Statistics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <div key={index} className={`p-4 rounded-lg border ${stat.bgColor} transition-all hover:shadow-md`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                    <p className="text-sm font-medium text-gray-900">{stat.title}</p>
                    <p className="text-xs text-gray-500">{stat.description}</p>
                  </div>
                  <Icon className={`h-8 w-8 ${stat.color}`} />
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
 