import { useState, useEffect } from 'react'
import { getPatients } from '../../services/mockDb'
import Loader from '../../components/common/Loader'
import { Search, User } from 'lucide-react'

export default function ManagePatients() {
  const [patients, setPatients] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => { getPatients().then(p => { setPatients(p); setLoading(false) }) }, [])

  const filtered = patients.filter(p => p.name?.toLowerCase().includes(search.toLowerCase()) || p.email?.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Manage Patients</h1>
        <p className="text-slate-500 text-sm">{patients.length} registered patients</p>
      </div>
      <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search by name or email..." className="w-full max-w-sm border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-teal-500 mb-5"/>
      {loading ? <Loader/> : (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>{['Patient','Email','Phone','Blood Group','Address'].map(h=><th key={h} className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">{h}</th>)}</tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map(p => (
                <tr key={p.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center text-xs font-bold">{p.name?.[0]}</div>
                      <span className="font-medium text-slate-800">{p.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{p.email}</td>
                  <td className="px-4 py-3 text-slate-600">{p.phone || '—'}</td>
                  <td className="px-4 py-3"><span className="bg-red-50 text-red-700 px-2 py-0.5 rounded text-xs font-medium">{p.bloodGroup || '—'}</span></td>
                  <td className="px-4 py-3 text-slate-600">{p.address || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && <div className="text-center py-10 text-slate-400 text-sm">No patients found</div>}
        </div>
      )}
    </div>
  )
}
