import React, { useState } from 'react'
import { motion } from "motion/react"
import { useNavigate, useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import TopicForm from '../components/TopicForm'
import Sidebar from '../components/Sidebar'
import FinalResult from '../components/FinalResult'
import PageHeader from '../components/PageHeader'
import Footer from '../components/Footer'
import { downloadPdf } from '../services/api'
import { FiDownload, FiX, FiCheckCircle } from "react-icons/fi"
import CodeEditor from '../components/CodeEditor'

function Notes() {
  const navigate = useNavigate()
  const { section } = useParams()
  const { userData } = useSelector((state) => state.user)
  const credits = userData.credits
  const [loading, setLoading] = useState(false)
  const [downloading, setDownloading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState("")

  const handleDownload = async () => {
    try {
      setDownloading(true)
      await downloadPdf(result)
      setDownloading(false)
    } catch (err) {
      setDownloading(false)
      setError("Failed to download PDF. Please try again.")
    }
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-50 via-slate-50 to-gray-100 px-4 sm:px-6 py-6 sm:py-8'>

      <PageHeader
        rightContent={
          <>
            <button
              className='flex items-center gap-2
                px-4 py-2 rounded-full
                bg-white/[0.07] border border-white/[0.1]
                hover:bg-white/[0.12]
                text-white text-sm transition-colors'
              onClick={() => navigate("/pricing")}
            >
              <span className='text-base'>💠</span>
              <span className='font-medium tabular-nums'>{credits}</span>
              <span className='ml-1 h-5 w-5 flex items-center justify-center
                rounded-full bg-white/90 text-[10px] font-bold text-black'>+</span>
            </button>
            <button
              onClick={() => navigate("/history")}
              className='px-4 py-2.5 rounded-full
                text-sm font-medium
                bg-white/[0.07] border border-white/[0.1]
                hover:bg-white/[0.12]
                text-white transition-colors
                flex items-center gap-2'
            >
              📚 Your Notes
            </button>
          </>
        }
      />

      {/* Topic Form */}
      <motion.div className="mb-10">
        <TopicForm 
          loading={loading} 
          setResult={setResult} 
          setLoading={setLoading} 
          setError={setError} 
          initialSection={section}
        />
      </motion.div>

      {/* Loading State */}
      {loading && (
        <motion.div
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ repeat: Infinity, duration: 1.2 }}
          className="text-center text-gray-600 font-medium mb-6"
        >
          Generating exam-focused notes…
        </motion.div>
      )}

      {/* Error State */}
      {error && (
        <div className="mb-6 text-center">
          <div className="inline-block px-5 py-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm font-medium">
            {error}
          </div>
        </div>
      )}

      {/* Empty State */}
      {!result && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="
            h-64 rounded-2xl
            flex flex-col items-center justify-center
            bg-white/70 backdrop-blur-sm
            border-2 border-dashed border-gray-200
            text-gray-400
          "
        >
          <span className="text-5xl mb-4 opacity-60">📘</span>
          <p className="text-sm font-medium">Generated notes will appear here</p>
          <p className="text-xs text-gray-300 mt-1">Fill in the form above to get started</p>
        </motion.div>
      )}

      {/* Result */}
      {result && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className='space-y-6'
        >
          {/* Action Header - Matches User Image */}
          <div className='flex flex-wrap items-center justify-between gap-4 bg-white/40 backdrop-blur-sm p-4 rounded-2xl border border-white/50 shadow-sm'>
             <div className='flex items-center gap-3'>
                <div className='w-2.5 h-7 bg-indigo-600 rounded-full' />
                <h3 className='text-sm font-bold text-gray-800 tracking-tight'>Result Actions</h3>
             </div>
             <div className='flex items-center gap-3'>
                {result.revisionMode && (
                    <button 
                        onClick={() => setResult(prev => ({ ...prev, revisionMode: false }))}
                        className='px-4 py-2 rounded-xl bg-green-600 hover:bg-green-700 text-white text-[11px] font-bold flex items-center gap-2 transition-all shadow-md shadow-green-100'
                    >
                        <FiCheckCircle className='text-sm' />
                        Exit Revision Mode
                    </button>
                )}
                <button 
                    onClick={handleDownload}
                    disabled={downloading}
                    className='px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] font-bold flex items-center gap-2 transition-all shadow-md shadow-indigo-100 disabled:opacity-50'
                >
                    <FiDownload className='text-sm' />
                    {downloading ? "Preparing PDF..." : "Download PDF"}
                </button>
             </div>
          </div>

          <div className='flex flex-col lg:grid lg:grid-cols-4 gap-6'>
            <div className='lg:col-span-1'>
                <Sidebar result={result} />
            </div>

            <div className='lg:col-span-3
                rounded-3xl bg-white dark:bg-slate-900/50
                shadow-[0_20px_60px_rgba(0,0,0,0.05)]
                border border-gray-100 dark:border-white/[0.05]
                p-6 sm:p-10'
            >
                <FinalResult result={result} />
            </div>
          </div>
          
          <CodeEditor />
        </motion.div>
      )}

      <Footer />
    </div>
  )
}

export default Notes
