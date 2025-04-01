import AdminDashboard from "../components/AdminDashboard/dashboard";
import PatientDashboard from "../components/PatientDashboard/PatientDashboard";
import StaffDashboard from "../components/StaffDashboard/StaffDashboard";
import DoctorDashboard from "../components/DoctorDashboard/DoctorDashboard"
import { useAuth } from "../store/authStore";

export default function DashboardRouter() {
    const { userType } = useAuth();
    
    // Route to the appropriate dashboard based on userType
    switch(userType) {
      case 'Admin':
        return <AdminDashboard />;
      case 'Staff':
        return <StaffDashboard />;
      case 'Doctor':
        return <DoctorDashboard/>;
      case 'Patient':
        return <PatientDashboard />;
      default:
        console.error("Unknown user type:", userType);
        return <Navigate to="/" replace />;
    }
  }