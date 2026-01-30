import express from 'express';
import {
  getIdeas,
  getIdea,
  createIdea,
  updateIdea,
  deleteIdea,
  toggleFavorite,
  togglePin,
  updateStatus,
  addChecklistItem,
  toggleChecklistItem,
  getStats,
  duplicateIdea,
  archiveMultiple,
  deleteMultiple
} from '../controllers/ideaController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Todas las rutas requieren autenticación
router.use(protect);

// Rutas de ideas
router.route('/ideas')
  .get(getIdeas)
  .post(createIdea);

router.route('/ideas/:id')
  .get(getIdea)
  .put(updateIdea)
  .delete(deleteIdea);

// Acciones especiales
router.patch('/ideas/:id/favorite', toggleFavorite);
router.patch('/ideas/:id/pin', togglePin);
router.patch('/ideas/:id/status', updateStatus);

// Checklist
router.post('/ideas/:id/checklist', addChecklistItem);
router.patch('/ideas/:id/checklist/:itemId', toggleChecklistItem);

// Utilidades
router.post('/ideas/:id/duplicate', duplicateIdea);
router.post('/archive-multiple', archiveMultiple);
router.post('/delete-multiple', deleteMultiple);

// Estadísticas
router.get('/stats', getStats);

export default router;
