import mongoose from 'mongoose';

/**
 * Conecta a la base de datos MongoDB
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
    });

    console.log(`MongoDB conectado: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error al conectar MongoDB: ${error.message}`);
    console.error('Detalles del error:', error);
    process.exit(1);
  }
};

export default connectDB;
