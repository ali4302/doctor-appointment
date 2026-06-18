import { useState } from 'react'
import { Link } from 'react-router-dom'
import Input from '../components/common/Input'
import Button from '../components/common/Button'
import { Mail, CheckCircle } from 'lucide-react'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault(); setLoading(true)
    await new Promise(r=>setTimeout(r,800))
    setSent(true); setLoading(false)
  }

  if (sent) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-10 max-w-sm text-center fade-in">
        <CheckCircle size={40} className="text-teal-600 mx-auto mb-4"/>
        <h2 className="text-xl font-bold text-slate-800 mb-2">Check your email</h2>
        <p className="text-slate-500 text-sm mb-6">We've sent a password reset link to <strong>{email}</strong></p>
        <Link to="/login" className="text-teal-700 font-medium text-sm hover:underline">Back to Login</Link>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8 w-full max-w-md fade-in">
        <h1 className="text-2xl font-bold text-slate-800 mb-1">Reset your password</h1>
        <p className="text-slate-500 text-sm mb-6">Enter your email and we'll send a reset link.</p>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input label="Email Address" type="email" placeholder="ali@example.com" icon={Mail} value={email} onChange={e=>setEmail(e.target.value)} required/>
          <Button type="submit" size="lg" className="w-full" disabled={loading}>{loading ? 'Sending...' : 'Send Reset Link'}</Button>
        </form>
        <p className="text-center text-sm text-slate-500 mt-4"><Link to="/login" className="text-teal-700 hover:underline">← Back to Login</Link></p>
      </div>
    </div>
  )
}
