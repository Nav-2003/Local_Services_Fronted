import { motion, AnimatePresence } from "framer-motion";
import { Star, X, Send, CheckCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import confetti from "canvas-confetti";

const Api = import.meta.env.VITE_BACKEND_API;
const ip=import.meta.env.VITE_IP;

export default function FeedbackModal({
  open,
  onClose,
  workerName,
  bookingId,
}) {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  
  const handleSubmit = async () => {
  if (rating === 0 || loading) return;
  try {
    setLoading(true);

    let res = await fetch(`http://${ip}:3001/api/booking/userData/getWorkerEmail`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ bookingId }),
    });

    const emailData = await res.json();
    const workerEmail = emailData.workerEmail;   
    const customerEmail=emailData.customerEmail;

    res = await fetch(`http://${ip}:3000/api/auth/feedback/putFeedback`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        workerEmail,
        customerEmail,
        text: comment,
        rating,
      }),
    });

    const data = await res.json();

    if (data.success) {
      setSubmitted(true);
    }
  } catch (err) {
    console.error(err);
  } finally {
    setLoading(false);
  }
};

  // 🎉 Celebration + auto redirect
  useEffect(() => {
    if (!submitted) return;

    confetti({
      particleCount: 180,
      spread: 90,
      origin: { y: 0.6 },
      zIndex: 9999,
    });

    const timer = setTimeout(() => {
      navigate("/");
    }, 2000);

    return () => clearTimeout(timer);
  }, [submitted, navigate, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            initial={{ scale: 0.85, y: 40, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.85, y: 40, opacity: 0 }}
            transition={{ type: "spring", stiffness: 220, damping: 18 }}
            className="relative w-[420px] rounded-[32px] p-8 bg-white/80 backdrop-blur-xl shadow-[0_30px_80px_rgba(0,0,0,0.25)] border border-white/40"
          >
            {/* CLOSE */}
            {!submitted && (
              <button
                onClick={onClose}
                className="absolute top-5 right-5 text-gray-400 hover:text-black transition"
              >
                <X />
              </button>
            )}

            {!submitted ? (
              <>
                {/* HEADER */}
                <div className="flex flex-col items-center text-center mb-6">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-400 to-green-600 flex items-center justify-center shadow-lg mb-4">
                    <CheckCircle className="text-white w-8 h-8" />
                  </div>
                  <h2 className="text-2xl font-bold">Service Completed</h2>
                  <p className="text-gray-500 text-sm mt-2">
                    How was your experience with{" "}
                    <span className="font-semibold">{workerName}</span>?
                  </p>
                </div>

                {/* STARS */}
                <div className="flex justify-center gap-4 mb-6">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <motion.button
                      key={star}
                      whileHover={{ scale: 1.25 }}
                      whileTap={{ scale: 0.9 }}
                      onMouseEnter={() => setHover(star)}
                      onMouseLeave={() => setHover(0)}
                      onClick={() => setRating(star)}
                      className="focus:outline-none"
                    >
                      <Star
                        className="w-11 h-11 transition-all"
                        strokeWidth={2.5}
                        fill={(hover || rating) >= star ? "#FACC15" : "none"}
                        stroke={
                          (hover || rating) >= star ? "#FACC15" : "#9CA3AF"
                        }
                      />
                    </motion.button>
                  ))}
                </div>
                {/* COMMENT */}
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Share a few words (optional)"
                  rows={3}
                  className="w-full rounded-2xl border border-gray-200 px-5 py-4 text-sm bg-white/70 focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
                />

                {/* BUTTON */}
                <motion.button
                  whileHover={{ scale: rating ? 1.04 : 1 }}
                  whileTap={{ scale: 0.97 }}
                  disabled={rating === 0 || loading}
                  onClick={handleSubmit}
                  className={
                    rating === 0 || loading
                      ? "mt-7 w-full py-4 rounded-2xl font-semibold text-white bg-gray-300 cursor-not-allowed flex items-center justify-center gap-2"
                      : "mt-7 w-full py-4 rounded-2xl font-semibold text-white flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 via-blue-600 to-purple-600 shadow-[0_20px_50px_rgba(99,102,241,0.5)]"
                  }
                >
                  <Send className="w-5 h-5" />
                  {loading ? "Submitting..." : "Submit Feedback"}
                </motion.button>
              </>
            ) : (
              /* THANK YOU STATE */
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center text-center py-12"
              >
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-400 to-green-600 flex items-center justify-center shadow-xl mb-6">
                  <CheckCircle className="text-white w-10 h-10" />
                </div>
                <h2 className="text-3xl font-extrabold mb-3">Thank You 💚</h2>
                <p className="text-gray-500 max-w-sm">
                  Your feedback has been recorded successfully. We truly
                  appreciate you choosing LocalService.
                </p>

                {/* PROGRESS BAR */}
                <div className="mt-8 h-1.5 w-40 bg-gray-200 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-emerald-500"
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 5, ease: "linear" }}
                  />
                </div>

                <p className="text-xs text-gray-400 mt-3">
                  Redirecting you to home…
                </p>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
