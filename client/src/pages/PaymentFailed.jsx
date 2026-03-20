import React, { useEffect } from 'react'
import { motion } from "motion/react"
import { FaTimesCircle } from "react-icons/fa";
import { getCurrentUser } from '../services/api';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';

function PaymentFailed() {
    const dispatch = useDispatch()
    const navigate = useNavigate()

    useEffect(() => {
        const t = setTimeout(() => {
            navigate("/")
        }, 5000);
        return () => clearTimeout(t)
    }, [])

    return (
        <div className='min-h-screen flex items-center justify-center bg-gradient-to-b from-white via-red-50/30 to-white p-4'>
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="bg-white rounded-2xl shadow-[0_15px_50px_rgba(0,0,0,0.08)] border border-gray-100 p-10 sm:p-14 text-center max-w-md w-full"
            >
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.2, type: "spring", stiffness: 200 }}
                    className="text-red-500 text-6xl flex justify-center mb-6"
                >
                    <FaTimesCircle />
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="text-2xl font-bold text-gray-900 tracking-tight"
                >
                    Payment Failed
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="text-gray-500 text-sm mt-2"
                >
                    Something went wrong. Please try again.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="mt-6 space-y-3"
                >
                    <button
                        onClick={() => navigate("/pricing")}
                        className="w-full py-3 rounded-xl bg-gray-900 text-white text-sm font-medium
                        hover:bg-gray-800 transition-colors shadow-sm"
                    >
                        Try Again
                    </button>
                    <motion.div
                        animate={{ opacity: [0.4, 1, 0.4] }}
                        transition={{ repeat: Infinity, duration: 1.5 }}
                        className="text-xs text-gray-400"
                    >
                        Redirecting to home...
                    </motion.div>
                </motion.div>
            </motion.div>

            <Footer />
        </div>
    )
}

export default PaymentFailed
