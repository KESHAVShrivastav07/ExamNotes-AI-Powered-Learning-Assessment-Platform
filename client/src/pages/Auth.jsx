import React, { useState } from 'react'
import { FcGoogle } from "react-icons/fc";
import { signInWithPopup } from 'firebase/auth';
import { auth, provider } from '../utils/firebase';
import axios from "axios"
import { serverUrl } from '../App';
import { useDispatch } from 'react-redux';
import { setUserData } from '../redux/userSlice';
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import Footer from '../components/Footer';

function Auth({ role = "teacher", note = null }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const normalizeRole = (r) => {
    if (r === "admin") return "admin";
    if (r === "teacher") return "teacher";
    return "user";
  };

  const [selectedRole, setSelectedRole] = useState(normalizeRole(role));
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleAuth = async () => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      const response = await signInWithPopup(auth, provider);
      const User = response.user;
      const name = User.displayName;
      const email = User.email;

      const result = await axios.post(
        serverUrl + "/api/auth/google",
        { name, email, role: selectedRole },
        { withCredentials: true }
      );

      const data = result.data;
      const payload = data?.user ? { ...data.user, role: data.role } : data;
      dispatch(setUserData(payload));

      if (data.role === "admin") navigate("/admin/dashboard");
      else if (data.role === "teacher") navigate("/teacher/dashboard");
      else navigate("/");

    } catch (error) {
      console.log("Google Auth Error:", error);
      setIsLoading(false);
    }
  };

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) return;
    
    setIsLoading(true);
    try {
       // Using the login function from api.js indirectly or directly
       const res = await axios.post(`${serverUrl}/api/auth/login`, 
         { email, password }, 
         { withCredentials: true }
       );
       
       const data = res.data;
       const payload = data?.user ? { ...data.user, role: data.role } : data;
       dispatch(setUserData(payload));

       // Instant Redirect
       if (data.role === "admin") navigate("/admin/dashboard");
       else if (data.role === "teacher") navigate("/teacher/dashboard");
       else navigate("/");

    } catch (error) {
       console.log("Admin Login Error:", error);
       alert("Invalid Admin Credentials");
    } finally {
       setIsLoading(false);
    }
  };

  return (
    <>
      {/* HEADER */}
      <motion.header
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="max-w-7xl mx-auto mt-6 sm:mt-8 rounded-2xl
          bg-[rgba(15,15,20,0.88)] backdrop-blur-2xl
          border border-white/[0.08]
          px-8 py-5
          shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
      >
        <h1 className='text-2xl font-bold bg-gradient-to-r from-white via-gray-200 to-white bg-clip-text text-transparent tracking-tight'>
          ExamNotes AI
        </h1>
        <p className='text-sm text-gray-400 mt-0.5 tracking-wide'>
          AI-powered exam-oriented notes & revision
        </p>
      </motion.header>

      {/* MAIN */}
      <main className='max-w-7xl mx-auto py-12 sm:py-16 px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 items-center'>

        {/* LEFT */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <h1 className='text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.1] tracking-tight
            bg-gradient-to-br from-gray-900 via-gray-700 to-gray-900
            bg-clip-text text-transparent'>
            Unlock Smart <br /> AI Notes
          </h1>

          <div className='mt-10 flex flex-col gap-5'>
            {/* Role Tabs */}
            <div className='flex items-center gap-1 p-1 rounded-xl bg-gray-100 w-fit'>
              {[
                { key: "user", label: "Student" },
                { key: "teacher", label: "Teacher" },
                { key: "admin", label: "Admin" },
              ].map((tab) => {
                const active = selectedRole === tab.key;
                return (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => setSelectedRole(tab.key)}
                    className={`rounded-lg px-5 py-2 text-sm font-medium transition-all duration-200 ${
                      active
                        ? "bg-white text-gray-900 shadow-sm"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {selectedRole === "admin" ? (
              <form onSubmit={handleAdminLogin} className="flex flex-col gap-4 max-w-sm">
                <input 
                  type="email" 
                  placeholder="Admin Email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-900 transition-all"
                  required
                />
                <input 
                  type="password" 
                  placeholder="Admin Password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-900 transition-all"
                  required
                />
                <button 
                  type="submit"
                  disabled={isLoading}
                  className="px-6 py-3.5 bg-gray-900 text-white rounded-xl font-bold hover:bg-black transition-all shadow-lg active:scale-95 disabled:opacity-50"
                >
                  {isLoading ? "Authenticating..." : "Admin Login"}
                </button>
              </form>
            ) : (
              <div className="flex items-center gap-4">
                <motion.button
                  onClick={handleGoogleAuth}
                  disabled={isLoading}
                  whileHover={!isLoading ? { scale: 1.05, y: -2 } : {}}
                  whileTap={{ scale: 0.97 }}
                  className={`px-6 py-3.5 rounded-xl flex items-center gap-3 w-fit
                    bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900
                    border border-white/10
                    font-semibold text-base transition-transform duration-100 ease-out hover:scale-105 active:scale-95 transform will-change-transform
                    shadow-[0_15px_40px_rgba(0,0,0,0.35)]
                    hover:shadow-[0_20px_50px_rgba(0,0,0,0.45)]
                    ${
                    isLoading
                      ? 'opacity-50 cursor-not-allowed text-gray-400'
                      : 'text-white'
                  }`}
                >
                  <FcGoogle size={22} />
                  {isLoading ? "Connecting..." : "Continue with Google"}
                </motion.button>
              </div>
            )}
          </div>

          <p className='mt-8 max-w-xl text-base text-gray-500 leading-relaxed'>
            You get <span className="font-semibold text-gray-700">100 FREE credits</span> to create
            exam notes, project notes, charts, graphs and download clean PDFs — instantly using AI.
          </p>

          <p className='mt-3 text-sm text-gray-400'>
            Start with 100 free credits • Upgrade anytime • Instant access
          </p>
        </motion.div>

        {/* RIGHT — Feature Cards */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.15, ease: "easeOut" }}
          className='grid grid-cols-1 sm:grid-cols-2 gap-4'
        >
          {selectedRole === "admin" ? (
            <>
              <Feature icon="👥" title="Manage Users" des="Full control over user accounts and permissions." onClick={() => navigate("/admin/dashboard")} />
              <Feature icon="🖥️" title="Monitor Platform" des="Real-time analytics and platform usage monitoring." onClick={() => navigate("/admin/dashboard")} />
              <Feature icon="💳" title="Control Subscriptions" des="Manage credit plans and payment processing." onClick={() => navigate("/admin/dashboard")} />
              <Feature icon="🛡️" title="Security Center" des="Enforce platform-wide security and access rules." onClick={() => navigate("/admin/dashboard")} />
            </>
          ) : selectedRole === "teacher" ? (
            <>
              <Feature icon="📚" title="Upload Notes" des="Quick PDF to AI conversion for study materials." onClick={() => navigate("/teacher/dashboard")} />
              <Feature icon="🗂️" title="Manage Subjects" des="Organize and categorize content by subjects." onClick={() => navigate("/teacher/dashboard")} />
              <Feature icon="🤝" title="Share Content" des="Instant sharing and distribution to students." onClick={() => navigate("/teacher/dashboard")} />
              <Feature icon="✍️" title="Assessments" des="Generate AI-powered questions and test items." onClick={() => navigate("/teacher/dashboard")} />
            </>
          ) : (
            <>
              <Feature icon="🎁" title="100 Free Credits" des="Start with 100 credits to generate notes without paying." onClick={() => navigate("/pricing")} />
              <Feature icon="📘" title="Exam Notes" des="High-yield, revision-ready exam-oriented notes." onClick={() => navigate("/notes")} />
              <Feature icon="📂" title="Project Notes" des="Well-structured documentation for assignments & projects." onClick={() => navigate("/notes")} />
              <Feature icon="📊" title="Charts & Graphs" des="Auto-generated diagrams, charts and flow graphs." onClick={() => navigate("/notes")} />
              <Feature icon="⬇️" title="Free PDF Download" des="Download clean, printable PDFs instantly." onClick={() => navigate("/history")} />
            </>
          )}
        </motion.div>

      </main>
      <Footer />
    </>
  );
}

/* FEATURE CARD */
function Feature({ icon, title, des, onClick }) {
  return (
    <motion.div
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`relative rounded-2xl p-5
        bg-gradient-to-br from-[rgba(15,15,20,0.92)] to-[rgba(25,25,35,0.88)]
        backdrop-blur-2xl
        border border-white/[0.06]
        shadow-[0_15px_40px_rgba(0,0,0,0.35)]
        hover:shadow-[0_20px_50px_rgba(0,0,0,0.45)]
        hover:border-white/[0.12]
        transition-transform duration-150 ease-out hover:scale-105 transform will-change-transform
        text-white
        ${onClick ? 'cursor-pointer' : ''}`}
    >
      <div className='text-2xl mb-3'>{icon}</div>
      <h3 className="text-sm font-semibold mb-1.5 tracking-tight">{title}</h3>
      <p className="text-gray-400 text-xs leading-relaxed">{des}</p>
    </motion.div>
  );
}

export default Auth;
