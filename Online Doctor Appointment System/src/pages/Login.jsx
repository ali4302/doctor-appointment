import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Input from '../components/common/Input'
import Button from '../components/common/Button'
import { Mail, Lock, Heart } from 'lucide-react'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email:'', password:'' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault(); setError('')
    if (!form.email || !form.password) { setError('Please fill in all fields'); return }
    setLoading(true)
    try {
      await login(form.email, form.password)
      navigate('/dashboard')
    } catch(err) { setError(err.message) } finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 w-full max-w-md fade-in">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-teal-100 rounded-2xl flex items-center justify-center mx-auto mb-3"><Heart size={22} className="text-teal-700"/></div>
          <h1 className="text-2xl font-bold text-slate-800">Welcome back</h1>
          <p className="text-slate-500 text-sm mt-1">Login to access your appointments</p>
        </div>
        {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3 mb-4">{error}</div>}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input label="Email Address" type="email" placeholder="ali@example.com" icon={Mail} value={form.email} onChange={e=>setForm({...form,email:e.target.value})}/>
          <Input label="Password" type="password" placeholder="Your password" icon={Lock} value={form.password} onChange={e=>setForm({...form,password:e.target.value})}/>
          <div className="text-right"><Link to="/forgot-password" className="text-sm text-teal-700 hover:underline">Forgot password?</Link></div>
          <Button type="submit" size="lg" className="w-full" disabled={loading}>{loading ? 'Signing in...' : 'Sign In'}</Button>
        </form>
        <div className="bg-slate-50 rounded-lg p-3 mt-4 text-xs text-slate-500">
          <strong>Demo credentials:</strong> ali@example.com / pass123
        </div>
        <p className="text-center text-sm text-slate-500 mt-4">Don't have an account? <Link to="/register" className="text-teal-700 font-medium hover:underline">Register</Link></p>
      </div>
    </div>
  )
}
