// src/components/layout/Navbar.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext'; // 1. IMPORTAMOS EL CARRITO
import styles from '../../styles/layout.module.css'; 

const Navbar = () => {
  const { user, signOut, getRole } = useAuth();
  const { cart } = useCart(); // 2. EXTRAEMOS LA INFORMACIÓN DEL CARRITO
  const navigate = useNavigate();
  
  const isAdmin = getRole() === 'admin'; 

  // 3. CALCULAMOS EL TOTAL DINÁMICO DE PRODUCTOS
  const totalItems = cart?.items?.reduce((acc, item) => acc + item.cantidad, 0) || 0;

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <nav className={styles.navbar}> 
      <Link to="/" className={`${styles.navLink} text-xl font-bold`} style={{fontSize: '1.5rem'}}>
        🛒 Montalift
      </Link>

      <div style={{display: 'flex', gap: '1rem', alignItems: 'center'}}>
        <Link to="/" className={styles.navLink}>Inicio</Link>

        {user ? (
          <>
            {isAdmin && (
              <Link to="/admin/dashboard" className={styles.navLink} style={{color: 'yellow'}}>
                Admin
              </Link>
            )}

            <Link to="/profile" className={styles.navLink}>Perfil</Link>
            
            {/* 4. AQUÍ OCURRE LA MAGIA: REEMPLAZAMOS EL (0) POR {totalItems} */}
            <Link to="/cart" className={styles.navLink}>Carrito ({totalItems})</Link>
            
            <button 
              onClick={handleLogout} 
              className={styles.logoutButton}
            >
              Salir
            </button>
          </>
        ) : (
          <Link to="/login" className={styles.logoutButton} style={{backgroundColor: 'white', color: '#4f46e5'}}>
            Iniciar Sesión
          </Link>
        )}
      </div>
    </nav>
  );
};
export default Navbar;
