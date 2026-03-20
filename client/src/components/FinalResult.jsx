import React from 'react'
import MermaidSetup from './MermaidSetup'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import RechartSetUp from './RechartSetUp'

function FinalResult({ result }) {
  if (!result) return null

  // Function to process content specifically to separate sections based on markdown heading tags
  const processContent = (content) => {
    if (typeof content !== 'string') return [];
    // A more robust regex to split by h2 or h3 while keeping the heading itself
    const sections = content.split(/(?=\n##\s|\n###\s)/);
    return sections.filter(section => section.trim() !== '');
  }

  // Support both legacy "detailedNotes" and new "summary" / "notes" fields
  const rawNotes = result.detailedNotes || result.summary || result.notes || "";
  const detailedNotesSections = processContent(rawNotes);

  // Support both legacy "revisionPoints" (string) and new "keyPoints" (array)
  let rawRevision = "";
  if (typeof result.revisionPoints === 'string') {
    rawRevision = result.revisionPoints;
  } else if (Array.isArray(result.revisionPoints)) {
    rawRevision = result.revisionPoints.join('\n');
  } else if (Array.isArray(result.keyPoints)) {
    rawRevision = result.keyPoints.join('\n');
  }
  const revisionPointsSections = processContent(rawRevision);

  // Task 2: Function to get useful reference links based on content
  const getReferenceLinks = (text) => {
    const links = [];
    const lowerText = text.toLowerCase();

    if (lowerText.includes("react")) links.push({ name: "React Docs", url: "https://react.dev/" });
    if (lowerText.includes("mongodb")) links.push({ name: "MongoDB Docs", url: "https://www.mongodb.com/docs/" });
    if (lowerText.includes("node")) links.push({ name: "Node.js Docs", url: "https://nodejs.org/en/docs" });
    if (lowerText.includes("express")) links.push({ name: "Express.js", url: "https://expressjs.com/" });
    if (lowerText.includes("javascript")) links.push({ name: "MDN JS", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript" });
    if (lowerText.includes("python")) links.push({ name: "Python Docs", url: "https://docs.python.org/3/" });
    if (lowerText.includes("tailwind")) links.push({ name: "Tailwind CSS", url: "https://tailwindcss.com/docs" });

    return links;
  };

  const allText = (rawNotes + " " + rawRevision).toLowerCase();
  const refLinks = getReferenceLinks(allText);

  return (
    <div className='w-full space-y-12 max-w-4xl mx-auto'>

      {/* Main Title Area */}
      <motion.div 
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        className="border-b border-gray-100 dark:border-white/[0.08] pb-8 mb-8"
      >
        <div className='flex items-center gap-4 mb-4'>
            <div className='w-10 h-10 lg:w-12 lg:h-12 rounded-2xl bg-indigo-600 dark:bg-indigo-500/20 flex items-center justify-center text-white dark:text-indigo-400 text-xl shadow-indigo-200 dark:shadow-indigo-900/20 shadow-xl border border-indigo-500/10'>
                📘
            </div>
            <h1 className="text-2xl lg:text-3xl font-extrabold text-indigo-900 dark:text-indigo-300 tracking-tight">
                Generated Notes
            </h1>
        </div>
        
        <h2 className='text-3xl lg:text-4xl font-extrabold text-gray-900 dark:text-white leading-tight mb-5'>
            {result.topic}
        </h2>

        <div className="flex flex-wrap gap-3 text-xs font-bold">
          <span className="px-3.5 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-500/20 shadow-sm">
            🎓 {result.classLevel}
          </span>
          <span className="px-3.5 py-1.5 rounded-xl bg-purple-50 dark:bg-purple-500/10 text-purple-700 dark:text-purple-400 border border-purple-100 dark:border-purple-500/20 shadow-sm">
            🎯 {result.examType}
          </span>
          {result.revisionMode && (
            <span className="px-3.5 py-1.5 rounded-xl bg-orange-50 dark:bg-orange-500/10 text-orange-700 dark:text-orange-400 border border-orange-100 dark:border-orange-500/20 shadow-sm">
              ⚡ Revision Mode
            </span>
          )}
        </div>
      </motion.div>

      {/* Detailed Notes */}
      {detailedNotesSections.length > 0 && (
        <motion.section
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
        >
          <SectionHeader icon="📖" title="Detailed Exam Notes" color="primary" />
          <div className='space-y-6 mt-8'>
            {detailedNotesSections.map((section, index) => (
              <MarkdownBlock key={`notes-${index}`} content={section} />
            ))}
          </div>
        </motion.section>
      )}

      {/* Revision Points - Specialized Styling */}
      {revisionPointsSections.length > 0 && (
        <motion.section
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className='rounded-3xl bg-green-50/80 dark:bg-green-900/10 border-2 border-green-100/50 dark:border-green-500/20 p-6 sm:p-8 shadow-sm hover:shadow-md transition-shadow'
        >
          <SectionHeader icon="⚡" title="Exam Quick Revision Points" color="green" isRevision />
          <div className='space-y-4 mt-6 prose prose-sm max-w-none text-green-900 dark:text-green-300 font-medium prose-li:my-1 prose-p:text-green-800 dark:prose-p:text-green-400'>
            {revisionPointsSections.map((section, index) => (
                <ReactMarkdown key={`revision-${index}`} remarkPlugins={[remarkGfm]}>
                    {section}
                </ReactMarkdown>
            ))}
          </div>
        </motion.section>
      )}

      {/* Diagram Section */}
      {result.diagram && result.includeDiagram !== false && (
        <motion.section 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
        >
          <SectionHeader icon="📊" title="Visual Reference Diagram" color="blue" />
          <div className='mt-6 rounded-2xl border-2 border-gray-100/50 dark:border-white/[0.08] p-8 bg-white/50 dark:bg-black/20 backdrop-blur-sm flex justify-center shadow-inner'>
            <MermaidSetup chart={result.diagram} />
          </div>
        </motion.section>
      )}

      {/* Chart Section */}
      {result.chartData && result.chartData.length > 0 && result.includeChart !== false && (
        <motion.section
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
        >
          <SectionHeader icon="📈" title="Data Analysis Charts" color="emerald" />
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mt-6'>
             {result.chartData.map((chart, i) => (
                <div key={i} className='rounded-2xl border border-gray-100 p-6 bg-white shadow-sm flex flex-col items-center hover:shadow-md transition-shadow'>
                   <h4 className='text-sm font-semibold text-gray-700 mb-6 text-center'>{chart.chartTitle}</h4>
                   <RechartSetUp data={chart.data} type={chart.chartType} />
                </div>
             ))}
          </div>
        </motion.section>
      )}

      {/* Task 2: Useful Reference Links */}
      {refLinks.length > 0 && (
        <motion.section 
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="pt-8 border-t border-gray-100"
        >
          <SectionHeader icon="🔗" title="Useful Reference Links" color="blue" />
          <div className="flex flex-wrap gap-4 mt-6">
            {refLinks.map((link, i) => (
              <a 
                key={i} 
                href={link.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-50 text-sm text-primary-600 font-medium hover:bg-primary-50 hover:text-primary-700 transition-all border border-gray-100 shadow-sm"
              >
                <span>{link.name}</span>
                <span className="text-xs opacity-50">↗</span>
              </a>
            ))}
          </div>
        </motion.section>
      )}

      {/* Signature Footer */}
      <footer className="pt-12 text-center opacity-30 select-none">
          <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-500">
              AI Note Generation Powered by ExamNotes AI
          </p>
      </footer>
    </div>
  )
}

function SectionHeader({ icon, title, color, isRevision }) {
  const colors = {
    primary: "text-primary-600 bg-primary-50",
    amber: "text-amber-600 bg-amber-50",
    green: "text-green-600 bg-green-100",
    blue: "text-blue-600 bg-blue-50",
    emerald: "text-emerald-600 bg-emerald-50",
  }

  return (
    <div className={`flex items-center gap-3 ${isRevision ? "" : "border-b border-gray-100 pb-4"}`}>
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl shadow-sm ${colors[color]}`}>
        {icon}
      </div>
      <h2 className={`text-xl sm:text-2xl font-bold tracking-tight ${isRevision ? "text-green-800" : "text-gray-800"}`}>
        {title}
      </h2>
    </div>
  )
}

function MarkdownBlock({ content }) {
  return (
    <div className='prose prose-sm sm:prose-base max-w-none
      prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-gray-900 dark:prose-headings:text-gray-100
      prose-h2:text-xl prose-h3:text-lg prose-h4:text-base
      prose-p:text-gray-600 dark:prose-p:text-gray-400 prose-p:leading-relaxed
      prose-li:text-gray-600 dark:prose-li:text-gray-400
      prose-strong:text-gray-800 dark:prose-strong:text-white prose-strong:font-semibold
      prose-blockquote:border-l-primary-500 prose-blockquote:bg-gray-50 dark:prose-blockquote:bg-white/[0.03] prose-blockquote:py-2 prose-blockquote:px-4 prose-blockquote:rounded-r-lg prose-blockquote:not-italic
      prose-code:text-primary-600 dark:prose-code:text-primary-400 prose-code:bg-primary-50 dark:prose-code:bg-primary-500/10 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:before:content-none prose-code:after:content-none
      prose-pre:bg-gray-900 dark:prose-pre:bg-black prose-pre:text-gray-100 prose-pre:rounded-xl'>
      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {content}
      </ReactMarkdown>
    </div>
  )
}

export default FinalResult
