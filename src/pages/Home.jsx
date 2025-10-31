// src/pages/Home.jsx (CÓDIGO FINAL Y ESTABLE)
import React, { useState, useEffect } from 'react';
import { supabase } from '../supabase/supabaseClient';
import ProductCard from '../components/modules/ProductCard'; 
import styles from '../styles/layout.module.css';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // CORRECCIÓN: Declaración correcta de estados para búsqueda y filtro
  const [searchTerm, setSearchTerm] = useState(''); 
  const [selectedCategory, setSelectedCategory] = useState(null); 
  const [categories, setCategories] = useState([]); // Estado para almacenar las categorías

  const fetchCategories = async () => {
    const { data } = await supabase.from('categorias').select('id, nombre');
    if (data) setCategories(data);
  };

  const fetchProducts = async () => {
    setLoading(true);
    
    let query = supabase.from('productos').select('id, nombre, precio, descripcion, stock, is_active, image_path');

    // APLICAR FILTRO DE BÚSQUEDA Y CATEGORÍA
    if (searchTerm) {
        query = query.ilike('nombre', `%${searchTerm}%`); 
    }
    if (selectedCategory) {
        query = query.eq('categoria_id', selectedCategory);
    }
    
    // APLICAR RLS y RENDIMIENTO
    const { data, error: dbError } = await query
      .eq('is_active', true)
      .order('nombre', { ascending: true })
      .limit(12); // Paginación simulada

    if (dbError) {
      console.error("Error en la carga de productos:", dbError.message);
      setError("Error al cargar el catálogo: " + dbError.message);
      setProducts([]);
    } else {
      setProducts(data);
      setError(null);
    }
    setLoading(false);
  };

  // 1. CARGAR PRODUCTOS AL CAMBIAR FILTROS
  useEffect(() => {
    fetchProducts();
  }, [searchTerm, selectedCategory]); 

  // 2. CARGAR CATEGORÍAS UNA SOLA VEZ AL INICIO
  useEffect(() => {
    fetchCategories();
  }, []); 

  if (loading) return <div style={{textAlign: 'center', fontSize: '1.125rem', padding: '5rem'}}>Cargando catálogo...</div>;
  if (error) return <div style={{backgroundColor: '#fee2e2', color: '#b91c1c', padding: '1rem', borderRadius: '0.5rem', textAlign: 'center', margin: '2rem auto', maxWidth: '80%'}}>Error: {error}</div>;

  return (
    <div style={{padding: '1.5rem'}}>
      <h2 className={styles.title} style={{color: 'var(--color-primary)'}}>Nuestros Productos</h2>

      {/* --- INTERFAZ DE BÚSQUEDA Y FILTRO --- */}
      <div style={{display: 'flex', gap: '1rem', marginBottom: '2rem', alignItems: 'center', justifyContent: 'center'}}>
        <input
          type="text"
          placeholder="Buscar por nombre..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{padding: '0.75rem', border: '1px solid #ccc', borderRadius: '0.5rem', flexGrow: 1, maxWidth: '400px'}}
        />

        <select
          value={selectedCategory || ''}
          onChange={(e) => setSelectedCategory(e.target.value ? parseInt(e.target.value) : null)}
          style={{padding: '0.75rem', border: '1px solid #ccc', borderRadius: '0.5rem', minWidth: '150px'}}
        >
          <option value="">Todas las Categorías</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.nombre}
            </option>
          ))}
        </select>
      </div>
      {/* --- FIN DE INTERFAZ DE BÚSQUEDA Y FILTRO --- */}
      
      {/* --- CONTENEDOR DE PRODUCTOS (GRID) --- */}
      <div style={{
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
          gap: '2rem',
          padding: '0 1rem' 
      }}>
        {products.map(product => (
          <ProductCard key={product.id} product={product} /> 
        ))}
        {products.length === 0 && <p style={{gridColumn: '1 / -1', textAlign: 'center', color: '#6b7280'}}>No se encontraron productos activos.</p>}
      </div>
    </div>
  );
};
export default Home;