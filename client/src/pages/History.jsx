import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { serverUrl } from '../App'
import { AnimatePresence, motion } from "motion/react"
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { GiHamburgerMenu } from "react-icons/gi";
import FinalResult from '../components/FinalResult'
import PageHeader from '../components/PageHeader'
import Footer from '../components/Footer'

function History() {
  const [topics, setTopics] = useState([])
  const navigate = useNavigate()
  const { userData } = useSelector((state) => state.user)
  const credits = userData.credits
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeNoteId, setActiveNoteId] = useState(null);
  const [selectedNote, setSelectedNote] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const myNotes = async () => {
      try {
        const res = await axios.get(serverUrl + "/api/notes/getnotes", { withCredentials: true })
        console.log(res.data)
        setTopics(Array.isArray(res.data) ? res.data : [])
      } catch (error) {
        console.log(error)
      }
    }
    myNotes()
  }, [])

  const openNotes = async (noteId) => {
    setLoading(true)
    setActiveNoteId(noteId)
    try {
      const res = await axios.get(serverUrl + `/api/notes/${noteId}`, { withCredentials: true })
      setSelectedNote(res.data.content)
      setLoading(false)
    } catch (error) {
      console.log(error)
      setLoading(false)
    }
  }

  useEffect(() => {
    if (window.innerWidth >= 1024) {
      setIsSidebarOpen(true)
    }
  }, [])

  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-50 via-slate-50 to-gray-100 px-4 sm:px-6 py-6 sm:py-8'>

      <PageHeader
        rightContent={
          <>
            {!isSidebarOpen && (
              <button
                onClick={() => setIsSidebarOpen(true)}
                className='lg:hidden text-white text-xl p-2 rounded-lg hover:bg-white/[0.1] transition-colors'
              >
                <GiHamburgerMenu />
              </button>
            )}
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
          </>
        }
      />

      <div className='grid grid-cols-1 lg:grid-cols-4 gap-6'>
        <AnimatePresence>
          {isSidebarOpen && (
            <>
              {/* Mobile backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsSidebarOpen(false)}
                className="fixed inset-0 bg-black/40 z-40 lg:hidden"
              />

              <motion.div
                initial={{ x: -320 }}
                animate={{ x: 0 }}
                exit={{ x: -320 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className='fixed lg:static
                  top-0 left-0 z-50 lg:z-auto
                  w-72 lg:w-auto
                  h-full lg:h-[75vh]
                  lg:rounded-2xl
                  lg:col-span-1
                  bg-[rgba(15,15,20,0.95)] lg:bg-[rgba(15,15,20,0.88)]
                  backdrop-blur-2xl
                  border border-white/[0.08]
                  shadow-[0_20px_50px_rgba(0,0,0,0.5)]
                  p-5
                  overflow-y-auto'>

                <button
                  onClick={() => setIsSidebarOpen(false)}
                  className='lg:hidden text-gray-400 hover:text-white mb-4 text-sm flex items-center gap-2 transition-colors'
                >
                  ← Back
                </button>

                <div className='space-y-1 mb-5'>
                  <button
                    onClick={() => navigate("/notes")}
                    className='w-full px-4 py-2.5 rounded-xl text-sm text-gray-200
                      bg-white/[0.06] hover:bg-white/[0.1]
                      border border-white/[0.06]
                      text-left transition-colors flex items-center gap-2'
                  >
                    <span>➕</span> New Notes
                  </button>
                </div>

                <hr className="border-white/[0.06] mb-4" />

                <h2 className='mb-4 text-sm font-semibold text-gray-300 uppercase tracking-widest'>
                  📚 Your Notes
                </h2>

                {topics.length === 0 && (
                  <div className="text-center py-8">
                    <span className="text-3xl opacity-40 block mb-2">📝</span>
                    <p className="text-sm text-gray-500">No notes created yet</p>
                  </div>
                )}

                <ul className='space-y-2'>
                  {topics.map((t, i) => (
                    <li
                      key={i}
                      onClick={() => openNotes(t._id)}
                      className={`
                        cursor-pointer rounded-xl p-3.5 border transition-all duration-200
                        ${activeNoteId === t._id
                          ? "bg-primary-500/20 border-primary-400/40 shadow-[0_0_0_1px_rgba(99,102,241,0.2)]"
                          : "bg-white/[0.03] border-white/[0.06] hover:bg-white/[0.07] hover:border-white/[0.1]"
                        }
                      `}
                    >
                      <p className='text-sm font-medium text-white leading-snug'>{t.topic}</p>

                      <div className='flex flex-wrap gap-1.5 mt-2 text-[10px]'>
                        {t.classLevel && (
                          <span className='px-2 py-0.5 rounded-full bg-primary-500/15 text-primary-300'>
                            {t.classLevel}
                          </span>
                        )}
                        {t.examType && (
                          <span className='px-2 py-0.5 rounded-full bg-purple-500/15 text-purple-300'>
                            {t.examType}
                          </span>
                        )}
                      </div>

                      <div className='flex gap-3 mt-2 text-[10px] text-gray-400'>
                        {t.revisionMode && <span>⚡ Revision</span>}
                        {t.includeDiagram && <span>📊 Diagram</span>}
                        {t.includeChart && <span>📈 Chart</span>}
                      </div>
                    </li>
                  ))}
                </ul>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className='lg:col-span-3
            rounded-2xl bg-white
            shadow-[0_8px_30px_rgba(0,0,0,0.08)]
            border border-gray-100
            p-6 sm:p-8
            min-h-[75vh]'
        >
          {loading && (
            <div className="h-full flex items-center justify-center">
              <motion.p
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ repeat: Infinity, duration: 1.2 }}
                className="text-gray-400 text-sm"
              >
                Loading notes…
              </motion.p>
            </div>
          )}

          {!loading && !selectedNote && (
            <div className="h-full flex flex-col items-center justify-center text-center py-20">
              <span className="text-5xl opacity-40 block mb-4">📋</span>
              <p className="text-gray-400 text-sm font-medium">Select a topic from the sidebar</p>
              <p className="text-gray-300 text-xs mt-1">Choose a note to view its content</p>
            </div>
          )}

          {!loading && selectedNote && <FinalResult result={selectedNote} />}
        </motion.div>
      </div>
      <Footer />
    </div>
  )
}

export default History
