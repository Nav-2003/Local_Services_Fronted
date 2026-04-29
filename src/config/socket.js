import { io } from "socket.io-client";

const socket = io("http://localhost:3002", {
  path: "/socket.io",
  transports: ["websocket","polling"],   
  reconnection: true,
  reconnectionAttempts: Infinity,
  reconnectionDelay: 1000
});

socket.on("connect", () => {
  console.log("Connected:", socket.id);
});

socket.on("disconnect", () => {
  console.log("Disconnected");
});

export default socket;
