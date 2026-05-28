"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Bell, BellOff } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import privateRequest from "@/shared/lib/api";
import { Notification } from "@/entities";
import queryClient from "@/shared/lib/query-client";
import { toast } from "@/shared/hooks/use-toast";

const fetchNotifications = async (page: number, limit: number) => {
  const response = await privateRequest.get(`/notifications?page=${page}&limit=${limit}`);
  return response.data;
};

export default function NotificationsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const { status } = useSession();
  const isSessionReady = status === "authenticated";

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["notifications", currentPage],
    queryFn: () => fetchNotifications(currentPage, 20),
    enabled: isSessionReady,
  });

  const notifications = data?.data?.collection ?? [];
  const unreadNotifications = notifications.filter((notification: Notification) => !notification.read);
  const readNotifications = notifications.filter((notification: Notification) => notification.read);

  const { mutate, isPending } = useMutation({
    mutationFn: async (values: { id: string }) => {
      return await privateRequest.patch(`/notifications/${values.id}/read`, {
        read: true,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["notifications"],
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to mark notification as read.",
        variant: "destructive",
      });
    },
  });

  const handleMarkAsRead = (id: string) => {
    mutate({ id });
  };

  if (status === "loading" || isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Notifications</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Stay updated on bookings and account activity.
          </p>
        </div>
        <Card className="border-border shadow-sm">
          <CardContent className="py-8 text-center text-muted-foreground">
            Checking your session...
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Notifications</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Stay updated on bookings and account activity.
          </p>
        </div>
        <Card className="border-border shadow-sm">
          <CardContent className="py-8 text-center text-destructive">
            Error loading notifications: {(error as Error).message}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Notifications</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Stay updated on bookings and account activity.
          </p>
        </div>
        <Badge variant="warning" className="w-fit">
          {unreadNotifications.length} unread
        </Badge>
      </div>

      <Card className="border-border shadow-sm">
        <CardContent className="p-6">
          <Tabs defaultValue="all" className="w-full pt-2">
            <TabsList className="mb-6 h-auto w-full justify-start rounded-2xl bg-muted/60 p-1 sm:inline-flex sm:w-auto">
              <TabsTrigger value="all" className="flex-1 rounded-xl px-4 py-2 sm:flex-none">
                All ({notifications.length})
              </TabsTrigger>
              <TabsTrigger value="unread" className="flex-1 rounded-xl px-4 py-2 sm:flex-none">
                Unread ({unreadNotifications.length})
              </TabsTrigger>
              <TabsTrigger value="read" className="flex-1 rounded-xl px-4 py-2 sm:flex-none">
                Read ({readNotifications.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-0 space-y-4">
              {renderNotifications(notifications, handleMarkAsRead, isPending)}
            </TabsContent>

            <TabsContent value="unread" className="mt-0 space-y-4">
              {unreadNotifications.length > 0 ? (
                renderNotifications(unreadNotifications, handleMarkAsRead, isPending)
              ) : (
                <EmptyState
                  icon={<Bell className="h-8 w-8 text-muted-foreground" />}
                  title="No unread notifications"
                  description="You've read all your notifications. Check back later for new updates."
                />
              )}
            </TabsContent>

            <TabsContent value="read" className="mt-0 space-y-4">
              {readNotifications.length > 0 ? (
                renderNotifications(readNotifications)
              ) : (
                <EmptyState
                  icon={<BellOff className="h-8 w-8 text-muted-foreground" />}
                  title="No read notifications"
                  description="You haven't read any notifications yet."
                />
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {data.data.pagination?.totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious onClick={() => setCurrentPage(Math.max(1, currentPage - 1))} />
            </PaginationItem>
            {[...Array(data.data.pagination.totalPages)].map((_, index) => (
              <PaginationItem key={index}>
                <PaginationLink
                  onClick={() => setCurrentPage(index + 1)}
                  isActive={currentPage === index + 1}
                >
                  {index + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                onClick={() =>
                  setCurrentPage(Math.min(data.data.pagination.totalPages, currentPage + 1))
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}

function renderNotifications(
  notifications: Notification[],
  handleMarkAsRead?: (id: string) => void,
  isPending?: boolean
) {
  if (!notifications.length) {
    return (
      <Card className="border-dashed border-border">
        <CardContent className="py-8 text-center text-sm text-muted-foreground">
          No notifications available.
        </CardContent>
      </Card>
    );
  }

  return notifications.map((notification) => (
    <Card
      key={notification.id}
      className="overflow-hidden border-border shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
    >
      <CardContent className="p-0">
        <div className="flex items-start justify-between gap-4 p-6">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className="font-medium">{notification.title}</h3>
              {!notification.read && <span className="h-2 w-2 rounded-full bg-primary" />}
            </div>
            <p className="mt-1 text-sm text-muted-foreground">{notification.body}</p>
            <p className="mt-2 text-xs text-muted-foreground">
              {new Date(notification.createdAt).toLocaleString()}
            </p>
          </div>
          {!notification.read ? (
            <Button
              variant="ghost"
              size="sm"
              className="shrink-0"
              disabled={isPending}
              onClick={() => handleMarkAsRead?.(notification.id.toString())}
            >
              Mark as read
            </Button>
          ) : null}
        </div>
      </CardContent>
    </Card>
  ));
}

function EmptyState({
  icon,
  title,
  description,
}: {
  icon: ReactNode;
  title: string;
  description: string;
}) {
  return (
    <Card className="border-dashed border-border">
      <CardContent className="flex flex-col items-center justify-center py-10">
        {icon}
        <CardTitle className="mt-4">{title}</CardTitle>
        <CardDescription className="mt-2 max-w-md text-center">{description}</CardDescription>
      </CardContent>
    </Card>
  );
}
