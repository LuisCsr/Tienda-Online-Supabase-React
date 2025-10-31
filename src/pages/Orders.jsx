// src/pages/Orders.jsx
import React, { useState, useEffect } from 'react';
import { supabase } from '../supabase/supabaseClient';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';

const Orders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOrders = async () => {
    if (!user) return;

    setLoading(true);
    // RLS: Solo obtendrá los pedidos donde user_id = auth.uid()
    const { data, error } = await supabase
      .from('pedidos')
      .select('id, total, estado, created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      setError("Error al cargar pedidos: " + error.message);
    } else {
      setOrders(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();
  }, [user]);

  if (loading) return <div className="text-center text-lg mt-10">Cargando historial de pedidos...</div>;
  if (!user) return <div className="text-center p-10 mt-10">Debes iniciar sesión para ver tus pedidos.</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Historial de Pedidos</h2>
      
      {orders.length === 0 ? (
        <div className="text-center p-10 bg-gray-50 rounded-lg">
          <p className="text-lg text-gray-500">Aún no has realizado ningún pedido.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map(order => (
            <Link to={`/orders/${order.id}`} key={order.id} className="block p-4 bg-white shadow-md rounded-lg flex justify-between items-center hover:bg-gray-100 transition">
              <div>
                <p className="font-bold text-lg">Pedido #{order.id}</p>
                <p className="text-sm text-gray-500">Fecha: {new Date(order.created_at).toLocaleDateString()}</p>
              </div>
              <div className="text-right">
                <span className="font-extrabold text-xl text-indigo-600">$ {order.total.toFixed(2)}</span>
                <p className={`text-sm font-semibold ${order.estado === 'pagado' ? 'text-green-500' : 'text-yellow-500'}`}>
                  {order.estado.toUpperCase()}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};
export default Orders;