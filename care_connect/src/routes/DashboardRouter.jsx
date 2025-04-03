import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import AdminDashboard from "../components/AdminDashboard/dashboard";
import PatientDashboard from "../components/PatientDashboard/PatientDashboard";
import StaffDashboard from "../components/StaffDashboard/StaffDashboard";
import DoctorDashboard from "../components/DoctorDashboard/DoctorDashboard";
import ListDoctors from "../components/AdminDashboard/ListDoctors";
import { useAuth } from "../store/authStore";
import ListAllStaff from "../components/AdminDashboard/ListAllStaff";
import VerifyUsers from "../components/AdminDashboard/VerifyUsers";
import Feedback from "../components/AdminDashboard/Feedback";
import EditUserPage from "../components/AdminDashboard/EditUser";

export default function DashboardRouter() {
  const { userType } = useAuth();
  const location = useLocation();
  
  // If path is exactly /dashboard, show the appropriate dashboard based on userType
  if (location.pathname === "/dashboard") {
    switch(userType) {
      case 'Admin':
        return <AdminDashboard />;
      case 'Staff':
        return <StaffDashboard />;
      case 'Doctor':
        return <DoctorDashboard />;
      case 'Patient':
        return <PatientDashboard />;
      default:
        console.error("Unknown user type:", userType);
        return <Navigate to="/" replace />;
    }
  }
  
  // Handle nested routes based on user type
  return (
    <Routes>
      {/* Admin Routes */}
      {userType === 'Admin' && (
  <>
    <Route path="/" element={<AdminDashboard />} />
    <Route path="admin/doctors" element={<ListDoctors />} /> 
    <Route path="admin/staffs" element={<ListAllStaff />} />
    <Route path="admin/verify-users" element={<VerifyUsers />} />
    <Route path="admin/feedback" element={<Feedback />} />
    <Route path="admin/edit-doctor/:id" element={<EditUserPage />} />
    <Route path="admin/edit-staff/:id" element={<EditUserPage />} />
  </>
)}
      
      {/* Doctor Routes */}
      {userType === 'Doctor' && (
        <>
          <Route path="/" element={<DoctorDashboard />} />
          {/* Add doctor specific routes */}
        </>
      )}
      
      {/* Patient Routes */}
      {userType === 'Patient' && (
        <>
          <Route path="/" element={<PatientDashboard />} />
          {/* Add patient specific routes */}
        </>
      )}
      
      {/* Staff Routes */}
      {userType === 'Staff' && (
        <>
          <Route path="/" element={<StaffDashboard />} />
          {/* Add staff specific routes */}
        </>
      )}
      
      {/* Fallback for unknown routes */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}