import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { Heart, Menu, X, User, LogOut, Calendar, Stethoscope, Bell } from 'lucide-react'

export default function Navbar() {
  const { user, admin, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [open, setOpen] = useState(false)
  const [dropdown, setDropdown] = useState(false)

  const isAdminPage = location.pathname.startsWith('/admin')

  function handleLogout() {
    logout()
    navigate('/')
    setDropdown(false)
    setOpen(false)
  }

  const navLinks = user ? [
    { to: '/dashboard', label: 'Dashboard' },
    { to: '/doctors', label: 'Doctors' },
    { to: '/my-appointments', label: 'My Appointments' },
  ] : [
    { to: '/', label: 'Home' },
    { to: '/doctors', label: 'Doctors' },
    { to: '/about', label: 'About' },
    { to: '/contact', label: 'Contact' },
  ]

  if (isAdminPage && admin) return (
    <nav className="bg-slate-800 text-white sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center h-16 gap-6">
        <Link to="/admin" className="flex items-center gap-2 font-bold text-lg">
          <Heart className="text-teal-400" size={20}/> Admin Panel
        </Link>
        <div className="hidden md:flex items-center gap-6 text-sm flex-1">
          <Link to="/admin" className="text-slate-300 hover:text-white transition">Dashboard</Link>
          <Link to="/admin/doctors" className="text-slate-300 hover:text-white transition">Doctors</Link>
          <Link to="/admin/patients" className="text-slate-300 hover:text-white transition">Patients</Link>
          <Link to="/admin/appointments" className="text-slate-300 hover:text-white transition">Appointments</Link>
          <Link to="/admin/notifications" className="text-slate-300 hover:text-white transition">Notifications</Link>
        </div>
        <button onClick={handleLogout} className="ml-auto flex items-center gap-2 text-sm text-slate-300 hover:text-white">
          <LogOut size={16}/> Logout
        </button>
      </div>
    </nav>
  )

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center h-16 gap-6">
        <Link to="/" className="flex items-center gap-2 font-bold text-xl text-teal-700">
          <Heart size={22} className="text-teal-600"/> MediBook
        </Link>

        <div className="hidden md:flex items-center gap-6 text-sm flex-1">
          {navLinks.map(l => (
            <Link key={l.to} to={l.to}
              className={`font-medium transition ${location.pathname === l.to ? 'text-teal-700' : 'text-slate-600 hover:text-teal-700'}`}>
              {l.label}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3 ml-auto">
          {user ? (
            <div className="relative">
              <button onClick={() => setDropdown(!dropdown)}
                className="flex items-center gap-2 text-sm font-medium text-slate-700 hover:text-teal-700 border border-slate-200 rounded-full px-3 py-1.5">
                <div className="w-7 h-7 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center text-xs font-bold">
                  {user.name?.[0]?.toUpperCase()}
                </div>
                {user.name?.split(' ')[0]}
              </button>
              {dropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-slate-100 py-1 fade-in">
                  <Link to="/profile" onClick={() => setDropdown(false)} className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"><User size={15}/> My Profile</Link>
                  <Link to="/my-appointments" onClick={() => setDropdown(false)} className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"><Calendar size={15}/> Appointments</Link>
                  <hr className="my-1 border-slate-100"/>
                  <button onClick={handleLogout} className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"><LogOut size={15}/> Logout</button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/login" className="text-sm font-medium text-slate-700 hover:text-teal-700 px-4 py-2 rounded-lg hover:bg-slate-50 transition">Login</Link>
              <Link to="/register" className="text-sm font-medium bg-teal-700 text-white px-4 py-2 rounded-lg hover:bg-teal-800 transition">Register</Link>
            </>
          )}
        </div>

        <button className="md:hidden ml-auto p-2 rounded-lg hover:bg-slate-100" onClick={() => setOpen(!open)}>
          {open ? <X size={20}/> : <Menu size={20}/>}
        </button>
      </div>

      {open && (
        <div className="md:hidden bg-white border-t border-slate-100 px-4 py-3 flex flex-col gap-2 fade-in">
          {navLinks.map(l => <Link key={l.to} to={l.to} onClick={() => setOpen(false)} className="text-sm font-medium text-slate-700 py-2 border-b border-slate-50">{l.label}</Link>)}
          {user ? (
            <button onClick={handleLogout} className="text-left text-sm text-red-600 py-2">Logout</button>
          ) : (
            <div className="flex gap-3 pt-2">
              <Link to="/login" onClick={() => setOpen(false)} className="flex-1 text-center text-sm font-medium border border-slate-300 rounded-lg py-2">Login</Link>
              <Link to="/register" onClick={() => setOpen(false)} className="flex-1 text-center text-sm font-medium bg-teal-700 text-white rounded-lg py-2">Register</Link>
            </div>
          )}
        </div>
      )}
    </nav>
  )
}
