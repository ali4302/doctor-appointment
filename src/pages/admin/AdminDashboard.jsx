import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getAppointmentsFull, getDoctors, getPatients, updateAppointmentStatus, cancelAppointment } from '../../services/mockDb'
import Loader from '../../components/common/Loader'
import AppointmentCard from '../../components/appointment/AppointmentCard'
import { Users, Stethoscope, Calendar, AlertCircle } from 'lucide-react'

export default function AdminDashboard() {
  const [appts, setAppts] = useState([])
  const [doctors, setDoctors] = useState([])
  const [patients, setPatients] = useState([])
  const [loading, setLoading] = useState(true)

  function load() {
    Promise.all([getAppointmentsFull(), getDoctors(), getPatients()]).then(([a,d,p]) => {
      setAppts(a); setDoctors(d); setPatients(p); setLoading(false)
    })
  }
  useEffect(load, [])

  async function handleStatus(id, status) { await updateAppointmentStatus(id, status); load() }
  async function handleCancel(id) { await cancelAppointment(id); load() }

  const stats = [
    { label: 'Total Appointments', value: appts.length, icon: Calendar, color: 'bg-teal-50 text-teal-700' },
    { label: 'Total Doctors', value: doctors.length, icon: Stethoscope, color: 'bg-sky-50 text-sky-700' },
    { label: 'Total Patients', value: patients.length, icon: Users, color: 'bg-purple-50 text-purple-700' },
    { label: 'Pending', value: appts.filter(a=>a.status==='Pending').length, icon: AlertCircle, color: 'bg-amber-50 text-amber-700' },
  ]
  const pending = appts.filter(a => a.status === 'Pending')

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 fade-in">
      <h1 className="text-2xl font-bold text-slate-800 mb-1">Admin Dashboard</h1>
      <p className="text-slate-500 text-sm mb-8">System overview and pending actions</p>
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
            <h2 className="text-lg font-semibold text-slate-800">Pending Appointments</h2>
            <Link to="/admin/appointments" className="text-sm text-teal-700 hover:underline">View all</Link>
          </div>
          {loading ? <Loader/> : pending.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-100 p-10 text-center">
              <AlertCircle size={32} className="text-slate-300 mx-auto mb-2"/>
              <p className="text-slate-400">No pending appointments</p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {pending.slice(0,5).map(a => <AppointmentCard key={a.id} appt={a} isAdmin onStatusChange={handleStatus} onCancel={handleCancel}/>)}
            </div>
          )}
        </div>
        <div>
          <h2 className="text-lg font-semibold text-slate-800 mb-4">Quick Links</h2>
          <div className="flex flex-col gap-3">
            {[{to:'/admin/doctors',label:'Manage Doctors',icon:Stethoscope},{to:'/admin/patients',label:'Manage Patients',icon:Users},{to:'/admin/appointments',label:'All Appointments',icon:Calendar}].map(l=>(
              <Link key={l.to} to={l.to} className="bg-white rounded-xl border border-slate-100 p-4 flex items-center gap-3 hover:border-teal-300 hover:bg-teal-50 transition">
                <l.icon size={18} className="text-teal-600"/>
                <span className="font-medium text-slate-700 text-sm">{l.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
