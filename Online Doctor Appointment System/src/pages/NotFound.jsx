import { Link } from 'react-router-dom'
export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 text-center px-4">
      <div>
        <p className="text-8xl font-bold text-teal-700 mb-4">404</p>
        <h1 className="text-2xl font-bold text-slate-800 mb-2">Page not found</h1>
        <p className="text-slate-500 mb-6">The page you're looking for doesn't exist.</p>
        <Link to="/" className="bg-teal-700 text-white px-6 py-3 rounded-xl font-medium hover:bg-teal-800 transition">Back to Home</Link>
      </div>
    </div>
  )
}
