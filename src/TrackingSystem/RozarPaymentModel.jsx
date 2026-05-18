import { motion, AnimatePresence } from "framer-motion";
import { CreditCard, X, Lock, CheckCircle } from "lucide-react";
import axios from "axios";

const API=import.meta.env.VITE_BACKEND_API;
const ip=import.meta.env.VITE_IP;

export default function RazorpayPaymentModal({
  open,
  onClose,
  amount,
  bookingId,
  user,
  onSuccess,
}) {
  if (!open) return null;

  const handlePayment = async () => {
    try {
      // 1️⃣ Create order from backend
      const res = await axios.post(`http://${ip}:3003/api/payment/payment-init/create-order`, {
        amount,
        bookingId,
      });

      const order = res.data;

      // 2️⃣ Razorpay options
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: "INR",
        name: "LocalServices",
        description: "Service Payment",
        order_id: order.id,
        theme: { color: "#2563eb" },

        handler: function (response) {
          console.log("Payment success", response);

          // 🔥 Notify parent
          onSuccess(response);
          onClose();
        },

        prefill: {
          name: user.name,
          email: user.email,
          contact: user.phone,
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error("Payment failed", err);
      alert("Payment failed. Try again.");
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[9999] flex items-center justify-center
                     bg-black/50 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* MODAL CARD */}
          <motion.div
            initial={{ scale: 0.85, opacity: 0, y: 60 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.85, opacity: 0, y: 60 }}
            transition={{ type: "spring", stiffness: 260, damping: 22 }}
            className="
              bg-white w-[380px] rounded-3xl shadow-2xl
              p-6 relative overflow-hidden
            "
          >
            {/* CLOSE */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X />
            </button>

            {/* HEADER */}
            <div className="flex flex-col items-center mb-6">
              <div className="bg-blue-100 p-4 rounded-full mb-3">
                <CreditCard className="w-8 h-8 text-blue-600" />
              </div>
              <h2 className="text-xl font-bold">Complete Payment</h2>
              <p className="text-gray-500 text-sm mt-1">
                Secure checkout powered by Razorpay
              </p>
            </div>

            {/* BILL SUMMARY */}
            <div className="bg-gray-50 rounded-xl p-4 mb-6">
              <div className="flex justify-between text-sm mb-2">
                <span>Service Charge</span>
                <span>₹{amount}</span>
              </div>
              <div className="flex justify-between text-sm mb-2">
                <span>Platform Fee</span>
                <span>₹20</span>
              </div>
              <div className="border-t pt-2 flex justify-between font-semibold text-base">
                <span>Total</span>
                <span>₹{Number(amount) + 2}</span>
              </div>
            </div>

            {/* SECURITY NOTE */}
            <div className="flex items-center justify-center gap-2 text-xs text-gray-500 mb-5">
              <Lock className="w-4 h-4" />
              100% Secure & Encypted Payment
            </div>

            {/* PAY BUTTON */}
            <button
              onClick={handlePayment}
              className="
                w-full flex items-center justify-center gap-2 py-3 rounded-xl
                text-white font-semibold text-base
                bg-gradient-to-r from-blue-600 to-indigo-600
                shadow-[0_15px_35px_rgba(59,130,246,0.45)]
                hover:shadow-[0_22px_50px_rgba(59,130,246,0.65)]
                hover:scale-[1.03]
                active:scale-[0.97]
                transition-all duration-300
              "
            >
              <CheckCircle className="w-5 h-5" />
              Pay ₹{Number(amount) + 20}
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
