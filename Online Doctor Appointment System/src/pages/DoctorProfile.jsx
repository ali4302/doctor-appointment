import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getDoctorById } from '../services/mockDb'
import Loader from '../components/common/Loader'
import { Star, Clock, DollarSign, Phone, Mail, Calendar, ArrowLeft } from 'lucide-react'

const COLORS = ['bg-teal-100 text-teal-700','bg-sky-100 text-sky-700','bg-purple-100 text-purple-700','bg-rose-100 text-rose-700','bg-amber-100 text-amber-700','bg-indigo-100 text-indigo-700']
function initials(name='') { return name.split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase() }
function color(id='') { return COLORS[parseInt(id.replace(/\D/g,'').slice(-1)||0) % COLORS.length] }

export default function DoctorProfile() {
  const { id } = useParams()
  const [doctor, setDoctor] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => { getDoctorById(id).then(d => { setDoctor(d); setLoading(false) }) }, [id])

  if (loading) return <Loader/>
  if (!doctor) return <div className="text-center py-20 text-slate-500">Doctor not found.</div>

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 fade-in">
      <Link to="/doctors" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-teal-700 mb-6"><ArrowLeft size={16}/> Back to Doctors</Link>
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="bg-gradient-to-r from-teal-700 to-teal-600 p-8 text-white">
          <div className="flex items-start gap-6 flex-wrap">
            <div className={`w-24 h-24 rounded-2xl flex items-center justify-center text-3xl font-bold ${color(doctor.id)}`}>{initials(doctor.name)}</div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold mb-1">{doctor.name}</h1>
              <p className="text-teal-200 font-medium mb-3">{doctor.specialization}</p>
              <div className="flex flex-wrap gap-4 text-sm text-teal-100">
                <span className="flex items-center gap-1.5"><Star size={14} className="fill-amber-400 text-amber-400"/> {doctor.rating} ({doctor.reviews} reviews)</span>
                <span className="flex items-center gap-1.5"><Clock size={14}/> {doctor.experience} years experience</span>
                <span className="flex items-center gap-1.5"><DollarSign size={14}/> Rs. {doctor.fee?.toLocaleString()} / visit</span>
              </div>
            </div>
            <Link to={`/book/${doctor.id}`} className="bg-white text-teal-700 font-semibold px-6 py-3 rounded-xl hover:bg-teal-50 transition flex items-center gap-2">
              <Calendar size={16}/> Book Appointment
            </Link>
          </div>
        </div>
        <div className="p-8 grid md:grid-cols-2 gap-8">
          <div>
            <h3 className="font-semibold text-slate-800 mb-3">About</h3>
            <p className="text-slate-600 text-sm leading-relaxed">{doctor.bio}</p>
            <h3 className="font-semibold text-slate-800 mt-6 mb-3">Availability</h3>
            <div className="flex flex-wrap gap-2">
              {['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map(d => (
                <span key={d} className={`px-3 py-1.5 rounded-lg text-xs font-medium ${doctor.availability?.includes(d) ? 'bg-teal-100 text-teal-700' : 'bg-slate-100 text-slate-400'}`}>{d}</span>
              ))}
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-slate-800 mb-3">Contact Information</h3>
            <div className="flex flex-col gap-3 text-sm">
              <span className="flex items-center gap-3 text-slate-600"><Phone size={15} className="text-teal-600"/> {doctor.phone}</span>
              <span className="flex items-center gap-3 text-slate-600"><Mail size={15} className="text-teal-600"/> {doctor.email}</span>
            </div>
            <div className="mt-6 p-4 bg-teal-50 rounded-xl border border-teal-100">
              <p className="text-sm text-teal-700 font-medium mb-1">Consultation Fee</p>
              <p className="text-2xl font-bold text-teal-800">Rs. {doctor.fee?.toLocaleString()}</p>
              <p className="text-xs text-teal-600 mt-1">Per appointment</p>
            </div>
          </div>
        </div>
        <div className="border-t border-slate-100 p-6 bg-slate-50 flex justify-end">
          <Link to={`/book/${doctor.id}`} className="inline-flex items-center gap-2 bg-teal-700 text-white font-semibold px-8 py-3 rounded-xl hover:bg-teal-800 transition">
            <Calendar size={16}/> Book Now
          </Link>
        </div>
      </div>
    </div>
  )
}
