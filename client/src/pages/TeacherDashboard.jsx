import React, { useState } from "react";
import { motion } from "motion/react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FiLogOut, FiMenu, FiX } from "react-icons/fi";
import { serverUrl } from "../App";
import { setUserData } from "../redux/userSlice";
import TeacherSidebar from "../components/TeacherSidebar";
import DashboardHome from "../components/teacher/DashboardHome";
import ThemeToggle from "../components/ThemeToggle";
import UploadNotes from "../components/teacher/UploadNotes";
import ManageSubjects from "../components/teacher/ManageSubjects";
import MyUploads from "../components/teacher/MyUploads";
import ManageTests from "../components/teacher/ManageTests";
import Footer from "../components/Footer";

function TeacherDashboard() {
  const [activeSection, setActiveSection] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { userData } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.get(serverUrl + "/api/auth/logout", { withCredentials: true });
      dispatch(setUserData(null));
      navigate("/teacher/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const renderContent = () => {
    switch (activeSection) {
      case "dashboard":
        return <DashboardHome userData={userData} setActiveSection={setActiveSection} />;
      case "upload":
        return <UploadNotes />;
      case "subjects":
        return <ManageSubjects />;
      case "uploads":
        return <MyUploads />;
      case "tests":
        return <ManageTests />;
      default:
        return <DashboardHome userData={userData} setActiveSection={setActiveSection} />;
    }
  };

  return (
    <div className='min-h-screen bg-gradient-to-b from-white via-slate-50 to-white dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 text-black dark:text-white transition-colors duration-150'>
       <div className="flex w-full min-h-screen">
          <TeacherSidebar
            activeSection={activeSection}
            setActiveSection={setActiveSection}
            isOpen={sidebarOpen}
            setIsOpen={setSidebarOpen}
            onLogout={handleLogout}
          />

          <main className="flex-1 w-full overflow-y-auto custom-scrollbar bg-slate-50 dark:bg-slate-950">
            <div className="w-full px-6 pt-8 pb-12">
              {/* Top Header Bar */}
              <div className="flex items-center justify-between w-full mb-8 border-b border-gray-200 dark:border-white/5 pb-6">
                <div className="flex items-center gap-4">
                  {/* Sidebar Toggle for Desktop/Mobile */}
                  <button 
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors shadow-sm"
                  >
                    {sidebarOpen ? <FiX size={20} /> : <FiMenu size={20} />}
                  </button>

                  <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                      Welcome back, Teacher 👋
                    </h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      Manage your tests, notes, and student performance from one central dashboard.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <ThemeToggle />
                  <button 
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors shadow-lg shadow-red-500/20 font-medium text-sm ml-2"
                  >
                    <FiLogOut size={16} />
                    <span className="hidden sm:inline">Logout</span>
                  </button>
                </div>
              </div>

              {/* Quick Actions (Optional, keeping them but smaller/better aligned) */}
              <div className="flex flex-wrap items-center gap-3 mb-6">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setActiveSection("upload")}
                  className='px-5 py-2.5 rounded-xl flex items-center gap-2 bg-white dark:bg-slate-800 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white font-semibold text-sm shadow-sm hover:shadow-md transition-all'
                >
                  Upload Notes <span className="text-lg">📄</span>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setActiveSection("tests")}
                  className='px-5 py-2.5 rounded-xl flex items-center gap-2 bg-blue-600 border border-blue-500 text-white font-semibold text-sm shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition-all'
                >
                  Create New Test <span className="text-lg">+</span>
                </motion.button>
              </div>

              {/* Render Section Content */}
              <motion.div
                key={activeSection}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="w-full flex-grow"
              >
                {renderContent()}
              </motion.div>

              <footer className="w-full text-center py-4 border-t border-gray-200 dark:border-white/5 mt-auto">
                <Footer />
              </footer>
            </div>
          </main>
       </div>
    </div>
  );
}

export default TeacherDashboard;
