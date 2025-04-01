import './App.css';
import LoginPage from './components/login/login';
import SignupPage from './components/Signup/signup';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
function App() {

  return (
    <>
      <Router>
        <Routes>
        <Route path='/' element={<LoginPage />} />
        <Route path='/register' element={<SignupPage/>}/>
        </Routes>
      </Router>
    </>
  )
}

export default App
