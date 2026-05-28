"use client";

import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";
import { Building2, ClipboardList, CreditCard, DollarSign, Hotel, Users } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchWorkspaceStats } from "@/features/workspace/stats-api";
import { getTenantMembershipRole } from "@/shared/lib/session";

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

export const WorkspaceDashboard = () => {
  const { data: session } = useSession();
  const { data, isLoading, isError } = useQuery({
    queryKey: ["workspace-stats"],
    queryFn: () => fetchWorkspaceStats(),
  });
  const totals = data?.totals ?? {};
  const tenantMembership =
    session?.user?.tenantMembership ??
    session?.user?.tenantMemberships?.find(
      (membership) => membership.tenant?.isActive !== false
    );
  const tenantName = tenantMembership?.tenant?.name;
  const tenantRole = getTenantMembershipRole(session);
  const stats = [
    { key: "users", label: "Team Members", tone: "text-primary", bg: "bg-primary/10", icon: Users },
    { key: "hotels", label: "Hotel Listings", tone: "text-action", bg: "bg-action/10", icon: Hotel },
    { key: "restaurants", label: "Restaurant Listings", tone: "text-action", bg: "bg-action/10", icon: Building2 },
    { key: "bookings", label: "Tenant Bookings", tone: "text-success", bg: "bg-success/10", icon: ClipboardList },
    { key: "payments", label: "Tenant Payments", tone: "text-action", bg: "bg-action/10", icon: CreditCard },
    { key: "revenue", label: "Tenant Revenue", tone: "text-success", bg: "bg-success/10", icon: DollarSign, format: formatBdtCurrency },
  ];
  const statusSections = [
    { title: "Tenant Bookings by Status", values: data?.bookingsByStatus },
    { title: "Tenant Payments by Status", values: data?.paymentsByStatus },
  ];

  return (
    <div className="space-y-8">
      <div>
        <div className="flex flex-wrap items-center gap-2">
          <h1 className="text-3xl font-semibold tracking-tight">
            {tenantName ?? "Tenant Dashboard"}
          </h1>
          <Badge variant="secondary" className="rounded-full px-3 py-1 text-xs">
            Tenant workspace
          </Badge>
          {tenantRole ? (
            <Badge variant="outline" className="rounded-full px-3 py-1 text-xs">
              {tenantRole}
            </Badge>
          ) : null}
        </div>
        <p className="mt-2 text-sm text-muted-foreground">
          Track this tenant&apos;s listings, team, bookings, payments, and revenue.
        </p>
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
            Unable to load workspace stats.
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

      {!isLoading && !isError && data ? (
        <div className="grid gap-6 sm:grid-cols-2">
          {statusSections.map((section) => (
            <Card key={section.title} className="border-border shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold text-foreground">
                  {section.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                {Object.entries(section.values ?? {}).length > 0 ? (
                  Object.entries(section.values ?? {}).map(([status, count]) => (
                    <span
                      key={status}
                      className="rounded-full bg-muted px-3 py-1 text-xs font-semibold text-muted-foreground"
                    >
                      {status}: {count}
                    </span>
                  ))
                ) : (
                  <span className="text-sm text-muted-foreground">
                    No activity yet.
                  </span>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : null}
    </div>
  );
};
