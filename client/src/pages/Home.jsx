import React, { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import { motion, AnimatePresence } from "motion/react"
import img from "../assets/img1.png"
import Footer from '../components/Footer'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import axios from 'axios'
import { serverUrl } from '../App'
import { FiBookOpen, FiCpu, FiType, FiX, FiCheck } from 'react-icons/fi'

function Home() {
  const navigate = useNavigate()
  const { userData } = useSelector((state) => state.user)
  const [sharedNotes, setSharedNotes] = useState([])
  const [loadingNotes, setLoadingNotes] = useState(false)
  

  useEffect(() => {
    if (userData?.branch) {
      fetchSharedNotes()
    }
  }, [userData])

  const fetchSharedNotes = async () => {
    try {
      setLoadingNotes(true)
      const res = await axios.get(`${serverUrl}/api/teacher/shared-notes`, {
        params: { branch: userData.branch, semester: userData.semester },
        withCredentials: true
      })
      setSharedNotes(res.data)
    } catch (err) {
      console.error("Fetch Shared Notes Error:", err)
    } finally {
      setLoadingNotes(false)
    }
  }


  return (
    <div className='min-h-screen overflow-hidden bg-gradient-to-b from-white via-slate-50 to-white dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 text-black dark:text-white transition-colors duration-150'>
      <Navbar />

      {/* Hero Section */}
      <section className='max-w-7xl mx-auto px-6 sm:px-8 pt-24 sm:pt-32 pb-16 grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 items-center'>
        <div>
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <motion.h1
              className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.1] tracking-tight
                bg-gradient-to-br from-gray-900 via-gray-700 to-gray-900
                dark:from-white dark:via-gray-300 dark:to-white
                bg-clip-text text-transparent"
            >
              Master Exams with <br /> Expert Study Materials
            </motion.h1>

            <motion.p
              className='mt-6 max-w-xl text-base sm:text-lg leading-relaxed text-gray-500 dark:text-gray-400'
            >
              Access curated teacher notes, structured project documentation,
              and comprehensive company mock series —
              designed to help you crack every placement.
            </motion.p>
          </motion.div>

          <div className="flex flex-wrap gap-4 mt-10">
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              onClick={() => navigate("/notes")}
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.97 }}
              className='px-10 py-3.5 rounded-xl
                flex items-center gap-3
                bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900
                border border-white/10
                text-white font-semibold text-base
                shadow-[0_15px_40px_rgba(0,0,0,0.35)]
                hover:shadow-[0_20px_50px_rgba(0,0,0,0.45)]
                transition-transform duration-100 ease-out hover:scale-105 active:scale-95 transform will-change-transform'>
              Get Started
              <span className="text-lg">→</span>
            </motion.button>

            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              onClick={() => navigate("/tests")}
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.97 }}
              className='px-8 py-3.5 rounded-xl
                flex items-center gap-3
                bg-white/5 hover:bg-white/10
                border border-white/10
                text-gray-900 dark:text-white font-semibold text-base
                transition-transform duration-100 ease-out hover:scale-105 active:scale-95 transform will-change-transform'>
              Company Tests
            </motion.button>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.15, ease: "easeOut" }}
          whileHover={{ y: -8, scale: 1.02 }}
          className="transform-gpu"
        >
          <div className='rounded-2xl overflow-hidden shadow-[0_25px_60px_rgba(0,0,0,0.12)]'>
            <img src={img} alt="ExamNotes AI preview" className="w-full" />
          </div>
        </motion.div>
      </section>

      <section className='max-w-7xl mx-auto px-6 sm:px-8 py-20 sm:py-28'>
        {/* Study Materials Section (Shared by Teachers) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-14"
        >
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
                Study Materials
              </h2>
              <p className="mt-2 text-gray-500 dark:text-gray-400">
                Teacher-uploaded notes for {userData.branch} Sem {userData.semester}.
              </p>
            </div>
          </div>
        </motion.div>

        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-20'>
          {loadingNotes ? (
            <div className="col-span-full py-10 text-center text-gray-400">Loading shared materials...</div>
          ) : sharedNotes.length === 0 ? (
             <div className="col-span-full py-10 text-center text-gray-400 italic">No notes uploaded for your branch yet.</div>
          ) : (
            sharedNotes.map((note, index) => (
              <Feature 
                key={note._id}
                icon="📘" 
                title={note.title} 
                des={note.subject} 
                delay={index * 0.1}
                onClick={() => window.open(serverUrl + "/" + note.fileUrl, "_blank")}
                buttonLabel="View Notes"
              />
            ))
          )}
        </div>

        {/* Existing Sections */}
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-14"
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
            Learn with AI
          </h2>
          <p className="mt-3 text-gray-500 dark:text-gray-400 max-w-lg mx-auto">
            Powered by AI to help you study smarter, not harder.
          </p>
        </motion.div>

        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5'>
          <Feature 
            icon="📘" title="Exam Notes" des="High-yield exam-oriented notes with revision points." delay={0} 
            onClick={() => navigate("/notes")}
          />
          <Feature 
            icon="📂" title="Project Notes" des="Well-structured content for assignments and projects." delay={0.1} 
            onClick={() => navigate("/notes")}
          />
          <Feature 
            icon="📊" title="Diagrams" des="Auto-generated visual diagrams for clarity." delay={0.2} 
            onClick={() => navigate("/notes")}
          />
          <Feature 
            icon="⬇️" title="PDF Download" des="Download clean, printable PDFs instantly." delay={0.3} 
            onClick={() => navigate("/history")}
          />
        </div>

        {/* Specialized Sections */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-20 mb-10 text-center"
        >
          <h2 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">Focus Areas</h2>
        </motion.div>

        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4'>
          <Feature 
            icon="💻" title="DSA" des="Data Structures & Algorithms master notes." delay={0.5} 
            onClick={() => navigate("/notes/dsa")}
          />
          <Feature 
            icon="🧩" title="OOPS" des="Object Oriented Programming fundamentals." delay={0.6} 
            onClick={() => navigate("/notes/oops")}
          />
          <Feature 
            icon="🗄️" title="DBMS" des="Database management system core concepts." delay={0.7} 
            onClick={() => navigate("/notes/dbms")}
          />
          <Feature 
            icon="🎓" title="Placement" des="Complete placement preparation materials." delay={0.8} 
            onClick={() => navigate("/notes/placement")}
          />
        </div>

        {/* Company Mock Tests */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mt-20 mb-10 text-center"
        >
          <h2 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">Company Mock Series</h2>
        </motion.div>

        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
          <Feature 
            icon="🏢" title="TCS NQT" des="Standard TCS pattern mock tests." delay={0.2} 
            onClick={() => navigate("/tests?company=TCS")}
          />
          <Feature 
            icon="💠" title="Infosys" des="Logical & analytical reasoning series." delay={0.3} 
            onClick={() => navigate("/tests?company=Infosys")}
          />
          <Feature 
            icon="🌀" title="Wipro" des="Wipro NLTH specific preparation." delay={0.4} 
            onClick={() => navigate("/tests?company=Wipro")}
          />
          <Feature 
            icon="📈" title="Analytics" des="Check your test performance trends." delay={0.5} 
            onClick={() => navigate("/performance")}
          />
          <Feature 
            icon="💻" title="Code Playground" des="Practice algorithms in our Monaco editor." delay={0.6} 
            onClick={() => navigate("/playground")}
          />
        </div>
      </section>


      <Footer />
    </div>
  )
}

function Feature({ icon, title, des, delay = 0, onClick, buttonLabel }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -6, scale: 1.02 }}
      onClick={onClick}
      className={`relative rounded-2xl p-6
        bg-gradient-to-br from-[rgba(15,15,20,0.92)] to-[rgba(25,25,35,0.88)]
        backdrop-blur-2xl
        border border-white/[0.06]
        shadow-[0_20px_50px_rgba(0,0,0,0.4)]
        hover:shadow-[0_25px_60px_rgba(0,0,0,0.5)]
        hover:border-white/[0.12]
        transition-transform duration-150 ease-out hover:scale-105 transform will-change-transform
        text-white
        ${onClick ? "cursor-pointer" : ""}`}
    >
      <div className='text-3xl mb-4'>{icon}</div>
      <h3 className="text-base font-semibold mb-2 tracking-tight">{title}</h3>
      <p className="text-gray-400 text-sm leading-relaxed mb-4">{des}</p>
      {buttonLabel && (
         <div className="inline-flex items-center gap-2 text-indigo-400 text-xs font-bold mt-2">
            {buttonLabel} <span className="text-lg">→</span>
         </div>
      )}
    </motion.div>
  )
}

export default Home
