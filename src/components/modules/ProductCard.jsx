// src/components/modules/ProductCard.jsx (CÓDIGO FINAL Y COMPLETO)
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import { getPublicUrl } from '../../supabase/storageService'; 

// --- CRÍTICO: URL ESTÁTICA DEL BUCKET (USANDO TU URL) ---
const BASE_STORAGE_URL_STATIC = 'https://hwewfpjnybtscfnmzbod.supabase.co/storage/v1/object/public/product-images'; 
// ----------------------------------------

const ProductCard = ({ product }) => {
  // OBTENER ESTADO DE CARGA DE AMBOS CONTEXTOS
  const { addItem, loading: cartLoading } = useCart(); 
  const { isAuthenticated, loading: authLoading } = useAuth();
  
  const [adding, setAdding] = useState(false); 
  
  // Asignación de variables
  const productName = product.nombre || 'Producto';
  const productDescription = product.descripcion || '';
  const productPrice = product.precio !== undefined ? product.precio : 0;
  
  // La URL se construye usando la función estable del SDK.
  const imageUrl = product.image_path 
    ? getPublicUrl(product.image_path)
    : null;

  // Lógica de Añadir al Carrito
  const handleAddToCart = async () => {
    // La verificación de 'isAuthenticated' ya ocurre dentro del CartContext
    
    // Si la autenticación o el carrito están cargando, el botón está deshabilitado.
    // Esto previene el error "carrito no cargado"
    if (authLoading || cartLoading) {
        alert("La sesión aún se está cargando. Inténtalo de nuevo en un momento.");
        return;
    }
    
    if (product.stock <= 0) {
        alert("Producto agotado.");
        return;
    }

    setAdding(true);
    const { error } = await addItem(product.id, 1); 
    setAdding(false);

    if (error) {
        alert("Error al añadir: " + error.message);
    } else {
        alert(`${productName} añadido al carrito.`);
    }
  };

  // CÁLCULOS FINALES
  const isOutOfStock = product.stock <= 0;
  
  // CRÍTICO: El botón se deshabilita si Auth O Cart están cargando
  const isLoading = authLoading || cartLoading; 
  const isButtonDisabled = adding || isOutOfStock || isLoading;

  return (
    <div style={{
        border: '1px solid #e5e7eb',
        borderRadius: '0.5rem',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        padding: '1.5rem',
        display: 'flex',
        flexDirection: 'column',
        transition: 'box-shadow 0.3s',
        backgroundColor: 'white',
        minHeight: '280px', 
        cursor: isButtonDisabled ? 'not-allowed' : 'pointer',
      }}>
      
      {/* Contenedor de Imagen con Estilo Final */}
      <div style={{
        height: '180px', 
        backgroundColor: '#f3f4f6', 
        marginBottom: '1rem', 
        borderRadius: '0.25rem', 
        overflow: 'hidden', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center'
      }}>
        {imageUrl ? (
          <img 
            src={imageUrl} 
            alt={productName} 
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }} 
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.parentElement.innerHTML = '<span style="color: #6b7280; font-size: 0.9rem">No Image</span>';
            }}
          />
        ) : (
          <span style={{color: '#6b7280', fontSize: '0.9rem'}}>No Image</span>
        )}
      </div>
      
      {/* Nombre del producto (Enlace a la página de detalle) */}
      <Link to={`/products/${product.id}`} style={{textDecoration: 'none', color: '#1f2937'}}>
          <h3 style={{ 
            fontSize: '1.25rem', 
            fontWeight: '700', 
            marginBottom: '0.5rem' 
          }}>
            {productName}
          </h3>
      </Link>
      
      {/* Descripción */}
      <p style={{ 
        fontSize: '0.9rem', 
        color: '#6b7280', 
        flexGrow: 1, 
        marginBottom: '1rem' 
      }}>
        {productDescription}
      </p>
      
      {/* Precio y stock */}
      <div style={{
        marginTop: 'auto', 
        borderTop: '1px solid #eee', 
        paddingTop: '1rem'
      }}>
        <span style={{ 
          fontSize: '1.8rem', 
          fontWeight: '700', 
          color: '#4f46e5'
        }}>
          $ {productPrice.toFixed(2)}
        </span>
        <p style={{ 
          fontSize: '0.8rem', 
          marginTop: '0.25rem', 
          fontWeight: '500', 
          color: isOutOfStock ? '#ef4444' : '#10b981'
        }}>
          {isOutOfStock ? 'AGOTADO' : `Stock: ${product.stock}`}
        </p>
      </div>
      
      {/* Botón */}
      <button
        onClick={handleAddToCart}
        disabled={isButtonDisabled}
        style={{
          marginTop: '1rem',
          width: '100%',
          backgroundColor: '#4f46e5',
          color: 'white',
          padding: '0.75rem',
          borderRadius: '0.5rem',
          border: 'none',
          fontSize: '1rem',
          fontWeight: '600',
          opacity: isButtonDisabled ? 0.5 : 1,
          cursor: isButtonDisabled ? 'not-allowed' : 'pointer'
        }}
      >
        {isLoading ? 'Cargando Sesión...' : (adding ? 'Añadiendo...' : 'Añadir al Carrito')}
      </button>
    </div>
  );
};

export default ProductCard;