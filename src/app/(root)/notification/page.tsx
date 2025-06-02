"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { Check, Bell, BellOff } from "lucide-react";
import { useState } from "react";
import privateRequest from "@/healper/privateRequest";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AxiosError } from "axios";
import queryClient from "@/app/config/queryClient";
import { toast } from "@/hooks/use-toast";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Notification } from "@/models";

// Fetch data using react-query
const fetchNotifications = async (page: number, limit: number) => {
  const response = await privateRequest.get(
    `/notifications?page=${page}&limit=${limit}`
  );
  return response.data;
};

export default function NotificationsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["notifications", currentPage],
    queryFn: () => fetchNotifications(currentPage, 20),
  });

  const notifications = data?.data?.collection ?? [];
  const unreadNotifications = notifications.filter(
    (n: Notification) => !n.read
  );
  const readNotifications = notifications.filter((n: Notification) => n.read);

  //Mutation for updating the user role
  const { mutate, isPending } = useMutation<
    {}, // Expected response type
    AxiosError<{}>, // Error type with extended interface
    { id: string } // Variables type
  >({
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
    onError: (err) => {
      toast({
        title: "Error",
        description: "Failed. Please try again.",
        variant: "destructive",
      });
    },
  });

  // const handleMarkAllAsRead = () => {
  //   console.log("Marking all notifications as read");
  // };

  const handleMarkAsRead = (id: string) => {
    mutate({ id: id });
  };

  // Handle error and loading states
  if (isLoading) return <div>Loading notifications...</div>;
  if (isError) return <div>Error loading notifications: {error.message}</div>;

  return (
    <div className="container py-10 max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Notifications</h1>
        {/* <Button onClick={handleMarkAllAsRead}>
          <Check className="mr-2 h-4 w-4" />
          Mark all as read
        </Button> */}
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="all">All ({notifications.length})</TabsTrigger>
          <TabsTrigger value="unread">
            Unread ({unreadNotifications.length})
          </TabsTrigger>
          <TabsTrigger value="read">
            Read ({readNotifications.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {renderNotifications(notifications, handleMarkAsRead)}
        </TabsContent>

        <TabsContent value="unread" className="space-y-4">
          {unreadNotifications.length > 0 ? (
            renderNotifications(unreadNotifications, handleMarkAsRead)
          ) : (
            <EmptyState
              icon={<Bell className="h-8 w-8 text-muted-foreground" />}
              title="No unread notifications"
              description="You've read all your notifications. Check back later for new updates."
            />
          )}
        </TabsContent>

        <TabsContent value="read" className="space-y-4">
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
      {data.data.pagination?.totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => setCurrentPage(currentPage - 1)}
              />
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
              <PaginationNext onClick={() => setCurrentPage(currentPage + 1)} />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}

// Render notifications
function renderNotifications(
  notifications: Notification[],
  handleMarkAsRead?: (id: string) => void
) {
  return notifications.map((notification) => (
    <Card key={notification.id} className="overflow-hidden">
      <CardContent className="p-0">
        <div className="flex items-start p-6">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className="font-medium">{notification.title}</h3>
              {!notification.read && (
                <span className="h-2 w-2 rounded-full bg-blue-600" />
              )}
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              {notification.body}
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              {notification.createdAt}
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="ml-2"
            onClick={() => handleMarkAsRead?.(notification.id.toString())}
          >
            {!notification.read && "Mark as read"}
          </Button>
        </div>
      </CardContent>
    </Card>
  ));
}

// Empty state component
function EmptyState({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center py-10">
        {icon}
        <CardTitle className="mt-4">{title}</CardTitle>
        <CardDescription className="mt-2 text-center max-w-md">
          {description}
        </CardDescription>
      </CardContent>
    </Card>
  );
}
