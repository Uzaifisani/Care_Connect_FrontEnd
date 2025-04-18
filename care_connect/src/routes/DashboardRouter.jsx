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
import Appointments from "../components/DoctorDashboard/Appointments";
import DFeedback from "../components/DoctorDashboard/DFeedback";
import BookAppointmentPage from "../components/PatientDashboard/BookAppointment";
import MyAppointmentsPage from "../components/PatientDashboard/MyAppoinments";
import GiveFeedbackPage from "../components/PatientDashboard/GiveFeedback";
import UploadPrescriptions from "../components/DoctorDashboard/UploadPrescriptions";
import ViewPrescriptions from "../components/DoctorDashboard/ViewPrescriptions";
import RegisterPatient from "../components/StaffDashboard/RegisterPatient";
import ChangePassword from "../components/ChangePassword";
import MakePayment from "../components/StaffDashboard/MakePayment";
import AllPatient from "../components/StaffDashboard/AllPatient";
import ViewPrescription from "../components/PatientDashboard/ViewPrescription";

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
      {/* Common Routes for all user types */}
      <Route path="change-password" element={<ChangePassword />} />

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
          <Route path="doctor/appointments" element={<Appointments />} />
          <Route path="doctor/feedbacks" element={<DFeedback />} />
          <Route path="doctor/upload-prescription" element={<UploadPrescriptions />} />
          <Route path="doctor/view-prescriptions" element={<ViewPrescriptions />} />
        </>
      )}
      
      {/* Patient Routes */}
      {userType === 'Patient' && (
        <>
          <Route path="/" element={<PatientDashboard />} />
          <Route path="patient/book-appointment" element={<BookAppointmentPage />} />
          <Route path="patient/my-appointments" element={<MyAppointmentsPage />} />
          <Route path="patient/feedback" element={<GiveFeedbackPage />} />
          <Route path="patient/prescriptions" element={<ViewPrescription />} />
        </>
      )}
      
      {/* Staff Routes */}
      {userType === 'Staff' && (
        <>
          <Route path="/" element={<StaffDashboard />} />
          <Route path="staff/register-patient" element={<RegisterPatient/>} />
          <Route path="staff/make-payment" element={<MakePayment />} />
          <Route path="staff/all-patients" element={<AllPatient />} />
        </>
      )}
      
      {/* Fallback for unknown routes */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}