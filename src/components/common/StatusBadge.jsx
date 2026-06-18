const MAP = {
  Pending: 'bg-amber-100 text-amber-700',
  Confirmed: 'bg-teal-100 text-teal-700',
  Cancelled: 'bg-red-100 text-red-700',
  Completed: 'bg-sky-100 text-sky-700',
}
export default function StatusBadge({ status }) {
  return <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${MAP[status] || 'bg-slate-100 text-slate-600'}`}>{status}</span>
}
