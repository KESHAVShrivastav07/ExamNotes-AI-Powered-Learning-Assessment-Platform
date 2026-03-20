import React from "react";
import { motion } from "motion/react";
import {
  FiHome,
  FiUpload,
  FiBookOpen,
  FiFileText,
  FiLogOut,
  FiMenu,
  FiX,
} from "react-icons/fi";

const navItems = [
  { key: "dashboard", label: "Dashboard", icon: <FiHome /> },
  { key: "upload", label: "Upload Notes", icon: <FiUpload /> },
  { key: "subjects", label: "Manage Subjects", icon: <FiBookOpen /> },
  { key: "uploads", label: "My Uploads", icon: <FiFileText /> },
  { key: "tests", label: "Mock Test Series", icon: <FiFileText /> },
];

function TeacherSidebar({ activeSection, setActiveSection, isOpen, setIsOpen, onLogout }) {
  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Mobile hamburger */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-5 left-5 z-50 md:hidden w-10 h-10 rounded-xl
          bg-white dark:bg-slate-900 border border-gray-200 dark:border-white/[0.1] shadow-md
          flex items-center justify-center text-gray-700 dark:text-gray-300
          hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
      >
        {isOpen ? <FiX size={18} /> : <FiMenu size={18} />}
      </button>

      {/* Sidebar */}
      <motion.aside
        initial={{ x: -280 }}
        animate={{ x: isOpen ? 0 : -280 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className={`fixed top-0 left-0 z-40 w-[260px] h-screen
          bg-white dark:bg-slate-900 border-r border-gray-200 dark:border-white/[0.05]
          flex flex-col`}
        style={{ willChange: "transform" }}
      >
        {/* Logo area */}
        <div className="px-6 py-7 border-b border-gray-100 dark:border-white/[0.05]">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white tracking-tight">
            📚 Teacher Panel
          </h2>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">ExamNotes AI</p>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-4 py-6 space-y-1.5">
          {navItems.map((item) => {
            const isActive = activeSection === item.key;
            return (
              <button
                key={item.key}
                onClick={() => {
                  setActiveSection(item.key);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl
                  text-sm font-medium transition-all duration-200
                  ${
                    isActive
                      ? "bg-primary-50 dark:bg-primary-500/10 text-primary-700 dark:text-primary-400 shadow-sm border border-primary-100 dark:border-primary-500/20"
                      : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/[0.02] hover:text-gray-900 dark:hover:text-white border border-transparent"
                  }`}
              >
                <span className={`text-lg ${isActive ? "text-primary-600" : "text-gray-400"}`}>
                  {item.icon}
                </span>
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="px-4 pb-6">
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl
              text-sm font-medium text-red-500
              hover:bg-red-50 transition-colors border border-transparent"
          >
            <FiLogOut className="text-lg" />
            Sign Out
          </button>
        </div>
      </motion.aside>
    </>
  );
}

export default TeacherSidebar;
