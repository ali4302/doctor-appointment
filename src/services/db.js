// localStorage-backed mock database
const KEYS = { doctors:'medi_doctors', patients:'medi_patients', appointments:'medi_appointments', notifications:'medi_notifications', admins:'medi_admins' };

const mockDoctors = [
  { id:'d1', name:'Dr. Ayesha Khan', specialization:'Cardiologist', experience:12, availability:'Mon-Fri', fee:2500, rating:4.9, reviews:134, bio:'Board-certified cardiologist with 12 years of clinical experience. Specialist in interventional cardiology and heart failure management.', phone:'+92-300-1234567', email:'ayesha.khan@medibook.pk', image:null, createdAt:'2024-01-01' },
  { id:'d2', name:'Dr. Muhammad Raza', specialization:'Neurologist', experience:9, availability:'Mon-Wed-Fri', fee:3000, rating:4.7, reviews:98, bio:'Expert neurologist specializing in epilepsy, headache disorders, and neurodegenerative diseases. Trained at Aga Khan University.', phone:'+92-321-2345678', email:'m.raza@medibook.pk', image:null, createdAt:'2024-01-02' },
  { id:'d3', name:'Dr. Sara Noor', specialization:'Dermatologist', experience:7, availability:'Tue-Thu-Sat', fee:2000, rating:4.8, reviews:211, bio:'Specializes in medical and cosmetic dermatology, acne management, and skin cancer screening. Fellow of the College of Physicians and Surgeons.', phone:'+92-333-3456789', email:'sara.noor@medibook.pk', image:null, createdAt:'2024-01-03' },
  { id:'d4', name:'Dr. Imran Sheikh', specialization:'Orthopedic Surgeon', experience:15, availability:'Mon-Tue-Thu', fee:3500, rating:4.6, reviews:76, bio:'Senior orthopedic surgeon with expertise in joint replacement, sports injuries, and minimally invasive spine surgery.', phone:'+92-345-4567890', email:'imran.sheikh@medibook.pk', image:null, createdAt:'2024-01-04' },
  { id:'d5', name:'Dr. Fatima Ali', specialization:'Pediatrician', experience:10, availability:'Mon-Fri', fee:1800, rating:4.9, reviews:302, bio:'Child health specialist with a passion for preventive care, vaccination, and developmental assessment. Caring and patient-centered approach.', phone:'+92-312-5678901', email:'fatima.ali@medibook.pk', image:null, createdAt:'2024-01-05' },
  { id:'d6', name:'Dr. Hassan Mirza', specialization:'Psychiatrist', experience:8, availability:'Wed-Thu-Fri', fee:2800, rating:4.7, reviews:89, bio:'Psychiatrist focusing on mood disorders, anxiety, PTSD, and cognitive behavioral therapy. Compassionate, evidence-based care.', phone:'+92-300-6789012', email:'hassan.mirza@medibook.pk', image:null, createdAt:'2024-01-06' },
];

const mockAdmin = { id:'a1', username:'admin', password:'admin123', name:'System Administrator', email:'admin@medibook.pk' };

function get(key) { try { return JSON.parse(localStorage.getItem(key)) || []; } catch { return []; } }
function set(key, val) { localStorage.setItem(key, JSON.stringify(val)); }

export function initDB() {
  if (!localStorage.getItem(KEYS.doctors)) set(KEYS.doctors, mockDoctors);
  if (!localStorage.getItem(KEYS.patients)) set(KEYS.patients, []);
  if (!localStorage.getItem(KEYS.appointments)) set(KEYS.appointments, []);
  if (!localStorage.getItem(KEYS.notifications)) set(KEYS.notifications, []);
  if (!localStorage.getItem(KEYS.admins)) set(KEYS.admins, [mockAdmin]);
}

export const db = {
  getDoctors: () => get(KEYS.doctors),
  getDoctor: (id) => get(KEYS.doctors).find(d => d.id === id),
  addDoctor: (doc) => { const docs = get(KEYS.doctors); docs.push({...doc, id:'d'+Date.now(), createdAt:new Date().toISOString()}); set(KEYS.doctors, docs); return doc; },
  updateDoctor: (id, data) => { const docs = get(KEYS.doctors).map(d => d.id===id?{...d,...data}:d); set(KEYS.doctors, docs); },
  deleteDoctor: (id) => { set(KEYS.doctors, get(KEYS.doctors).filter(d => d.id!==id)); },
  getPatients: () => get(KEYS.patients),
  getPatient: (id) => get(KEYS.patients).find(p => p.id === id),
  addPatient: (p) => { const ps = get(KEYS.patients); const newP = {...p, id:'p'+Date.now(), createdAt:new Date().toISOString()}; ps.push(newP); set(KEYS.patients, ps); return newP; },
  updatePatient: (id, data) => { const ps = get(KEYS.patients).map(p => p.id===id?{...p,...data}:p); set(KEYS.patients, ps); return ps.find(p=>p.id===id); },
  emailExists: (email) => get(KEYS.patients).some(p => p.email===email),
  findPatient: (email, password) => get(KEYS.patients).find(p => p.email===email && p.password===password),
  getAppointments: () => get(KEYS.appointments),
  getPatientAppointments: (pid) => get(KEYS.appointments).filter(a => a.patientId===pid),
  getDoctorAppointments: (did) => get(KEYS.appointments).filter(a => a.doctorId===did),
  addAppointment: (a) => { const apps = get(KEYS.appointments); const newA = {...a, id:'ap'+Date.now(), status:'Pending', createdAt:new Date().toISOString()}; apps.push(newA); set(KEYS.appointments, apps); return newA; },
  updateAppointment: (id, data) => { const apps = get(KEYS.appointments).map(a => a.id===id?{...a,...data}:a); set(KEYS.appointments, apps); return apps.find(a=>a.id===id); },
  deleteAppointment: (id) => { set(KEYS.appointments, get(KEYS.appointments).filter(a => a.id!==id)); },
  getNotifications: (pid) => get(KEYS.notifications).filter(n => n.patientId===pid||n.patientId==='all'),
  getAllNotifications: () => get(KEYS.notifications),
  addNotification: (n) => { const ns = get(KEYS.notifications); const newN = {...n, id:'n'+Date.now(), createdAt:new Date().toISOString(), read:false}; ns.unshift(newN); set(KEYS.notifications, ns); return newN; },
  markNotifRead: (id) => { const ns = get(KEYS.notifications).map(n => n.id===id?{...n,read:true}:n); set(KEYS.notifications, ns); },
  findAdmin: (username, password) => get(KEYS.admins).find(a => a.username===username && a.password===password),
};
