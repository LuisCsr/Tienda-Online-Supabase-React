// src/pages/Cart.jsx
import React from 'react';
import { useCart } from '../contexts/CartContext';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/layout.module.css'; // Importación

const Cart = () => {
  const { cart, loading, removeItem } = useCart();
  const navigate = useNavigate();

  if (loading) return <div style={{textAlign: 'center', fontSize: '1.125rem', marginTop: '2.5rem'}}>Cargando carrito...</div>;

  const totalItems = cart?.items.reduce((acc, item) => acc + item.cantidad, 0) || 0;
  const subtotal = cart?.items.reduce((acc, item) => acc + item.cantidad * item.productos.precio, 0) || 0;

  if (totalItems === 0) {
    return (
      <div style={{textAlign: 'center', padding: '2.5rem', backgroundColor: 'white', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', borderRadius: '0.5rem'}}>
        <h2 style={{fontSize: '1.875rem', fontWeight: '700', marginBottom: '1rem'}}>Tu carrito está vacío 😔</h2>
        <p style={{color: '#4b5563'}}>Parece que aún no has agregado productos.</p>
        <button onClick={() => navigate('/')} style={{marginTop: '1.5rem', backgroundColor: '#4f46e5', color: 'white', padding: '0.5rem 1rem', borderRadius: '0.5rem', border: 'none', cursor: 'pointer'}}>
          Explorar Tienda
        </button>
      </div>
    );
  }

  return (
    <div style={{padding: '1.5rem', maxWidth: '64rem', margin: '0 auto'}}>
      <h2 className={styles.title}>Mi Carrito de Compras ({totalItems} items)</h2>
      
      <div style={{backgroundColor: 'white', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', borderRadius: '0.5rem', overflow: 'hidden'}}>
        {cart.items.map(item => (
          <CartItemRow key={item.id} item={item} removeItem={removeItem} />
        ))}
      </div>

      <div style={{marginTop: '1.5rem', padding: '1.5rem', backgroundColor: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '0.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
        <h3 style={{fontSize: '1.5rem', fontWeight: '700'}}>Subtotal:</h3>
        <span style={{fontSize: '2.25rem', fontWeight: '800', color: '#4f46e5'}}>$ {subtotal.toFixed(2)}</span>
      </div>
      
      <button 
        onClick={() => navigate('/checkout')} 
        style={{marginTop: '1.5rem', width: '100%', backgroundColor: '#10b981', color: 'white', padding: '0.75rem', borderRadius: '0.5rem', fontSize: '1.125rem', fontWeight: '600', border: 'none', cursor: 'pointer'}}
      >
        Proceder al Pago Simulado
      </button>
    </div>
  );
};

const CartItemRow = ({ item, removeItem }) => {
  const handleRemove = async () => {
    if (window.confirm(`¿Estás seguro de que quieres eliminar ${item.productos.nombre} del carrito?`)) {
      await removeItem(item.id);
    }
  };

  return (
    <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', borderBottom: '1px solid #e5e7eb'}}>
      <div style={{display: 'flex', alignItems: 'center', gap: '1rem'}}>
        <div style={{width: '4rem', height: '4rem', backgroundColor: '#e5e7eb', borderRadius: '0.375rem', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <span style={{color: '#6b7280'}}>📦</span>
        </div>
        <div>
          <h4 style={{fontWeight: '600'}}>{item.productos.nombre}</h4>
          <p style={{color: '#6b7280', fontSize: '0.875rem'}}>Cantidad: {item.cantidad}</p>
        </div>
      </div>
      <div style={{display: 'flex', alignItems: 'center', gap: '1.5rem'}}>
        <span style={{fontWeight: '700', fontSize: '1.125rem', color: '#4f46e5'}}>$ {(item.cantidad * item.productos.precio).toFixed(2)}</span>
        <button 
          onClick={handleRemove} 
          style={{color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer'}}
          aria-label={`Eliminar ${item.productos.nombre}`}
        >
          🗑️
        </button>
      </div>
    </div>
  );
};

export default Cart;