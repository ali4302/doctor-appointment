// Mock localStorage-backed database
const DB = {
  get: (key) => JSON.parse(localStorage.getItem(key) || 'null'),
  set: (key, val) => localStorage.setItem(key, JSON.stringify(val)),
};
// Add this near the top of api.js
export const TIME_SLOTS_LIST = [
  '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
  '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM'
];

const delay = (ms = 400) => new Promise(r => setTimeout(r, ms));

// Seed initial data if empty
function seedData() {
  if (DB.get('seeded')) return;
  DB.set('doctors', [
    { id: 'd1', name: 'Dr. Ayesha Khan', specialization: 'Cardiologist', experience: 12, availability: 'Mon,Wed,Fri', fee: 2500, rating: 4.9, reviews: 142, bio: 'Specialist in heart diseases with 12+ years of clinical experience at top hospitals.', phone: '0300-1234567', email: 'ayesha@medibook.pk' },
    { id: 'd2', name: 'Dr. Muhammad Raza', specialization: 'Neurologist', experience: 9, availability: 'Tue,Thu,Sat', fee: 2200, rating: 4.7, reviews: 98, bio: 'Expert neurologist treating brain and nerve disorders with evidence-based care.', phone: '0311-2345678', email: 'raza@medibook.pk' },
    { id: 'd3', name: 'Dr. Sara Noor', specialization: 'Dermatologist', experience: 7, availability: 'Mon,Tue,Thu', fee: 1800, rating: 4.8, reviews: 210, bio: 'Renowned skin specialist helping patients achieve healthy skin with modern treatments.', phone: '0333-3456789', email: 'sara@medibook.pk' },
    { id: 'd4', name: 'Dr. Hamid Ali', specialization: 'Orthopedist', experience: 15, availability: 'Wed,Thu,Fri', fee: 3000, rating: 4.6, reviews: 87, bio: 'Bone and joint specialist with expertise in sports injuries and joint replacement.', phone: '0345-4567890', email: 'hamid@medibook.pk' },
    { id: 'd5', name: 'Dr. Fatima Malik', specialization: 'Gynecologist', experience: 11, availability: 'Mon,Wed,Sat', fee: 2800, rating: 4.9, reviews: 175, bio: 'Women\'s health expert providing compassionate care for all stages of life.', phone: '0321-5678901', email: 'fatima@medibook.pk' },
    { id: 'd6', name: 'Dr. Bilal Ahmed', specialization: 'Pediatrician', experience: 8, availability: 'Tue,Wed,Fri', fee: 1500, rating: 4.7, reviews: 320, bio: 'Dedicated children\'s doctor focused on preventive care and child development.', phone: '0312-6789012', email: 'bilal@medibook.pk' },
  ]);
  DB.set('patients', [{ id: 'p1', name: 'Ali Hassan', email: 'ali@test.com', password: 'test123', phone: '0300-9999999', blood: 'B+', dob: '1995-06-15', address: 'Lahore, Pakistan' }]);
  DB.set('appointments', [
    { id: 'a1', patientId: 'p1', doctorId: 'd1', date: '2026-06-20', time: '10:00 AM', status: 'confirmed', symptoms: 'Chest pain', createdAt: '2026-06-15T10:00:00' },
    { id: 'a2', patientId: 'p1', doctorId: 'd2', date: '2026-06-25', time: '02:00 PM', status: 'pending', symptoms: 'Headaches', createdAt: '2026-06-16T09:00:00' },
  ]);
  DB.set('notifications', [
    { id: 'n1', patientId: 'p1', message: 'Your appointment with Dr. Ayesha Khan has been confirmed for June 20.', createdAt: '2026-06-15T12:00:00', read: false },
  ]);
  DB.set('admin', { username: 'admin', password: 'admin123' });
  DB.set('seeded', true);
}
seedData();

export const authService = {
  register: async (data) => {
    await delay();
    const patients = DB.get('patients') || [];
    if (patients.find(p => p.email === data.email)) throw new Error('Email already registered');
    const newP = { ...data, id: 'p' + Date.now(), blood: '', dob: '', address: '' };
    DB.set('patients', [...patients, newP]);
    return { user: newP, role: 'patient' };
  },
  login: async ({ email, password }) => {
    await delay();
    const patients = DB.get('patients') || [];
    const user = patients.find(p => p.email === email && p.password === password);
    if (!user) throw new Error('Invalid credentials');
    return { user, role: 'patient' };
  },
  adminLogin: async ({ username, password }) => {
    await delay();
    const admin = DB.get('admin');
    if (admin.username !== username || admin.password !== password) throw new Error('Invalid admin credentials');
    return { user: { id: 'admin', name: 'Administrator', username }, role: 'admin' };
  },
  updateProfile: async (id, data) => {
    await delay();
    const patients = DB.get('patients') || [];
    const idx = patients.findIndex(p => p.id === id);
    if (idx === -1) throw new Error('Patient not found');
    patients[idx] = { ...patients[idx], ...data };
    DB.set('patients', patients);
    return patients[idx];
  },
};

export const doctorService = {
  getAll: async () => { await delay(); return DB.get('doctors') || []; },
  getById: async (id) => { await delay(); return (DB.get('doctors') || []).find(d => d.id === id); },
  create: async (data) => {
    await delay();
    const docs = DB.get('doctors') || [];
    const doc = { ...data, id: 'd' + Date.now(), rating: 4.5, reviews: 0 };
    DB.set('doctors', [...docs, doc]);
    return doc;
  },
  update: async (id, data) => {
    await delay();
    const docs = DB.get('doctors') || [];
    const idx = docs.findIndex(d => d.id === id);
    docs[idx] = { ...docs[idx], ...data };
    DB.set('doctors', docs);
    return docs[idx];
  },
  delete: async (id) => {
    await delay();
    DB.set('doctors', (DB.get('doctors') || []).filter(d => d.id !== id));
  },
};

export const appointmentService = {
  getByPatient: async (patientId) => {
    await delay();
    const appts = DB.get('appointments') || [];
    const docs = DB.get('doctors') || [];
    return appts.filter(a => a.patientId === patientId).map(a => ({ ...a, doctor: docs.find(d => d.id === a.doctorId) }));
  },
  getAll: async () => {
    await delay();
    const appts = DB.get('appointments') || [];
    const docs = DB.get('doctors') || [];
    const patients = DB.get('patients') || [];
    return appts.map(a => ({ ...a, doctor: docs.find(d => d.id === a.doctorId), patient: patients.find(p => p.id === a.patientId) }));
  },
  book: async (data) => {
    await delay();
    const appts = DB.get('appointments') || [];
    const newA = { ...data, id: 'a' + Date.now(), status: 'pending', createdAt: new Date().toISOString() };
    DB.set('appointments', [...appts, newA]);
    const notifs = DB.get('notifications') || [];
    DB.set('notifications', [...notifs, { id: 'n' + Date.now(), patientId: data.patientId, message: `Your appointment has been booked and is pending confirmation.`, createdAt: new Date().toISOString(), read: false }]);
    return newA;
  },
  updateStatus: async (id, status) => {
    await delay();
    const appts = DB.get('appointments') || [];
    const idx = appts.findIndex(a => a.id === id);
    appts[idx].status = status;
    DB.set('appointments', appts);
    const notifs = DB.get('notifications') || [];
    DB.set('notifications', [...notifs, { id: 'n' + Date.now(), patientId: appts[idx].patientId, message: `Your appointment status has been updated to: ${status}.`, createdAt: new Date().toISOString(), read: false }]);
    return appts[idx];
  },
};

export const notificationService = {
  getByPatient: async (patientId) => {
    await delay();
    return (DB.get('notifications') || []).filter(n => n.patientId === patientId).reverse();
  },
  getAll: async () => { await delay(); return (DB.get('notifications') || []).reverse(); },
  markRead: async (id) => {
    await delay();
    const notifs = DB.get('notifications') || [];
    const idx = notifs.findIndex(n => n.id === id);
    notifs[idx].read = true;
    DB.set('notifications', notifs);
  },
  broadcast: async (message) => {
    await delay();
    const patients = DB.get('patients') || [];
    const notifs = DB.get('notifications') || [];
    const newNotifs = patients.map(p => ({ id: 'n' + Date.now() + Math.random(), patientId: p.id, message, createdAt: new Date().toISOString(), read: false }));
    DB.set('notifications', [...notifs, ...newNotifs]);
  },
  getPatientsData: async () => { await delay(); return DB.get('patients') || []; },
};
