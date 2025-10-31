// src/pages/Profile.jsx (CÓDIGO FINAL CON FORMULARIO DE EDICIÓN)
import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../supabase/supabaseClient';

const Profile = () => {
  const { user, getRole } = useAuth();
  const [profileData, setProfileData] = useState({ nombre: '', telefono: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  
  const userRole = getRole();

  const fetchProfile = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setError(null);

    // RLS: La política "Usuarios pueden ver/editar su propio perfil" permite esta consulta
    const { data, error } = await supabase
      .from('perfiles')
      .select('nombre, telefono')
      .eq('id', user.id)
      .single();

    if (error) {
      setError("Error al cargar perfil: " + error.message);
    } else if (data) {
      setProfileData({ 
        nombre: data.nombre || '', 
        telefono: data.telefono || '' 
      });
    }
    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSuccess(null);
    setError(null);

    // Validación básica del lado del cliente
    if (profileData.nombre.length < 3) {
        setError("El nombre debe tener al menos 3 caracteres.");
        return;
    }

    // RLS: La política permite a los usuarios actualizar su propia fila
    const { error: updateError } = await supabase
      .from('perfiles')
      .update(profileData)
      .eq('id', user.id);

    if (updateError) {
      setError("Error al actualizar: " + updateError.message);
    } else {
      setSuccess("Perfil actualizado con éxito.");
    }
  };

  if (loading) return <div style={{textAlign: 'center', padding: '5rem'}}>Cargando perfil...</div>;

  return (
    <div style={{maxWidth: '40rem', margin: '3rem auto', padding: '2rem', backgroundColor: 'white', borderRadius: '10px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)'}}>
      <h2 style={{fontSize: '2rem', fontWeight: 'bold', marginBottom: '1.5rem', color: '#4f46e5'}}>Mi Perfil</h2>
      
      {success && <div style={{backgroundColor: '#dcfce7', color: '#059669', padding: '0.75rem', borderRadius: '0.5rem', marginBottom: '1rem', fontWeight: '500'}}>{success}</div>}
      {error && <div style={{backgroundColor: '#fee2e2', color: '#b91c1c', padding: '0.75rem', borderRadius: '0.5rem', marginBottom: '1rem', fontWeight: '500'}}>{error}</div>}

      <div style={{marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid #eee'}}>
        <p style={{color: '#6b7280', fontSize: '0.9rem'}}>Correo Electrónico:</p>
        <p style={{fontSize: '1.1rem', fontWeight: '500'}}>{user?.email}</p>
        <p style={{color: '#6b7280', fontSize: '0.9rem', marginTop: '0.5rem'}}>Rol:</p>
        <p style={{fontSize: '1.1rem', fontWeight: '700', color: userRole === 'admin' ? '#ef4444' : '#10b981'}}>{userRole.toUpperCase()}</p>
      </div>

      {/* FORMULARIO DE EDICIÓN */}
      <form onSubmit={handleUpdate} style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
        <h3 style={{fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem'}}>Actualizar Datos</h3>
        
        <div>
          <label htmlFor="nombre" style={{display: 'block', marginBottom: '0.25rem', fontWeight: '500'}}>Nombre Completo</label>
          <input
            id="nombre"
            type="text"
            value={profileData.nombre}
            onChange={(e) => setProfileData({...profileData, nombre: e.target.value})}
            style={{width: '100%', padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '0.25rem'}}
            required
          />
        </div>
        
        <div>
          <label htmlFor="telefono" style={{display: 'block', marginBottom: '0.25rem', fontWeight: '500'}}>Teléfono</label>
          <input
            id="telefono"
            type="tel"
            value={profileData.telefono}
            onChange={(e) => setProfileData({...profileData, telefono: e.target.value})}
            style={{width: '100%', padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '0.25rem'}}
          />
        </div>

        {/* NOTA: El campo de 'Direcciones de envío' requeriría una tabla separada y más lógica */}
        <p style={{fontSize: '0.8rem', color: '#6b7280'}}>Las direcciones de envío se manejarían en una sección separada.</p>

        <button type="submit" style={{padding: '0.75rem', backgroundColor: '#4f46e5', color: 'white', borderRadius: '0.5rem', border: 'none', cursor: 'pointer', fontWeight: '600', marginTop: '1rem'}}>
          Guardar Cambios
        </button>
      </form>
    </div>
  );
};

export default Profile;