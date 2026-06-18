import { Routes, Route } from 'react-router-dom'
import { ProtectedRoute, AdminRoute } from './ProtectedRoute'

import Home from '../pages/Home'
import About from '../pages/About'
import Contact from '../pages/Contact'
import Register from '../pages/Register'
import Login from '../pages/Login'
import ForgotPassword from '../pages/ForgotPassword'
import Doctors from '../pages/Doctors'
import DoctorProfile from '../pages/DoctorProfile'
import BookAppointment from '../pages/BookAppointment'
import Dashboard from '../pages/Dashboard'
import MyAppointments from '../pages/MyAppointments'
import PatientProfile from '../pages/PatientProfile'
import AdminLogin from '../pages/AdminLogin'
import AdminDashboard from '../pages/admin/AdminDashboard'
import ManageDoctors from '../pages/admin/ManageDoctors'
import ManagePatients from '../pages/admin/ManagePatients'
import ManageAppointments from '../pages/admin/ManageAppointments'
import Notifications from '../pages/admin/Notifications'
import NotFound from '../pages/NotFound'

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<Home/>}/>
      <Route path="/about" element={<About/>}/>
      <Route path="/contact" element={<Contact/>}/>
      <Route path="/register" element={<Register/>}/>
      <Route path="/login" element={<Login/>}/>
      <Route path="/forgot-password" element={<ForgotPassword/>}/>
      <Route path="/doctors" element={<Doctors/>}/>
      <Route path="/doctors/:id" element={<DoctorProfile/>}/>
      {/* Patient protected */}
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard/></ProtectedRoute>}/>
      <Route path="/my-appointments" element={<ProtectedRoute><MyAppointments/></ProtectedRoute>}/>
      <Route path="/profile" element={<ProtectedRoute><PatientProfile/></ProtectedRoute>}/>
      <Route path="/book/:doctorId" element={<ProtectedRoute><BookAppointment/></ProtectedRoute>}/>
      {/* Admin */}
      <Route path="/admin/login" element={<AdminLogin/>}/>
      <Route path="/admin" element={<AdminRoute><AdminDashboard/></AdminRoute>}/>
      <Route path="/admin/doctors" element={<AdminRoute><ManageDoctors/></AdminRoute>}/>
      <Route path="/admin/patients" element={<AdminRoute><ManagePatients/></AdminRoute>}/>
      <Route path="/admin/appointments" element={<AdminRoute><ManageAppointments/></AdminRoute>}/>
      <Route path="/admin/notifications" element={<AdminRoute><Notifications/></AdminRoute>}/>
      {/* 404 */}
      <Route path="*" element={<NotFound/>}/>
    </Routes>
  )
}
