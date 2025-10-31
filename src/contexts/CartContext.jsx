// src/contexts/CartContext.jsx
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '../supabase/supabaseClient';
import { useAuth } from './AuthContext'; // Para obtener el usuario

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [cart, setCart] = useState(null); // Contendrá { id: cart_id, items: [] }
  const [loading, setLoading] = useState(true);

  // ----------------------------------------------------
  // 1. OBTENER / CREAR CARRITO
  // ----------------------------------------------------
  const fetchOrCreateCart = useCallback(async (userId) => {
    if (!userId) {
      setCart(null);
      setLoading(false);
      return;
    }

    // Intenta obtener el carrito existente del usuario
    let { data: cartData, error } = await supabase
      .from('carritos')
      .select('id')
      .eq('user_id', userId)
      .single();

    if (error && error.code === 'PGRST116') { // No se encontró el carrito
      // Si no existe, créalo
      const { data: newCart, error: insertError } = await supabase
        .from('carritos')
        .insert([{ user_id: userId }])
        .select('id')
        .single();
      
      if (insertError) {
        console.error("Error al crear carrito:", insertError.message);
        return null;
      }
      cartData = newCart;
    } else if (error) {
      console.error("Error al obtener carrito:", error.message);
      return null;
    }

    // Obtener los ítems del carrito
    const { data: items, error: itemsError } = await supabase
      .from('items_carrito')
      .select('*, productos(id, nombre, precio, stock)')
      .eq('carrito_id', cartData.id);

    if (itemsError) {
      console.error("Error al obtener ítems:", itemsError.message);
      return null;
    }
    
    setCart({ id: cartData.id, items: items || [] });
    setLoading(false);
    return { id: cartData.id, items: items || [] };
  }, []);

  useEffect(() => {
    setLoading(true);
    fetchOrCreateCart(user?.id);
  }, [user, fetchOrCreateCart]);


  // ----------------------------------------------------
  // 2. OPERACIONES DEL CARRITO (ADD, UPDATE, REMOVE)
  // ----------------------------------------------------
  
  const addItem = async (productId, quantity = 1) => {
    if (!isAuthenticated || !cart?.id) return { error: { message: "Usuario no autenticado o carrito no cargado." } };

    const existingItem = cart.items.find(item => item.producto_id === productId);

    let dbResponse;
    if (existingItem) {
      // Si el ítem existe, actualiza la cantidad
      const newQuantity = existingItem.cantidad + quantity;
      dbResponse = await supabase
        .from('items_carrito')
        .update({ cantidad: newQuantity })
        .eq('id', existingItem.id)
        .select('*, productos(id, nombre, precio, stock)')
        .single();
    } else {
      // Si el ítem no existe, insértalo
      dbResponse = await supabase
        .from('items_carrito')
        .insert([{ carrito_id: cart.id, producto_id: productId, cantidad: quantity }])
        .select('*, productos(id, nombre, precio, stock)')
        .single();
    }

    if (dbResponse.error) {
      console.error("Error al añadir/actualizar ítem:", dbResponse.error.message);
      return { error: dbResponse.error };
    }

    // Vuelve a cargar el carrito para tener el estado actualizado
    await fetchOrCreateCart(user.id);
    return { error: null };
  };

  const removeItem = async (itemId) => {
    if (!isAuthenticated || !cart?.id) return { error: { message: "Usuario no autenticado o carrito no cargado." } };

    const { error } = await supabase
      .from('items_carrito')
      .delete()
      .eq('id', itemId); // RLS protege que solo borre ítems de SU carrito

    if (error) {
      console.error("Error al eliminar ítem:", error.message);
      return { error };
    }

    // Vuelve a cargar el carrito para tener el estado actualizado
    await fetchOrCreateCart(user.id);
    return { error: null };
  };

  const cartValue = {
    cart,
    loading,
    addItem,
    removeItem,
    // totalItems: cart?.items.reduce((acc, item) => acc + item.cantidad, 0) || 0,
    // subtotal: cart?.items.reduce((acc, item) => acc + item.cantidad * item.productos.precio, 0) || 0,
    refetchCart: () => fetchOrCreateCart(user?.id), // Utilidad para recargar
  };

  return (
    <CartContext.Provider value={cartValue}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);