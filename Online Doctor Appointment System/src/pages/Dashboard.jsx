import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getAppointmentsByPatient, getNotificationsByPatient } from '../services/mockDb'
import AppointmentCard from '../components/appointment/AppointmentCard'
import Loader from '../components/common/Loader'
import { Calendar, Clock, CheckCircle, AlertCircle, Plus, Bell } from 'lucide-react'

export default function Dashboard() {
  const { user } = useAuth()
  const [appts, setAppts] = useState([])
  const [notifs, setNotifs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      getAppointmentsByPatient(user.id),
      getNotificationsByPatient(user.id)
    ]).then(([a, n]) => { setAppts(a); setNotifs(n); setLoading(false) })
  }, [user.id])

  const stats = [
    { label: 'Total Booked', value: appts.length, icon: Calendar, color: 'bg-teal-50 text-teal-700' },
    { label: 'Upcoming', value: appts.filter(a=>a.status==='Confirmed').length, icon: Clock, color: 'bg-sky-50 text-sky-700' },
    { label: 'Pending', value: appts.filter(a=>a.status==='Pending').length, icon: AlertCircle, color: 'bg-amber-50 text-amber-700' },
    { label: 'Completed', value: appts.filter(a=>a.status==='Completed').length, icon: CheckCircle, color: 'bg-green-50 text-green-700' },
  ]

  const unreadNotifs = notifs.filter(n=>!n.read)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 fade-in">
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Welcome back, {user.name?.split(' ')[0]} 👋</h1>
          <p className="text-slate-500 text-sm mt-0.5">Here's an overview of your health appointments</p>
        </div>
        <Link to="/doctors" className="inline-flex items-center gap-2 bg-teal-700 text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-teal-800 transition">
          <Plus size={16}/> Book Appointment
        </Link>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map(s => (
          <div key={s.label} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${s.color}`}><s.icon size={20}/></div>
            <p className="text-2xl font-bold text-slate-800">{s.value}</p>
            <p className="text-sm text-slate-500">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-800">Recent Appointments</h2>
            <Link to="/my-appointments" className="text-sm text-teal-700 hover:underline">View all</Link>
          </div>
          {loading ? <Loader/> : appts.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-100 p-10 text-center">
              <Calendar size={36} className="text-slate-300 mx-auto mb-3"/>
              <p className="text-slate-500 font-medium">No appointments yet</p>
              <Link to="/doctors" className="text-teal-700 text-sm hover:underline mt-2 inline-block">Find a doctor →</Link>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {appts.slice(0,3).map(a => <AppointmentCard key={a.id} appt={a}/>)}
            </div>
          )}
        </div>
        <div>
          <div className="flex items-center gap-2 mb-4">
            <h2 className="text-lg font-semibold text-slate-800">Notifications</h2>
            {unreadNotifs.length > 0 && <span className="text-xs bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center font-bold">{unreadNotifs.length}</span>}
          </div>
          <div className="flex flex-col gap-2">
            {loading ? <Loader/> : notifs.length === 0 ? (
              <div className="bg-white rounded-xl border border-slate-100 p-6 text-center">
                <Bell size={24} className="text-slate-300 mx-auto mb-2"/>
                <p className="text-slate-400 text-sm">No notifications</p>
              </div>
            ) : notifs.slice(0,5).map(n => (
              <div key={n.id} className={`rounded-xl border p-3 text-sm ${n.read ? 'bg-white border-slate-100' : 'bg-teal-50 border-teal-100'}`}>
                <p className="text-slate-700 text-xs leading-relaxed">{n.message}</p>
                <p className="text-slate-400 text-xs mt-1">{n.createdAt}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
