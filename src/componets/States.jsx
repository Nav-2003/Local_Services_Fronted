import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function States() {
  const navigate=useNavigate();
  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-gray-600"
      >
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span>5000+ Verified Professionals</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
          <span>50+ Service Categories</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
          <span>24/7 Support</span>
        </div>
      </motion.div>

      <motion.button
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.96 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        onClick={()=>navigate('service/workerDetail')}
        className="
         px-10 py-4 text-lg font-semibold text-white
         rounded-2xl mt-10
         bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500
         shadow-[0_20px_40px_rgba(16,185,129,0.35)]
         hover:shadow-[0_30px_60px_rgba(16,185,129,0.5)]
         transition-all duration-300
         "
      >
        Start Earning
      </motion.button>
    </>
  );
}
