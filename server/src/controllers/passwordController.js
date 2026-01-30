import Password from '../models/Password.js';

// La clave maestra debe ser derivada del password del usuario
// Por ahora usaremos el ID del usuario como base (en producción usar algo más seguro)
const getMasterKey = (userId) => {
  return process.env.MASTER_KEY_SECRET + userId.toString();
};

/**
 * Obtener todas las contraseñas del usuario
 */
export const getPasswords = async (req, res) => {
  try {
    const { category, search, favorites, weak, old } = req.query;

    let passwords;

    if (search) {
      passwords = await Password.search(req.user._id, search);
    } else if (favorites) {
      passwords = await Password.getFavorites(req.user._id);
    } else if (weak) {
      passwords = await Password.getWeakPasswords(req.user._id);
    } else if (old) {
      passwords = await Password.getOldPasswords(req.user._id, parseInt(old) || 90);
    } else if (category) {
      passwords = await Password.getByCategory(req.user._id, category);
    } else {
      passwords = await Password.find({ user: req.user._id })
        .sort({ website: 1 });
    }

    // No enviar contraseñas encriptadas al cliente por seguridad
    const sanitizedPasswords = passwords.map(pwd => ({
      _id: pwd._id,
      website: pwd.website,
      websiteUrl: pwd.websiteUrl,
      favicon: pwd.favicon,
      username: pwd.username,
      email: pwd.email,
      category: pwd.category,
      tags: pwd.tags,
      strength: pwd.strength,
      compromised: pwd.compromised,
      lastPasswordChange: pwd.lastPasswordChange,
      passwordAge: pwd.passwordAge,
      lastUsed: pwd.lastUsed,
      timesUsed: pwd.timesUsed,
      isFavorite: pwd.isFavorite,
      has2FA: pwd.has2FA,
      twoFactorType: pwd.twoFactorType,
      hasNotes: !!pwd.encryptedNotes,
      createdAt: pwd.createdAt,
      updatedAt: pwd.updatedAt
    }));

    res.json(sanitizedPasswords);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Obtener una contraseña específica (con contraseña desencriptada)
 */
export const getPassword = async (req, res) => {
  try {
    const { id } = req.params;

    const password = await Password.findOne({
      _id: id,
      user: req.user._id
    });

    if (!password) {
      return res.status(404).json({ message: 'Contraseña no encontrada' });
    }

    // Actualizar estadísticas de uso
    password.lastUsed = new Date();
    password.timesUsed += 1;
    await password.save();

    // Desencriptar contraseña
    const masterKey = getMasterKey(req.user._id);
    const decryptedPassword = password.decryptPassword(masterKey);
    const decryptedNotes = password.decryptNotes(masterKey);

    res.json({
      _id: password._id,
      website: password.website,
      websiteUrl: password.websiteUrl,
      favicon: password.favicon,
      username: password.username,
      email: password.email,
      password: decryptedPassword,
      notes: decryptedNotes,
      category: password.category,
      tags: password.tags,
      strength: password.strength,
      compromised: password.compromised,
      lastPasswordChange: password.lastPasswordChange,
      passwordAge: password.passwordAge,
      lastUsed: password.lastUsed,
      timesUsed: password.timesUsed,
      isFavorite: password.isFavorite,
      has2FA: password.has2FA,
      twoFactorType: password.twoFactorType,
      createdAt: password.createdAt,
      updatedAt: password.updatedAt
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Crear una nueva contraseña
 */
export const createPassword = async (req, res) => {
  try {
    const {
      website,
      websiteUrl,
      favicon,
      username,
      email,
      password: plainPassword,
      notes,
      category,
      tags,
      has2FA,
      twoFactorType
    } = req.body;

    if (!website || !username || !plainPassword) {
      return res.status(400).json({
        message: 'Website, username y password son requeridos'
      });
    }

    // Calcular fortaleza de la contraseña
    const strength = Password.calculateStrength(plainPassword);

    // Crear documento de contraseña
    const passwordDoc = new Password({
      user: req.user._id,
      website,
      websiteUrl,
      favicon,
      username,
      email,
      category: category || 'other',
      tags: tags || [],
      strength,
      has2FA: has2FA || false,
      twoFactorType: twoFactorType || 'none',
      lastPasswordChange: new Date()
    });

    // Encriptar contraseña
    const masterKey = getMasterKey(req.user._id);
    const encryptedData = passwordDoc.encryptPassword(plainPassword, masterKey);
    passwordDoc.encryptedPassword = `${encryptedData.iv}:${encryptedData.authTag}:${encryptedData.encrypted}`;

    // Encriptar notas si existen
    if (notes) {
      const encryptedNotes = passwordDoc.encryptNotes(notes, masterKey);
      passwordDoc.encryptedNotes = `${encryptedNotes.iv}:${encryptedNotes.authTag}:${encryptedNotes.encrypted}`;
    }

    await passwordDoc.save();

    // Devolver versión sanitizada (sin contraseña)
    res.status(201).json({
      _id: passwordDoc._id,
      website: passwordDoc.website,
      websiteUrl: passwordDoc.websiteUrl,
      favicon: passwordDoc.favicon,
      username: passwordDoc.username,
      email: passwordDoc.email,
      category: passwordDoc.category,
      tags: passwordDoc.tags,
      strength: passwordDoc.strength,
      has2FA: passwordDoc.has2FA,
      twoFactorType: passwordDoc.twoFactorType,
      hasNotes: !!passwordDoc.encryptedNotes,
      createdAt: passwordDoc.createdAt
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Actualizar una contraseña
 */
export const updatePassword = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const password = await Password.findOne({
      _id: id,
      user: req.user._id
    });

    if (!password) {
      return res.status(404).json({ message: 'Contraseña no encontrada' });
    }

    const masterKey = getMasterKey(req.user._id);

    // Si se actualiza la contraseña, encriptarla
    if (updates.password) {
      const strength = Password.calculateStrength(updates.password);
      const encryptedData = password.encryptPassword(updates.password, masterKey);
      password.encryptedPassword = `${encryptedData.iv}:${encryptedData.authTag}:${encryptedData.encrypted}`;
      password.strength = strength;
      password.lastPasswordChange = new Date();
      delete updates.password;
    }

    // Si se actualizan las notas, encriptarlas
    if (updates.notes !== undefined) {
      if (updates.notes) {
        const encryptedNotes = password.encryptNotes(updates.notes, masterKey);
        password.encryptedNotes = `${encryptedNotes.iv}:${encryptedNotes.authTag}:${encryptedNotes.encrypted}`;
      } else {
        password.encryptedNotes = null;
      }
      delete updates.notes;
    }

    // Actualizar otros campos
    Object.assign(password, updates);
    await password.save();

    res.json({
      _id: password._id,
      website: password.website,
      websiteUrl: password.websiteUrl,
      favicon: password.favicon,
      username: password.username,
      email: password.email,
      category: password.category,
      tags: password.tags,
      strength: password.strength,
      has2FA: password.has2FA,
      twoFactorType: password.twoFactorType,
      hasNotes: !!password.encryptedNotes,
      isFavorite: password.isFavorite,
      updatedAt: password.updatedAt
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Eliminar una contraseña
 */
export const deletePassword = async (req, res) => {
  try {
    const { id } = req.params;

    const password = await Password.findOne({
      _id: id,
      user: req.user._id
    });

    if (!password) {
      return res.status(404).json({ message: 'Contraseña no encontrada' });
    }

    await password.deleteOne();

    res.json({ message: 'Contraseña eliminada exitosamente' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Alternar favorito
 */
export const toggleFavorite = async (req, res) => {
  try {
    const { id } = req.params;

    const password = await Password.findOne({
      _id: id,
      user: req.user._id
    });

    if (!password) {
      return res.status(404).json({ message: 'Contraseña no encontrada' });
    }

    password.isFavorite = !password.isFavorite;
    await password.save();

    res.json({ isFavorite: password.isFavorite });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Generar contraseña segura
 */
export const generatePassword = async (req, res) => {
  try {
    const { length = 16, options = {} } = req.body;

    const password = Password.generateSecurePassword(parseInt(length), options);
    const strength = Password.calculateStrength(password);

    res.json({
      password,
      strength,
      length: password.length
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Obtener estadísticas de seguridad
 */
export const getSecurityStats = async (req, res) => {
  try {
    const userId = req.user._id;

    const [
      total,
      weak,
      compromised,
      old,
      without2FA,
      byCategory,
      byStrength
    ] = await Promise.all([
      Password.countDocuments({ user: userId }),
      Password.countDocuments({ user: userId, strength: { $in: ['weak', 'medium'] } }),
      Password.countDocuments({ user: userId, compromised: true }),
      Password.countDocuments({ user: userId, passwordAge: { $gte: 90 } }),
      Password.countDocuments({ user: userId, has2FA: false }),
      Password.aggregate([
        { $match: { user: userId } },
        { $group: { _id: '$category', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ]),
      Password.aggregate([
        { $match: { user: userId } },
        { $group: { _id: '$strength', count: { $sum: 1 } } }
      ])
    ]);

    // Calcular score de seguridad (0-100)
    let securityScore = 100;
    if (total > 0) {
      securityScore -= (weak / total) * 30; // -30% por contraseñas débiles
      securityScore -= (compromised / total) * 40; // -40% por contraseñas comprometidas
      securityScore -= (old / total) * 20; // -20% por contraseñas antiguas
      securityScore -= (without2FA / total) * 10; // -10% por falta de 2FA
    }

    res.json({
      total,
      weak,
      compromised,
      old,
      without2FA,
      with2FA: total - without2FA,
      byCategory: byCategory.reduce((acc, item) => {
        acc[item._id] = item.count;
        return acc;
      }, {}),
      byStrength: byStrength.reduce((acc, item) => {
        acc[item._id] = item.count;
        return acc;
      }, {}),
      securityScore: Math.max(0, Math.round(securityScore))
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Importar contraseñas desde archivo CSV
 */
export const importPasswords = async (req, res) => {
  try {
    const { passwords } = req.body;

    if (!Array.isArray(passwords) || passwords.length === 0) {
      return res.status(400).json({ message: 'No se proporcionaron contraseñas para importar' });
    }

    const masterKey = getMasterKey(req.user._id);
    const imported = [];
    const errors = [];

    for (const pwdData of passwords) {
      try {
        if (!pwdData.website || !pwdData.username || !pwdData.password) {
          errors.push({ data: pwdData, error: 'Faltan campos requeridos' });
          continue;
        }

        const strength = Password.calculateStrength(pwdData.password);

        const passwordDoc = new Password({
          user: req.user._id,
          website: pwdData.website,
          websiteUrl: pwdData.websiteUrl,
          username: pwdData.username,
          email: pwdData.email,
          category: pwdData.category || 'other',
          strength,
          lastPasswordChange: new Date()
        });

        const encryptedData = passwordDoc.encryptPassword(pwdData.password, masterKey);
        passwordDoc.encryptedPassword = `${encryptedData.iv}:${encryptedData.authTag}:${encryptedData.encrypted}`;

        if (pwdData.notes) {
          const encryptedNotes = passwordDoc.encryptNotes(pwdData.notes, masterKey);
          passwordDoc.encryptedNotes = `${encryptedNotes.iv}:${encryptedNotes.authTag}:${encryptedNotes.encrypted}`;
        }

        await passwordDoc.save();
        imported.push(passwordDoc._id);
      } catch (err) {
        errors.push({ data: pwdData, error: err.message });
      }
    }

    res.json({
      message: `Se importaron ${imported.length} contraseñas`,
      imported: imported.length,
      errors: errors.length,
      errorDetails: errors
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Exportar contraseñas (solo para backup)
 */
export const exportPasswords = async (req, res) => {
  try {
    const passwords = await Password.find({ user: req.user._id });
    const masterKey = getMasterKey(req.user._id);

    const exportData = passwords.map(pwd => ({
      website: pwd.website,
      websiteUrl: pwd.websiteUrl,
      username: pwd.username,
      email: pwd.email,
      password: pwd.decryptPassword(masterKey),
      notes: pwd.decryptNotes(masterKey),
      category: pwd.category,
      tags: pwd.tags
    }));

    res.json(exportData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
