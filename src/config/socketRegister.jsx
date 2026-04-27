import { useEffect, useContext } from "react";
import socket from "./socket";
import { AuthContext } from "./AuthContext";

const SocketRegister = () => {
  const { folkEmail } = useContext(AuthContext);

  useEffect(() => {
    if (!folkEmail) return;

    // If already connected → register immediately
    if (socket.connected) {
      socket.emit("register-Socket", { email: folkEmail });
    }

    // Also handle future reconnects
    const handleConnect = () => {
      socket.emit("register-Socket", { email: folkEmail });
    };

    socket.on("connect", handleConnect);

    return () => {
      socket.off("connect", handleConnect);
    };
  }, [folkEmail]);

  return null;
};

export default SocketRegister;
