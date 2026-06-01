// src/supabase/storageService.js (FINAL Y CORREGIDO)
import { supabase } from './supabaseClient';
import { v4 as uuidv4 } from 'uuid';

const BUCKET_NAME = 'product-images';

/**
 * Sube un archivo de imagen (Solo Admin).
 */
export async function uploadProductImage(file) {
    const fileExt = file.name.split('.').pop();
    const fileName = `${uuidv4()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(filePath, file);

    if (error) {
        console.error("Error al subir imagen:", error);
        throw error;
    }
    return filePath; 
}

/**
 * Función que falla: Ya no se usa para el renderizado.
 */
export async function getSignedUrl(filePath) {
    if (!filePath) return null;
    console.warn("getSignedUrl no se usa para renderizar la imagen, se usa getPublicUrl.");
    return null; 
}

/**
 * FUNCIÓN CORREGIDA: Obtiene la URL pública para el renderizado.
 * @param {string} filePath La ruta del archivo en el bucket.
 * @returns {string} La URL pública completa.
 */
export function getPublicUrl(filePath) {
    if (!filePath) return null;
    
    const { data } = supabase.storage
        .from(BUCKET_NAME)
        .getPublicUrl(filePath);

    return data.publicUrl; // El SDK construye la URL perfecta.
}