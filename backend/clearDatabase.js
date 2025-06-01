const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Cargar variables de entorno
dotenv.config();

// Función para limpiar la base de datos
const clearDatabase = async () => {
  try {
    // Conectar a MongoDB
    console.log('Conectando a MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB conectado');

    // Obtener todas las colecciones
    const collections = await mongoose.connection.db.collections();
    
    // Borrar cada colección
    console.log('Borrando todas las colecciones...');
    for (const collection of collections) {
      await collection.deleteMany({});
      console.log(`Colección ${collection.collectionName} borrada`);
    }

    console.log('¡Base de datos limpiada con éxito!');
    console.log('Todos los usuarios, tareas, proyectos y etiquetas han sido eliminados.');
    
    // Cerrar conexión
    await mongoose.connection.close();
    console.log('Conexión a MongoDB cerrada');
    
    process.exit(0);
  } catch (error) {
    console.error('Error al limpiar la base de datos:', error);
    process.exit(1);
  }
};

// Ejecutar la función
clearDatabase();
