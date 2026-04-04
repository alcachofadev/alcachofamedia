// api/posts.js - API para Vercel
const fs = require('fs');
const path = require('path');

// ¡CAMBIALA! - Usa una contraseña segura
const ADMIN_PASSWORD = 'alcachofa_admin_2026';

export default async function handler(req, res) {
  // Configurar CORS para permitir peticiones desde tu dominio
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // Manejar preflight CORS
  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }
  
  // Ruta al archivo posts.json
  const postsPath = path.join(process.cwd(), 'posts.json');
  
  // GET: Obtener todos los posts
  if (req.method === 'GET') {
    try {
      const data = fs.readFileSync(postsPath, 'utf8');
      const posts = JSON.parse(data);
      return res.status(200).json(posts);
    } catch (error) {
      console.error('Error GET:', error);
      return res.status(500).json({ error: 'Error al leer posts' });
    }
  }
  
  // POST: Guardar posts (requiere autenticación)
  if (req.method === 'POST') {
    try {
      const { password, posts } = req.body;
      
      // Verificar contraseña
      if (password !== ADMIN_PASSWORD) {
        return res.status(401).json({ error: 'Contraseña incorrecta' });
      }
      
      if (!posts) {
        return res.status(400).json({ error: 'No se recibieron posts' });
      }
      
      // Guardar en el archivo
      fs.writeFileSync(postsPath, JSON.stringify(posts, null, 2), 'utf8');
      
      return res.status(200).json({ 
        success: true, 
        message: 'Posts guardados correctamente' 
      });
    } catch (error) {
      console.error('Error POST:', error);
      return res.status(500).json({ error: 'Error al guardar posts' });
    }
  }
  
  // Método no permitido
  return res.status(405).json({ error: 'Método no permitido' });
}