import express from 'express';
import {
  getTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  getSummary,
  getCategoryBreakdown,
  getMonthlyStats,
  getTrends
} from '../controllers/financeController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Todas las rutas requieren autenticación
router.use(protect);

// Rutas de transacciones
router.route('/transactions')
  .get(getTransactions)
  .post(createTransaction);

router.route('/transactions/:id')
  .put(updateTransaction)
  .delete(deleteTransaction);

// Rutas de estadísticas y resúmenes
router.get('/summary', getSummary);
router.get('/breakdown', getCategoryBreakdown);
router.get('/monthly-stats', getMonthlyStats);
router.get('/trends', getTrends);

export default router;
