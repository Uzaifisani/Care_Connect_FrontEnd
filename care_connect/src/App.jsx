import './App.css';
import LoginPage from './components/login/login';
import SignupPage from './components/Signup/signup';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './routes/protectedRoutes';
import { AuthProvider, useAuth } from './store/authStore';
import DashboardRouter from './routes/DashboardRouter';

// Create a separate component to use the context
function AppContent() {

  return (
    <Routes>
      <Route path='/' element={<LoginPage />} />
      <Route path='/register' element={<SignupPage />} />
      <Route
        path='/dashboard'
        element={
          <ProtectedRoute>
            <DashboardRouter/>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
      <Routes>
      <Route path='/' element={<LoginPage />} />
      <Route path='/register' element={<SignupPage />} />
      <Route
        path='/dashboard/*'
        element={
          <ProtectedRoute>
            <DashboardRouter/>
          </ProtectedRoute>
        }
      />
    </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;