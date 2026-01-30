import express from 'express';
import {
  createEmailAccount,
  getEmailAccounts,
  updateEmailAccount,
  deleteEmailAccount,
  syncEmails,
  getEmails,
  getEmail,
  toggleReadStatus,
  toggleStar,
  sendEmail,
  deleteEmail
} from '../controllers/emailController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Todas las rutas requieren autenticación
router.use(protect);

// Rutas de cuentas de correo
router.route('/accounts')
  .get(getEmailAccounts)
  .post(createEmailAccount);

router.route('/accounts/:id')
  .put(updateEmailAccount)
  .delete(deleteEmailAccount);

// Sincronizar emails de una cuenta
router.post('/accounts/:id/sync', syncEmails);

// Rutas de emails
router.get('/accounts/:accountId/emails', getEmails);
router.get('/emails/:id', getEmail);
router.delete('/emails/:id', deleteEmail);

// Acciones sobre emails
router.patch('/emails/:id/read', toggleReadStatus);
router.patch('/emails/:id/star', toggleStar);

// Enviar email
router.post('/send', sendEmail);

export default router;
