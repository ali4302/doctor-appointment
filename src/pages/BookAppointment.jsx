import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
// Replace your old mockDb imports with this:
import { doctorService, appointmentService, TIME_SLOTS_LIST } from '../services/api'
import Loader from '../components/common/Loader'
import Button from '../components/common/Button'
import { Calendar, Clock, CheckCircle, ArrowLeft, ArrowRight } from 'lucide-react'

function today() { return new Date().toISOString().split('T')[0] }

export default function BookAppointment() {
  const { doctorId } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [doctor, setDoctor] = useState(null)
  const [loading, setLoading] = useState(true)
  const [step, setStep] = useState(1)
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [symptoms, setSymptoms] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [booked, setBooked] = useState(null)

  useEffect(() => { getDoctorById(doctorId).then(d => { setDoctor(d); setLoading(false) }) }, [doctorId])

  async function handleBook() {
    setSubmitting(true)
    const appt = await bookAppointment({ patientId: user.id, doctorId, date, time, symptoms })
    setBooked(appt)
    setStep(3)
    setSubmitting(false)
  }

  if (loading) return <Loader/>

  const steps = ['Select Time', 'Confirm', 'Done']

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10 fade-in">
      <button onClick={() => navigate(-1)} className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-teal-700 mb-6"><ArrowLeft size={16}/> Back</button>

      {/* Progress */}
      <div className="flex items-center mb-8">
        {steps.map((s, i) => (
          <div key={s} className="flex items-center flex-1">
            <div className="flex flex-col items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition
                ${step > i+1 ? 'bg-teal-700 text-white' : step === i+1 ? 'bg-teal-700 text-white ring-4 ring-teal-100' : 'bg-slate-200 text-slate-500'}`}>
                {step > i+1 ? <CheckCircle size={16}/> : i+1}
              </div>
              <span className={`text-xs mt-1 font-medium ${step === i+1 ? 'text-teal-700' : 'text-slate-400'}`}>{s}</span>
            </div>
            {i < steps.length-1 && <div className={`flex-1 h-0.5 mx-3 mb-4 ${step > i+1 ? 'bg-teal-600' : 'bg-slate-200'}`}/>}
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        {/* Doctor strip */}
        <div className="bg-teal-50 border-b border-teal-100 p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal-200 text-teal-800 flex items-center justify-center font-bold text-sm">
            {doctor?.name?.split(' ').map(w=>w[0]).join('').slice(0,2)}
          </div>
          <div>
            <p className="font-semibold text-slate-800 text-sm">{doctor?.name}</p>
            <p className="text-xs text-teal-600">{doctor?.specialization}</p>
          </div>
          <div className="ml-auto text-right">
            <p className="text-xs text-slate-500">Consultation fee</p>
            <p className="font-bold text-teal-700">Rs. {doctor?.fee?.toLocaleString()}</p>
          </div>
        </div>

        <div className="p-6">
          {step === 1 && (
            <div className="flex flex-col gap-5">
              <div>
                <label className="text-sm font-medium text-slate-700 mb-1.5 flex items-center gap-2"><Calendar size={15}/> Select Date</label>
                <input type="date" min={today()} value={date} onChange={e=>setDate(e.target.value)}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"/>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 mb-1.5 flex items-center gap-2"><Clock size={15}/> Select Time Slot</label>
                <div className="grid grid-cols-4 gap-2">
                  {TIME_SLOTS_LIST.map(t => (
                    <button key={t} onClick={() => setTime(t)}
                      className={`text-xs py-2.5 px-2 rounded-lg font-medium transition border
                        ${time===t ? 'bg-teal-700 text-white border-teal-700' : 'border-slate-200 text-slate-600 hover:border-teal-400 hover:bg-teal-50'}`}>
                      {t}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 mb-1.5 block">Symptoms / Reason (optional)</label>
                <textarea value={symptoms} onChange={e=>setSymptoms(e.target.value)} rows={3} placeholder="Describe your symptoms or reason for visit..."
                  className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100 resize-none"/>
              </div>
              <Button onClick={() => setStep(2)} disabled={!date || !time} className="w-full" size="lg">
                Continue <ArrowRight size={16}/>
              </Button>
            </div>
          )}

          {step === 2 && (
            <div className="flex flex-col gap-5">
              <h3 className="font-semibold text-slate-800">Review your appointment</h3>
              <div className="bg-slate-50 rounded-xl p-5 flex flex-col gap-3 text-sm">
                <div className="flex justify-between"><span className="text-slate-500">Doctor</span><span className="font-medium text-slate-800">{doctor?.name}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Specialization</span><span className="font-medium">{doctor?.specialization}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Date</span><span className="font-medium">{date}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Time</span><span className="font-medium">{time}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Patient</span><span className="font-medium">{user?.name}</span></div>
                {symptoms && <div className="flex justify-between gap-4"><span className="text-slate-500">Symptoms</span><span className="text-right text-slate-700 text-xs">{symptoms}</span></div>}
                <hr className="border-slate-200"/>
                <div className="flex justify-between"><span className="text-slate-500 font-medium">Consultation Fee</span><span className="font-bold text-teal-700">Rs. {doctor?.fee?.toLocaleString()}</span></div>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setStep(1)} className="flex-1">Edit</Button>
                <Button onClick={handleBook} disabled={submitting} className="flex-1">{submitting ? 'Booking...' : 'Confirm Booking'}</Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="text-center py-8 fade-in">
              <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4"><CheckCircle size={32} className="text-teal-600"/></div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">Appointment Booked!</h3>
              <p className="text-slate-500 text-sm mb-1">Your appointment is <span className="font-semibold text-amber-600">pending admin confirmation</span>.</p>
              <p className="text-slate-400 text-xs mb-6">You will be notified once it is confirmed.</p>
              <div className="bg-slate-50 rounded-xl p-4 text-sm text-left mb-6">
                <div className="flex justify-between mb-1"><span className="text-slate-500">Appointment ID</span><span className="font-mono text-xs text-slate-700">{booked?.id}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Status</span><span className="font-semibold text-amber-600">Pending</span></div>
              </div>
              <Button onClick={() => navigate('/my-appointments')} size="lg">View My Appointments</Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
