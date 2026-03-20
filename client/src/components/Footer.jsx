import React from 'react'
import { motion } from "motion/react"
import logo from "../assets/logo.png"
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { serverUrl } from '../App'
import { setUserData } from '../redux/userSlice'

function Footer() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { userData } = useSelector((state) => state.user)

    const handleSignOut = async () => {
        try {
            await axios.get(serverUrl + "/api/auth/logout", { withCredentials: true })
            dispatch(setUserData(null))
            navigate("/auth")
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <motion.footer
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className='z-10 mx-4 sm:mx-6 mb-8 mt-20
            rounded-2xl
            bg-[rgba(15,15,20,0.88)] backdrop-blur-2xl
            border border-white/[0.08]
            px-8 py-10
            shadow-[0_20px_50px_rgba(0,0,0,0.5)]'>

            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 items-start'>

                {/* Brand */}
                <div className="flex flex-col gap-4 lg:col-span-1">
                    <div className="flex items-center gap-3">
                        <img src={logo} alt="logo" className='h-9 w-9 object-contain' />
                        <span className="text-lg font-semibold text-white tracking-tight">
                            ExamNotes <span className="text-gray-400 font-normal">AI</span>
                        </span>
                    </div>
                    <p className="text-sm text-gray-400 leading-relaxed">
                        Generate exam-focused notes, diagrams, and printable PDFs using AI.
                    </p>
                </div>

                {/* Focus Areas */}
                <div>
                    <h3 className='text-xs font-bold text-gray-300 uppercase tracking-widest mb-4'>
                        Focus Areas
                    </h3>
                    <ul className='space-y-2.5 text-sm'>
                        <FooterLink onClick={() => navigate("/notes/dsa")} label="DSA Study Master" />
                        <FooterLink onClick={() => navigate("/notes/oops")} label="OOPS Concepts" />
                        <FooterLink onClick={() => navigate("/notes/dbms")} label="DBMS / SQL" />
                        <FooterLink onClick={() => navigate("/notes/placement")} label="Placement Prep" />
                    </ul>
                </div>

                {/* Portals & Pricing */}
                <div>
                    <h3 className='text-xs font-bold text-gray-300 uppercase tracking-widest mb-4'>
                        Admin & Teacher
                    </h3>
                    <ul className='space-y-2.5 text-sm'>
                        <FooterLink onClick={() => navigate("/teacher/login")} label="Teacher Portal" />
                        <FooterLink onClick={() => navigate("/admin/login")} label="Admin Access" />
                        <FooterLink onClick={() => navigate("/pricing")} label="Buy Credits" />
                        <FooterLink onClick={() => navigate("/notes")} label="Notes Generator" />
                    </ul>
                </div>

                <div className='lg:text-right'>
                    <h3 
                        className='text-xs font-bold text-gray-300 uppercase tracking-widest mb-4'
                        title={userData ? `Logged in as ${userData.email || userData.name}` : undefined}
                    >
                        {userData ? (userData.email || userData.name || "My Account") : "My Account"}
                    </h3>
                    <ul className='space-y-2.5 text-sm'>
                        <FooterLink onClick={() => navigate("/history")} label="Study History" />
                        <li
                            onClick={handleSignOut}
                            className='text-red-400 hover:text-red-300 cursor-pointer transition-colors font-medium flex lg:justify-end items-center gap-2'
                        >
                            Sign Out <span>→</span>
                        </li>
                        <li className='text-gray-400'>
                            support@examnotes.com
                        </li>
                    </ul>
                </div>

            </div>

            <div className="my-8 h-px bg-white/[0.06]" />

            <div className='flex flex-col sm:flex-row justify-between items-center gap-4'>
                <p className='text-xs text-gray-500'>
                    © {new Date().getFullYear()} ExamNotes AI Platform. All rights reserved.
                </p>
                <div className="flex items-center gap-4 text-[10px] uppercase tracking-widest text-gray-600 font-bold">
                    <span>System Status: Healthy</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500/50" />
                </div>
            </div>
        </motion.footer>
    )
}

function FooterLink({ onClick, label }) {
    return (
        <li
            onClick={onClick}
            className='text-gray-400 hover:text-white cursor-pointer transition-colors'
        >
            {label}
        </li>
    )
}

export default Footer
