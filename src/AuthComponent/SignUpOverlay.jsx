import { motion } from "framer-motion";
import { Mail, Lock, User, Phone, Eye, EyeOff, X } from "lucide-react";
import { useContext, useState } from "react";
import { AuthContext } from "../config/AuthContext";
import SignInOverlay from "./SignInOverlay";

const ApiZ = import.meta.env.VITE_BACKEND_APIZ;
const ApiO = import.meta.env.VITE_BACKEND_APIO;
const ApiT = import.meta.env.VITE_BACKEND_APIT;
const ApiH = import.meta.env.VITE_BACKEND_APIH;

export default function SignupOverlay({ onClose }) {
  const { setFolkEmail, folkEmail } = useContext(AuthContext);

  const [showPass, setShowPass] = useState(false);
  const [showSignIn, setShowSignIn] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    // Validation
    if (!name || !email || !phone || !password) {
      setError("All fields are required");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        `${ApiZ}/api/auth/userAuth/signUp/customerSignUp`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            email,
            phone,
            pass: password,
          }),
        }
      );

      const result = await response.json();

      // Backend error
      if (!response.ok) {
        setError(result.message || "Signup failed");
        return;
      }

      // Success
      setSuccess("Account created successfully");

      // Save email for signin
      setFolkEmail(email);
      setTimeout(() => {
        setShowSignIn(true);
      }, 1200);

    } catch (err) {
      setError("Server error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {!folkEmail && (
        <div className="fixed inset-0 z-[9999] bg-black/50 backdrop-blur-md flex items-center justify-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl p-8"
          >
            {/* CLOSE BUTTON */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>

            {/* HEADER */}
            <h2 className="text-2xl font-bold text-center">
              Create your account
            </h2>
            <p className="text-sm text-gray-500 text-center mb-6">
              Find trusted professionals near you
            </p>

            {/* FORM */}
            <form onSubmit={handleSubmit} className="space-y-4">

              {/* ERROR */}
              {error && (
                <p className="text-red-500 text-sm text-center">{error}</p>
              )}

              {/* SUCCESS */}
              {success && (
                <p className="text-green-600 text-sm text-center">
                  {success}
                </p>
              )}

              {/* NAME */}
              <Input
                icon={<User />}
                placeholder="Full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />

              {/* EMAIL */}
              <Input
                icon={<Mail />}
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              {/* PHONE */}
              <Input
                icon={<Phone />}
                type="tel"
                placeholder="Phone number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />

              {/* PASSWORD */}
              <div className="flex items-center gap-3 border rounded-xl px-4 py-3">
                <Lock className="w-5 h-5 text-gray-400" />
                <input
                  type={showPass ? "text" : "password"}
                  placeholder="Create password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="flex-1 outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                >
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {/* SUBMIT */}
              <motion.button
                disabled={loading}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className={`w-full py-4 font-semibold text-white rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 
                ${loading ? "opacity-70 cursor-not-allowed" : ""}`}
              >
                {loading ? "Creating Account..." : "Sign Up & Continue"}
              </motion.button>
            </form>
          </motion.div>
        </div>
      )}

      {/* SIGNIN */}
      {showSignIn && (
        <SignInOverlay onClose={() => {setShowSignIn(false) }} />
      )}
    </>
  );
}

/* REUSABLE INPUT */
function Input({ icon, ...props }) {
  return (
    <div className="flex items-center gap-3 border rounded-xl px-4 py-3">
      <span className="text-gray-400">{icon}</span>
      <input
        {...props}
        className="flex-1 outline-none text-sm"
      />
    </div>
  );
}
