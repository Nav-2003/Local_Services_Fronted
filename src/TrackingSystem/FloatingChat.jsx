import { MessageCircle, Send, X } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import socket from "../config/socket";

export default function FloatingChat({ data }) {
  const bookingId = data.bookingId;
  const userType = data.type; // "worker" or "customer"

  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const bottomRef = useRef(null);

  /* ================= JOIN ROOM ================= */
  useEffect(() => {
    if (!bookingId) return;
    socket.emit("joinRoom", { roomId: bookingId, email: data.email });
  }, [bookingId]);

  /* ================= RECEIVE MESSAGE ================= */
  useEffect(() => {
    const handleMessage = (data) => {
      setMessages((prev) => [...prev, data]);
    };

    socket.on("chatMessage", handleMessage);
    return () => socket.off("chatMessage", handleMessage);
  }, []);

  /* ================= AUTO SCROLL ================= */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /* ================= SEND MESSAGE ================= */
  const sendMessage = () => {
    if (!message.trim()) return;

    const payload = {
      roomId: bookingId,
      sender: userType,
      email: data.email,
      text: message,
    };

    socket.emit("chatMessage", payload);
    setMessages((prev) => [...prev, payload]);
    setMessage("");
  };

  return (
    <>
      {/* ================= FLOATING BUTTON ================= */}
      <button
        onClick={() => {
          console.log("CHAT CLICKED");
          setOpen(true);
        }}
        className="
          fixed bottom-6 right-6 
          z-[9999] pointer-events-auto
          bg-blue-600 hover:bg-blue-700
          text-white p-4 rounded-full shadow-2xl transition
        "
      >
        <MessageCircle className="w-6 h-6" />
      </button>

      {/* ================= CHAT BOX ================= */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 60, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 60, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 280, damping: 25 }}
            className="
              fixed z-[9999]
              w-[320px] h-[420px]
              bg-white rounded-2xl shadow-2xl
              flex flex-col overflow-hidden border ring-1 ring-blue-100

              /* Mobile */
              bottom-[120px] right-4

              /* Desktop – stick near right panel edge */
              lg:bottom-[120px] lg:right-[380px]
            "
          >
            {/* ================= HEADER ================= */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600
                            text-white p-3 flex justify-between items-center">
              <span className="font-semibold">Live Chat</span>
              <button onClick={() => setOpen(false)}>
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* ================= MESSAGES ================= */}
            <div className="flex-1 p-3 overflow-y-auto space-y-2 bg-gray-50">
              {messages.map((msg, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: msg.sender === userType ? 40 : -40 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`
                    max-w-[75%] px-3 py-2 rounded-xl text-sm
                    ${msg.sender === userType
                      ? "bg-blue-600 text-white ml-auto"
                      : "bg-white text-black mr-auto shadow"}
                  `}
                >
                  {msg.text}
                </motion.div>
              ))}
              <div ref={bottomRef} />
            </div>

            {/* ================= INPUT ================= */}
            <div className="p-3 border-t flex gap-2 bg-white">
              <input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                placeholder="Type a message..."
                className="
                  flex-1 border rounded-xl px-3 py-2 text-sm outline-none
                  focus:ring-2 focus:ring-blue-400
                "
              />
              <button
                onClick={sendMessage}
                className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-xl transition"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
