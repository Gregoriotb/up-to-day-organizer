import express from 'express';
import {
  updateProfile,
  uploadProfileImage,
  uploadCoverImage,
} from '../controllers/userController.js';
import { protect } from '../middleware/auth.js';
import upload from '../middleware/upload.js';

const router = express.Router();

// Todas las rutas de usuario requieren autenticación
router.put('/profile', protect, updateProfile);
router.post('/profile-image', protect, upload.single('image'), uploadProfileImage);
router.post('/cover-image', protect, upload.single('image'), uploadCoverImage);

export default router;
