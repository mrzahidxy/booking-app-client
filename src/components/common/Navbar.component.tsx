"use client";

import Link from "next/link";
import { ChevronDown, MenuIcon, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { signOut, useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { NotificationDropdown } from "@/components/features/notification/NotificationDropdow.component";
import { useToast } from "@/shared/hooks/use-toast";
import useFCMToken from "@/shared/hooks/useFCMToekn";
import { useEffect } from "react";
import { getToken, onMessage } from "firebase/messaging";
import { messaging } from "@/shared/lib/firebase-config";
import privateRequest from "@/shared/lib/api";
import { cn } from "@/shared/utils";

export function Navbar() {
  const { data: session, status } = useSession();
  const { push } = useRouter();
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  const { toast } = useToast();
  const { fcmToken, storeFCMToken } = useFCMToken();

  useEffect(() => {
    if (!messaging) {
      return;
    }

    const requestPermission = async () => {
      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        if (!messaging) {
          return;
        }
        const currentFCMToken = await getToken(messaging, {
          vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
        });
        if (currentFCMToken) {
          storeFCMToken(currentFCMToken);
        }
      }
    };

    if (!fcmToken) {
      requestPermission();
    }
  }, [fcmToken, storeFCMToken]);

  // Handle incoming notifications
  useEffect(() => {
    if (!messaging) {
      return;
    }

    const unsubscribe = onMessage(messaging, (payload) => {
      toast({
        title: payload.notification?.title,
        description: payload.notification?.body,
      });
    });

    return () => {
      unsubscribe();
    };
  }, [toast]);

  const handleSignOut = async () => {
    try {
      await signOut();
      push("/auth/login");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  useEffect(() => {
    if (status !== "authenticated" || !fcmToken) {
      return;
    }

    privateRequest.put("/users/fcm", {
      fcmToken,
    });
  }, [status, fcmToken]);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/80 bg-white/90 backdrop-blur-xl shadow-sm shadow-slate-900/5">
      <div
        className={cn(
          "flex h-16 items-center",
          isAdmin ? "px-4 sm:px-6 lg:px-10" : "container"
        )}
      >
        <div className="md:hidden">
          <Button variant="ghost" size="icon" className="rounded-full text-muted-foreground hover:text-primary">
            <MenuIcon className="h-5 w-5" />
          </Button>
        </div>

        <Link
          href="/"
          className="ml-4 flex items-center space-x-2 text-lg font-semibold tracking-tight text-primary md:ml-0"
        >
          <span>Gontobbo</span>
        </Link>

        <div className="ml-auto flex items-center space-x-3">
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 rounded-full border border-transparent text-muted-foreground hover:border-border hover:bg-background hover:text-primary"
          >
            <Heart className="h-5 w-5" />
          </Button>

          {status === "loading" && (
            // Loading state
            <span className="text-sm font-medium">Loading...</span>
          )}

          {status === "authenticated" && (
            <>
              <NotificationDropdown />
              <div className="flex items-center gap-2">
              <Link
                href="/profile"
                className="text-sm font-semibold text-foreground transition-colors hover:text-primary"
              >
                {session.user?.name ?? "User"}
              </Link>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-full border border-transparent text-muted-foreground hover:border-border hover:bg-background hover:text-primary"
                    >
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    {String(session.user?.role).toUpperCase() === "ADMIN" ? (
                      <DropdownMenuItem onClick={() => push("/admin")}>
                        Admin Panel
                      </DropdownMenuItem>
                    ) : (
                      <DropdownMenuItem onClick={() => push("/profile")}>
                        Profile
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem onClick={handleSignOut}>
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </>
          )}

          {status === "unauthenticated" && (
            // Sign-in link for unauthenticated users
            <Link
              href="/auth/login"
              className="text-sm font-semibold text-foreground hover:text-primary"
            >
              Sign in
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
