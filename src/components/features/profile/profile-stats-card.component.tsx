"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Bell, MessageSquare } from "lucide-react";
import Link from "next/link";

interface UserData {
  bookings?: any[];
  review?: any[];
  notification?: any[];
}

interface ProfileStatsCardProps {
  userData: UserData;
}

export const ProfileStatsCard = ({ userData }: ProfileStatsCardProps) => {
  const stats = [
    {
      title: "Total Bookings",
      value: userData?.bookings?.length ?? 0,
      icon: BookOpen,
      description: "Completed bookings",
      tone: "primary",
      href: "/booking",
    },
    {
      title: "Reviews Written",
      value: userData?.review?.length ?? 0,
      icon: MessageSquare,
      description: "Reviews submitted",
      tone: "success",
      href: "/reviews",
    },
    {
      title: "Notifications",
      value: userData?.notification?.length ?? 0,
      icon: Bell,
      description: "Total notifications",
      tone: "action",
      href: "/notification",
    },
  ] as const;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Account Statistics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            const toneClasses = {
              primary: "bg-primary/10 text-primary",
              success: "bg-success/10 text-success",
              action: "bg-action/10 text-action",
            }[stat.tone];

            return (
              <Link
                key={index}
                href={stat.href}
                className="rounded-2xl border border-border bg-white p-4 transition-all hover:-translate-y-1 hover:shadow-lg hover:shadow-slate-900/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                aria-label={`View ${stat.title.toLowerCase()}`}
              >
                <div className="space-y-4">
                  <span className={`inline-flex h-10 w-10 items-center justify-center rounded-xl ${toneClasses}`}>
                    <Icon className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-3xl font-semibold text-foreground">{stat.value}</p>
                    <p className="text-sm font-medium text-foreground">{stat.title}</p>
                    <p className="text-xs text-muted-foreground">{stat.description}</p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
