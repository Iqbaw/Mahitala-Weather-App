import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import axiosInstance from "./axiosInstance";
import { API_URL } from "./Constants";

const firebaseConfig = {
  apiKey: "AIzaSyBJtTlFqSInZ14sSCaPuH8V2HuluBIRkIU",
  authDomain: "mahitala-cb8b6.firebaseapp.com",
  projectId: "mahitala-cb8b6",
  storageBucket: "mahitala-cb8b6.firebasestorage.app",
  messagingSenderId: "139501858476",
  appId: "1:139501858476:web:e0c7771358b4c250083909",
  measurementId: "G-71VGCDW19P",
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

export const requestPermissionAndRegisterToken = async () => {
  const token = localStorage.getItem("token");
  if (!token) {
    return null;
  }

  try {
    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      return null;
    }

    const registration = await navigator.serviceWorker.ready;

    const fcmToken = await getToken(messaging, {
      vapidKey:
        "BCLRrmurifCU5zU_aNYrTg0y7gOqyQyhsCsd_XwOyvSgffNbtiN0aY8UqnYmsSE5jDY8Myog51Fw5KQLnYGwoYc",
      serviceWorkerRegistration: registration,
    });

    if (fcmToken) {
      const res = await axiosInstance.post(
        API_URL + "/api/notifications/register-token",
        {
          fcmToken: fcmToken,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    return fcmToken;
  } catch (err) {
    return null;
  }
};

export const onMessageListener = () =>
  new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      resolve(payload);
    });
  });
