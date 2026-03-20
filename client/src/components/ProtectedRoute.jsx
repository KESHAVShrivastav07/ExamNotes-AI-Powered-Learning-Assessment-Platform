import React from 'react'
import { Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

/**
 * ProtectedRoute - Handles role-based access control and initial loading state
 * to prevent UI flicker during authentication checks.
 */
function ProtectedRoute({ children, allowedRole, redirectTo = "/auth" }) {
  const { userData, isLoading } = useSelector((state) => state.user)

  // Task 1: If still checking authentication, render nothing (or a loader)
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="w-8 h-8 border-4 border-gray-900 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  // Task 4: If no user found, redirect to login
  if (!userData) {
    return <Navigate to={redirectTo} replace />
  }

  // Check role if specified
  if (allowedRole && userData.role !== allowedRole) {
    // If user is logged in but has wrong role, redirect to their respective dashboard
    const fallback = userData.role === "admin" ? "/admin/dashboard" : 
                     userData.role === "teacher" ? "/teacher/dashboard" : "/";
    return <Navigate to={fallback} replace />
  }

  return children
}

export default ProtectedRoute
