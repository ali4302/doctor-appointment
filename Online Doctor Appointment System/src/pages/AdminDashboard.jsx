import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { appointmentService, doctorService, notificationService } from '../services/api';
import AppointmentCard from '../components/appointment/AppointmentCard';
import Loader from '../components/common/Loader';
import { Users, Calendar, Stethoscope, Clock, LayoutDashboard, ChevronRight } from 'lucide-react';

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    const [appts, docs, pats] = await Promise.all([appointmentService.getAll(), doctorService.getAll(), notificationService.getPatientsData()]);
    setAppointments(appts); setDoctors(docs); setPatients(pats); setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleAction = async (id, status) => {
    await appointmentService.updateStatus(id, status);
    load();
  };

  const pending = appointments.filter(a => a.status === 'pending');
  const stats = [
    { label: 'Total Appointments', value: appointments.length, icon: Calendar, color: 'text-primary', bg: 'bg-primary-pale' },
    { label: 'Total Doctors', value: doctors.length, icon: Stethoscope, color: 'text-sky-600', bg: 'bg-sky-50' },
    { label: 'Total Patients', value: patients.length, icon: Users, color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'Pending Today', value: pending.length, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
  ];

  const adminLinks = [
    { to: '/admin/doctors', label: 'Manage Doctors', icon: Stethoscope },
    { to: '/admin/patients', label: 'Manage Patients', icon: Users },
    { to: '/admin/appointments', label: 'Manage Appointments', icon: Calendar },
    { to: '/admin/notifications', label: 'Notifications', icon: Clock },
  ];

  return (
    <div className="min-h-screen flex bg-slate-50">
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-56 bg-slate-800 text-white">
        <div className="p-4 border-b border-slate-700">
          <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Admin Panel</p>
          <p className="text-sm font-semibold mt-1">MediBook</p>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          <Link to="/admin" className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg bg-slate-700 text-white text-sm font-medium">
            <LayoutDashboard className="w-4 h-4" />Dashboard
          </Link>
          {adminLinks.map(({ to, label, icon: Icon }) => (
            <Link key={to} to={to} className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-slate-400 hover:bg-slate-700 hover:text-white text-sm transition-all">
              <Icon className="w-4 h-4" />{label}
            </Link>
          ))}
        </nav>
        <div className="p-3 border-t border-slate-700">
          <button onClick={logout} className="w-full text-left text-xs text-slate-400 hover:text-red-400 transition-colors py-2 px-3">Logout</button>
        </div>
      </aside>

      <main className="flex-1 p-6 overflow-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>
          <p className="text-slate-500 text-sm">Welcome back, Administrator</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map(({ label, value, icon: Icon, color, bg }) => (
            <div key={label} className="card">
              <div className={`w-10 h-10 ${bg} rounded-xl flex items-center justify-center mb-3`}><Icon className={`w-5 h-5 ${color}`} /></div>
              <div className={`text-2xl font-bold ${color}`}>{value}</div>
              <div className="text-xs text-slate-500 mt-0.5">{label}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-slate-800">Pending Approvals</h2>
              <Link to="/admin/appointments" className="text-xs text-primary hover:underline flex items-center gap-1">View all <ChevronRight className="w-3 h-3" /></Link>
            </div>
            {loading ? <Loader /> : pending.length === 0 ? (
              <div className="card text-center py-8 text-slate-400 text-sm">No pending appointments</div>
            ) : (
              <div className="space-y-4">
                {pending.slice(0, 4).map(a => (
                  <AppointmentCard key={a.id} appt={a}
                    actions={[{ label: 'Confirm', status: 'confirmed', variant: 'primary' }, { label: 'Cancel', status: 'cancelled', variant: 'danger' }]}
                    onAction={handleAction} />
                ))}
              </div>
            )}
          </div>
          <div>
            <h2 className="font-semibold text-slate-800 mb-4">Quick Links</h2>
            <div className="space-y-2">
              {adminLinks.map(({ to, label, icon: Icon }) => (
                <Link key={to} to={to} className="card flex items-center gap-3 py-3 hover:shadow-md transition-all group">
                  <Icon className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium text-slate-700 group-hover:text-primary flex-1">{label}</span>
                  <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-primary transition-colors" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
