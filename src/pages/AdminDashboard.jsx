// src/pages/AdminDashboard.jsx (CÓDIGO FINAL COMPLETO Y CORREGIDO)
import React, { useState, useEffect } from 'react';
import { supabase } from '../supabase/supabaseClient';
import { uploadProductImage } from '../supabase/storageService'; // Importar servicio de Storage
import styles from '../styles/layout.module.css'; // Estilos CSS Modules

// ID de la categoría de prueba (asumimos que la tabla soporta NULLS ahora)
const DEFAULT_CATEGORY_ID = 1; 

const AdminDashboard = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Estados para la Bonificación de Imagen y Datos del Producto
  const [imageFile, setImageFile] = useState(null); 
  const [newProduct, setNewProduct] = useState({ 
    nombre: '', 
    precio: 0, 
    stock: 0, 
    is_active: true, 
    descripcion: '',
    image_path: null, 
  });

  // Función para obtener productos (solo si es admin)
  const fetchProducts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('productos')
      .select('*')
      .order('id', { ascending: true });

    if (error) {
      setError("Error al cargar productos (Verifique RLS): " + error.message);
      setProducts([]);
    } else {
      setProducts(data);
      setError(null);
    }
    setLoading(false);
  };

  // Función para crear un producto (Incluye validación y subida de imagen)
  const createProduct = async (e) => {
    e.preventDefault();
    setError(null);
    
    // --- 1. VALIDACIÓN DEL LADO DEL CLIENTE (REQUISITO DE SEGURIDAD) ---
    if (newProduct.nombre.trim() === '' || newProduct.nombre.length < 3) {
      setError("El nombre debe tener al menos 3 caracteres.");
      return;
    }
    if (newProduct.precio <= 0) {
      setError("El precio debe ser un número positivo.");
      return;
    }
    if (!Number.isInteger(newProduct.stock) || newProduct.stock < 0) {
        setError("El stock debe ser un número entero no negativo.");
        return;
    }

    let imagePath = null;
    
    // --- 2. SUBIDA DE IMAGEN (Bonificación) ---
    if (imageFile) {
      try {
        imagePath = await uploadProductImage(imageFile); 
      } catch (storageError) {
        setError("Fallo al subir la imagen. Revise la política de Storage.");
        return; 
      }
    }

    // 3. PREPARAR DATOS PARA LA INSERCIÓN DB
    const productData = {
      ...newProduct,
      categoria_id: DEFAULT_CATEGORY_ID, 
      image_path: imagePath, // Ruta de la imagen o null
    };

    // 4. INSERTAR EL PRODUCTO
    const { error: dbError } = await supabase
      .from('productos')
      .insert([productData]); 

    if (dbError) {
      setError("Error al crear producto: " + dbError.message);
    } else {
      // Limpiar estados
      setNewProduct({ nombre: '', precio: 0, stock: 0, is_active: true, descripcion: '', image_path: null });
      setImageFile(null);
      fetchProducts();
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  if (loading) return <div style={{textAlign: 'center', fontSize: '1.125rem', marginTop: '2.5rem'}}>Cargando Panel de Administración...</div>;

  return (
    <div style={{padding: '1.5rem'}}>
      <h2 className={styles.title} style={{color: '#4f46e5'}}>Panel de Administración de Productos</h2>
      
      {error && <div style={{backgroundColor: '#fee2e2', color: '#b91c1c', padding: '0.75rem', borderRadius: '0.5rem', marginBottom: '1rem'}}>{error}</div>}

      {/* Formulario de Creación Rápida */}
      <div style={{marginBottom: '2rem', padding: '1.5rem', backgroundColor: 'white', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', borderRadius: '0.5rem', border: '1px solid #e5e7eb'}}>
        <h3 style={{fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem'}}>Crear Nuevo Producto</h3>
        <form onSubmit={createProduct} style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
          
          {/* Campo de Imagen */}
          <div>
             <label style={{display: 'block', marginBottom: '0.25rem', fontWeight: '500'}}>Imagen del Producto (Max 5MB)</label>
             <input
                type="file"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files[0])}
                style={{padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '0.25rem', width: '100%'}}
             />
          </div>

          {/* Nombre y Descripción */}
          <input
            type="text"
            placeholder="Nombre del Producto"
            value={newProduct.nombre}
            onChange={(e) => setNewProduct({ ...newProduct, nombre: e.target.value })}
            style={{padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '0.25rem', width: '100%'}}
            required
          />
          <textarea
            placeholder="Descripción (Opcional)"
            value={newProduct.descripcion}
            onChange={(e) => setNewProduct({ ...newProduct, descripcion: e.target.value })}
            style={{padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '0.25rem', width: '100%', height: '5rem'}}
          />
          
          {/* Precio, Stock, Activo */}
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem'}}>
            <input
              type="number"
              placeholder="Precio"
              value={newProduct.precio}
              onChange={(e) => setNewProduct({ ...newProduct, precio: parseFloat(e.target.value) || 0 })}
              style={{padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '0.25rem'}}
              required
            />
            <input
              type="number"
              placeholder="Stock"
              value={newProduct.stock}
              onChange={(e) => setNewProduct({ ...newProduct, stock: parseInt(e.target.value) || 0 })}
              style={{padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '0.25rem'}}
              required
            />
            <label style={{display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '0.25rem', backgroundColor: '#f9fafb'}}>
              <input
                type="checkbox"
                checked={newProduct.is_active}
                onChange={(e) => setNewProduct({ ...newProduct, is_active: e.target.checked })}
              />
              <span>Producto Activo</span>
            </label>
          </div>
          <button type="submit" style={{width: '100%', backgroundColor: '#4f46e5', color: 'white', padding: '0.75rem', borderRadius: '0.25rem', fontWeight: '600', border: 'none', cursor: 'pointer'}}>
            Guardar Nuevo Producto
          </button>
        </form>
      </div>

      {/* Listado y Edición */}
      <h3 style={{fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem'}}>Productos Existentes ({products.length})</h3>
      <div style={{display: 'flex', flexDirection: 'column', gap: '0.75rem'}}>
        {products.map((product) => (
          <ProductRow key={product.id} product={product} fetchProducts={fetchProducts} />
        ))}
      </div>
    </div>
  );
};

// Componente de Fila para Edición (ProductRow) - Se asume que este componente está definido
const ProductRow = ({ product, fetchProducts }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedProduct, setEditedProduct] = useState(product);
    const [rowError, setRowError] = useState(null);

    const updateProduct = async () => {
      setRowError(null);
      const { error } = await supabase
        .from('productos')
        .update({
          nombre: editedProduct.nombre,
          descripcion: editedProduct.descripcion,
          precio: editedProduct.precio,
          stock: editedProduct.stock,
          is_active: editedProduct.is_active,
        })
        .eq('id', editedProduct.id);

      if (error) {
        setRowError("Error al actualizar: " + error.message);
      } else {
        setIsEditing(false);
        fetchProducts();
      }
    };

    const toggleActive = async () => {
      setRowError(null);
      const { error } = await supabase
        .from('productos')
        .update({ is_active: !product.is_active })
        .eq('id', product.id);

      if (error) {
        setRowError("Error al cambiar estado: " + error.message);
      } else {
        fetchProducts();
      }
    };

    return (
      <div style={{padding: '1rem', border: '1px solid #e5e7eb', backgroundColor: 'white', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)', borderRadius: '0.5rem'}}>
        {rowError && <p style={{color: '#ef4444', fontSize: '0.75rem', marginBottom: '0.5rem'}}>{rowError}</p>}
        
        {isEditing ? (
          <div style={{display: 'flex', flexDirection: 'column', gap: '0.5rem'}}>
            <input value={editedProduct.nombre} onChange={e => setEditedProduct({...editedProduct, nombre: e.target.value})} style={{padding: '0.25rem', border: '1px solid #d1d5db', borderRadius: '0.25rem'}} />
            <textarea value={editedProduct.descripcion} onChange={e => setEditedProduct({...editedProduct, descripcion: e.target.value})} style={{padding: '0.25rem', border: '1px solid #d1d5db', borderRadius: '0.25rem', height: '4rem'}} />
            <div style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem'}}>
              <input type="number" value={editedProduct.precio} onChange={e => setEditedProduct({...editedProduct, precio: parseFloat(e.target.value)})} style={{padding: '0.25rem', border: '1px solid #d1d5db', borderRadius: '0.25rem'}} />
              <input type="number" value={editedProduct.stock} onChange={e => setEditedProduct({...editedProduct, stock: parseInt(e.target.value)})} style={{padding: '0.25rem', border: '1px solid #d1d5db', borderRadius: '0.25rem'}} />
              <label style={{display: 'flex', alignItems: 'center', gap: '0.25rem'}}>
                <input type="checkbox" checked={editedProduct.is_active} onChange={e => setEditedProduct({...editedProduct, is_active: e.target.checked})} />
                <span>Activo</span>
              </label>
            </div>
            <div style={{display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '0.75rem'}}>
              <button onClick={updateProduct} style={{backgroundColor: '#3b82f6', color: 'white', padding: '0.5rem', borderRadius: '0.25rem', fontSize: '0.875rem', border: 'none', cursor: 'pointer'}}>Guardar Cambios</button>
              <button onClick={() => setIsEditing(false)} style={{backgroundColor: '#6b7280', color: 'white', padding: '0.5rem', borderRadius: '0.25rem', fontSize: '0.875rem', border: 'none', cursor: 'pointer'}}>Cancelar</button>
            </div>
          </div>
        ) : (
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start'}}>
            <div>
              <p style={{fontWeight: '700', fontSize: '1.125rem'}}>{product.nombre} (ID: {product.id})</p>
              <p style={{color: '#4b5563', fontSize: '0.875rem'}}>{product.descripcion}</p>
              <p style={{marginTop: '0.25rem', fontWeight: '600', color: '#4f46e5'}}>$ {product.precio.toFixed(2)}</p>
            </div>
            <div style={{textAlign: 'right'}}>
              <p style={{fontWeight: '600', color: product.is_active ? '#10b981' : '#ef4444'}}>
                {product.is_active ? 'ACTIVO' : 'INACTIVO'}
              </p>
              <p style={{fontSize: '0.875rem', color: '#6b7280'}}>Stock: {product.stock}</p>
              <div style={{display: 'flex', gap: '0.5rem', marginTop: '0.5rem', justifyContent: 'flex-end'}}>
                <button onClick={() => setIsEditing(true)} style={{backgroundColor: '#f59e0b', color: 'white', padding: '0.25rem 0.5rem', borderRadius: '0.25rem', fontSize: '0.75rem', border: 'none', cursor: 'pointer'}}>Editar</button>
                <button onClick={toggleActive} style={{padding: '0.25rem 0.5rem', borderRadius: '0.25rem', fontSize: '0.75rem', border: 'none', cursor: 'pointer', backgroundColor: product.is_active ? '#ef4444' : '#10b981', color: 'white'}}>
                  {product.is_active ? 'Desactivar' : 'Activar'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };
  
export default AdminDashboard;