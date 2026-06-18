import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { getDoctors } from '../services/mockDb'
import DoctorCard from '../components/doctor/DoctorCard'
import Loader from '../components/common/Loader'
import { Search, Filter } from 'lucide-react'

const SPECS = ['All','Cardiologist','Neurologist','Dermatologist','Orthopedic','Pediatrician','General Physician']

export default function Doctors() {
  const [doctors, setDoctors] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchParams] = useSearchParams()
  const [search, setSearch] = useState(searchParams.get('q') || '')
  const [spec, setSpec] = useState(searchParams.get('spec') || 'All')

  useEffect(() => { getDoctors().then(d => { setDoctors(d); setLoading(false) }) }, [])

  const filtered = doctors.filter(d => {
    const matchSearch = d.name.toLowerCase().includes(search.toLowerCase()) || d.specialization.toLowerCase().includes(search.toLowerCase())
    const matchSpec = spec === 'All' || d.specialization === spec
    return matchSearch && matchSpec
  })

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800 mb-1">Find a Doctor</h1>
        <p className="text-slate-500">Browse our team of expert specialists</p>
      </div>
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 mb-8 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"/>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search by name or specialization..." className="w-full pl-9 pr-4 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"/>
        </div>
        <div className="flex gap-2 flex-wrap">
          {SPECS.map(s => (
            <button key={s} onClick={()=>setSpec(s)}
              className={`text-xs px-3 py-2 rounded-lg font-medium transition ${spec===s ? 'bg-teal-700 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
              {s}
            </button>
          ))}
        </div>
      </div>
      {loading ? <Loader/> : filtered.length === 0 ? (
        <div className="text-center py-20">
          <Search size={40} className="text-slate-300 mx-auto mb-3"/>
          <p className="text-slate-500 font-medium">No doctors found</p>
          <p className="text-slate-400 text-sm">Try a different search term or filter</p>
        </div>
      ) : (
        <>
          <p className="text-sm text-slate-500 mb-4">{filtered.length} doctor{filtered.length !== 1 ? 's' : ''} found</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map(d => <DoctorCard key={d.id} doctor={d}/>)}
          </div>
        </>
      )}
    </div>
  )
}
