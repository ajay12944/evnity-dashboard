import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import Announcements from './pages/Announcements';
import Users from './pages/Users';
import Clubs from './pages/Clubs';
import Events from './pages/Events';
import Calendar from './pages/Calendar';
import Registrations from './pages/Registrations';
import Login from './pages/Login';

function App() {
  return (
    <AuthProvider>
      <Toaster position="top-right" />
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }>
            <Route index element={<Dashboard />} />
            <Route path="announcements" element={<Announcements />} />
            <Route path="users" element={<Users />} />
            <Route path="clubs" element={<Clubs />} />
            <Route path="events" element={<Events />} />
            <Route path="calendar" element={<Calendar />} />
            <Route path="registrations" element={<Registrations />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
