import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from "motion/react"
import axios from 'axios';
import { serverUrl } from '../App';
import Footer from '../components/Footer';

function Pricing() {
  const navigate = useNavigate()
  const [selectedPrice, setSelectedPrice] = useState(null);
  const [paying, setPaying] = useState(false);
  const [payingAmount, setPayingAmount] = useState(null);
  const [error, setError] = useState("");

  const handlePaying = async (amount) => {
    try {
      setError("")
      setPayingAmount(amount)
      setPaying(true)
      const result = await axios.post(serverUrl + "/api/credit/order", { amount }, { withCredentials: true })

      if (result.data.url) {
        window.location.href = result.data.url
      } else {
        setError("Failed to generate payment link. Please try again.")
        setPaying(false)
      }
    } catch (error) {
      setPaying(false)
      console.log(error)
      setError(error.response?.data?.message || "Payment service unavailable. Are you logged in?")
    }
  }

  return (
    <div className='min-h-screen bg-gradient-to-b from-white via-slate-50 to-white px-4 sm:px-6 py-8 sm:py-12'>

      {/* Error Message */}
      {error && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md mx-auto mb-6 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm font-medium text-center"
        >
          {error}
        </motion.div>
      )}

      {/* Back Button */}
      <motion.button
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={() => navigate("/")}
        className='flex items-center gap-2 text-sm text-gray-400 hover:text-gray-700 transition-colors mb-8 group'
      >
        <span className="group-hover:-translate-x-1 transition-transform">←</span>
        Back to home
      </motion.button>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">
          Buy Credits
        </h1>
        <p className="text-gray-500 mt-3 max-w-md mx-auto">
          Choose a plan that fits your study needs. Credits never expire.
        </p>
      </motion.div>

      {/* Pricing Cards */}
      <div className='max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-5'>
        <PricingCard
          title="Starter"
          price="₹100"
          amount={100}
          credits="100 Credits"
          description="Perfect for quick revisions"
          features={[
            "Generate AI notes",
            "Exam-focused answers",
            "Diagram & charts support",
            "Fast generation"
          ]}
          selectedPrice={selectedPrice}
          setSelectedPrice={setSelectedPrice}
          onBuy={handlePaying}
          paying={paying}
          payingAmount={payingAmount}
        />

        <PricingCard
          popular
          title="Popular"
          price="₹200"
          amount={200}
          credits="120 Credits"
          description="Best value for students"
          features={[
            "All Starter features",
            "More credits per ₹",
            "Revision mode access",
            "Priority AI response"
          ]}
          selectedPrice={selectedPrice}
          setSelectedPrice={setSelectedPrice}
          onBuy={handlePaying}
          paying={paying}
          payingAmount={payingAmount}
        />

        <PricingCard
          title="Pro Learner"
          price="₹500"
          amount={500}
          credits="300 Credits"
          description="For serious exam preparation"
          features={[
            "Maximum credit value",
            "Unlimited revisions",
            "Charts & diagrams",
            "Ideal for full syllabus"
          ]}
          selectedPrice={selectedPrice}
          setSelectedPrice={setSelectedPrice}
          onBuy={handlePaying}
          paying={paying}
          payingAmount={payingAmount}
        />
      </div>
      <Footer />
    </div>
  )
}

function PricingCard({
  title,
  price,
  amount,
  credits,
  description,
  features,
  popular,
  selectedPrice,
  setSelectedPrice,
  onBuy,
  paying,
  payingAmount
}) {
  const isSelected = selectedPrice === amount;
  const isPayingThisCard = paying && payingAmount === amount;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onClick={() => setSelectedPrice(amount)}
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      className={`
        relative cursor-pointer
        rounded-2xl p-7 bg-white
        border-2 transition-all duration-200
        shadow-sm hover:shadow-md
        ${isSelected
          ? "border-gray-900 shadow-lg"
          : popular
            ? "border-primary-400 shadow-primary-100"
            : "border-gray-100 hover:border-gray-200"
        }
      `}
    >
      {popular && !isSelected && (
        <span className='absolute -top-3 left-1/2 -translate-x-1/2
          text-xs px-3 py-1 rounded-full
          bg-gradient-to-r from-primary-500 to-primary-600
          text-white font-medium shadow-sm'>
          Most Popular
        </span>
      )}

      {isSelected && (
        <span className='absolute -top-3 left-1/2 -translate-x-1/2
          text-xs px-3 py-1 rounded-full
          bg-gray-900 text-white font-medium'>
          Selected
        </span>
      )}

      <h2 className='text-lg font-semibold text-gray-900'>{title}</h2>
      <p className='text-sm text-gray-500 mt-1'>{description}</p>

      <div className='mt-5'>
        <p className="text-4xl font-bold text-gray-900 tracking-tight">{price}</p>
        <p className="text-sm text-primary-600 font-medium mt-1">{credits}</p>
      </div>

      <button
        disabled={isPayingThisCard}
        onClick={(e) => {
          e.stopPropagation();
          onBuy(amount)
        }}
        className={`
          w-full mt-6 py-3 rounded-xl font-medium text-sm transition-all duration-200
          ${isPayingThisCard
            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
            : isSelected
              ? "bg-gray-900 text-white hover:bg-gray-800 shadow-md"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }
        `}
      >
        {isPayingThisCard ? "Redirecting..." : "Buy Now"}
      </button>

      <ul className='mt-6 space-y-3 text-sm text-gray-600'>
        {features.map((f, i) => (
          <li key={i} className="flex items-start gap-2.5">
            <span className="text-accent-500 mt-0.5 text-xs">✓</span>
            {f}
          </li>
        ))}
      </ul>
    </motion.div>
  )
}

export default Pricing
