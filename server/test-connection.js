import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

/**
 * Script para probar la conexión a MongoDB
 * Ejecutar: node test-connection.js
 */
const testConnection = async () => {
  try {
    console.log('🔄 Intentando conectar a MongoDB...');
    console.log(`📍 URI: ${process.env.MONGODB_URI.replace(/\/\/.*:.*@/, '//*****:*****@')}`);

    await mongoose.connect(process.env.MONGODB_URI);

    console.log('✅ ¡Conexión exitosa a MongoDB!');
    console.log(`📊 Base de datos: ${mongoose.connection.name}`);
    console.log(`🌐 Host: ${mongoose.connection.host}`);

    // Listar colecciones
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log(`📁 Colecciones encontradas: ${collections.length}`);

    if (collections.length > 0) {
      console.log('📋 Nombres de colecciones:');
      collections.forEach(col => console.log(`   - ${col.name}`));
    }

    await mongoose.connection.close();
    console.log('🔌 Conexión cerrada correctamente');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error al conectar a MongoDB:', error.message);
    console.log('\n💡 Posibles soluciones:');
    console.log('   1. Verifica que el MONGODB_URI en .env sea correcto');
    console.log('   2. Asegúrate de haber agregado tu IP en Atlas (Network Access)');
    console.log('   3. Verifica que el usuario/password sean correctos');
    process.exit(1);
  }
};

testConnection();
