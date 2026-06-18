import { useState } from 'react'
import { Phone, Mail, MapPin, Clock, CheckCircle } from 'lucide-react'
import Input from '../components/common/Input'
import Button from '../components/common/Button'

export default function Contact() {
  const [form, setForm] = useState({ name:'', email:'', message:'' })
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault(); setLoading(true)
    await new Promise(r=>setTimeout(r,800)); setSent(true); setLoading(false)
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 fade-in">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">Get in Touch</h1>
        <p className="text-slate-500">We're here to help. Reach out any time.</p>
      </div>
      <div className="grid md:grid-cols-2 gap-10">
        <div className="flex flex-col gap-5">
          {[{icon:Phone,label:'Phone',val:'+92-42-1234567'},{icon:Mail,label:'Email',val:'info@medibook.pk'},{icon:MapPin,label:'Address',val:'Lahore, Punjab, Pakistan'},{icon:Clock,label:'Hours',val:'Mon–Fri: 9AM–6PM, Sat: 10AM–4PM'}].map(c=>(
            <div key={c.label} className="flex items-start gap-4 bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center flex-shrink-0"><c.icon size={18}/></div>
              <div><p className="font-medium text-slate-800 text-sm">{c.label}</p><p className="text-slate-500 text-sm">{c.val}</p></div>
            </div>
          ))}
        </div>
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8">
          {sent ? (
            <div className="text-center py-10 fade-in">
              <CheckCircle size={40} className="text-teal-600 mx-auto mb-3"/>
              <h3 className="font-bold text-slate-800 text-xl mb-1">Message Sent!</h3>
              <p className="text-slate-500 text-sm">We'll get back to you within 24 hours.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <h3 className="font-bold text-slate-800 text-lg">Send a Message</h3>
              <Input label="Your Name" placeholder="Ali Hassan" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} required/>
              <Input label="Email" type="email" placeholder="ali@example.com" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} required/>
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-slate-700">Message</label>
                <textarea rows={4} placeholder="How can we help you?" value={form.message} onChange={e=>setForm({...form,message:e.target.value})} required
                  className="border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100 resize-none"/>
              </div>
              <Button type="submit" size="lg" className="w-full" disabled={loading}>{loading ? 'Sending...' : 'Send Message'}</Button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
