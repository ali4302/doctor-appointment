import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { getAppointmentsByPatient, cancelAppointment } from '../services/mockDb'
import AppointmentCard from '../components/appointment/AppointmentCard'
import Loader from '../components/common/Loader'
import { Calendar } from 'lucide-react'
import { Link } from 'react-router-dom'

const FILTERS = ['All','Pending','Confirmed','Completed','Cancelled']

export default function MyAppointments() {
  const { user } = useAuth()
  const [appts, setAppts] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('All')

  function load() { getAppointmentsByPatient(user.id).then(a => { setAppts(a); setLoading(false) }) }
  useEffect(load, [user.id])

  async function handleCancel(id) {
    if (!confirm('Cancel this appointment?')) return
    await cancelAppointment(id)
    load()
  }

  const filtered = filter === 'All' ? appts : appts.filter(a => a.status === filter)

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 fade-in">
      <h1 className="text-2xl font-bold text-slate-800 mb-1">My Appointments</h1>
      <p className="text-slate-500 text-sm mb-6">Track all your doctor visits</p>
      <div className="flex gap-2 flex-wrap mb-6">
        {FILTERS.map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`text-xs px-4 py-2 rounded-lg font-medium transition ${filter===f ? 'bg-teal-700 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:border-teal-400'}`}>
            {f} {f==='All' ? `(${appts.length})` : `(${appts.filter(a=>a.status===f).length})`}
          </button>
        ))}
      </div>
      {loading ? <Loader/> : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-100 p-16 text-center">
          <Calendar size={36} className="text-slate-300 mx-auto mb-3"/>
          <p className="text-slate-500 font-medium">No {filter !== 'All' ? filter.toLowerCase() : ''} appointments</p>
          <Link to="/doctors" className="text-teal-700 text-sm hover:underline mt-2 inline-block">Book a new appointment →</Link>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map(a => <AppointmentCard key={a.id} appt={a} onCancel={handleCancel}/>)}
        </div>
      )}
    </div>
  )
}
