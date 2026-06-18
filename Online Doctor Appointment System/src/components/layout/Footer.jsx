import { Link } from 'react-router-dom'
import { Heart, Phone, Mail, MapPin, Clock } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-slate-800 text-slate-300 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <div className="flex items-center gap-2 text-white font-bold text-xl mb-3">
            <Heart size={20} className="text-teal-400"/> MediBook
          </div>
          <p className="text-sm leading-relaxed text-slate-400">Your trusted partner for online doctor appointments. Quality healthcare, just a click away.</p>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-3 text-sm">Quick Links</h4>
          <div className="flex flex-col gap-2 text-sm">
            <Link to="/" className="hover:text-teal-400 transition">Home</Link>
            <Link to="/doctors" className="hover:text-teal-400 transition">Find Doctors</Link>
            <Link to="/about" className="hover:text-teal-400 transition">About Us</Link>
            <Link to="/contact" className="hover:text-teal-400 transition">Contact</Link>
          </div>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-3 text-sm">Contact Info</h4>
          <div className="flex flex-col gap-2 text-sm">
            <span className="flex items-center gap-2"><Phone size={14}/> +92-42-1234567</span>
            <span className="flex items-center gap-2"><Mail size={14}/> info@medibook.pk</span>
            <span className="flex items-center gap-2"><MapPin size={14}/> Lahore, Punjab, Pakistan</span>
          </div>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-3 text-sm">Hours</h4>
          <div className="flex flex-col gap-2 text-sm">
            <span className="flex items-center gap-2"><Clock size={14}/> Mon – Fri: 9AM – 6PM</span>
            <span className="flex items-center gap-2"><Clock size={14}/> Sat: 10AM – 4PM</span>
            <span className="text-slate-500">Sunday: Closed</span>
          </div>
        </div>
      </div>
      <div className="border-t border-slate-700 py-4 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} MediBook. All rights reserved.
      </div>
    </footer>
  )
}
