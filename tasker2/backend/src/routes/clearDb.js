const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

// Ruta para borrar todas las colecciones de la base de datos
router.delete('/', async (req, res) => {
  try {
    // Obtener todas las colecciones
    const collections = await mongoose.connection.db.collections();
    
    // Borrar cada colección
    console.log('Borrando todas las colecciones...');
    for (const collection of collections) {
      await collection.deleteMany({});
      console.log(`Colección ${collection.collectionName} borrada`);
    }
    
    console.log('¡Base de datos limpiada con éxito!');
    
    res.status(200).json({
      success: true,
      message: 'Base de datos limpiada con éxito. Todos los usuarios, tareas, proyectos y etiquetas han sido eliminados.'
    });
  } catch (error) {
    console.error('Error al limpiar la base de datos:', error);
    res.status(500).json({
      success: false,
      message: 'Error al limpiar la base de datos',
      error: error.message
    });
  }
});

module.exports = router;
