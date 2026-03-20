import React, { useEffect } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import UserLogin from './pages/UserLogin'
import AdminDashboard from './pages/AdminDashboard'
import AdminLogin from './pages/AdminLogin'
import TeacherLogin from './pages/TeacherLogin'
import TeacherDashboard from './pages/TeacherDashboard'
import { getCurrentUser } from './services/api'
import { useDispatch, useSelector } from 'react-redux'
import ProtectedRoute from './components/ProtectedRoute'
import History from './pages/History'
import Notes from './pages/Notes'
import Pricing from './pages/Pricing'
import PaymentSuccess from './pages/PaymentSuccess'
import PaymentFailed from './pages/PaymentFailed'
import TestList from './pages/TestList'
import TestAttempt from './pages/TestAttempt'
import TestPerformance from './pages/TestPerformance'
import Playground from './pages/Playground'

export const serverUrl = "http://localhost:8000"

function App () {
  const dispatch = useDispatch()
  const { userData, isLoading } = useSelector((state) => state.user)

  console.log("[App] Rendering. isLoading:", isLoading, "userData:", !!userData);

  useEffect(() => {
    // Only fetch if we haven't checked yet
    getCurrentUser(dispatch);
  }, [dispatch]);

  // Prevent flicker by not rendering routes until auth check is done
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-slate-950 transition-colors">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-medium text-gray-500 animate-pulse">Synchronizing Session...</p>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Public Routes with Redirects */}
      <Route 
        path='/auth' 
        element={userData ? <Navigate to="/" replace /> : <UserLogin />} 
      />
      <Route
        path='/admin/login'
        element={userData?.role === "admin" ? <Navigate to="/admin/dashboard" replace /> : <AdminLogin />}
      />
      <Route
        path='/teacher/login'
        element={userData?.role === "teacher" ? <Navigate to="/teacher/dashboard" replace /> : <TeacherLogin />}
      />

      {/* Protected Routes */}
      <Route 
        path='/' 
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        } 
      />

      <Route
        path='/admin/dashboard'
        element={
          <ProtectedRoute allowedRole="admin" redirectTo="/admin/login">
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path='/teacher/dashboard'
        element={
          <ProtectedRoute allowedRole="teacher" redirectTo="/teacher/login">
            <TeacherDashboard />
          </ProtectedRoute>
        }
      />

      <Route 
        path='/history' 
        element={
          <ProtectedRoute>
            <History />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path='/notes' 
        element={
          <ProtectedRoute>
            <Notes />
          </ProtectedRoute>
        } 
      />
      <Route 
        path='/notes/:section' 
        element={
          <ProtectedRoute>
            <Notes />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path='/pricing' 
        element={
          <ProtectedRoute>
            <Pricing />
          </ProtectedRoute>
        } 
      />

      <Route 
        path='/tests' 
        element={
          <ProtectedRoute>
            <TestList />
          </ProtectedRoute>
        } 
      />

      <Route 
        path='/test/:id' 
        element={
          <ProtectedRoute>
            <TestAttempt />
          </ProtectedRoute>
        } 
      />

      <Route 
        path='/performance' 
        element={
          <ProtectedRoute>
            <TestPerformance />
          </ProtectedRoute>
        } 
      />

      <Route 
        path='/playground' 
        element={
          <ProtectedRoute>
            <Playground />
          </ProtectedRoute>
        } 
      />

      {/* Global Results/Status (always accessible or protected as needed) */}
      <Route path='/payment-success' element={<PaymentSuccess />} />
      <Route path='/payment-failed' element={<PaymentFailed />} />
      
      {/* Catch all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App

