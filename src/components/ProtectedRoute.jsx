// src/components/ProtectedRoute.jsx (Paso 9)
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ requiredRole }) => {
  const { user, loading, getRole } = useAuth();

  if (loading) {
    // Estado de carga inicial
    return <div className="flex justify-center items-center h-screen text-lg">Cargando autenticación...</div>;
  }

  if (!user) {
    // 1. Si no hay usuario, redirige a login
    return <Navigate to="/login" replace />;
  }

  if (requiredRole === 'admin') {
    const userRole = getRole();
    
    // 2. Si se requiere Admin y el usuario no lo es, deniega el acceso
    if (userRole !== 'admin') {
      alert("Acceso denegado: Se requiere rol de administrador.");
      return <Navigate to="/" replace />; // Redirige a Home
    }
  }

  // Si pasa las comprobaciones, renderiza la ruta
  return <Outlet />;
};

export default ProtectedRoute;