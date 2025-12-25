"use client";

import Link from "next/link";
import { MenuIcon, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { NotificationDropdown } from "@/components/features/notification/NotificationDropdow.component";
import { useToast } from "@/shared/hooks/use-toast";
import useFCMToken from "@/shared/hooks/useFCMToekn";
import { useEffect } from "react";
import { getToken, onMessage } from "firebase/messaging";
import { messaging } from "@/shared/lib/firebase-config";
import privateRequest from "@/shared/lib/api";

export function Navbar() {
  const { data: session, status } = useSession();
  const { push } = useRouter();

  const { toast } = useToast();
  const { fcmToken, storeFCMToken } = useFCMToken();

  useEffect(() => {
    if (!messaging) {
      return;
    }

    const requestPermission = async () => {
      const permission = await Notification.requestPermission();
      if (permission === "granted") {
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
    if (status === "authenticated") {
      if (!fcmToken) return;

      privateRequest.put("/users/fcm", {
        fcmToken: fcmToken,
      });
    }
  }, [status]);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <Button variant="ghost" size="icon">
            <MenuIcon className="h-5 w-5" />
          </Button>
        </div>

        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2 ml-4 md:ml-0">
          <span className="text-xl font-bold">Bookinn.</span>
        </Link>

        {/* Right Section */}
        <div className="flex items-center space-x-4 ml-auto">
          {/* Favorites Button */}
          <Button variant="ghost" size="icon">
            <Heart className="h-5 w-5" />
          </Button>

          {status === "loading" && (
            // Loading state
            <span className="text-sm font-medium">Loading...</span>
          )}

          {status === "authenticated" && (
            <>
              <NotificationDropdown />
              <DropdownMenu>
                <DropdownMenuTrigger className="text-sm font-medium">
                  {session.user?.name ?? "User"}
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {session.user?.role === "Admin" ? (
                    <DropdownMenuItem onClick={() => push("/admin")}>
                      Admin Panel
                    </DropdownMenuItem>
                  ) : (
                    <DropdownMenuItem onClick={() => push("/profile")}>
                      User Panel
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={handleSignOut}>
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          )}

          {status === "unauthenticated" && (
            // Sign-in link for unauthenticated users
            <Link href="/auth/login" className="text-sm font-medium">
              Sign in
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
