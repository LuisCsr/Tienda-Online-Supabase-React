// src/components/layout/Footer.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import styles from '../../styles/layout.module.css'; // IMPORTACIÓN CRÍTICA

const Footer = () => {
  return (
    <footer className={styles.footer}> {/* CSS Module */}
      <div style={{maxWidth: '1280px', margin: '0 auto', textAlign: 'center'}}>
        <p style={{fontSize: '0.875rem'}}>&copy; 2025 MiTienda Online. Todos los derechos reservados.</p>
        
        <div style={{display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '0.5rem', fontSize: '0.75rem'}}>
          <Link to="/about" style={{color: 'white', textDecoration: 'none'}}>Acerca de</Link>
          <Link to="/privacy" style={{color: 'white', textDecoration: 'none'}}>Política de Privacidad</Link>
          <Link to="/contact" style={{color: 'white', textDecoration: 'none'}}>Contacto</Link>
        </div>
        <p style={{marginTop: '1rem', fontSize: '0.75rem', color: '#9ca3af'}}>Desarrollado con React, Vite, CSS Modules y Supabase.</p>
      </div>
    </footer>
  );
};
export default Footer;