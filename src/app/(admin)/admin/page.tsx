"use client";

import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";
import {
  Building2,
  ClipboardList,
  CreditCard,
  DollarSign,
  Hotel,
  Shield,
  Users,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchAdminStats } from "@/features/admin/stats-api";
import { isPlatformAdminSession } from "@/shared/lib/session";

type StatConfig = {
  key: string;
  label: string;
  tone: string;
  bg: string;
  icon: typeof Users;
  visibleForTenant?: boolean;
  format?: (value: number) => string;
};

const formatBdtCurrency = (value: number) => {
  try {
    return new Intl.NumberFormat("bn-BD", {
      style: "currency",
      currency: "BDT",
    }).format(value);
  } catch {
    return `BDT ${value.toLocaleString()}`;
  }
};

const Dashboard = () => {
  const { data: session } = useSession();
  const isPlatformAdmin = isPlatformAdminSession(session);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: () => fetchAdminStats(),
  });

  const totals = data?.totals ?? {};
  const stats: StatConfig[] = [
    { key: "tenants", label: "Total Tenants", tone: "text-primary", bg: "bg-primary/10", icon: Shield, visibleForTenant: false },
    { key: "activeTenants", label: "Active Tenants", tone: "text-success", bg: "bg-success/10", icon: Shield, visibleForTenant: false },
    { key: "users", label: "Total Users", tone: "text-primary", bg: "bg-primary/10", icon: Users, visibleForTenant: false },
    { key: "hotels", label: "Total Hotels", tone: "text-action", bg: "bg-action/10", icon: Hotel, visibleForTenant: true },
    { key: "restaurants", label: "Total Restaurants", tone: "text-action", bg: "bg-action/10", icon: Building2, visibleForTenant: true },
    { key: "bookings", label: "Total Bookings", tone: "text-success", bg: "bg-success/10", icon: ClipboardList, visibleForTenant: true },
    { key: "payments", label: "Total Payments", tone: "text-action", bg: "bg-action/10", icon: CreditCard, visibleForTenant: true },
    { key: "revenue", label: "Revenue", tone: "text-success", bg: "bg-success/10", icon: DollarSign, visibleForTenant: true, format: formatBdtCurrency },
  ];

  const visibleStats = stats.filter((stat) => isPlatformAdmin || stat.visibleForTenant);

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-3xl font-semibold tracking-tight">Dashboard</h1>
            <Badge variant="secondary" className="rounded-full px-3 py-1 text-xs">
              {isPlatformAdmin ? "System admin" : "Tenant workspace"}
            </Badge>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            {isPlatformAdmin
              ? "Monitor tenants, users, listings, bookings, and payments across the system."
              : "Track your assigned organisation, bookings, and revenue."}
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton key={index} className="h-28 w-full" />
          ))}
        </div>
      ) : isError ? (
        <Card className="border-border shadow-sm">
          <CardContent className="py-8 text-center text-muted-foreground">
            Unable to load dashboard stats.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {visibleStats.map((stat) => {
            const value =
              stat.key === "revenue"
                ? data?.revenue
                : totals[stat.key as keyof typeof totals];
            if (value === undefined || value === null) {
              return null;
            }

            const Icon = stat.icon;

            return (
              <Card key={stat.key} className="border-border shadow-sm">
                <CardContent className="p-5">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${stat.bg}`}>
                    <Icon className={`h-5 w-5 ${stat.tone}`} />
                  </div>
                  <div className="mt-4 text-2xl font-semibold text-foreground">
                    {stat.format ? stat.format(value) : value}
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {!isLoading && !isError && data && isPlatformAdmin && (
        <div className="grid gap-6 sm:grid-cols-2">
          <Card className="border-border shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold text-foreground">
                Bookings by Status
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              {Object.entries(data.bookingsByStatus).map(([status, count]) => (
                <span
                  key={status}
                  className="rounded-full bg-muted px-3 py-1 text-xs font-semibold text-muted-foreground"
                >
                  {status}: {count}
                </span>
              ))}
            </CardContent>
          </Card>

          <Card className="border-border shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold text-foreground">
                Payments by Status
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              {Object.entries(data.paymentsByStatus).map(([status, count]) => (
                <span
                  key={status}
                  className="rounded-full bg-muted px-3 py-1 text-xs font-semibold text-muted-foreground"
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
