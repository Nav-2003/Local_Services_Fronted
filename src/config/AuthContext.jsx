import { createContext, useState, useEffect } from "react";
import socket from "./socket";

export const AuthContext = createContext();

const Api = import.meta.env.VITE_BACKEND_API;

export const AuthProvider = ({ children }) => {
  const [signIn, setSignIn] = useState(false);
  const [signUp, setSignUp] = useState(false);
  const [userSign, setUserSign] = useState(false);
  const [workerSign, setWorkerSign] = useState(false);
  const [folkEmail, setFolkEmail] = useState("");
  const [bookingId, setBookingId] = useState();
  const [service, setService] = useState();

  /* NEW: loading state while restoring session */
  const [authLoading, setAuthLoading] = useState(true);

  /* ---------- AUTO LOGIN AFTER REFRESH ---------- */
  useEffect(() => {
    const restoreSession = async () => {
      try {
        const res = await fetch(`${Api}/api/userAuth/refresh/refreshSignin`, {
          credentials: "include",
        });

        const data = await res.json();

        if (!res.ok || !data.success) {
          setAuthLoading(false);
          return;
        }

        /* Save new access token */
        localStorage.setItem("accessToken", data.accessToken);

        /* Restore global auth state */
        setSignIn(true);
        setFolkEmail(data.user.email);

        if (data.role === "customer") {
          setUserSign(true);
        } else {
          setWorkerSign(true);
        }

        /* Reconnect socket */
        socket.emit("register-Socket", { email: data.user.email });

      } catch (err) {
        console.log("Session restore failed");
      } finally {
        setAuthLoading(false);
      }
    };

    restoreSession();
  }, []);

  const logout = async () => {
  try {
    await fetch(`${Api}/api/userAuth/UserLogout/logout`, {
      method: "POST",
      credentials: "include",
    });
  } catch (err) {
    console.log("Logout error");
  }
  localStorage.removeItem("accessToken");
  setSignIn(false);
  setUserSign(false);
  setWorkerSign(false);
  setFolkEmail("");
  socket.disconnect();
};

  return (
    <AuthContext.Provider
      value={{
        signIn,
        setSignIn,
        signUp,
        setSignUp,
        userSign,
        setUserSign,
        workerSign,
        setWorkerSign,
        folkEmail,
        setFolkEmail,
        bookingId,
        setBookingId,
        service,
        setService,
        authLoading, 
        logout // NEW
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
