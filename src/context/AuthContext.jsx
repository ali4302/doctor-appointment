import React, { createContext, useContext, useState, useEffect } from 'react'
import { authService } from '../services/api' // Fixed internal path import

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Initial mount hydration checks
    const savedUser = localStorage.getItem('medi_session_user')
    if (savedUser) {
      try { setUser(JSON.parse(savedUser)) } catch(e) { console.error(e) }
    }
    setLoading(false)
  }, [])

  async function login(email, password) {
    const res = await authService.login({ email, password })
    setUser({ ...res.user, role: res.role })
    localStorage.setItem('medi_session_user', JSON.stringify({ ...res.user, role: res.role }))
    return res.user
  }

  async function loginAsAdmin(username, password) {
    const res = await authService.adminLogin({ username, password })
    setUser({ ...res.user, role: res.role })
    localStorage.setItem('medi_session_user', JSON.stringify({ ...res.user, role: res.role }))
    return res.user
  }

  async function register(data) { 
    return authService.register(data) 
  }

  async function updateProfile(data) {
    const updated = await authService.updateProfile(user.id, data)
    const updatedWithRole = { ...updated, role: user.role }
    setUser(updatedWithRole)
    localStorage.setItem('medi_session_user', JSON.stringify(updatedWithRole))
    return updated
  }

  function logout() {
    setUser(null)
    localStorage.removeItem('medi_session_user')
  }

  return (
    <AuthContext.Provider value={{ 
      user, 
      admin: user?.role === 'admin' ? user : null, // Unified role evaluation
      loading, 
      login, 
      loginAsAdmin, 
      register, 
      updateProfile, 
      logout 
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() { return useContext(AuthContext) }