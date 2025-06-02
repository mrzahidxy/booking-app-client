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
import { NotificationDropdown } from "./notification/NotificationDropdow.component";
import { useToast } from "@/hooks/use-toast";
import useFCMToken from "@/hooks/useFCMToekn";
import { useEffect } from "react";
import { getToken, onMessage } from "firebase/messaging";
import { messaging } from "@/firebase-config";
import privateRequest from "@/healper/privateRequest";

export function Navbar() {
  const { data: session, status } = useSession();
  const { push } = useRouter();

  const { toast } = useToast();
  const { fcmToken, storeFCMToken } = useFCMToken();

  useEffect(() => {
    const requestPermission = async () => {
      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        const currentFCMToken = await getToken(messaging, {
          vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
        });
        if (currentFCMToken) {
          storeFCMToken(currentFCMToken);
        } else {
          console.log("No registration token available.");
        }
      } else {
        console.log("Notification permission denied.");
      }
    };

    if (!fcmToken) {
      requestPermission();
    }
  }, []);

  useEffect(() => {
    onMessage(messaging, (payload) => {
      toast({
        title: payload.notification?.title,
        description: payload.notification?.body,
      });
    });
  }, []);

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
        const fcmToken = localStorage.getItem("fcm_token");
        if (!fcmToken) return;

        privateRequest.put("/users/fcm", {
          fcmToken: localStorage.getItem("fcm_token"),
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
          )}

          <NotificationDropdown/> 
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
