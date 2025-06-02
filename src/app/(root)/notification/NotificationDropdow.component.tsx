"use client";

import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import Link from "next/link";
import {
  InfiniteData,
  useInfiniteQuery,
  useMutation,
} from "@tanstack/react-query";
import privateRequest from "@/healper/privateRequest";
import { AxiosError } from "axios";
import queryClient from "@/app/config/queryClient";
import { toast } from "@/hooks/use-toast";
import { Notification, NotificationPage } from "@/models";

const fetchNotifications = async (
  page: number,
  limit: number
): Promise<NotificationPage> => {
  const res = await privateRequest.get(
    `/notifications?page=${page}&limit=${limit}`
  );
  return res.data.data;
};

export function NotificationDropdown(): JSX.Element {
  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery<
    NotificationPage,
    AxiosError,
    InfiniteData<NotificationPage>
  >({
    queryKey: ["notifications"],
    queryFn: ({ pageParam = 1 }) => fetchNotifications(pageParam as number, 20),
    getNextPageParam: (lastPage) =>
      lastPage.pagination.hasNextPage
        ? lastPage.pagination.currentPage + 1
        : undefined,
    initialPageParam: 1,
  });

  // Flatten collections from all loaded pages
  const notifications: Notification[] =
    data?.pages.flatMap((p) => p.collection) ?? [];

  const unreadCount = notifications.filter((n) => !n.read).length;

  // Mutation: mark single notification as read
  const markRead = useMutation<void, AxiosError, { id: number }>({
    mutationFn: ({ id }) =>
      privateRequest.patch(`/notifications/${id}/read`, { read: true }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
    onError: () =>
      toast({
        title: "Error",
        description: "Failed to mark notification as read.",
        variant: "destructive",
      }),
  });

  // Render list or states
  const renderNotifications = () => {
    if (isLoading) return <p>Loading...</p>;
    if (isError) return <p>Error: {(error as Error).message}</p>;
    if (notifications.length === 0)
      return (
        <p className="text-sm text-muted-foreground py-4 text-center">
          No notifications
        </p>
      );

    return notifications.map((notification) => (
      <Link
        href={`/booking`}
        key={notification.id}
        className={`flex items-start gap-3 py-2 cursor-pointer ${
          !notification.read ? "bg-muted/50 -mx-4 px-4 rounded-md" : ""
        }`}
        onClick={() => markRead.mutate({ id: notification.id })}
      >
        <div className="flex-1">
          <h4 className="text-sm font-medium">{notification.title}</h4>
          <p className="text-sm text-muted-foreground">{notification.body}</p>
          <p className="text-xs text-muted-foreground">
            {new Date(notification.createdAt).toLocaleString()}
          </p>
        </div>
        {!notification.read && (
          <span className="mt-1 h-2 w-2 rounded-full bg-blue-600" />
        )}
      </Link>
    ));
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-xs text-destructive-foreground">
              {unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-80 p-0" align="end">
        <Card className="border-0 shadow-none">
          <CardHeader className="pb-3 p-4">
            <div className="flex items-center justify-between">
              <CardTitle>Notifications</CardTitle>
              <CardDescription>{unreadCount} unread</CardDescription>
            </div>
          </CardHeader>

          <CardContent className="max-h-[300px] overflow-y-auto p-0 px-4 space-y-4">
            {renderNotifications()}
          </CardContent>

          <CardFooter className="border-t pt-3 flex flex-col items-center">
            {hasNextPage && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
                className="mb-2"
              >
                {isFetchingNextPage ? "Loading..." : "Load More"}
              </Button>
            )}
            <Button variant="ghost" size="sm" asChild>
              <Link href="/notification">View all</Link>
            </Button>
          </CardFooter>
        </Card>
      </PopoverContent>
    </Popover>
  );
}
