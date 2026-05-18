import { useContext, useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Calendar,
  IndianRupee,
  Hash,
  Radio,
} from "lucide-react";
import { AuthContext } from "../config/AuthContext";
import { useNavigate } from "react-router-dom";

const Api = import.meta.env.VITE_BACKEND_API;
const ip=import.meta.env.VITE_IP;

/* ---------------- UTILS ---------------- */

function formatDateTime(timestamp) {
  const date = new Date(timestamp);

  const formattedDate = date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  const formattedTime = date.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  return `${formattedDate} · ${formattedTime}`;
}

/* ---------------- COMPONENT ---------------- */

export default function BookingList({ status }) {
  const { folkEmail,setBookingId } = useContext(AuthContext);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate=useNavigate();

  useEffect(() => {
    if (!folkEmail || !status) return;

    const fetchBooking = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `http://${ip}:3001/api/booking/bookingData/bookingInfrom`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: folkEmail,
              type: status,
            }),
          }
        );

        const data = await res.json();
        setBookings(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
        setBookings([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [folkEmail, status]);

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      {/* Header */}
      <motion.h1
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-bold text-gray-900 capitalize mb-10"
      >
        {status} bookings
      </motion.h1>

      {/* Loading */}
      {loading && (
        <div className="text-center py-24 text-gray-500">
          Loading bookings...
        </div>
      )}

      {/* Empty */}
      {!loading && bookings.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-24 text-gray-500"
        >
          No {status} bookings found.
        </motion.div>
      )}

      {/* Cards */}
      <div className="grid gap-8">
        {bookings.map((booking, i) => (
          <motion.div
            key={booking.bookingId}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            whileHover={{ y: -6 }}
            className="relative group"
          >
            {/* Glow */}
            <div
              className="absolute -inset-[1px] rounded-3xl opacity-0
                         group-hover:opacity-100 transition
                         bg-gradient-to-br from-blue-400/30 to-purple-400/30"
            />

            {/* Card */}
            <div
              className="relative rounded-3xl bg-white/90 backdrop-blur-xl
                         border border-gray-200
                         shadow-[0_20px_50px_rgba(0,0,0,0.08)]
                         p-7"
            >
              {/* TOP */}
              <div className="flex justify-between items-start mb-5">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {booking.title || "Service Booking"}
                  </h3>

                  {/* Booking ID */}
                  <p className="mt-1 text-xs text-gray-500 flex items-center gap-1">
                    <Hash size={12} />
                    <span className="font-medium">
                      {booking.bookingId}
                    </span>
                  </p>
                </div>

                <StatusBadge status={booking.status} />
              </div>

              {/* MIDDLE (LIVE INDICATOR) */}
              {booking.status === "live" && (
                <div  onClick={()=>{
                  setBookingId(booking.bookingId)
                  navigate('/serivice/liveTracking')
                }} className="mb-4 flex items-center gap-2 text-sm
                                text-blue-700 bg-blue-50
                                px-3 py-2 rounded-xl cursor-pointer"
                          >
                  <motion.span
                    animate={{ opacity: [1, 0.4, 1] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                  >
                    <Radio size={14} />
                  </motion.span>
                  Live booking — service in progress
                </div>
              )}

              {/* BOTTOM */}
              <div className="flex justify-between items-center text-sm">
                <span className="flex items-center gap-1 text-gray-600">
                  <Calendar size={14} />
                  {formatDateTime(booking.time)}
                </span>

                <div className="text-right">
                  <span className="flex items-center justify-end gap-1
                                   text-base font-bold text-gray-900">
                    <IndianRupee size={16} />
                    {booking.amount}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}



function StatusBadge({ status }) {
  const styles = {
    live: "bg-blue-100 text-blue-700",
    completed: "bg-green-100 text-green-700",
    cancelled: "bg-red-100 text-red-700",
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-semibold capitalize
                  ${styles[status] || "bg-gray-100 text-gray-600"}`}
    >
      {status}
    </span>
  );
}
