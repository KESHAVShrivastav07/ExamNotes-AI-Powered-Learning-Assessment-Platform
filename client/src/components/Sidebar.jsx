import React from 'react'
import { motion } from "motion/react"
import { FiMapPin, FiStar, FiTriangle, FiHelpCircle } from "react-icons/fi"

function Sidebar({ result }) {
  if (
    !result ||
    !result.subTopics ||
    !result.questions ||
    !result.questions.short ||
    !result.questions.long
  ) {
    return null;
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const item = {
    hidden: { opacity: 0, x: -10 },
    show: { opacity: 1, x: 0 }
  }

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className='bg-white dark:bg-slate-900/40 rounded-2xl border border-gray-100 dark:border-white/[0.08] shadow-[0_8px_30px_rgba(0,0,0,0.06)] p-6 space-y-6 transition-colors'
    >

      {/* Header */}
      <div className='flex items-center gap-2.5 pb-2'>
        <div className='w-8 h-8 rounded-lg bg-red-50 dark:bg-red-500/10 flex items-center justify-center text-red-500 dark:text-red-400'>
            <FiMapPin className='text-base' />
        </div>
        <h3 className='text-sm font-bold text-gray-800 dark:text-gray-100 tracking-tight'>
          Quick Exam View
        </h3>
      </div>

      {/* Sub Topics */}
      <section>
        <div className='flex items-center gap-2 mb-3'>
            <FiStar className="text-amber-500 text-xs" />
            <p className='text-[10px] font-bold text-gray-400 uppercase tracking-widest'>
                Sub Topics (Priority)
            </p>
        </div>
        {Object.entries(result.subTopics).map(([star, topics]) => (
          <motion.div
            variants={item}
            key={star}
            className='mb-3 rounded-xl bg-amber-50/40 dark:bg-amber-500/5 border border-amber-100/50 dark:border-amber-500/20 p-4'
          >
            <div className='flex items-center justify-between mb-2'>
                <p className='text-xs font-bold text-amber-700 dark:text-amber-500'>
                  {star} Priority
                </p>
                <div className='flex gap-0.5'>
                    {Array.from({ length: 3 }).map((_, i) => (
                        <FiStar key={i} className={`text-[10px] ${i < (star === "High" ? 3 : star === "Medium" ? 2 : 1) ? "fill-amber-500 text-amber-500" : "text-amber-200"}`} />
                    ))}
                </div>
            </div>
            <ul className='list-disc ml-4 text-sm text-gray-600 dark:text-gray-400 space-y-1'>
              {topics.map((t, i) => (
                <li key={i}>{t}</li>
              ))}
            </ul>
          </motion.div>
        ))}
      </section>

      <hr className="border-gray-100 dark:border-white/[0.05]" />

      {/* Exam Importance */}
      <motion.section variants={item} className='rounded-xl bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-500/10 dark:to-amber-500/10 border border-orange-100 dark:border-orange-500/20 p-4'>
        <div className='flex items-center gap-2 mb-1.5'>
            <FiTriangle className='text-orange-500 text-[10px] fill-orange-500 rotate-180' />
            <p className='text-[10px] font-bold text-orange-800 uppercase tracking-widest'>
                Exam Importance
            </p>
        </div>
        <span className='text-orange-900 font-extrabold text-sm tracking-tight'>
          {result.importance}
        </span>
      </motion.section>

      {/* Important Questions */}
      <section>
        <div className='flex items-center gap-2 mb-3'>
            <FiHelpCircle className='text-blue-500 text-xs' />
            <p className='text-[10px] font-bold text-gray-400 uppercase tracking-widest'>
                Important Questions
            </p>
        </div>

        <div className='space-y-3'>
          <QuestionBlock
            title="Short Questions"
            items={result.questions.short}
            bgClass="bg-primary-50/60"
            borderClass="border-primary-100"
            titleClass="text-primary-700"
          />

          <QuestionBlock
            title="Long Questions"
            items={result.questions.long}
            bgClass="bg-purple-50/60"
            borderClass="border-purple-100"
            titleClass="text-purple-700"
          />

          <QuestionBlock
            title="Diagram Question"
            items={[result.questions.diagram]}
            bgClass="bg-blue-50/60"
            borderClass="border-blue-100"
            titleClass="text-blue-700"
          />
        </div>
      </section>
    </motion.div>
  )
}

function QuestionBlock({ title, items, bgClass, borderClass, titleClass }) {
  return (
    <div className={`rounded-xl ${bgClass} border ${borderClass} p-3.5`}>
      <p className={`text-xs font-medium ${titleClass} mb-2`}>
        {title}
      </p>
      <ul className='list-disc ml-4 text-sm text-gray-600 space-y-1'>
        {items.map((t, i) => (
          <li key={i}>{t}</li>
        ))}
      </ul>
    </div>
  )
}

export default Sidebar
