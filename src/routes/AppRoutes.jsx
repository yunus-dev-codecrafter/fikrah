import { Navigate, Route, Routes } from 'react-router-dom'
import Login from '../pages/Login'
import HeadmasterAttendance from '../pages/headmaster/HeadmasterAttendance'
import HeadmasterDashboard from '../pages/headmaster/HeadmasterDashboard'
import HeadmasterReports from '../pages/headmaster/HeadmasterReports'
import ParentDashboard from '../pages/parent/ParentDashboard'
import ParentPayments from '../pages/parent/ParentPayments'
import ParentReportCards from '../pages/parent/ParentReportCards'
import ProprietorDashboard from '../pages/proprietor/ProprietorDashboard'
import SuperAdminDashboard from '../pages/super-admin/SuperAdminDashboard'
import TeacherAttendance from '../pages/teacher/TeacherAttendance'
import TeacherDashboard from '../pages/teacher/TeacherDashboard'
import TeacherScores from '../pages/teacher/TeacherScores'
import ProtectedRoute from './ProtectedRoute'

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route
        path="/super-admin"
        element={
          <ProtectedRoute role="super-admin">
            <SuperAdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/proprietor"
        element={
          <ProtectedRoute role="proprietor">
            <ProprietorDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/headmaster"
        element={
          <ProtectedRoute role="headmaster">
            <HeadmasterDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/headmaster/reports"
        element={
          <ProtectedRoute role="headmaster">
            <HeadmasterReports />
          </ProtectedRoute>
        }
      />
      <Route
        path="/headmaster/attendance"
        element={
          <ProtectedRoute role="headmaster">
            <HeadmasterAttendance />
          </ProtectedRoute>
        }
      />
      <Route
        path="/teacher"
        element={
          <ProtectedRoute role="teacher">
            <TeacherDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/teacher/attendance"
        element={
          <ProtectedRoute role="teacher">
            <TeacherAttendance />
          </ProtectedRoute>
        }
      />
      <Route
        path="/teacher/scores"
        element={
          <ProtectedRoute role="teacher">
            <TeacherScores />
          </ProtectedRoute>
        }
      />
      <Route
        path="/parent"
        element={
          <ProtectedRoute role="parent">
            <ParentDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/parent/report-cards"
        element={
          <ProtectedRoute role="parent">
            <ParentReportCards />
          </ProtectedRoute>
        }
      />
      <Route
        path="/parent/payments"
        element={
          <ProtectedRoute role="parent">
            <ParentPayments />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}

export default AppRoutes
