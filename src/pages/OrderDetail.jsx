// src/pages/OrderDetail.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../supabase/supabaseClient';

const OrderDetail = () => {
  const { orderId } = useParams(); // Obtiene el ID de la URL
  const [order, setOrder] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrderDetail = async () => {
      setLoading(true);
      
      // 1. Obtener el pedido (RLS: Solo si pertenece al usuario o es admin)
      const { data: orderData, error: orderError } = await supabase
        .from('pedidos')
        .select('*')
        .eq('id', orderId)
        .single();
      
      if (orderError) {
        setError("Error al cargar el detalle del pedido. Asegúrate de que este pedido te pertenece.");
        setLoading(false);
        return;
      }
      setOrder(orderData);

      // 2. Obtener los ítems del pedido (RLS: Solo si el pedido pertenece al usuario o es admin)
      const { data: itemsData, error: itemsError } = await supabase
        .from('items_pedido')
        .select('*')
        .eq('pedido_id', orderId);

      if (itemsError) {
        setError("Error al cargar los ítems del pedido.");
      } else {
        setItems(itemsData);
      }
      setLoading(false);
    };

    fetchOrderDetail();
  }, [orderId]);

  if (loading) return <div className="text-center text-lg mt-10">Cargando detalle del pedido...</div>;
  if (error) return <div className="bg-red-100 text-red-700 p-4 rounded text-center mt-10 max-w-md mx-auto">Error: {error}</div>;
  if (!order) return <div className="text-center p-10 mt-10">Pedido no encontrado.</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white shadow-xl rounded-lg">
      <h2 className="text-3xl font-bold mb-4 text-indigo-700">Detalle del Pedido #{order.id}</h2>
      
      <div className="grid grid-cols-2 gap-4 border-b pb-4 mb-4">
        <div>
          <p className="text-gray-500">Fecha del Pedido:</p>
          <p className="font-semibold">{new Date(order.created_at).toLocaleString()}</p>
        </div>
        <div>
          <p className="text-gray-500">Estado:</p>
          <p className={`font-bold ${order.estado === 'pagado' ? 'text-green-600' : 'text-yellow-600'}`}>{order.estado.toUpperCase()}</p>
        </div>
        <div>
          <p className="text-gray-500">Total:</p>
          <p className="font-bold text-xl text-indigo-600">$ {order.total.toFixed(2)}</p>
        </div>
        <div>
          <p className="text-gray-500">Dirección de Envío:</p>
          <p className="text-sm">{order.direccion_envio}</p>
        </div>
      </div>
      
      <h3 className="text-xl font-semibold mb-3">Productos Comprados:</h3>
      <div className="space-y-3">
        {items.map(item => (
          <div key={item.id} className="flex justify-between p-3 border rounded-md bg-gray-50">
            <span className="font-medium">{item.nombre_producto}</span>
            <span className="text-sm text-gray-600">{item.cantidad} x ${item.precio_unitario.toFixed(2)}</span>
            <span className="font-bold">${(item.cantidad * item.precio_unitario).toFixed(2)}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
export default OrderDetail;