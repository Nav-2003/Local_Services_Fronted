import { io } from "socket.io-client";
const ApiZ = import.meta.env.VITE_BACKEND_APIZ;
const ApiO = import.meta.env.VITE_BACKEND_APIO;
const ApiT = import.meta.env.VITE_BACKEND_APIT;
const ApiH = import.meta.env.VITE_BACKEND_APIH;

const socket = io(`${ApiT}`, {
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
