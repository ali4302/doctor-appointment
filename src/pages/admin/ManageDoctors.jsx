import { useState, useEffect } from 'react'
import { getDoctors, addDoctor, updateDoctor, deleteDoctor } from '../../services/mockDb'
import Button from '../../components/common/Button'
import Input from '../../components/common/Input'
import Loader from '../../components/common/Loader'
import { Plus, Edit, Trash, X, Check } from 'lucide-react'

const DAYS = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun']
const SPECS = ['Cardiologist','Neurologist','Dermatologist','Orthopedic','Pediatrician','General Physician','Gynecologist','Psychiatrist','Ophthalmologist']
const EMPTY = { name:'', specialization:'', experience:'', fee:'', bio:'', phone:'', email:'', availability:[] }

export default function ManageDoctors() {
  const [doctors, setDoctors] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(EMPTY)
  const [saving, setSaving] = useState(false)
  const [search, setSearch] = useState('')

  function load() { getDoctors().then(d => { setDoctors(d); setLoading(false) }) }
  useEffect(load, [])

  function openAdd() { setForm(EMPTY); setEditing(null); setShowForm(true) }
  function openEdit(doc) { setForm({...doc, experience: String(doc.experience), fee: String(doc.fee)}); setEditing(doc.id); setShowForm(true) }

  async function handleSave(e) {
    e.preventDefault(); setSaving(true)
    const data = { ...form, experience: Number(form.experience), fee: Number(form.fee) }
    if (editing) await updateDoctor(editing, data)
    else await addDoctor(data)
    load(); setShowForm(false); setSaving(false)
  }

  async function handleDelete(id) {
    if (!confirm('Delete this doctor?')) return
    await deleteDoctor(id); load()
  }

  function toggleDay(d) {
    setForm(f => ({ ...f, availability: f.availability.includes(d) ? f.availability.filter(x=>x!==d) : [...f.availability, d] }))
  }

  const filtered = doctors.filter(d => d.name.toLowerCase().includes(search.toLowerCase()) || d.specialization.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 fade-in">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Manage Doctors</h1>
          <p className="text-slate-500 text-sm">{doctors.length} doctors registered</p>
        </div>
        <Button onClick={openAdd} className="flex items-center gap-2"><Plus size={16}/> Add Doctor</Button>
      </div>

      {showForm && (
        <div className="bg-white rounded-2xl border border-teal-200 shadow-md p-6 mb-8 slide-in">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-semibold text-slate-800">{editing ? 'Edit Doctor' : 'Add New Doctor'}</h3>
            <button onClick={() => setShowForm(false)}><X size={18} className="text-slate-400 hover:text-slate-700"/></button>
          </div>
          <form onSubmit={handleSave} className="grid sm:grid-cols-2 gap-4">
            <Input label="Full Name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} required/>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-slate-700">Specialization</label>
              <select value={form.specialization} onChange={e=>setForm({...form,specialization:e.target.value})} required
                className="border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-teal-500">
                <option value="">Select</option>
                {SPECS.map(s=><option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <Input label="Experience (years)" type="number" min="1" value={form.experience} onChange={e=>setForm({...form,experience:e.target.value})} required/>
            <Input label="Consultation Fee (Rs.)" type="number" value={form.fee} onChange={e=>setForm({...form,fee:e.target.value})} required/>
            <Input label="Phone" value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})}/>
            <Input label="Email" type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})}/>
            <div className="sm:col-span-2 flex flex-col gap-1">
              <label className="text-sm font-medium text-slate-700">Availability</label>
              <div className="flex gap-2 flex-wrap">
                {DAYS.map(d => (
                  <button type="button" key={d} onClick={()=>toggleDay(d)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition border ${form.availability.includes(d) ? 'bg-teal-700 text-white border-teal-700' : 'border-slate-200 text-slate-600 hover:border-teal-400'}`}>{d}</button>
                ))}
              </div>
            </div>
            <div className="sm:col-span-2 flex flex-col gap-1">
              <label className="text-sm font-medium text-slate-700">Bio</label>
              <textarea rows={3} value={form.bio} onChange={e=>setForm({...form,bio:e.target.value})}
                className="border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-teal-500 resize-none"/>
            </div>
            <div className="sm:col-span-2 flex gap-3 justify-end">
              <Button variant="ghost" type="button" onClick={() => setShowForm(false)}>Cancel</Button>
              <Button type="submit" disabled={saving}>{saving ? 'Saving...' : editing ? 'Save Changes' : 'Add Doctor'}</Button>
            </div>
          </form>
        </div>
      )}

      <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search doctors..." className="w-full max-w-sm border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-teal-500 mb-5"/>
      {loading ? <Loader/> : (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>{['Name','Specialization','Exp.','Fee','Availability','Actions'].map(h=><th key={h} className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">{h}</th>)}</tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map(d => (
                <tr key={d.id} className="hover:bg-slate-50 transition">
                  <td className="px-4 py-3 font-medium text-slate-800">{d.name}</td>
                  <td className="px-4 py-3 text-teal-600">{d.specialization}</td>
                  <td className="px-4 py-3 text-slate-600">{d.experience}y</td>
                  <td className="px-4 py-3 text-slate-600">Rs. {d.fee?.toLocaleString()}</td>
                  <td className="px-4 py-3"><div className="flex gap-1 flex-wrap">{d.availability?.map(av=><span key={av} className="bg-teal-50 text-teal-700 text-xs px-1.5 py-0.5 rounded">{av}</span>)}</div></td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button onClick={()=>openEdit(d)} className="text-sky-600 hover:text-sky-800"><Edit size={15}/></button>
                      <button onClick={()=>handleDelete(d.id)} className="text-red-500 hover:text-red-700"><Trash size={15}/></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && <div className="text-center py-10 text-slate-400 text-sm">No doctors found</div>}
        </div>
      )}
    </div>
  )
}
