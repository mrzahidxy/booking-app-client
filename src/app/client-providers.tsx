"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { SessionProvider } from "next-auth/react";
import { ReactNode, useEffect } from "react";
import queryClient from "./config/queryClient";
import { getToken, onMessage } from "firebase/messaging";
import { messaging } from "../firebase-config";
import { useToast } from "@/hooks/use-toast";

export default function ClientProviders({ children }: { children: ReactNode }) {
  const { toast } = useToast();

  useEffect(() => {
    const requestPermission = async () => {
      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        const currentToken = await getToken(messaging, {
          vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
        });
        if (currentToken) {
          console.log("FCM Token:", currentToken);
          localStorage.setItem("fcm_token", currentToken);
        } else {
          console.log("No registration token available.");
        }
      } else {
        console.log("Notification permission denied.");
      }
    };

    requestPermission();
  }, []);

  useEffect(() => {
    onMessage(messaging, (payload) => {
      toast({
        title: payload.notification?.title,
        description: payload.notification?.body,
      });
    });
  }, []);

  return (
    <SessionProvider>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </SessionProvider>
  );
}
