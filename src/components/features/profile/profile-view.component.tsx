"use client";

import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { fetchCurrentUser } from "@/features/users/api";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Edit } from "lucide-react";
import DefaultLoader from "@/components/common/DefaultLoacer.component";
import { useState } from "react";

import { ProfileEdit } from "./profile-edit.component";
import { ProfileInfoCard } from "./profile-info-card.component";
import { ProfileStatsCard } from "./profile-stats-card.component";

export const ProfileView = () => {
  const { data: session } = useSession();
  const [isEditing, setIsEditing] = useState(false);
  const userId = session?.user?.id;

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["user-profile", userId],
    queryFn: () => fetchCurrentUser(),
    enabled: !!userId,
    staleTime: 0,
    refetchOnMount: true,
  });

  if (isLoading) {
    return <DefaultLoader showImage={false} />;
  }

  if (isError) {
    return (
      <div className="py-10 text-center">
        <p className="text-sm text-destructive">Error loading profile: {error?.message}</p>
      </div>
    );
  }

  if (isEditing) {
    return (
      <div className="container mx-auto max-w-4xl py-8">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-semibold tracking-tight">Edit Profile</h1>
        </div>
        <ProfileEdit onCancel={() => setIsEditing(false)} />
      </div>
    );
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return "—";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const initials =
    data?.name
      ?.split(" ")
      .map((name: string) => name[0])
      .join("")
      .slice(0, 2) ?? "U";

  return (
    <div className="container mx-auto max-w-4xl py-8">
      <div className="space-y-6">
        <Card className="border-border shadow-lg shadow-slate-900/10">
          <CardContent className="p-6">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-6">
                <div className="flex h-32 w-32 items-center justify-center rounded-full border-4 border-background bg-primary/10 text-3xl font-semibold text-primary shadow-lg">
                  {initials}
                </div>
                <div>
                  <h1 className="text-3xl font-semibold tracking-tight">
                    {data?.name ?? "My Profile"}
                  </h1>
                  <p className="text-lg text-muted-foreground">{data?.email}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <Badge variant="secondary">Phone: {data?.phone ?? "—"}</Badge>
                    <Badge variant="secondary">User ID: #{data?.id}</Badge>
                    <Badge variant="secondary">
                      Member since: {formatDate(data?.createdAt)}
                    </Badge>
                  </div>
                </div>
              </div>
              <Button onClick={() => setIsEditing(true)} size="sm">
                <Edit className="mr-2 h-4 w-4" />
                Edit Profile
              </Button>
            </div>
          </CardContent>
        </Card>

        <ProfileStatsCard userData={data} />
        <ProfileInfoCard userData={data} />
      </div>
    </div>
  );
};
