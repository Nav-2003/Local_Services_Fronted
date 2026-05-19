import { distance, motion } from "framer-motion";
import {Loader2,MapPin, Users,Clock,ShieldCheck,} from "lucide-react";
import socket from "../config/socket";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../config/AuthContext";
import QuickMatch from "./AssignCustomer";
import { useNavigate } from "react-router-dom";

const ApiZ = import.meta.env.VITE_BACKEND_APIZ;
const ApiO = import.meta.env.VITE_BACKEND_APIO;
const ApiT = import.meta.env.VITE_BACKEND_APIT;
const ApiH = import.meta.env.VITE_BACKEND_APIH;

export default function WorkerWaitingForCustomer({ workerName = "Worker" }) {
  const [showAssignment,setShowAssignment]=useState(false);
  const [data,setdata]=useState({});
  const {folkEmail,setBookingId,bookingId}=useContext(AuthContext);
  const navigate=useNavigate();

  useEffect(() => {
  socket.on("customerCancel",()=>{
       setShowAssignment(false);
  });

  socket.on("assignCustmorResult", ({distance,name,bookingId}) => {
    console.log(distance,name,bookingId)
    setdata({name:name,distance:distance})
    setBookingId(bookingId);
    setShowAssignment(true);
  });

  return () => {
    socket.off("customerCancel");
    socket.off("assignCustmorResult");
  };
}, []);

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50 px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-lg bg-white/80 backdrop-blur-xl rounded-3xl shadow-[0_30px_80px_rgba(0,0,0,0.15)]  p-8 text-center"
      >
        {/* STATUS ICON */}
        <div className="flex justify-center mb-5">
          <div className="relative">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 2.5, ease: "linear" }}
              className="absolute inset-0 rounded-full
                         border-2 border-dashed border-blue-300"
            />
            <div className="w-16 h-16 rounded-full
                            bg-blue-600 flex items-center justify-center
                            shadow-lg">
              <Loader2 className="w-8 h-8 text-white animate-spin" />
            </div>
          </div>
        </div>

        {/* TITLE */}
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          You’re online, {workerName} 🚀
        </h2>

        <p className="text-gray-600 mb-6">
          Waiting for customers near your location to book your service.
        </p>

        {/* INFO CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">

          <InfoCard
            icon={<MapPin className="w-5 h-5 text-blue-600" />}
            title="Location"
            value="Searching nearby"
          />

          <InfoCard
            icon={<Users className="w-5 h-5 text-green-600" />}
            title="Customers"
            value="Looking for jobs"
          />

          <InfoCard
            icon={<Clock className="w-5 h-5 text-indigo-600" />}
            title="Status"
            value="Available"
          />
        </div>

        {/* MESSAGE */}
        <div className="bg-blue-50 border border-blue-100
                        rounded-2xl p-4 mb-6">
          <p className="text-sm text-gray-700">
            Keep this screen open. You’ll be notified instantly when
            a customer assigns you a job.
          </p>
        </div>

        {/* TRUST */}
        <div className="flex items-center justify-center gap-2
                        text-xs text-gray-500">
          <ShieldCheck className="w-4 h-4 text-green-500" />
          You are visible to nearby customers
        </div>
      </motion.div>
      {showAssignment&&(<QuickMatch 
          data={data}
          onAccept={async()=>{
              const response=await fetch(`${ApiO}/api/booking/bookingRes/accept`,{
                   method:"PUT",
                   headers:{
                      "Content-Type":"application/json"
                   },
                   body:JSON.stringify({email:folkEmail,bookingId})
             });
            const data=await response.json();
            console.log(data);
            setShowAssignment(false)
            navigate('/serivice/liveTracking')
          }}
          onReject={async()=>{
             const response=await fetch(`${ApiO}/api/booking/bookingrej/reject`,{
                   method:"PUT",
                   headers:{
                      "Content-Type":"application/json"
                   },
                   body:JSON.stringify({email:folkEmail,bookingId})
             });
            const data=await response.json();
            console.log(data);
            setShowAssignment(false)
          }}
      />)}
    </div>
  );
}

/* SMALL CARD COMPONENT */
function InfoCard({ icon, title, value }) {
  return (
    <div className="bg-white rounded-2xl border
                    p-4 flex flex-col items-center
                    shadow-sm">
      {icon}
      <p className="text-xs text-gray-500 mt-1">{title}</p>
      <p className="text-sm font-semibold text-gray-800">{value}</p>
    </div>
  );
}