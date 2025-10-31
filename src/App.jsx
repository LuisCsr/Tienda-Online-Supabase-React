// src/App.jsx (CÓDIGO FINAL Y CORREGIDO DE EXPORTACIÓN)
import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Importa componentes de Layout y Lógica
import ProtectedRoute from './components/ProtectedRoute'; 
import Navbar from './components/layout/Navbar'; 
import Footer from './components/layout/Footer';

// Importa las Páginas
import Home from './pages/Home';
import Login from './pages/Login';
import Profile from './pages/Profile';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Orders from './pages/Orders';
import OrderDetail from './pages/OrderDetail';
import AdminDashboard from './pages/AdminDashboard'; 
import ProductDetail from './pages/ProductDetail'; // Asegúrate de incluir ProductDetail

import styles from './styles/layout.module.css'; 

// --- DEFINICIÓN DE LA FUNCIÓN APP ---
const App = () => { // Usamos 'const' aquí
  return (
    <div className={styles.pageContainer}> 
      <Navbar />
      
      <main className={styles.mainContent}> 
        <Routes>
          {/* Rutas Públicas */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Login />} />
          <Route path="/products/:id" element={<ProductDetail />} />

          {/* Rutas Protegidas */}
          <Route element={<ProtectedRoute />}>
            <Route path="/profile" element={<Profile />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/orders/:orderId" element={<OrderDetail />} />
          </Route>

          {/* Rutas de Administrador */}
          <Route element={<ProtectedRoute requiredRole="admin" />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
          </Route>

          <Route path="*" element={<div style={{textAlign: 'center', padding: '5rem'}}>404 | Página no encontrada</div>} />
        </Routes>
      </main>
      
      <Footer />
    </div>
  );
};
// --- FIN DE LA FUNCIÓN APP ---

// --- EXPORTACIÓN CORRECTA AL FINAL ---
export default App;