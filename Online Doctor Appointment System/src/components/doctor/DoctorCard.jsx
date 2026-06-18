import { Link } from 'react-router-dom'
import { Star, Clock, DollarSign } from 'lucide-react'

const COLORS = ['bg-teal-100 text-teal-700','bg-sky-100 text-sky-700','bg-purple-100 text-purple-700','bg-rose-100 text-rose-700','bg-amber-100 text-amber-700','bg-indigo-100 text-indigo-700']
function initials(name) { return name.split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase() }
function color(id) { return COLORS[parseInt(id?.replace(/\D/g,'')?.slice(-1)||0) % COLORS.length] }

export default function DoctorCard({ doctor }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 overflow-hidden fade-in">
      <div className="p-5">
        <div className="flex items-start gap-4">
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-lg font-bold flex-shrink-0 ${color(doctor.id)}`}>
            {initials(doctor.name)}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-slate-800 truncate">{doctor.name}</h3>
            <p className="text-sm text-teal-600 font-medium">{doctor.specialization}</p>
            <p className="text-xs text-slate-400 mt-0.5">{doctor.experience} yrs experience</p>
          </div>
        </div>
        <div className="flex items-center gap-4 mt-4 text-xs text-slate-500">
          <span className="flex items-center gap-1"><Star size={12} className="text-amber-400 fill-amber-400"/> {doctor.rating} ({doctor.reviews})</span>
          <span className="flex items-center gap-1"><DollarSign size={12}/> Rs. {doctor.fee?.toLocaleString()}</span>
        </div>
        <div className="flex flex-wrap gap-1 mt-3">
          {doctor.availability?.map(d => <span key={d} className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">{d}</span>)}
        </div>
      </div>
      <div className="px-5 pb-5 flex gap-2">
        <Link to={`/doctors/${doctor.id}`} className="flex-1 text-center text-sm font-medium border border-teal-600 text-teal-700 rounded-lg py-2 hover:bg-teal-50 transition">View Profile</Link>
        <Link to={`/book/${doctor.id}`} className="flex-1 text-center text-sm font-medium bg-teal-700 text-white rounded-lg py-2 hover:bg-teal-800 transition">Book Now</Link>
      </div>
    </div>
  )
}
