import { CheckCircle, Loader2 } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import socket from "../config/socket";
import { AuthContext } from "../config/AuthContext";
import { useNavigate } from "react-router-dom";


const Api = import.meta.env.VITE_BACKEND_API;
export default function BookingPendingOverlay({
  provider,
  bookingId,
  onClose,
  onAccept,
}) {
  const TOTAL_TIME = 300; // 5 min
  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME);
  const [rejected, setRejected] = useState(false);
  const { folkEmail } = useContext(AuthContext);
  const navigate=useNavigate();

  /* ================= SOCKET LISTENER (ONCE) ================= */
  useEffect(() => {
    socket.on("checkWorkerAssignResult", (msg) => {
      console.log("Assign result:", msg.result);
      if (!msg.result) {
        setRejected(true);
      }
      if (msg.result) {
        onAccept();
        onClose();
        navigate('/serivice/liveTracking');
      }
    });
    return () => {
      socket.off("checkWorkerAssignResult");
    };
  }, []);

  /* ================= COUNTDOWN + EMIT ================= */
  useEffect(() => {
    if (!provider) return;

    const timer = setInterval(() => {
      setTimeLeft((t) => t - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [provider]);

  /* ================= AUTO CLOSE AFTER REJECT ================= */
  useEffect(() => {
    if (!rejected) return;

    const closeTimer = setTimeout(() => {
      setRejected(false);
      onClose();
    }, 3000);

    return () => clearTimeout(closeTimer);
  }, [rejected]);

  const handleOnClose=()=>{
       
        const data=fetch(`http://localhost:3001/api/bookingrej/cancel_customer`,{
                  method:'PUT',
                  headers:{
                     "Content-Type": "application/json" 
                  },
                  body:JSON.stringify({bookingId})
              })
              onClose();

  }
  if (!provider) return null;

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const progress = (timeLeft / TOTAL_TIME) * 100;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[9999]
                   bg-black/40 backdrop-blur-sm
                   flex items-center justify-center"
      >
        <motion.div
          initial={{ y: 40, scale: 0.95 }}
          animate={{ y: 0, scale: 1 }}
          exit={{ y: 40, scale: 0.95 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-3xl shadow-2xl
                     p-8 w-[90%] max-w-md text-center relative"
        >
          {/* STATUS BADGE */}
          <div className="absolute top-4 right-4 text-xs
                          bg-blue-100 text-blue-700
                          px-3 py-1 rounded-full">
            Pending
          </div>

          {/* LOADER */}
          <div className="flex justify-center mb-4">
            <div className="relative">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                className="absolute inset-0 rounded-full
                           border-2 border-dashed border-blue-300"
              />
              <div className="w-16 h-16 rounded-full bg-blue-600
                              flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-white animate-spin" />
              </div>
            </div>
          </div>

          {/* TEXT */}
          <h2 className="text-xl font-semibold mb-1">
            Waiting for confirmation
          </h2>

          <p className="text-gray-600 mb-6">
            <span className="font-medium">{provider.name}</span> is reviewing
            your request
          </p>

          {/* TIMER */}
          <div className="bg-gray-50 rounded-2xl p-4 mb-4">
            <p className="text-sm text-gray-500 mb-1">
              Estimated response time
            </p>
            <p className="text-3xl font-bold text-blue-600">
              {minutes}:{seconds.toString().padStart(2, "0")}
            </p>

            <div className="mt-3 h-2 w-full bg-gray-200 rounded-full">
              <motion.div
                animate={{ width: `${progress}%` }}
                className="h-full bg-gradient-to-r
                           from-blue-500 to-indigo-500"
              />
            </div>
          </div>

          {/* SUCCESS / WAIT MESSAGE */}
          {!rejected && (
            <div className="flex items-center justify-center gap-2
                            text-sm text-gray-500">
              <CheckCircle className="w-4 h-4 text-green-500" />
              We’ll notify you once confirmed
            </div>
          )}

          {/* ❌ REJECTION MESSAGE */}
          <AnimatePresence>
            {rejected && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.3 }}
                className="mt-4 bg-red-50 border border-red-200
                           rounded-2xl p-4"
              >
                <p className="text-sm font-semibold text-red-700">
                  Request not accepted
                </p>
                <p className="text-xs text-red-600 mt-1">
                  The worker is currently unavailable.
                  Please try another nearby provider.
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* CANCEL */}
          <button
            onClick={handleOnClose}
            className="mt-6 px-10 py-4 text-lg font-semibold text-white
                       rounded-2xl
                       bg-gradient-to-r from-blue-600 to-indigo-600
                       shadow-[0_20px_40px_rgba(37,99,235,0.35)]
                       hover:shadow-[0_30px_60px_rgba(37,99,235,0.45)]
                       hover:scale-[1.03]
                       active:scale-[0.98]
                       transition-all duration-300"
          >
            Cancel booking
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
