// src/components/layout/Navbar.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import styles from '../../styles/layout.module.css'; // IMPORTACIÓN CRÍTICA

const Navbar = () => {
  const { user, signOut, getRole } = useAuth();
  const navigate = useNavigate();
  // El rol ahora se lee del JWT, no del perfil de la página.
  const isAdmin = getRole() === 'admin'; 

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <nav className={styles.navbar}> {/* CSS Module */}
      <Link to="/" className={`${styles.navLink} text-xl font-bold`} style={{fontSize: '1.5rem'}}>
        🛒 MiTienda
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
            <Link to="/cart" className={styles.navLink}>Carrito (0)</Link>
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