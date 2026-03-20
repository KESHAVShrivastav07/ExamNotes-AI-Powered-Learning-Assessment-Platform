import React from 'react'
import { motion } from "motion/react"
import { useNavigate } from 'react-router-dom'

function PageHeader({ rightContent }) {
  const navigate = useNavigate()

  return (
    <motion.header
      initial={{ opacity: 0, y: -15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="
        mb-10 rounded-2xl
        bg-[rgba(15,15,20,0.88)] backdrop-blur-2xl
        border border-white/[0.08]
        px-8 py-5
        shadow-[0_20px_50px_rgba(0,0,0,0.5)]
        flex items-center justify-between gap-4 flex-wrap
      "
    >
      <div
        onClick={() => navigate("/")}
        className="cursor-pointer group"
      >
        <h1 className="text-2xl font-bold bg-gradient-to-r from-white via-gray-200 to-white bg-clip-text text-transparent group-hover:opacity-90 transition-opacity">
          ExamNotes AI
        </h1>
        <p className="text-sm text-gray-400 mt-0.5 tracking-wide">
          AI-powered exam-oriented notes &amp; revision
        </p>
      </div>

      {rightContent && (
        <div className="flex items-center gap-3 flex-wrap">
          {rightContent}
        </div>
      )}
    </motion.header>
  )
}

export default PageHeader
