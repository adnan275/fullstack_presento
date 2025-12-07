import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");
  console.log('🔒 ProtectedRoute check:', {
    hasToken: !!token,
    token: token ? token.substring(0, 20) + '...' : 'None',
    path: window.location.pathname
  });

  if (!token) {
    console.log('❌ No token found, redirecting to /login');
    return <Navigate to="/login" replace />;
  }

  console.log('✅ Token found, allowing access');
  return children;
}

