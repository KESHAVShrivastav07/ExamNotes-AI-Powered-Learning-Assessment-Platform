import React from 'react';
import { motion } from "motion/react";

const DashboardCard = ({ icon, title, children, delay = 0, onClick, className = "" }) => {
  return (
    <motion.div
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      whileTap={onClick ? { scale: 0.98 } : {}}
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
        ${onClick ? "cursor-pointer" : ""} ${className}`}
    >
      {icon && <div className='text-3xl mb-4'>{icon}</div>}
      {title && <h3 className="text-base font-semibold mb-2 tracking-tight">{title}</h3>}
      <div className="text-gray-400 text-sm leading-relaxed">
        {children}
      </div>
    </motion.div>
  );
};

export default DashboardCard;
