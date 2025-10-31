// src/pages/Login.jsx (CÓDIGO FINAL Y COMPLETO)
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabase/supabaseClient'; 
import styles from '../styles/layout.module.css'; 

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const { signIn, signUp, loading, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  if (isAuthenticated) { navigate('/'); return null; }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    let result = isLogin ? await signIn(email, password) : await signUp(email, password);

    if (result.error) {
      setError(result.error.message);
    } else if (!isLogin) {
      setError('¡Registro exitoso! Por favor, verifica tu correo electrónico para iniciar sesión.');
    } else {
      navigate('/');
    }
  };

  // Función para iniciar sesión con proveedores OAuth (Bonificación)
  const handleOAuthSignIn = async (provider) => {
    const { error } = await supabase.auth.signInWithOAuth({
        provider: provider,
        options: {
            redirectTo: window.location.origin, 
        }
    });
    
    if (error) {
        setError("Error de OAuth: " + error.message);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '2.5rem 0' }}>
      <div className={styles.formBox} style={{ width: '100%' }}> 
        <h1 className={styles.title} style={{fontSize: '1.875rem', textAlign: 'center', color: '#4f46e5'}}>
          {isLogin ? 'Iniciar Sesión' : 'Registrarse'}
        </h1>
        
        {/* Mensaje de error/éxito */}
        {error && (
          <div style={{ padding: '0.75rem', marginBottom: '1rem', borderRadius: '0.5rem', fontSize: '0.875rem', backgroundColor: error.includes('verifica') ? '#dcfce7' : '#fee2e2', color: error.includes('verifica') ? '#059669' : '#b91c1c' }} role="alert">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* CAMPOS DE FORMULARIO */}
          <div>
            <label htmlFor="email" style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151' }}>Correo Electrónico</label>
            <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
              style={{ marginTop: '0.25rem', display: 'block', width: '100%', padding: '0.5rem 0.75rem', border: '1px solid #d1d5db', borderRadius: '0.375rem' }}
            />
          </div>
          <div>
            <label htmlFor="password" style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151' }}>Contraseña</label>
            <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required
              style={{ marginTop: '0.25rem', display: 'block', width: '100%', padding: '0.5rem 0.75rem', border: '1px solid #d1d5db', borderRadius: '0.375rem' }}
            />
          </div>

          {/* BOTÓN DE SUBMIT */}
          <button
            type="submit" disabled={loading}
            className={styles.logoutButton} 
            style={{ width: '100%', backgroundColor: '#4f46e5', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.5 : 1}}
          >
            {loading ? 'Cargando...' : (isLogin ? 'Iniciar Sesión' : 'Registrarse')}
          </button>
        </form>
        
        {/* --- BOTÓN DE OAUTH (Bonificación) --- */}
        <div style={{ marginTop: '1rem', textAlign: 'center' }}>
            <button
                onClick={() => handleOAuthSignIn('google')}
                // Usamos estilos que se integran con el diseño base
                style={{ 
                    width: '100%', 
                    padding: '0.75rem', 
                    backgroundColor: '#db4437', 
                    color: 'white', 
                    borderRadius: '0.5rem', 
                    border: 'none', 
                    cursor: 'pointer', 
                    fontWeight: '600' 
                }}
            >
                Iniciar Sesión con Google
            </button>
        </div>
        {/* ------------------------------------- */}

        <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
          <button
            onClick={() => setIsLogin(!isLogin)}
            style={{ fontSize: '0.875rem', color: '#4f46e5', textDecoration: 'underline', cursor: 'pointer', background: 'none', border: 'none' }}
          >
            {isLogin ? '¿No tienes cuenta? Regístrate aquí' : '¿Ya tienes cuenta? Inicia Sesión'}
          </button>
        </div>
      </div>
    </div>
  );
};
export default Login;