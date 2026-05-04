"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Hash, Mail, Phone, Shield, User } from "lucide-react";

interface UserData {
  id: number;
  name?: string;
  email: string;
  phone?: string;
  createdAt?: string;
  updateAt?: string;
  role?: {
    id: number;
    name: string;
  };
  bookings?: any[];
  review?: any[];
  notification?: any[];
}

interface ProfileInfoCardProps {
  userData: UserData;
}

export const ProfileInfoCard = ({ userData }: ProfileInfoCardProps) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <User className="h-5 w-5" />
            </span>
            Personal Information
          </CardTitle>
        </CardHeader>
        <CardContent className="divide-y">
          <div className="space-y-2 py-3">
            <label className="text-sm font-medium text-muted-foreground">Full Name</label>
            <p className="text-lg font-medium text-foreground">{userData?.name ?? "Not provided"}</p>
          </div>
          <div className="space-y-2 py-3">
            <label className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <Mail className="h-4 w-4" />
              Email Address
            </label>
            <p className="text-lg text-foreground">{userData?.email}</p>
          </div>
          <div className="space-y-2 py-3">
            <label className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <Phone className="h-4 w-4" />
              Phone Number
            </label>
            <p className="text-lg text-foreground">{userData?.phone ?? "Not provided"}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-action/10 text-action">
              <Shield className="h-5 w-5" />
            </span>
            Account Information
          </CardTitle>
        </CardHeader>
        <CardContent className="divide-y">
          <div className="space-y-2 py-3">
            <label className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <Hash className="h-4 w-4" />
              User ID
            </label>
            <p className="text-lg font-mono text-foreground">#{userData?.id}</p>
          </div>
          <div className="space-y-2 py-3">
            <label className="text-sm font-medium text-muted-foreground">Role</label>
            <div>
              <Badge variant="secondary">{userData?.role?.name ?? "User"}</Badge>
            </div>
          </div>
          <div className="space-y-2 py-3">
            <label className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <Calendar className="h-4 w-4" />
              Member Since
            </label>
            <p className="text-lg text-foreground">
              {userData?.createdAt ? formatDate(userData.createdAt) : "—"}
            </p>
          </div>
          <div className="space-y-2 py-3">
            <label className="text-sm font-medium text-muted-foreground">Last Updated</label>
            <p className="text-lg text-foreground">
              {userData?.updateAt ? formatDate(userData.updateAt) : "—"}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
