import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Input from '../components/common/Input'
import Button from '../components/common/Button'
import { User, Mail, Lock, Phone, Heart } from 'lucide-react'

export default function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name:'', email:'', password:'', confirm:'', phone:'' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  function validate() {
    const e = {}
    if (!form.name.trim()) e.name = 'Name is required'
    if (!form.email.includes('@')) e.email = 'Valid email required'
    if (form.password.length < 6) e.password = 'Minimum 6 characters'
    if (form.password !== form.confirm) e.confirm = 'Passwords do not match'
    if (!form.phone.trim()) e.phone = 'Phone number required'
    return e
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const e2 = validate(); if (Object.keys(e2).length) { setErrors(e2); return }
    setLoading(true)
    try {
      await register({ name: form.name, email: form.email, password: form.password, phone: form.phone })
      setSuccess(true)
      setTimeout(() => navigate('/login'), 2000)
    } catch (err) {
      setErrors({ email: err.message })
    } finally { setLoading(false) }
  }

  if (success) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-10 text-center max-w-sm">
        <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4"><Heart size={28} className="text-teal-600"/></div>
        <h2 className="text-xl font-bold text-slate-800 mb-2">Account Created!</h2>
        <p className="text-slate-500 text-sm">Redirecting you to login...</p>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-12">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 w-full max-w-md fade-in">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-teal-100 rounded-2xl flex items-center justify-center mx-auto mb-3"><Heart size={22} className="text-teal-700"/></div>
          <h1 className="text-2xl font-bold text-slate-800">Create your account</h1>
          <p className="text-slate-500 text-sm mt-1">Join thousands of patients on MediBook</p>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input label="Full Name" placeholder="Ali Hassan" icon={User} value={form.name} onChange={e=>setForm({...form,name:e.target.value})} error={errors.name}/>
          <Input label="Email Address" type="email" placeholder="ali@example.com" icon={Mail} value={form.email} onChange={e=>setForm({...form,email:e.target.value})} error={errors.email}/>
          <Input label="Phone Number" placeholder="+92-300-1234567" icon={Phone} value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})} error={errors.phone}/>
          <Input label="Password" type="password" placeholder="Min. 6 characters" icon={Lock} value={form.password} onChange={e=>setForm({...form,password:e.target.value})} error={errors.password}/>
          <Input label="Confirm Password" type="password" placeholder="Repeat password" icon={Lock} value={form.confirm} onChange={e=>setForm({...form,confirm:e.target.value})} error={errors.confirm}/>
          <Button type="submit" size="lg" className="w-full mt-2" disabled={loading}>{loading ? 'Creating account...' : 'Create Account'}</Button>
        </form>
        <p className="text-center text-sm text-slate-500 mt-6">Already have an account? <Link to="/login" className="text-teal-700 font-medium hover:underline">Login</Link></p>
      </div>
    </div>
  )
}
