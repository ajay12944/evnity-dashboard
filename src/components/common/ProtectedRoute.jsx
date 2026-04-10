import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  // Bypassing auth check for now as requested
  return children;
};

export default ProtectedRoute;
