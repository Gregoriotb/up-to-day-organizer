import User from '../models/User.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * @desc    Actualizar perfil de usuario
 * @route   PUT /api/user/profile
 * @access  Private
 */
export const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.firstName = req.body.firstName || user.firstName;
      user.lastName = req.body.lastName || user.lastName;
      user.bio = req.body.bio || user.bio;
      user.email = req.body.email || user.email;

      const updatedUser = await user.save();

      res.json({
        _id: updatedUser._id,
        username: updatedUser.username,
        email: updatedUser.email,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        profileImage: updatedUser.profileImage,
        coverImage: updatedUser.coverImage,
        bio: updatedUser.bio,
        projects: updatedUser.projects,
        integrations: updatedUser.integrations,
      });
    } else {
      res.status(404).json({ message: 'Usuario no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Subir imagen de perfil
 * @route   POST /api/user/profile-image
 * @access  Private
 */
export const uploadProfileImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No se proporcionó ninguna imagen' });
    }

    const user = await User.findById(req.user._id);

    if (user) {
      // Eliminar imagen anterior si existe
      if (user.profileImage) {
        const oldImagePath = path.join(__dirname, '../../..', user.profileImage);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
          console.log('🗑️  Imagen de perfil anterior eliminada:', oldImagePath);
        }
      }

      // Guardar ruta de la nueva imagen
      user.profileImage = `/uploads/${req.file.filename}`;
      await user.save();

      res.json({
        message: 'Imagen de perfil actualizada',
        profileImage: user.profileImage,
      });
    } else {
      res.status(404).json({ message: 'Usuario no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Subir imagen de portada
 * @route   POST /api/user/cover-image
 * @access  Private
 */
export const uploadCoverImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No se proporcionó ninguna imagen' });
    }

    const user = await User.findById(req.user._id);

    if (user) {
      // Eliminar imagen anterior si existe
      if (user.coverImage) {
        const oldImagePath = path.join(__dirname, '../../..', user.coverImage);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
          console.log('🗑️  Imagen de portada anterior eliminada:', oldImagePath);
        }
      }

      // Guardar ruta de la nueva imagen
      user.coverImage = `/uploads/${req.file.filename}`;
      await user.save();

      res.json({
        message: 'Imagen de portada actualizada',
        coverImage: user.coverImage,
      });
    } else {
      res.status(404).json({ message: 'Usuario no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
