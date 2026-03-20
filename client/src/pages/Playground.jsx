import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CodeEditor from '../components/CodeEditor';
import { motion } from 'framer-motion';

const Playground = () => {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-slate-950 transition-colors duration-150">
            <Navbar />
            
            <main className="max-w-7xl mx-auto px-6 pt-32 pb-20">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-8"
                >
                    <div className="max-w-3xl">
                        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                            Code Playground
                        </h1>
                        <p className="text-lg text-gray-500 dark:text-gray-400 mt-4">
                            Practice your algorithms and logic in our high-performance Monaco Editor. 
                            Supports JavaScript, Python, C++, and Java.
                        </p>
                    </div>

                    <div className="rounded-3xl border border-gray-200 dark:border-white/[0.08] bg-white dark:bg-slate-900/40 p-1 shadow-2xl shadow-indigo-500/5">
                        <CodeEditor />
                    </div>
                </motion.div>
            </main>

            <Footer />
        </div>
    );
};

export default Playground;
