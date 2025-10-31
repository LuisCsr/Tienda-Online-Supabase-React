// src/pages/ProductDetail.jsx (COMPLETO)
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../supabase/supabaseClient';
import { getPublicUrl } from '../supabase/storageService'; 
import styles from '../styles/layout.module.css'; // Usamos estilos del módulo

const ProductDetail = () => {
  const { id } = useParams(); 
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imageUrl, setImageUrl] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError(null);
      
      // Consultar el producto por ID (RLS debe permitir la lectura si está activo)
      const { data, error: dbError } = await supabase
        .from('productos')
        .select('id, nombre, descripcion, precio, stock, image_path, is_active')
        .eq('id', id)
        .eq('is_active', true) 
        .single(); 

      if (dbError || !data) {
        setError("Producto no encontrado o inactivo.");
      } else {
        setProduct(data);
        if (data.image_path) {
          // Obtener URL pública (asumiendo bucket público)
          setImageUrl(getPublicUrl(data.image_path));
        }
      }
      setLoading(false);
    };

    fetchProduct();
  }, [id]);

  // Manejo de estados de carga y error
  if (loading) return <div style={{textAlign: 'center', padding: '5rem'}}>Cargando detalles...</div>;
  if (error) return <div style={{textAlign: 'center', color: '#ef4444', marginTop: '3rem', padding: '2rem', border: '1px solid #ef4444', backgroundColor: '#fef2f2'}}>{error}</div>;
  if (!product) return <div style={{textAlign: 'center', marginTop: '3rem'}}>Producto no disponible.</div>;

  const isOutOfStock = product.stock <= 0;

  return (
    <div className={styles.mainContent} style={{maxWidth: '900px'}}>
        <div style={{display: 'flex', gap: '3rem', flexWrap: 'wrap', backgroundColor: 'white', padding: '2rem', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)'}}>
            
            {/* Columna Izquierda: Imagen */}
            <div style={{flex: '1 1 300px', height: '400px', backgroundColor: '#f3f4f后来', borderRadius: '8px', overflow: 'hidden'}}>
                {imageUrl ? (
                    <img src={imageUrl} alt={product.nombre} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
                ) : (
                    <div style={{textAlign: 'center', paddingTop: '40%', color: '#6b7280'}}>No Image</div>
                )}
            </div>

            {/* Columna Derecha: Detalles y Compra */}
            <div style={{flex: '1 1 450px'}}>
                <h1 style={{fontSize: '2rem', fontWeight: '800', marginBottom: '0.5rem'}}>{product.nombre}</h1>
                
                {/* CALIFICACIÓN PROMEDIO (REQUISITO) */}
                <p style={{marginBottom: '1rem', color: '#f59e0b', fontWeight: '600'}}>⭐️⭐️⭐️⭐️ (4.5/5 Simulado)</p> 
                
                <p style={{fontSize: '3rem', fontWeight: 'bold', color: '#4f46e5', marginBottom: '1.5rem'}}>$ {product.precio.toFixed(2)}</p>

                <h3 style={{fontSize: '1.125rem', fontWeight: '600', marginBottom: '0.5rem'}}>Descripción:</h3>
                <p style={{marginBottom: '2rem', color: '#374151', lineHeight: '1.6'}}>{product.descripcion}</p>
                
                <p style={{fontWeight: '600', color: isOutOfStock ? '#ef4444' : '#10b981', marginBottom: '1.5rem'}}>
                    {isOutOfStock ? 'AGOTADO' : `En Stock: ${product.stock} unidades`}
                </p>

                <button 
                    disabled={isOutOfStock}
                    style={{padding: '1rem 2rem', backgroundColor: '#4f46e5', color: 'white', borderRadius: '8px', border: 'none', cursor: 'pointer', opacity: isOutOfStock ? 0.5 : 1}}
                    // Aquí iría la lógica de añadir al carrito
                >
                    Añadir al Carrito
                </button>
            </div>
        </div>
    </div>
  );
};

export default ProductDetail;