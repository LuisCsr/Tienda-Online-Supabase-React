// src/pages/Checkout.jsx (CÓDIGO FINAL CORREGIDO)
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../supabase/supabaseClient';
import styles from '../styles/layout.module.css';

const Checkout = () => {
  const { cart, loading: cartLoading, refetchCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [processing, setProcessing] = useState(false);
  const [checkoutError, setCheckoutError] = useState(null);

  const subtotal = cart?.items.reduce((acc, item) => acc + item.cantidad * item.productos.precio, 0) || 0;

  if (cartLoading || !cart || cart.items.length === 0) {
    if (!cartLoading && cart?.items.length === 0) navigate('/cart');
    return <div style={{textAlign: 'center', padding: '5rem'}}>Cargando carrito...</div>;
  }

  const handleSimulatePayment = async () => {
    // CRÍTICO: El RLS se resolvió con la política permisiva en Supabase.
    if (!user || processing) return;

    setProcessing(true);
    setCheckoutError(null);

    try {
      // 1. Crear el Pedido (Orders)
      const { data: orderData, error: orderError } = await supabase
        .from('pedidos')
        .insert([{ 
            user_id: user.id, // CRÍTICO: Aseguramos el user.id para cumplir la FK
            total: subtotal, 
            direccion_envio: "Simulada: Calle Falsa 123", // Requisito
            estado: 'pagado'
        }])
        .select('id')
        .single();

      if (orderError) throw orderError;
      const orderId = orderData.id;

      // 2. Mapear Ítems del Carrito a Ítems del Pedido
      const orderItemsToInsert = cart.items.map(item => ({
        pedido_id: orderId,
        producto_id: item.producto_id,
        nombre_producto: item.productos.nombre,
        precio_unitario: item.productos.precio,
        cantidad: item.cantidad,
      }));

      const { error: itemsError } = await supabase
        .from('items_pedido')
        .insert(orderItemsToInsert);

      if (itemsError) throw itemsError;

      // 3. Limpiar el Carrito (Eliminar todos los items_carrito)
      const itemIds = cart.items.map(item => item.id);
      await supabase.from('items_carrito').delete().in('id', itemIds);
        
      // 4. Actualizar el estado del carrito en el frontend
      await refetchCart();
      
      // Éxito: Redirigir al historial de pedidos
      alert("¡Pago simulado exitoso! Tu pedido ha sido confirmado.");
      navigate(`/orders/${orderId}`);

    } catch (err) {
      console.error("Error en checkout:", err);
      // Muestra el error de RLS o de DB en la interfaz
      setCheckoutError("Ocurrió un error al procesar tu pedido. Detalle: " + err.message);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div style={{padding: '1.5rem', maxWidth: '40rem', margin: '3rem auto', backgroundColor: 'white', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', borderRadius: '8px'}}>
      <h2 className={styles.title} style={{color: '#10b981', fontSize: '2rem'}}>Paso Final: Pago Simulado</h2>
      
      {checkoutError && <div style={{backgroundColor: '#fee2e2', color: '#b91c1c', padding: '1rem', borderRadius: '0.5rem', marginBottom: '1rem'}}>{checkoutError}</div>}

      <div style={{padding: '1rem 0', borderBottom: '1px solid #eee', marginBottom: '1.5rem'}}>
          <p style={{fontSize: '1.125rem', color: '#6b7280'}}>Items en el pedido: {cart.items.length}</p>
      </div>

      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
          <h3 style={{fontSize: '1.5rem', fontWeight: '700'}}>Total a Pagar:</h3>
          <span style={{fontSize: '2.5rem', fontWeight: '800', color: '#10b981'}}>$ {subtotal.toFixed(2)}</span>
      </div>

      <button
        onClick={handleSimulatePayment}
        disabled={processing}
        style={{marginTop: '2rem', width: '100%', backgroundColor: '#10b981', color: 'white', padding: '1rem', borderRadius: '8px', fontSize: '1.25rem', fontWeight: 'bold', border: 'none', cursor: 'pointer', opacity: processing ? 0.5 : 1}}
      >
        {processing ? 'Procesando Pago...' : 'Confirmar Pedido (Simulado)'}
      </button>
      
      <p style={{textAlign: 'center', fontSize: '0.875rem', color: '#6b7280', marginTop: '1rem'}}>Nota: Esta acción registrará el pedido en la base de datos.</p>
    </div>
  );
};
export default Checkout;