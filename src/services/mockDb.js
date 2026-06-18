// services/mockDb.js — LocalStorage-backed mock database

const KEYS = {
  doctors: 'medi_doctors',
  patients: 'medi_patients',
  appointments: 'medi_appointments',
  notifications: 'medi_notifications',
  admin: 'medi_admin',
}

const INITIAL_DOCTORS = [
  { id: 'd1', name: 'Dr. Ayesha Khan', specialization: 'Cardiologist', experience: 12, availability: ['Mon','Wed','Fri'], fee: 2500, rating: 4.9, reviews: 128, bio: 'Expert in heart diseases and cardiovascular care with 12 years at leading hospitals.', phone: '+92-300-1234567', email: 'ayesha.khan@medibook.pk' },
  { id: 'd2', name: 'Dr. Muhammad Raza', specialization: 'Neurologist', experience: 9, availability: ['Tue','Thu','Sat'], fee: 3000, rating: 4.7, reviews: 84, bio: 'Specialist in neurological disorders, stroke, and brain health management.', phone: '+92-300-2345678', email: 'm.raza@medibook.pk' },
  { id: 'd3', name: 'Dr. Sara Noor', specialization: 'Dermatologist', experience: 7, availability: ['Mon','Tue','Thu'], fee: 2000, rating: 4.8, reviews: 96, bio: 'Board-certified dermatologist specializing in skin, hair, and nail conditions.', phone: '+92-300-3456789', email: 'sara.noor@medibook.pk' },
  { id: 'd4', name: 'Dr. Hamid Ali', specialization: 'Orthopedic', experience: 15, availability: ['Mon','Wed','Sat'], fee: 3500, rating: 4.6, reviews: 112, bio: 'Orthopedic surgeon with expertise in joint replacement and sports injuries.', phone: '+92-300-4567890', email: 'hamid.ali@medibook.pk' },
  { id: 'd5', name: 'Dr. Zainab Malik', specialization: 'Pediatrician', experience: 6, availability: ['Tue','Wed','Fri'], fee: 1500, rating: 4.9, reviews: 203, bio: 'Dedicated pediatrician with a gentle approach to child healthcare and development.', phone: '+92-300-5678901', email: 'zainab.malik@medibook.pk' },
  { id: 'd6', name: 'Dr. Usman Ghani', specialization: 'General Physician', experience: 10, availability: ['Mon','Tue','Wed','Thu','Fri'], fee: 1000, rating: 4.5, reviews: 310, bio: 'Experienced general physician for primary care, preventive medicine, and health consultations.', phone: '+92-300-6789012', email: 'usman.ghani@medibook.pk' },
]

const INITIAL_ADMIN = { id: 'a1', username: 'admin', password: 'admin123', name: 'System Administrator' }

const INITIAL_PATIENTS = [
  { id: 'p0', name: 'Ali Hassan', email: 'ali@example.com', password: 'pass123', phone: '0300-1111111', bloodGroup: 'B+', dob: '1990-05-15', address: 'Lahore, Punjab' },
]

const TIME_SLOTS = ['09:00 AM','10:00 AM','11:00 AM','12:00 PM','02:00 PM','03:00 PM','04:00 PM','05:00 PM']

export function seed() {
  if (!localStorage.getItem(KEYS.doctors)) localStorage.setItem(KEYS.doctors, JSON.stringify(INITIAL_DOCTORS))
  if (!localStorage.getItem(KEYS.admin)) localStorage.setItem(KEYS.admin, JSON.stringify(INITIAL_ADMIN))
  if (!localStorage.getItem(KEYS.patients)) localStorage.setItem(KEYS.patients, JSON.stringify(INITIAL_PATIENTS))
  if (!localStorage.getItem(KEYS.appointments)) localStorage.setItem(KEYS.appointments, JSON.stringify([
    { id: 'ap1', patientId: 'p0', doctorId: 'd1', date: '2026-06-20', time: '10:00 AM', status: 'Confirmed', symptoms: 'Chest pain and fatigue', createdAt: '2026-06-10' },
    { id: 'ap2', patientId: 'p0', doctorId: 'd2', date: '2026-06-25', time: '02:00 PM', status: 'Pending', symptoms: 'Headaches and dizziness', createdAt: '2026-06-11' },
  ]))
  if (!localStorage.getItem(KEYS.notifications)) localStorage.setItem(KEYS.notifications, JSON.stringify([
    { id: 'n1', patientId: 'p0', message: 'Your appointment with Dr. Ayesha Khan on June 20 has been confirmed.', createdAt: '2026-06-12', read: false },
  ]))
}

const delay = (ms = 400) => new Promise(r => setTimeout(r, ms))

function get(key) { try { return JSON.parse(localStorage.getItem(key)) || [] } catch { return [] } }
function set(key, val) { localStorage.setItem(key, JSON.stringify(val)) }

// ─── DOCTORS ───────────────────────────────────────────────────────────────
export async function getDoctors() { await delay(); return get(KEYS.doctors) }
export async function getDoctorById(id) { await delay(200); return get(KEYS.doctors).find(d => d.id === id) || null }
export async function addDoctor(data) {
  await delay()
  const docs = get(KEYS.doctors)
  const doc = { ...data, id: 'd' + Date.now(), rating: 4.5, reviews: 0 }
  set(KEYS.doctors, [...docs, doc])
  return doc
}
export async function updateDoctor(id, data) {
  await delay()
  const docs = get(KEYS.doctors).map(d => d.id === id ? { ...d, ...data } : d)
  set(KEYS.doctors, docs)
}
export async function deleteDoctor(id) {
  await delay()
  set(KEYS.doctors, get(KEYS.doctors).filter(d => d.id !== id))
}

// ─── PATIENTS ──────────────────────────────────────────────────────────────
export async function getPatients() { await delay(); return get(KEYS.patients) }
export async function getPatientById(id) { await delay(200); return get(KEYS.patients).find(p => p.id === id) || null }
export async function registerPatient(data) {
  await delay()
  const patients = get(KEYS.patients)
  if (patients.find(p => p.email === data.email)) throw new Error('Email already registered')
  const patient = { ...data, id: 'p' + Date.now() }
  set(KEYS.patients, [...patients, patient])
  return patient
}
export async function updatePatient(id, data) {
  await delay()
  const patients = get(KEYS.patients).map(p => p.id === id ? { ...p, ...data } : p)
  set(KEYS.patients, patients)
  return patients.find(p => p.id === id)
}

// ─── AUTH ──────────────────────────────────────────────────────────────────
export async function loginPatient(email, password) {
  await delay()
  const patient = get(KEYS.patients).find(p => p.email === email && p.password === password)
  if (!patient) throw new Error('Invalid email or password')
  return patient
}
export async function loginAdmin(username, password) {
  await delay()
  const admin = get(KEYS.admin)
  if (!admin || admin.username !== username || admin.password !== password) throw new Error('Invalid admin credentials')
  return admin
}

// ─── APPOINTMENTS ──────────────────────────────────────────────────────────
export async function getAppointments() { await delay(); return get(KEYS.appointments) }
export async function getAppointmentsByPatient(patientId) {
  await delay()
  const appts = get(KEYS.appointments).filter(a => a.patientId === patientId)
  const docs = get(KEYS.doctors)
  return appts.map(a => ({ ...a, doctor: docs.find(d => d.id === a.doctorId) }))
}
export async function getAppointmentsFull() {
  await delay()
  const appts = get(KEYS.appointments)
  const docs = get(KEYS.doctors)
  const patients = get(KEYS.patients)
  return appts.map(a => ({
    ...a,
    doctor: docs.find(d => d.id === a.doctorId),
    patient: patients.find(p => p.id === a.patientId),
  }))
}
export async function bookAppointment(data) {
  await delay()
  const appt = { ...data, id: 'ap' + Date.now(), status: 'Pending', createdAt: new Date().toISOString().split('T')[0] }
  set(KEYS.appointments, [...get(KEYS.appointments), appt])
  // create notification
  const notif = { id: 'n' + Date.now(), patientId: data.patientId, message: `Your appointment has been booked. Awaiting confirmation.`, createdAt: appt.createdAt, read: false }
  set(KEYS.notifications, [...get(KEYS.notifications), notif])
  return appt
}
export async function updateAppointmentStatus(id, status) {
  await delay()
  const appts = get(KEYS.appointments).map(a => a.id === id ? { ...a, status } : a)
  set(KEYS.appointments, appts)
  const appt = appts.find(a => a.id === id)
  if (appt) {
    const notif = { id: 'n' + Date.now(), patientId: appt.patientId, message: `Your appointment status has been updated to: ${status}.`, createdAt: new Date().toISOString().split('T')[0], read: false }
    set(KEYS.notifications, [...get(KEYS.notifications), notif])
  }
}
export async function cancelAppointment(id) { return updateAppointmentStatus(id, 'Cancelled') }

// ─── NOTIFICATIONS ─────────────────────────────────────────────────────────
export async function getNotificationsByPatient(patientId) {
  await delay(200)
  return get(KEYS.notifications).filter(n => n.patientId === patientId).reverse()
}
export async function getAllNotifications() { await delay(200); return get(KEYS.notifications).reverse() }
export async function markRead(id) {
  set(KEYS.notifications, get(KEYS.notifications).map(n => n.id === id ? { ...n, read: true } : n))
}
export async function sendNotification(patientId, message) {
  await delay()
  const notif = { id: 'n' + Date.now(), patientId, message, createdAt: new Date().toISOString().split('T')[0], read: false }
  set(KEYS.notifications, [...get(KEYS.notifications), notif])
  return notif
}

export const TIME_SLOTS_LIST = TIME_SLOTS
