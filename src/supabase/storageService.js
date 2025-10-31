// src/supabase/storageService.js
import { supabase } from './supabaseClient';
import { v4 as uuidv4 } from 'uuid'; 

const BUCKET_NAME = 'product-images';

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

// FUNCIÓN CORREGIDA FINAL: Obtiene la URL pública estable para el renderizado.
export function getPublicUrl(filePath) {
    if (!filePath) return null;
    
    const { data } = supabase.storage
        .from(BUCKET_NAME)
        .getPublicUrl(filePath);

    return data.publicUrl;
}

// getSignedUrl fue eliminado para simplificar la solución.