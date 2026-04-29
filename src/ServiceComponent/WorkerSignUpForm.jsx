import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Phone,
  Mail,
  Briefcase,
  IdCard,
  Lock,
  Eye,
  EyeOff,
  ChevronDown,
  Zap,
  MapPin,
} from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../config/AuthContext";
import SignInOverlay from "../AuthComponent/SignInOverlay";

const Api = import.meta.env.VITE_BACKEND_API;

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;600&family=DM+Mono:wght@300;400&display=swap');

  .signup-root {
    min-height: 100vh;
    background: #f7f4ef;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2rem 1rem;
    font-family: 'DM Mono', monospace;
    position: relative;
    overflow: hidden;
  }

  .signup-root::before {
    content: '';
    position: fixed;
    inset: 0;
    background:
      radial-gradient(ellipse 70% 60% at 10% 5%, rgba(212, 163, 78, 0.12) 0%, transparent 60%),
      radial-gradient(ellipse 60% 50% at 90% 95%, rgba(212, 163, 78, 0.1) 0%, transparent 60%);
    pointer-events: none;
  }

  .grid-overlay {
    position: fixed;
    inset: 0;
    background-image:
      linear-gradient(rgba(180,140,60,0.07) 1px, transparent 1px),
      linear-gradient(90deg, rgba(180,140,60,0.07) 1px, transparent 1px);
    background-size: 60px 60px;
    pointer-events: none;
  }

  .signup-card {
    position: relative;
    width: 100%;
    max-width: 520px;
    background: #ffffff;
    border: 1px solid rgba(212, 163, 78, 0.2);
    border-radius: 2px;
    overflow: hidden;
    box-shadow: 0 4px 6px rgba(0,0,0,0.04), 0 20px 60px rgba(0,0,0,0.08);
  }

  .card-top-line {
    height: 2px;
    background: linear-gradient(90deg, transparent, #d4a34e, transparent);
  }

  .card-header {
    padding: 2.5rem 2.5rem 0;
    position: relative;
  }

  .badge {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    font-size: 0.6rem;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: #d4a34e;
    border: 1px solid rgba(212, 163, 78, 0.3);
    padding: 0.3rem 0.7rem;
    border-radius: 1px;
    margin-bottom: 1.2rem;
  }

  .card-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 2.6rem;
    font-weight: 300;
    color: #1a1208;
    line-height: 1.1;
    letter-spacing: -0.01em;
    margin-bottom: 0.4rem;
  }

  .card-title span {
    color: #d4a34e;
    font-style: italic;
  }

  .card-subtitle {
    font-size: 0.7rem;
    color: rgba(60,40,10,0.45);
    letter-spacing: 0.12em;
    text-transform: uppercase;
    margin-bottom: 2rem;
  }

  .divider {
    height: 1px;
    background: linear-gradient(90deg, rgba(212,163,78,0.3), transparent);
    margin: 0 2.5rem;
  }

  .form-body {
    padding: 2rem 2.5rem 2.5rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .input-group {
    position: relative;
  }

  .input-label {
    font-size: 0.6rem;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: rgba(212, 163, 78, 0.6);
    margin-bottom: 0.4rem;
    display: block;
  }

  .input-wrapper {
    display: flex;
    align-items: center;
    background: rgba(250,246,240,0.8);
    border: 1px solid rgba(212, 163, 78, 0.12);
    transition: all 0.25s ease;
    position: relative;
  }

  .input-wrapper:focus-within {
    border-color: rgba(212, 163, 78, 0.5);
    background: rgba(212, 163, 78, 0.06);
    box-shadow: 0 0 0 3px rgba(212, 163, 78, 0.05), inset 0 1px 0 rgba(212,163,78,0.08);
  }

  .input-wrapper:focus-within .input-icon {
    color: #d4a34e;
  }

  .input-icon {
    padding: 0 0.75rem;
    color: rgba(212, 163, 78, 0.3);
    transition: color 0.25s;
    flex-shrink: 0;
  }

  .input-wrapper input,
  .input-wrapper select {
    flex: 1;
    background: transparent;
    border: none;
    outline: none;
    color: #2a1f0a;
    font-family: 'DM Mono', monospace;
    font-size: 0.78rem;
    padding: 0.75rem 0.75rem 0.75rem 0;
    letter-spacing: 0.03em;
  }

  .input-wrapper input::placeholder {
    color: rgba(60,40,10,0.25);
    font-size: 0.72rem;
  }

  .input-wrapper select {
    appearance: none;
    cursor: pointer;
    padding-right: 2.5rem;
  }

  .input-wrapper select option {
    background: #fff8ee;
    color: #1a1208;
  }

  .select-arrow {
    position: absolute;
    right: 0.75rem;
    color: rgba(212, 163, 78, 0.4);
    pointer-events: none;
  }

  .eye-btn {
    background: none;
    border: none;
    cursor: pointer;
    padding: 0.75rem;
    color: rgba(212, 163, 78, 0.35);
    transition: color 0.2s;
    display: flex;
    align-items: center;
  }

  .eye-btn:hover { color: #d4a34e; }

  .error-msg {
    font-size: 0.6rem;
    letter-spacing: 0.08em;
    color: #e05a5a;
    margin-top: 0.3rem;
    display: flex;
    align-items: center;
    gap: 0.3rem;
  }

  .error-msg::before {
    content: '▲';
    font-size: 0.45rem;
  }

  .two-col {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
  }

  .submit-btn {
    width: 100%;
    background: linear-gradient(135deg, #d4a34e 0%, #b8862e 100%);
    border: none;
    color: #ffffff;
    font-family: 'DM Mono', monospace;
    font-size: 0.7rem;
    font-weight: 400;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    padding: 1rem;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: all 0.3s ease;
    margin-top: 0.5rem;
  }

  .submit-btn::before {
    content: '';
    position: absolute;
    top: 0; left: -100%;
    width: 100%; height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent);
    transition: left 0.5s ease;
  }

  .submit-btn:hover::before { left: 100%; }
  .submit-btn:hover { box-shadow: 0 8px 30px rgba(212, 163, 78, 0.25); }
  .submit-btn:disabled { opacity: 0.5; cursor: not-allowed; }

  .submit-btn .btn-inner {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
  }

  .loading-dots {
    display: inline-flex;
    gap: 3px;
  }

  .loading-dots span {
    width: 4px; height: 4px;
    background: #0a0a0a;
    border-radius: 50%;
    animation: dot-pulse 1.2s ease infinite;
  }

  .loading-dots span:nth-child(2) { animation-delay: 0.2s; }
  .loading-dots span:nth-child(3) { animation-delay: 0.4s; }

  @keyframes dot-pulse {
    0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
    40% { transform: scale(1); opacity: 1; }
  }

  .card-footer {
    padding: 0 2.5rem 2rem;
    text-align: center;
    font-size: 0.6rem;
    letter-spacing: 0.1em;
    color: rgba(60,40,10,0.45);
    text-transform: uppercase;
  }

  .card-footer a {
    color: rgba(212, 163, 78, 0.6);
    text-decoration: none;
    transition: color 0.2s;
  }

  .card-footer a:hover { color: #d4a34e; }

  .corner-accent {
    position: absolute;
    width: 24px; height: 24px;
    border-color: rgba(212, 163, 78, 0.4);
    border-style: solid;
  }

  .corner-tl { top: 12px; left: 12px; border-width: 1px 0 0 1px; }
  .corner-tr { top: 12px; right: 12px; border-width: 1px 1px 0 0; }
  .corner-bl { bottom: 12px; left: 12px; border-width: 0 0 1px 1px; }
  .corner-br { bottom: 12px; right: 12px; border-width: 0 1px 1px 0; }

  @media (max-width: 560px) {
    .card-header, .form-body { padding-left: 1.5rem; padding-right: 1.5rem; }
    .divider { margin: 0 1.5rem; }
    .card-footer { padding-left: 1.5rem; padding-right: 1.5rem; }
    .two-col { grid-template-columns: 1fr; }
    .card-title { font-size: 2rem; }
  }
`;

export default function WorkerSignupForm() {
  const { setFolkEmail } = useContext(AuthContext);
  const [showPassword, setShowPassword] = useState(false);
  const [showSignIn, setShowSignIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [service, setService] = useState("");
  const [aadhar, setAadhar] = useState("");
  const [password, setPassword] = useState("");
  const [initialAmount, setInitialAmount] = useState("");
  const [emailExists, setEmailExists] = useState(false);

  useEffect(() => {
    if (!email) { setEmailExists(false); return; }
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`${Api}/api/auth/workerAuth/checkEmail`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        });
        const data = await res.json();
        setEmailExists(data.exists);
      } catch (err) { console.error(err); }
    }, 500);
    return () => clearTimeout(timer);
  }, [email]);

  const getLocation = () =>
    new Promise((resolve, reject) => {
      if (!navigator.geolocation) return reject("Geolocation not supported");
      navigator.geolocation.getCurrentPosition(
        (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => reject("Location permission denied")
      );
    });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (emailExists) return alert("Email already exists");
    if (!/^\d{10}$/.test(phone)) return alert("Invalid phone number");
    if (!/^\d{12}$/.test(aadhar)) return alert("Invalid Aadhaar number");
    if (password.length < 8) return alert("Password must be at least 8 characters");
    try {
      setLoading(true);
      const { lat, lng } = await getLocation();
      const response = await fetch(`${Api}/api/auth/workerAuth/signUp/workerSignUp`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name, phone, email, service, adhar: aadhar, pass: password, lat, lng,
          money: Number(initialAmount) || 400,
        }),
      });
      await response.json();
      setFolkEmail(email);
      setShowSignIn(true);
    } catch (err) {
      alert(err);
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1], staggerChildren: 0.07 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 12 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
  };

  return (
    <>
      <style>{styles}</style>
      <div className="signup-root">
        <div className="grid-overlay" />
        <div style={{position:'fixed',top:'-10%',left:'-5%',width:'500px',height:'500px',borderRadius:'50%',background:'radial-gradient(circle, rgba(212,163,78,0.13) 0%, transparent 70%)',pointerEvents:'none'}} />
        <div style={{position:'fixed',bottom:'-15%',right:'-8%',width:'600px',height:'600px',borderRadius:'50%',background:'radial-gradient(circle, rgba(180,100,30,0.1) 0%, transparent 70%)',pointerEvents:'none'}} />

        <motion.div
          className="signup-card"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="card-top-line" />
          <div className="corner-accent corner-tl" />
          <div className="corner-accent corner-tr" />
          <div className="corner-accent corner-bl" />
          <div className="corner-accent corner-br" />

          {/* Header */}
          <div className="card-header">
            <motion.div variants={itemVariants}>
              <div className="badge">
                <Zap size={8} />
                Worker Portal
              </div>
            </motion.div>
            <motion.h1 className="card-title" variants={itemVariants}>
              Start <span>Earning</span>
            </motion.h1>
            <motion.p className="card-subtitle" variants={itemVariants}>
              Professional services platform
            </motion.p>
          </div>

          <div className="divider" />

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <div className="form-body">

              <motion.div variants={itemVariants}>
                <PremiumInput label="Full Name" value={name} setValue={setName} icon={<User size={14} />} placeholder="Your legal name" />
              </motion.div>

              <motion.div variants={itemVariants} className="two-col">
                <PremiumInput label="Phone" value={phone} setValue={setPhone} icon={<Phone size={14} />} placeholder="10-digit number" type="tel" />
                <PremiumInput label="Wallet Amount" value={initialAmount} setValue={setInitialAmount} icon={<span style={{fontSize:'0.65rem',paddingLeft:'0.2rem'}}>₹</span>} placeholder="Min. 400" type="number" />
              </motion.div>

              <motion.div variants={itemVariants}>
                <div className="input-group">
                  <label className="input-label">Email Address</label>
                  <div className="input-wrapper">
                    <span className="input-icon"><Mail size={14} /></span>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      required
                    />
                  </div>
                  <AnimatePresence>
                    {emailExists && (
                      <motion.div
                        className="error-msg"
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                      >
                        This email is already registered
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>

              <motion.div variants={itemVariants}>
                <div className="input-group">
                  <label className="input-label">Service Category</label>
                  <div className="input-wrapper">
                    <span className="input-icon"><Briefcase size={14} /></span>
                    <select value={service} onChange={(e) => setService(e.target.value)} required>
                      <option value="" disabled>Select your trade</option>
                      <option value="Electrician">Electrician</option>
                      <option value="Plumber">Plumber</option>
                      <option value="Mechanic">Mechanic</option>
                      <option value="Carpenter">Carpenter</option>
                      <option value="Barber">Barber</option>
                    </select>
                    <span className="select-arrow"><ChevronDown size={12} /></span>
                  </div>
                </div>
              </motion.div>

              <motion.div variants={itemVariants}>
                <PremiumInput label="Aadhaar Number" value={aadhar} setValue={setAadhar} icon={<IdCard size={14} />} placeholder="12-digit Aadhaar" type="text" maxLength={12} />
              </motion.div>

              <motion.div variants={itemVariants}>
                <div className="input-group">
                  <label className="input-label">Password</label>
                  <div className="input-wrapper">
                    <span className="input-icon"><Lock size={14} /></span>
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Min. 8 characters"
                      required
                    />
                    <button type="button" className="eye-btn" onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                </div>
              </motion.div>

              <motion.div variants={itemVariants} style={{marginTop:'0.25rem'}}>
                <motion.button
                  type="submit"
                  className="submit-btn"
                  disabled={loading || emailExists}
                  whileTap={{ scale: 0.99 }}
                >
                  <span className="btn-inner">
                    {loading ? (
                      <>
                        <MapPin size={12} />
                        Fetching Location
                        <span className="loading-dots">
                          <span /><span /><span />
                        </span>
                      </>
                    ) : (
                      <>
                        <Zap size={12} />
                        Create Account
                      </>
                    )}
                  </span>
                </motion.button>
              </motion.div>

            </div>
          </form>

          <div className="card-footer">
            Already registered?{" "}
            <a href="#" onClick={(e) => { e.preventDefault(); setShowSignIn(true); }}>
              Sign In
            </a>
          </div>
        </motion.div>
      </div>

      {showSignIn && <SignInOverlay onClose={() => setShowSignIn(false)} />}
    </>
  );
}

function PremiumInput({ label, value, setValue, icon, placeholder, ...props }) {
  return (
    <div className="input-group">
      <label className="input-label">{label}</label>
      <div className="input-wrapper">
        <span className="input-icon">{icon}</span>
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder}
          {...props}
        />
      </div>
    </div>
  );
}
