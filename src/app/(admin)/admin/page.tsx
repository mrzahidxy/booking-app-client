"use client";

import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchAdminStats } from "@/features/admin/stats-api";

type StatConfig = {
  key: string;
  label: string;
  tone: string;
  bg: string;
  format?: (value: number) => string;
};

const Dashboard = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: () => fetchAdminStats(),
  });

  const totals = data?.totals ?? {};
  const stats: StatConfig[] = [
    { key: "users", label: "Total Users", tone: "text-blue-600", bg: "bg-blue-50" },
    { key: "hotels", label: "Total Hotels", tone: "text-blue-600", bg: "bg-blue-50" },
    { key: "restaurants", label: "Total Restaurants", tone: "text-orange-600", bg: "bg-orange-50" },
    { key: "rooms", label: "Total Rooms", tone: "text-blue-600", bg: "bg-blue-50" },
    { key: "bookings", label: "Total Bookings", tone: "text-emerald-600", bg: "bg-emerald-50" },
    { key: "reviews", label: "Total Reviews", tone: "text-blue-600", bg: "bg-blue-50" },
    { key: "notifications", label: "Total Notifications", tone: "text-orange-600", bg: "bg-orange-50" },
    { key: "payments", label: "Total Payments", tone: "text-blue-600", bg: "bg-blue-50" },
    {
      key: "revenue",
      label: "Revenue",
      tone: "text-emerald-600",
      bg: "bg-emerald-50",
      format: (value) => `$${value.toLocaleString()}`,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of bookings, listings, and platform performance.
        </p>
      </div>

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton key={index} className="h-28 w-full" />
          ))}
        </div>
      ) : isError ? (
        <Card className="shadow-sm">
          <CardContent className="py-8 text-center text-muted-foreground">
            Unable to load admin stats.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {stats.map((stat) => {
            const value =
              stat.key === "revenue"
                ? data?.revenue
                : totals[stat.key as keyof typeof totals];
            if (value === undefined || value === null) {
              return null;
            }
            return (
              <Card key={stat.key} className="shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {stat.label}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div
                    className={`inline-flex rounded-lg px-3 py-2 text-2xl font-semibold ${stat.bg} ${stat.tone}`}
                  >
                    {stat.format ? stat.format(value) : value}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {!isLoading && !isError && data && (
        <div className="grid gap-4 sm:grid-cols-2">
          <Card className="shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Bookings by Status
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              {Object.entries(data.bookingsByStatus).map(([status, count]) => (
                <span
                  key={status}
                  className="rounded-full bg-muted px-3 py-1 text-sm text-muted-foreground"
                >
                  {status}: {count}
                </span>
              ))}
            </CardContent>
          </Card>
          <Card className="shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Payments by Status
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              {Object.entries(data.paymentsByStatus).map(([status, count]) => (
                <span
                  key={status}
                  className="rounded-full bg-muted px-3 py-1 text-sm text-muted-foreground"
                >
                  {status}: {count}
                </span>
              ))}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
