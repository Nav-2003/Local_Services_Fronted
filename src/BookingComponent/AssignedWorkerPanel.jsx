import { User, MapPin, Clock, Wrench, X, Phone } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import socket from "../config/socket";
import { useNavigate } from "react-router-dom";
import handleCancelButton from "../config/handleCancelButton";
import { AuthContext } from "../config/AuthContext";
import FeedbackModal from "../TrackingSystem/FeedBackModel";
import RazorpayPaymentModal from "../TrackingSystem/RozarPaymentModel";

export default function AssignedWorkerPanel({ worker }) {
  const { folkEmail,bookingId } = useContext(AuthContext);
  const navigate = useNavigate();

  const [workerEmail, setWorkerEmail] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [distance, setDistance] = useState(null);
  const [showFeedback,setShowFeedback]=useState(false);
  const [showPayment,setShowPayment]=useState(false);

  /* ================= SET EMAILS (SAFE) ================= */
  useEffect(() => {
    if (!worker || !folkEmail) return;

    if (worker.type === "worker") {
      setWorkerEmail(worker.email);
      setCustomerEmail(folkEmail);
    } else {
      setWorkerEmail(folkEmail);
      setCustomerEmail(worker.email);
    }
  }, [worker, folkEmail]);

  /* ================= SOCKET LOGIC ================= */
  useEffect(() => {
    if (!workerEmail || !customerEmail) return;

    const intervalId = setInterval(() => {
    //  socket.emit("cancelBooking", { email: folkEmail });
      socket.emit("liveDistance", { workerEmail, customerEmail });
    }, 1000);

    const handleCancel = ({ cancel }) => {
      if (cancel === true) {
        if (worker.type === "customer") {
          navigate("/service/waitingRoom");
        } else {
          navigate("/search");
        }
        clearInterval(intervalId);
      }
    };

    const handleLiveDistance = ({ distance }) => {
      setDistance(distance);
    };

    socket.on("cancelBooking", handleCancel);
    socket.on("liveDistance", handleLiveDistance);
    socket.on("paymentResponse",({payment})=>{
         setShowFeedback(true)
    }) 

    return () => {
      clearInterval(intervalId);
      socket.off("cancelBooking", handleCancel);
      socket.off("liveDistance", handleLiveDistance);
      socket.off("paymentResponse")
    };
  }, [workerEmail, customerEmail, worker.type, navigate]);


  const handlePaymentSuccess = (response) => {
  
  console.log("Payment completed", response);
  socket.emit("paymentStatus",{bookingId});
  navigate('/');
};

  /* ================= UI ================= */
  return (
    <div className="w-full lg:w-[100%] border-r bg-white p-5">
      <h2 className="text-lg font-semibold mb-4">{worker.type==="customer"?"Your Custmor":"Your Worker"}</h2>

      <div className="rounded-2xl border p-4 space-y-4 shadow-sm">
        <div className="flex items-center gap-3">
          <User className="w-5 h-5 text-blue-600" />
          <span className="font-semibold">{worker.name}</span>
        </div>

        <div className="flex items-center gap-3 text-gray-600">
          <MapPin className="w-5 h-5" />
          {distance !== null ? `${distance} km away` : "Calculating..."}
        </div>

        <div className="flex items-center gap-3 text-gray-600">
          <Phone className="w-5 h-5" />
          {worker.phone}
        </div>

        <div className="text-sm font-semibold text-emerald-600">
          Status: On the way
        </div>

        {/* CANCEL BUTTON */}
        <button
          onClick={() =>
            handleCancelButton({
              bookingId:bookingId,
            })
          }
          className="mt-4 w-full flex items-center justify-center gap-2 py-4 rounded-2xl
            text-base font-semibold text-white
            bg-gradient-to-r from-blue-600 via-rose-500 to-red-600
            shadow-[0_18px_40px_rgba(239,68,68,0.45)]
            hover:shadow-[0_25px_55px_rgba(239,68,68,0.65)]
            hover:scale-[1.03]
            active:scale-[0.97]
            transition-all duration-300"
        >
          <X className="w-5 h-5" />
          Cancel Booking
        </button>
       {worker.type==="customer"&&<button
  className="
    mt-3 w-full flex items-center justify-center gap-2 py-3 rounded-2xl
    text-base font-semibold text-white
    bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500
    shadow-[0_12px_30px_rgba(16,185,129,0.45)]
    hover:shadow-[0_20px_45px_rgba(16,185,129,0.65)]
    hover:scale-[1.03]
    active:scale-[0.97]
    transition-all duration-300
  "
  onClick={()=>{
    setShowPayment(true)
  }}
>
  <span className="text-lg">✔</span>
  Work Completed
</button>}

{/* PAYMENT MODAL – ONLY FOR WORKER SIDE */}
{worker?.type === "customer" && (
  <RazorpayPaymentModal
    open={showPayment}
    onClose={() => setShowPayment(false)}
    amount={1}
    bookingId={bookingId}
    user={{
      name: "Naveen",
      email: "xxx@gmail.com",
      phone: "9198511333",
    }}
    onSuccess={handlePaymentSuccess}
  />
)}

{/* FEEDBACK MODAL – ONLY FOR CUSTOMER SIDE */}

<FeedbackModal
  open={showFeedback}
  onClose={() => setShowFeedback(false)}
  workerName={"Naveen Kushawaha"}
  bookingId={bookingId}
/>


      </div>
    </div>
  );
}
