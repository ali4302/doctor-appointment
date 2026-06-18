import { useState, useEffect } from 'react'
import { getAllNotifications, getPatients, sendNotification } from '../../services/mockDb'
import Button from '../../components/common/Button'
import Loader from '../../components/common/Loader'
import { Bell, Send } from 'lucide-react'

export default function Notifications() {
  const [notifs, setNotifs] = useState([])
  const [patients, setPatients] = useState([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({ patientId: '', message: '' })
  const [sending, setSending] = useState(false)

  function load() {
    Promise.all([getAllNotifications(), getPatients()]).then(([n,p]) => { setNotifs(n); setPatients(p); setLoading(false) })
  }
  useEffect(load, [])

  async function handleSend(e) {
    e.preventDefault()
    if (!form.patientId || !form.message) return
    setSending(true)
    await sendNotification(form.patientId, form.message)
    setForm({ patientId: '', message: '' }); setSending(false); load()
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 fade-in">
      <h1 className="text-2xl font-bold text-slate-800 mb-1">Notifications</h1>
      <p className="text-slate-500 text-sm mb-8">Send and view patient notifications</p>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 mb-8">
        <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2"><Send size={16}/> Send Notification</h3>
        <form onSubmit={handleSend} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-slate-700">Select Patient</label>
            <select value={form.patientId} onChange={e=>setForm({...form,patientId:e.target.value})} required
              className="border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-teal-500">
              <option value="">Choose a patient</option>
              {patients.map(p => <option key={p.id} value={p.id}>{p.name} ({p.email})</option>)}
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-slate-700">Message</label>
            <textarea rows={3} value={form.message} onChange={e=>setForm({...form,message:e.target.value})} required placeholder="Type your notification message..."
              className="border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-teal-500 resize-none"/>
          </div>
          <Button type="submit" disabled={sending} className="self-end flex items-center gap-2">{sending ? 'Sending...' : <><Send size={14}/> Send</>}</Button>
        </form>
      </div>

      <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2"><Bell size={16}/> All Notifications ({notifs.length})</h3>
      {loading ? <Loader/> : (
        <div className="flex flex-col gap-3">
          {notifs.map(n => {
            const patient = patients.find(p => p.id === n.patientId)
            return (
              <div key={n.id} className={`rounded-xl border p-4 ${n.read ? 'bg-white border-slate-100' : 'bg-teal-50 border-teal-100'}`}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold text-slate-600">{patient?.name || 'Unknown Patient'}</span>
                  <div className="flex items-center gap-2">
                    {!n.read && <span className="text-xs bg-teal-600 text-white px-2 py-0.5 rounded-full">Unread</span>}
                    <span className="text-xs text-slate-400">{n.createdAt}</span>
                  </div>
                </div>
                <p className="text-sm text-slate-700">{n.message}</p>
              </div>
            )
          })}
          {notifs.length === 0 && <div className="text-center py-10 text-slate-400 text-sm">No notifications yet</div>}
        </div>
      )}
    </div>
  )
}
