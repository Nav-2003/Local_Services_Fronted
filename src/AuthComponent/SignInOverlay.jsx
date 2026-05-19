import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, X } from "lucide-react";
import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../config/AuthContext";
import SuccessOverlay from "../ServiceComponent/SuccessAuth";
import { useNavigate } from "react-router-dom";
import HashLoader from "react-spinners/HashLoader";

const ApiZ = import.meta.env.VITE_BACKEND_APIZ;
const ApiO = import.meta.env.VITE_BACKEND_APIO;
const ApiT = import.meta.env.VITE_BACKEND_APIT;
const ApiH = import.meta.env.VITE_BACKEND_APIH;


export default function SignInOverlay({ onClose }) {
  const {
    setSignIn,
    setUserSign,
    setWorkerSign,
    setFolkEmail,
  } = useContext(AuthContext);

  const [showPass, setShowPass] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [close,setClose]=useState(true);
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const navigate = useNavigate();

  /* ---------- GEOLOCATION ---------- */
  useEffect(() => {
    if (!navigator.geolocation) return;

    const id = navigator.geolocation.watchPosition(
      (pos) => {
        setLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
      },
      (err) => console.error(err),
      { enableHighAccuracy: true }
    );

    return () => navigator.geolocation.clearWatch(id);
  }, []);

  /* ---------- SIGNIN ---------- */
  const handleSignIn = async () => {
    setError("");

    if (!email || !password) {
      setError("Email and password required");
      return;
    }

    if (!location) {
      setError("Fetching your location. Please wait...");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(`${ApiZ}/api/auth/userAuth/signIn`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          email,
          pass: password,
          lat: location.lat,
          lng: location.lng,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Sign in failed");
        return;
      }

      /* ---------- SAVE TOKEN ---------- */
      localStorage.setItem("accessToken", data.accessToken);

      /* ---------- CONTEXT ---------- */
      setSignIn(true);
      setFolkEmail(email);

      /* ---------- ROLE ---------- */
    // socket.emit("register-Socket", { email});
      if (data.role === "customer") {
        setUserSign(true);
        setClose(false)
        navigate("/");
      } else {
          console.log("HIii")
        setWorkerSign(true);
        setSuccess(true);
      }
    } catch (err) {
      setError("Server error. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  return ( close&&
    <div className="fixed inset-0 z-[9999] bg-black/50 backdrop-blur-md flex items-center justify-center px-4">

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl p-8"
      >
        {/* CLOSE */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>

        <h2 className="text-2xl font-bold text-center mb-2">
          Welcome Back
        </h2>

        <p className="text-sm text-gray-500 text-center mb-6">
          Sign in to continue
        </p>

        {/* ERROR */}
        {error && (
          <p className="text-red-500 text-center mb-3">{error}</p>
        )}

        {/* EMAIL */}
        <div className="mb-4">
          <label className="text-sm font-medium">Email</label>
          <div className="flex items-center gap-3 border rounded-xl px-4 py-3">
            <Mail className="w-5 h-5 text-gray-400" />
            <input
              type="email"
              placeholder="you@email.com"
              className="flex-1 outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>

        {/* PASSWORD */}
        <label className="text-sm font-medium">Password</label>
        <div className="flex items-center gap-3 border rounded-xl px-4 py-3">
          <Lock className="w-5 h-5 text-gray-400" />
          <input
            type={showPass ? "text" : "password"}
            className="flex-1 outline-none"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button onClick={() => setShowPass(!showPass)}>
            {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        {/* BUTTON */}
        <motion.button
          disabled={loading}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleSignIn}
          className="w-full py-4 mt-8 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold"
        >
          {loading ? (
            <div className="flex items-center justify-center gap-2">
              <HashLoader size={20} color="white" />
              Signing in...
            </div>
          ) : (
            "Sign In"
          )}
        </motion.button>
      </motion.div>

      {/* WORKER SUCCESS */}
      {success && (
        <SuccessOverlay onClose={() => setSuccess(false)} />
      )}
    </div>
  );
}
