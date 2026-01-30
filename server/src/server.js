import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from './config/database.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import financeRoutes from './routes/financeRoutes.js';
import emailRoutes from './routes/emailRoutes.js';
import passwordRoutes from './routes/passwordRoutes.js';
import ideaRoutes from './routes/ideaRoutes.js';

// Configurar variables de entorno
dotenv.config();

// Obtener __dirname en ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Conectar a la base de datos
connectDB();

// Inicializar Express
const app = express();

// Middlewares CORS configuration
const corsOptions = {
  origin: ['http://localhost:5173', 'http://localhost:5174'],
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Servir archivos estáticos (uploads) con headers CORS específicos
const uploadsPath = path.join(__dirname, '../../uploads');
app.use('/uploads', (req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Cache-Control', 'public, max-age=3600');
  next();
}, express.static(uploadsPath));

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/finance', financeRoutes);
app.use('/api/email', emailRoutes);
app.use('/api/password', passwordRoutes);
app.use('/api/idea', ideaRoutes);

// Ruta de prueba
app.get('/api/health', (req, res) => {
  res.json({ message: 'API funcionando correctamente', status: 'ok' });
});

// Manejo de errores 404
app.use((req, res) => {
  res.status(404).json({ message: 'Ruta no encontrada' });
});

// Puerto
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`\n🚀 Servidor corriendo en puerto ${PORT}`);
  console.log(`📡 http://localhost:${PORT}`);
  console.log(`✅ Health check: http://localhost:${PORT}/api/health\n`);
});
