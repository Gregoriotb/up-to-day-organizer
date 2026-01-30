import express from 'express';
import {
  getPasswords,
  getPassword,
  createPassword,
  updatePassword,
  deletePassword,
  toggleFavorite,
  generatePassword,
  getSecurityStats,
  importPasswords,
  exportPasswords
} from '../controllers/passwordController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Todas las rutas requieren autenticación
router.use(protect);

// Rutas de contraseñas
router.route('/passwords')
  .get(getPasswords)
  .post(createPassword);

router.route('/passwords/:id')
  .get(getPassword)
  .put(updatePassword)
  .delete(deletePassword);

// Acciones especiales
router.patch('/passwords/:id/favorite', toggleFavorite);

// Generador de contraseñas
router.post('/generate', generatePassword);

// Estadísticas de seguridad
router.get('/stats', getSecurityStats);

// Importar/Exportar
router.post('/import', importPasswords);
router.get('/export', exportPasswords);

export default router;
