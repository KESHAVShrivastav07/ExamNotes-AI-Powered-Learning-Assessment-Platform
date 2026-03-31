import React, { useEffect, useState } from 'react'
import { motion } from "motion/react"
import { generateNotes } from '../services/api';
import { useDispatch } from 'react-redux';
import { updateCredits } from '../redux/userSlice';
import { useNavigate } from 'react-router-dom';

function TopicForm({ setResult, setLoading, loading, setError, initialSection }) {
  const navigate = useNavigate();
  const [topic, setTopic] = useState("");

  useEffect(() => {
    if (initialSection) {
      const sectionMap = {
        dsa: "Data Structures & Algorithms (DSA)",
        oops: "Object Oriented Programming (OOPS)",
        dbms: "Database Management Systems (DBMS)",
        placement: "Placement Preparation & Core CS Subjects",
        os: "Operating Systems (OS)",
        cn: "Computer Networks (CN)"
      };
      setTopic(sectionMap[initialSection.toLowerCase()] || initialSection);
    }
  }, [initialSection]);

  const [classLevel, setClassLevel] = useState("");
  const [examType, setExamType] = useState("");
  const [revisionMode, setRevisionMode] = useState(false);
  const [includeDiagram, setIncludeDiagram] = useState(false);
  const [includeChart, setIncludeChart] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressText, setProgressText] = useState("");
  const dispatch = useDispatch()

  const handleSubmit = async () => {
    if (!topic.trim()) {
      setError("Please enter the topic")
      return;
    }
    setError("")
    setLoading(true)
    setResult(null)
    try {
      const result = await generateNotes({
        topic, classLevel, examType,
        revisionMode, includeDiagram, includeChart
      })
      setResult(result.data)
      setLoading(false)
      setClassLevel("")
      setTopic("")
      setExamType("")
      setIncludeChart(false)
      setRevisionMode(false)
      setIncludeDiagram(false)

      if (typeof result.creditsLeft === "number") {
        dispatch(updateCredits(result.creditsLeft));
      }
    } catch (error) {
      console.log(error)
      if (error?.response?.status === 403) {
        setError("Insufficient credits! Redirecting to buy credits...");
        setLoading(false)
        setTimeout(() => navigate("/pricing"), 2000);
      } else {
        setError("Failed to fetch notes from server");
        setLoading(false)
      }
    }
  }

  useEffect(() => {
    if (!loading) {
      setProgress(0);
      setProgressText("")
      return;
    }
    let value = 0;

    const interval = setInterval(() => {
      value += Math.random() * 8

      if (value >= 95) {
        value = 95;
        setProgressText("Almost done…");
        clearInterval(interval);
      } else if (value > 70) {
        setProgressText("Finalizing notes…");
      } else if (value > 40) {
        setProgressText("Processing content…");
      } else {
        setProgressText("Generating notes…");
      }

      setProgress(Math.floor(value))
    }, 700)

    return () => clearInterval(interval);
  }, [loading])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="
        rounded-2xl
        bg-[rgba(15,15,20,0.88)] backdrop-blur-2xl
        border border-white/[0.08]
        shadow-[0_20px_50px_rgba(0,0,0,0.5)]
        p-6 sm:p-8
        space-y-5
        text-white
      ">

      {/* Section Title */}
      <div className="mb-1">
        <h2 className="text-lg font-semibold tracking-tight">Generate Notes</h2>
        <p className="text-xs text-gray-400 mt-0.5">Fill in the details to create AI-powered exam notes</p>
      </div>

      {/* Inputs */}
      <div className="space-y-4">
        <InputField
          placeholder="Enter topic (e.g. Web Development)"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          icon="📝"
        />
        <InputField
          placeholder="Class / Level (e.g. Class 10)"
          value={classLevel}
          onChange={(e) => setClassLevel(e.target.value)}
          icon="🎓"
        />
        <InputField
          placeholder="Exam Type (e.g. CBSE, JEE, NEET)"
          value={examType}
          onChange={(e) => setExamType(e.target.value)}
          icon="📋"
        />
      </div>

      {/* Toggles */}
      <div className='flex flex-col sm:flex-row gap-4 sm:gap-6 pt-1'>
        <Toggle label="Exam Revision Mode" checked={revisionMode} onChange={() => setRevisionMode(!revisionMode)} />
        <Toggle label="Include Diagram" checked={includeDiagram} onChange={() => setIncludeDiagram(!includeDiagram)} />
        <Toggle label="Include Charts" checked={includeChart} onChange={() => setIncludeChart(!includeChart)} />
      </div>

      {/* Submit Button */}
      <motion.button
        onClick={handleSubmit}
        whileHover={!loading ? { scale: 1.01, y: -1 } : {}}
        whileTap={!loading ? { scale: 0.98 } : {}}
        disabled={loading}
        className={`
          w-full mt-2
          py-3.5 rounded-xl
          font-semibold text-sm
          flex items-center justify-center gap-3
          transition-all duration-200
          ${loading
            ? "bg-gray-600/50 text-gray-300 cursor-not-allowed"
            : "bg-white text-gray-900 shadow-[0_8px_25px_rgba(255,255,255,0.1)] hover:shadow-[0_12px_30px_rgba(255,255,255,0.15)]"
          }
        `}>
        {loading ? "Generating Notes..." : "Generate Notes"}
        {!loading && <span>→</span>}
      </motion.button>

      {/* Progress */}
      {loading && (
        <div className='mt-2 space-y-2'>
          <div className='w-full h-1.5 rounded-full bg-white/[0.08] overflow-hidden'>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ ease: "easeOut", duration: 0.6 }}
              className='h-full rounded-full bg-gradient-to-r from-accent-400 via-accent-500 to-accent-400'
            />
          </div>

          <div className='flex justify-between text-xs text-gray-400'>
            <span>{progressText}</span>
            <span className="tabular-nums">{progress}%</span>
          </div>
          <p className='text-[10px] text-gray-500 text-center'>
            This may take up to 2–5 minutes. Please don't close or refresh the page.
          </p>
        </div>
      )}
    </motion.div>
  )
}

function InputField({ placeholder, value, onChange, icon }) {
  return (
    <div className="relative">
      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm opacity-60">{icon}</span>
      <input
        type="text"
        className='w-full pl-10 pr-4 py-3 rounded-xl
          bg-white/[0.06]
          border border-white/[0.08]
          placeholder-gray-500
          text-white text-sm
          focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500/40
          transition-all'
        placeholder={placeholder}
        onChange={onChange}
        value={value}
      />
    </div>
  )
}

function Toggle({ label, checked, onChange }) {
  return (
    <div className='flex items-center gap-3 cursor-pointer select-none' onClick={onChange}>
      <motion.div
        animate={{
          backgroundColor: checked
            ? "rgba(16,185,129,0.3)"
            : "rgba(255,255,255,0.08)"
        }}
        transition={{ duration: 0.2 }}
        className='relative w-11 h-6 rounded-full
          border border-white/[0.1]'
      >
        <motion.div
          layout
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
          className='absolute top-0.5
            h-5 w-5 rounded-full
            bg-white
            shadow-md'
          style={{
            left: checked ? "1.35rem" : "0.15rem",
          }}
        />
      </motion.div>

      <span className={`text-sm transition-colors duration-200 ${checked ? "text-accent-400" : "text-gray-400"
        }`}>{label}</span>
    </div>
  )
}

export default TopicForm
