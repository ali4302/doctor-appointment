import { Heart } from 'lucide-react';

export function Loader({ text = 'Loading...' }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4">
      <div className="relative">
        <div className="w-14 h-14 border-4 border-primary-100 border-t-primary-600 rounded-full animate-spin" />
        <Heart className="absolute inset-0 m-auto w-5 h-5 text-primary-600 animate-pulse-slow" />
      </div>
      <p className="text-slate-500 text-sm">{text}</p>
    </div>
  );
}

export function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader />
    </div>
  );
}

export function SkeletonCard() {
  return (
    <div className="card">
      <div className="flex items-center gap-3 mb-4">
        <div className="skeleton w-14 h-14 rounded-full" />
        <div className="flex-1 space-y-2">
          <div className="skeleton h-4 w-3/4" />
          <div className="skeleton h-3 w-1/2" />
        </div>
      </div>
      <div className="space-y-2">
        <div className="skeleton h-3 w-full" />
        <div className="skeleton h-3 w-5/6" />
        <div className="skeleton h-3 w-4/6" />
      </div>
      <div className="skeleton h-9 w-full mt-4 rounded-xl" />
    </div>
  );
}

export function StatusBadge({ status }) {
  const map = {
    Pending: 'badge-pending',
    Confirmed: 'badge-confirmed',
    Cancelled: 'badge-cancelled',
    Completed: 'badge-completed',
  };
  return <span className={map[status] || 'badge-pending'}>{status}</span>;
}

export function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mb-4">
        {Icon && <Icon className="w-8 h-8 text-slate-400" />}
      </div>
      <h3 className="text-lg font-semibold text-slate-800 mb-1">{title}</h3>
      <p className="text-slate-500 text-sm mb-5 max-w-xs">{description}</p>
      {action}
    </div>
  );
}

export function Alert({ type = 'error', message, onClose }) {
  if (!message) return null;
  const styles = {
    error: 'bg-red-50 border-red-200 text-red-800',
    success: 'bg-emerald-50 border-emerald-200 text-emerald-800',
    info: 'bg-sky-50 border-sky-200 text-sky-800',
  };
  return (
    <div className={`flex items-start gap-3 p-4 rounded-xl border text-sm ${styles[type]} animate-fade-in`}>
      <span className="flex-1">{message}</span>
      {onClose && <button onClick={onClose} className="shrink-0 opacity-60 hover:opacity-100 font-bold">×</button>}
    </div>
  );
}

export function AdminSidebar() {
  const links = [
    { to: '/admin', label: 'Dashboard', icon: '📊' },
    { to: '/admin/doctors', label: 'Manage Doctors', icon: '🩺' },
    { to: '/admin/patients', label: 'Manage Patients', icon: '👥' },
    { to: '/admin/appointments', label: 'Appointments', icon: '📅' },
    { to: '/admin/notifications', label: 'Notifications', icon: '🔔' },
  ];
  return (
    <aside className="w-64 shrink-0 hidden lg:block">
      <div className="card sticky top-24">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Admin Panel</p>
        <nav className="space-y-1">
          {links.map(({ to, label, icon }) => (
            <a key={to} href={to} className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-700 hover:bg-primary-50 hover:text-primary-700 transition-colors">
              <span>{icon}</span>{label}
            </a>
          ))}
        </nav>
      </div>
    </aside>
  );
}
