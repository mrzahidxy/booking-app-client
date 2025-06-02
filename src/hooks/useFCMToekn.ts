import { useEffect, useState } from "react";

export default function useFCMToken() {
  const [fcmToken, setFcmToken] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("fcm_token");
    if (token) {
      setFcmToken(token);
    }
  }, []);

  const storeFCMToken = (token: string) => {
    setFcmToken(token);
    localStorage.setItem("fcm_token", token);
  };

  return { fcmToken, storeFCMToken };
}
