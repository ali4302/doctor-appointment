import { Calendar, Clock, Stethoscope, User } from 'lucide-react'
import StatusBadge from '../common/StatusBadge'
import Button from '../common/Button'

export default function AppointmentCard({ appt, onCancel, onStatusChange, isAdmin }) {
  const { doctor, patient, date, time, status, symptoms } = appt
  return (
    <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5 fade-in">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center flex-shrink-0">
            <Stethoscope size={18}/>
          </div>
          <div>
            {isAdmin
              ? <><p className="font-semibold text-slate-800 text-sm">{patient?.name}</p><p className="text-xs text-slate-500">→ {doctor?.name} · {doctor?.specialization}</p></>
              : <><p className="font-semibold text-slate-800 text-sm">{doctor?.name}</p><p className="text-xs text-teal-600">{doctor?.specialization}</p></>
            }
            <div className="flex items-center gap-3 mt-1.5 text-xs text-slate-400">
              <span className="flex items-center gap-1"><Calendar size={11}/> {date}</span>
              <span className="flex items-center gap-1"><Clock size={11}/> {time}</span>
            </div>
            {symptoms && <p className="text-xs text-slate-400 mt-1 italic">"{symptoms}"</p>}
          </div>
        </div>
        <StatusBadge status={status}/>
      </div>
      {(onCancel || onStatusChange) && (
        <div className="flex gap-2 mt-4 flex-wrap">
          {isAdmin && status === 'Pending' && (
            <Button size="sm" onClick={() => onStatusChange(appt.id, 'Confirmed')}>Confirm</Button>
          )}
          {isAdmin && status === 'Confirmed' && (
            <Button size="sm" variant="secondary" onClick={() => onStatusChange(appt.id, 'Completed')}>Mark Completed</Button>
          )}
          {(status === 'Pending' || status === 'Confirmed') && (
            <Button size="sm" variant="danger" onClick={() => onCancel(appt.id)}>Cancel</Button>
          )}
        </div>
      )}
    </div>
  )
}
