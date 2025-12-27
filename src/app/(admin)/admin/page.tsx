"use client";

import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchAdminStats } from "@/features/admin/stats-api";
import {
  Bell,
  Building2,
  CreditCard,
  DollarSign,
  Hotel,
  Star,
  Users,
  ClipboardList,
  BedDouble,
} from "lucide-react";

type StatConfig = {
  key: string;
  label: string;
  tone: string;
  bg: string;
  icon: typeof Users;
  format?: (value: number) => string;
};

const Dashboard = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: () => fetchAdminStats(),
  });

  const totals = data?.totals ?? {};
  const stats: StatConfig[] = [
    {
      key: "users",
      label: "Total Users",
      tone: "text-blue-600",
      bg: "bg-blue-50",
      icon: Users,
    },
    {
      key: "hotels",
      label: "Total Hotels",
      tone: "text-indigo-600",
      bg: "bg-indigo-50",
      icon: Hotel,
    },
    {
      key: "restaurants",
      label: "Total Restaurants",
      tone: "text-orange-600",
      bg: "bg-orange-50",
      icon: Building2,
    },
    {
      key: "rooms",
      label: "Total Rooms",
      tone: "text-sky-600",
      bg: "bg-sky-50",
      icon: BedDouble,
    },
    {
      key: "bookings",
      label: "Total Bookings",
      tone: "text-emerald-600",
      bg: "bg-emerald-50",
      icon: ClipboardList,
    },
    {
      key: "reviews",
      label: "Total Reviews",
      tone: "text-amber-600",
      bg: "bg-amber-50",
      icon: Star,
    },
    {
      key: "notifications",
      label: "Total Notifications",
      tone: "text-rose-600",
      bg: "bg-rose-50",
      icon: Bell,
    },
    {
      key: "payments",
      label: "Total Payments",
      tone: "text-violet-600",
      bg: "bg-violet-50",
      icon: CreditCard,
    },
    {
      key: "revenue",
      label: "Revenue",
      tone: "text-emerald-600",
      bg: "bg-emerald-50",
      icon: DollarSign,
      format: (value) => `$${value.toLocaleString()}`,
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Dashboard</h1>
        <p className="text-sm text-slate-500">
          Welcome back! Here&apos;s what&apos;s happening today.
        </p>
      </div>

      {isLoading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton key={index} className="h-28 w-full" />
          ))}
        </div>
      ) : isError ? (
        <Card className="border-slate-200 shadow-sm">
          <CardContent className="py-8 text-center text-slate-500">
            Unable to load admin stats.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => {
            const value =
              stat.key === "revenue"
                ? data?.revenue
                : totals[stat.key as keyof typeof totals];
            if (value === undefined || value === null) {
              return null;
            }
            const Icon = stat.icon;
            return (
              <Card key={stat.key} className="border-slate-200 shadow-sm">
                <CardContent className="p-5">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-xl ${stat.bg}`}
                  >
                    <Icon className={`h-5 w-5 ${stat.tone}`} />
                  </div>
                  <div className="mt-4 text-2xl font-semibold text-slate-900">
                    {stat.format ? stat.format(value) : value}
                  </div>
                  <p className="mt-1 text-sm text-slate-500">{stat.label}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {!isLoading && !isError && data && (
        <div className="grid gap-6 sm:grid-cols-2">
          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold text-slate-700">
                Bookings by Status
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              {Object.entries(data.bookingsByStatus).map(([status, count]) => (
                <span
                  key={status}
                  className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-500"
                >
                  {status}: {count}
                </span>
              ))}
            </CardContent>
          </Card>
          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold text-slate-700">
                Payments by Status
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              {Object.entries(data.paymentsByStatus).map(([status, count]) => (
                <span
                  key={status}
                  className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-500"
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
