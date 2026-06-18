import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import Input from '../components/common/Input'
import Button from '../components/common/Button'
import { User, Mail, Phone, MapPin, CheckCircle } from 'lucide-react'

export default function PatientProfile() {
  const { user, updateProfile } = useAuth()
  const [form, setForm] = useState({ name: user?.name||'', email: user?.email||'', phone: user?.phone||'', bloodGroup: user?.bloodGroup||'', dob: user?.dob||'', address: user?.address||'' })
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)

  async function handleSave(e) {
    e.preventDefault(); setLoading(true); setSaved(false)
    await updateProfile(form)
    setSaved(true); setLoading(false)
    setTimeout(() => setSaved(false), 3000)
  }

  const initials = user?.name?.split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase()

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10 fade-in">
      <h1 className="text-2xl font-bold text-slate-800 mb-6">My Profile</h1>
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="bg-gradient-to-r from-teal-700 to-teal-600 p-8 flex items-center gap-5">
          <div className="w-20 h-20 rounded-2xl bg-white/20 text-white flex items-center justify-center text-2xl font-bold">{initials}</div>
          <div className="text-white">
            <h2 className="text-xl font-bold">{user?.name}</h2>
            <p className="text-teal-200 text-sm">{user?.email}</p>
          </div>
        </div>
        <form onSubmit={handleSave} className="p-8 flex flex-col gap-5">
          {saved && <div className="flex items-center gap-2 bg-teal-50 border border-teal-200 text-teal-700 rounded-lg px-4 py-3 text-sm"><CheckCircle size={16}/> Profile updated successfully!</div>}
          <div className="grid sm:grid-cols-2 gap-4">
            <Input label="Full Name" icon={User} value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/>
            <Input label="Email" type="email" icon={Mail} value={form.email} onChange={e=>setForm({...form,email:e.target.value})}/>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <Input label="Phone Number" icon={Phone} value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})}/>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-slate-700">Blood Group</label>
              <select value={form.bloodGroup} onChange={e=>setForm({...form,bloodGroup:e.target.value})}
                className="border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100">
                <option value="">Select</option>
                {['A+','A-','B+','B-','AB+','AB-','O+','O-'].map(g=><option key={g} value={g}>{g}</option>)}
              </select>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <Input label="Date of Birth" type="date" value={form.dob} onChange={e=>setForm({...form,dob:e.target.value})}/>
            <Input label="Address" icon={MapPin} value={form.address} onChange={e=>setForm({...form,address:e.target.value})}/>
          </div>
          <Button type="submit" size="lg" disabled={loading}>{loading ? 'Saving...' : 'Save Changes'}</Button>
        </form>
      </div>
    </div>
  )
}
