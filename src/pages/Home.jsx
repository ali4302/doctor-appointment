import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Search, Shield, Clock, Bell, Star, ArrowRight, Stethoscope, Users, Calendar } from 'lucide-react'
import { getDoctors } from '../services/mockDb'
import DoctorCard from '../components/doctor/DoctorCard'
import Loader from '../components/common/Loader'

export default function Home() {
  const [doctors, setDoctors] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const navigate = useNavigate()

  useEffect(() => { getDoctors().then(d => { setDoctors(d); setLoading(false) }) }, [])

  function handleSearch(e) {
    e.preventDefault()
    navigate(`/doctors?q=${encodeURIComponent(search)}`)
  }

  const features = [
    { icon: Search, title: 'Find Specialists', desc: 'Browse from 50+ specialist doctors across all medical fields.' },
    { icon: Calendar, title: 'Easy Booking', desc: 'Choose your preferred date and time slot in just a few clicks.' },
    { icon: Bell, title: 'Get Notified', desc: 'Receive instant email & system notifications for every update.' },
    { icon: Shield, title: 'Secure & Private', desc: 'Your health data is protected with enterprise-grade security.' },
  ]

  const stats = [
    { icon: Stethoscope, value: '50+', label: 'Specialist Doctors' },
    { icon: Users, value: '5,000+', label: 'Happy Patients' },
    { icon: Calendar, value: '10,000+', label: 'Appointments' },
    { icon: Star, value: '4.8/5', label: 'Average Rating' },
  ]

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-teal-700 via-teal-600 to-sky-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20 md:py-28 text-center">
          <span className="inline-block bg-white/20 text-white text-xs font-medium px-3 py-1 rounded-full mb-4">🏥 Pakistan's Trusted Healthcare Platform</span>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">Book Your Doctor<br/>Appointment Online</h1>
          <p className="text-lg text-teal-100 mb-8 max-w-xl mx-auto">Find the right specialist, choose your time, and manage all your visits — from the comfort of your home.</p>
          <form onSubmit={handleSearch} className="flex max-w-lg mx-auto bg-white rounded-xl overflow-hidden shadow-xl">
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search doctor or specialization..." className="flex-1 px-4 py-3 text-slate-700 text-sm outline-none"/>
            <button type="submit" className="bg-teal-700 text-white px-5 py-3 hover:bg-teal-800 transition flex items-center gap-2 text-sm font-medium"><Search size={16}/> Search</button>
          </form>
          <div className="flex flex-wrap justify-center gap-3 mt-6 text-sm text-teal-100">
            <span>Popular:</span>
            {['Cardiologist','Neurologist','Pediatrician','Dermatologist'].map(s => (
              <Link key={s} to={`/doctors?spec=${s}`} className="hover:text-white underline transition">{s}</Link>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map(s => (
            <div key={s.label} className="text-center">
              <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center mx-auto mb-2"><s.icon size={20}/></div>
              <div className="text-2xl font-bold text-slate-800">{s.value}</div>
              <div className="text-xs text-slate-500">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-slate-800 mb-2">Why Choose MediBook?</h2>
          <p className="text-slate-500">Everything you need for effortless healthcare management</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map(f => (
            <div key={f.title} className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition text-center">
              <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center mx-auto mb-4"><f.icon size={22}/></div>
              <h3 className="font-semibold text-slate-800 mb-1">{f.title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Doctors */}
      <section className="bg-slate-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-slate-800 mb-1">Featured Doctors</h2>
              <p className="text-slate-500">Top-rated specialists ready to see you</p>
            </div>
            <Link to="/doctors" className="hidden md:flex items-center gap-2 text-teal-700 font-medium text-sm hover:gap-3 transition-all">View All <ArrowRight size={16}/></Link>
          </div>
          {loading ? <Loader/> : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {doctors.slice(0,3).map(d => <DoctorCard key={d.id} doctor={d}/>)}
            </div>
          )}
          <div className="text-center mt-8">
            <Link to="/doctors" className="inline-flex items-center gap-2 bg-teal-700 text-white px-6 py-3 rounded-xl font-medium hover:bg-teal-800 transition">
              Browse All Doctors <ArrowRight size={16}/>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-teal-700 text-white py-16">
        <div className="max-w-3xl mx-auto text-center px-4">
          <h2 className="text-3xl font-bold mb-3">Ready to take control of your health?</h2>
          <p className="text-teal-100 mb-8">Create a free account and book your first appointment in minutes.</p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link to="/register" className="bg-white text-teal-700 font-semibold px-8 py-3 rounded-xl hover:bg-teal-50 transition">Get Started Free</Link>
            <Link to="/about" className="border border-white/50 text-white font-semibold px-8 py-3 rounded-xl hover:bg-white/10 transition">Learn More</Link>
          </div>
        </div>
      </section>
    </div>
  )
}
