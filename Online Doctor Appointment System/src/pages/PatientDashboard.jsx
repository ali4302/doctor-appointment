import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { appointmentService } from '../services/api';
import AppointmentCard from '../components/appointment/AppointmentCard';
import Loader from '../components/common/Loader';
import { Calendar, Clock, CheckCircle, XCircle, Search, User } from 'lucide-react';

export default function PatientDashboard() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { appointmentService.getByPatient(user.id).then(a => { setAppointments(a); setLoading(false); }); }, []);

  const counts = {
    total: appointments.length,
    pending: appointments.filter(a => a.status === 'pending').length,
    confirmed: appointments.filter(a => a.status === 'confirmed').length,
    completed: appointments.filter(a => a.status === 'completed').length,
  };

  const stats = [
    { label: 'Total Booked', value: counts.total, icon: Calendar, color: 'text-primary', bg: 'bg-primary-pale' },
    { label: 'Pending', value: counts.pending, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Confirmed', value: counts.confirmed, icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Completed', value: counts.completed, icon: CheckCircle, color: 'text-sky-600', bg: 'bg-sky-50' },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Welcome back, {user.name?.split(' ')[0]} 👋</h1>
          <p className="text-slate-500 text-sm mt-1">Here's your health dashboard overview</p>
        </div>
        <Link to="/doctors" className="btn-primary flex items-center gap-2"><Search className="w-4 h-4" />Find a Doctor</Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {stats.map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="card">
            <div className={`w-10 h-10 ${bg} rounded-xl flex items-center justify-center mb-3`}><Icon className={`w-5 h-5 ${color}`} /></div>
            <div className={`text-2xl font-bold ${color}`}>{value}</div>
            <div className="text-xs text-slate-500 mt-0.5">{label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <h2 className="font-semibold text-slate-800 mb-4">Recent Appointments</h2>
          {loading ? <Loader /> : appointments.length === 0 ? (
            <div className="card text-center py-10">
              <Calendar className="w-10 h-10 mx-auto mb-3 text-slate-200" />
              <p className="text-slate-500 font-medium">No appointments yet</p>
              <p className="text-slate-400 text-sm mb-4">Book your first appointment to get started</p>
              <Link to="/doctors" className="btn-primary text-sm">Find a Doctor</Link>
            </div>
          ) : (
            <div className="space-y-4">
              {appointments.slice(0, 3).map(a => <AppointmentCard key={a.id} appt={a} />)}
              {appointments.length > 3 && (
                <Link to="/my-appointments" className="block text-center text-sm text-primary hover:underline">View all {appointments.length} appointments →</Link>
              )}
            </div>
          )}
        </div>
        <div>
          <h2 className="font-semibold text-slate-800 mb-4">Quick Actions</h2>
          <div className="space-y-3">
            {[
              { to: '/doctors', label: 'Book New Appointment', icon: Calendar, color: 'text-primary bg-primary-pale' },
              { to: '/my-appointments', label: 'View All Appointments', icon: Clock, color: 'text-sky-600 bg-sky-50' },
              { to: '/notifications', label: 'Notifications', icon: CheckCircle, color: 'text-emerald-600 bg-emerald-50' },
              { to: '/profile', label: 'Edit Profile', icon: User, color: 'text-purple-600 bg-purple-50' },
            ].map(({ to, label, icon: Icon, color }) => (
              <Link key={to} to={to} className="card flex items-center gap-3 py-3 hover:shadow-md transition-all group">
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${color}`}><Icon className="w-5 h-5" /></div>
                <span className="text-sm font-medium text-slate-700 group-hover:text-primary transition-colors">{label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
