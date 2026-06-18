import { useState, useEffect } from 'react'
import { getAppointmentsFull, updateAppointmentStatus, cancelAppointment } from '../../services/mockDb'
import AppointmentCard from '../../components/appointment/AppointmentCard'
import Loader from '../../components/common/Loader'

const FILTERS = ['All','Pending','Confirmed','Completed','Cancelled']

export default function ManageAppointments() {
  const [appts, setAppts] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('All')

  function load() { getAppointmentsFull().then(a => { setAppts(a); setLoading(false) }) }
  useEffect(load, [])

  async function handleStatus(id, status) { await updateAppointmentStatus(id, status); load() }
  async function handleCancel(id) { await cancelAppointment(id); load() }

  const filtered = filter === 'All' ? appts : appts.filter(a => a.status === filter)

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 fade-in">
      <h1 className="text-2xl font-bold text-slate-800 mb-1">Manage Appointments</h1>
      <p className="text-slate-500 text-sm mb-6">{appts.length} total appointments</p>
      <div className="flex gap-2 flex-wrap mb-6">
        {FILTERS.map(f => (
          <button key={f} onClick={()=>setFilter(f)}
            className={`text-xs px-4 py-2 rounded-lg font-medium transition ${filter===f ? 'bg-teal-700 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:border-teal-400'}`}>
            {f} ({f==='All' ? appts.length : appts.filter(a=>a.status===f).length})
          </button>
        ))}
      </div>
      {loading ? <Loader/> : (
        <div className="flex flex-col gap-3">
          {filtered.map(a => <AppointmentCard key={a.id} appt={a} isAdmin onStatusChange={handleStatus} onCancel={handleCancel}/>)}
          {filtered.length === 0 && <div className="bg-white rounded-2xl border border-slate-100 p-10 text-center text-slate-400">No appointments in this category</div>}
        </div>
      )}
    </div>
  )
}
