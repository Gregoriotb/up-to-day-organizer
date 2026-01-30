import mongoose from 'mongoose';
import crypto from 'crypto';

const passwordSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  // Información del sitio/servicio
  website: {
    type: String,
    required: true
  },
  websiteUrl: {
    type: String
  },
  favicon: {
    type: String // URL del favicon del sitio
  },
  // Credenciales encriptadas
  username: {
    type: String,
    required: true
  },
  email: {
    type: String
  },
  encryptedPassword: {
    type: String,
    required: true
  },
  // Información adicional encriptada
  encryptedNotes: {
    type: String
  },
  // Categorización
  category: {
    type: String,
    enum: ['social', 'banking', 'email', 'shopping', 'work', 'entertainment', 'utilities', 'other'],
    default: 'other'
  },
  tags: [{
    type: String
  }],
  // Seguridad
  strength: {
    type: String,
    enum: ['weak', 'medium', 'strong', 'very-strong'],
    default: 'medium'
  },
  compromised: {
    type: Boolean,
    default: false
  },
  lastPasswordChange: {
    type: Date,
    default: Date.now
  },
  passwordAge: {
    type: Number, // días desde el último cambio
    default: 0
  },
  // Uso y acceso
  lastUsed: {
    type: Date
  },
  timesUsed: {
    type: Number,
    default: 0
  },
  isFavorite: {
    type: Boolean,
    default: false
  },
  // Autenticación de dos factores
  has2FA: {
    type: Boolean,
    default: false
  },
  twoFactorType: {
    type: String,
    enum: ['none', 'app', 'sms', 'email', 'hardware'],
    default: 'none'
  },
  // Alertas y recordatorios
  expirationDate: {
    type: Date
  },
  alertBeforeExpiry: {
    type: Boolean,
    default: false
  },
  daysBeforeAlert: {
    type: Number,
    default: 30
  }
}, {
  timestamps: true
});

// Método para encriptar contraseña
passwordSchema.methods.encryptPassword = function(password, masterKey) {
  const algorithm = 'aes-256-gcm';
  const key = crypto.scryptSync(masterKey, 'salt', 32);
  const iv = crypto.randomBytes(16);

  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(password, 'utf8', 'hex');
  encrypted += cipher.final('hex');

  const authTag = cipher.getAuthTag();

  return {
    encrypted: encrypted,
    iv: iv.toString('hex'),
    authTag: authTag.toString('hex')
  };
};

// Método para desencriptar contraseña
passwordSchema.methods.decryptPassword = function(masterKey) {
  const algorithm = 'aes-256-gcm';
  const key = crypto.scryptSync(masterKey, 'salt', 32);

  // El formato almacenado es: iv:authTag:encrypted
  const parts = this.encryptedPassword.split(':');
  const iv = Buffer.from(parts[0], 'hex');
  const authTag = Buffer.from(parts[1], 'hex');
  const encryptedText = parts[2];

  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  decipher.setAuthTag(authTag);

  let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
  decrypted += decipher.final('utf8');

  return decrypted;
};

// Método para encriptar notas
passwordSchema.methods.encryptNotes = function(notes, masterKey) {
  if (!notes) return null;

  const algorithm = 'aes-256-gcm';
  const key = crypto.scryptSync(masterKey, 'salt', 32);
  const iv = crypto.randomBytes(16);

  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(notes, 'utf8', 'hex');
  encrypted += cipher.final('hex');

  const authTag = cipher.getAuthTag();

  return {
    encrypted: encrypted,
    iv: iv.toString('hex'),
    authTag: authTag.toString('hex')
  };
};

// Método para desencriptar notas
passwordSchema.methods.decryptNotes = function(masterKey) {
  if (!this.encryptedNotes) return null;

  const algorithm = 'aes-256-gcm';
  const key = crypto.scryptSync(masterKey, 'salt', 32);

  const parts = this.encryptedNotes.split(':');
  const iv = Buffer.from(parts[0], 'hex');
  const authTag = Buffer.from(parts[1], 'hex');
  const encryptedText = parts[2];

  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  decipher.setAuthTag(authTag);

  let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
  decrypted += decipher.final('utf8');

  return decrypted;
};

// Método para calcular la fortaleza de la contraseña
passwordSchema.statics.calculateStrength = function(password) {
  let strength = 0;

  // Longitud
  if (password.length >= 8) strength++;
  if (password.length >= 12) strength++;
  if (password.length >= 16) strength++;

  // Complejidad
  if (/[a-z]/.test(password)) strength++; // minúsculas
  if (/[A-Z]/.test(password)) strength++; // mayúsculas
  if (/[0-9]/.test(password)) strength++; // números
  if (/[^a-zA-Z0-9]/.test(password)) strength++; // caracteres especiales

  // Clasificación
  if (strength <= 3) return 'weak';
  if (strength <= 5) return 'medium';
  if (strength <= 6) return 'strong';
  return 'very-strong';
};

// Método para generar contraseña segura
passwordSchema.statics.generateSecurePassword = function(length = 16, options = {}) {
  const {
    includeUppercase = true,
    includeLowercase = true,
    includeNumbers = true,
    includeSymbols = true
  } = options;

  let charset = '';
  if (includeLowercase) charset += 'abcdefghijklmnopqrstuvwxyz';
  if (includeUppercase) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  if (includeNumbers) charset += '0123456789';
  if (includeSymbols) charset += '!@#$%^&*()_+-=[]{}|;:,.<>?';

  let password = '';
  const randomBytes = crypto.randomBytes(length);

  for (let i = 0; i < length; i++) {
    password += charset[randomBytes[i] % charset.length];
  }

  return password;
};

// Método para actualizar la edad de la contraseña
passwordSchema.methods.updatePasswordAge = function() {
  const now = new Date();
  const lastChange = new Date(this.lastPasswordChange);
  const diffTime = Math.abs(now - lastChange);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  this.passwordAge = diffDays;
};

// Método estático para obtener contraseñas por categoría
passwordSchema.statics.getByCategory = async function(userId, category) {
  return this.find({
    user: userId,
    category: category
  }).sort({ website: 1 });
};

// Método estático para obtener contraseñas favoritas
passwordSchema.statics.getFavorites = async function(userId) {
  return this.find({
    user: userId,
    isFavorite: true
  }).sort({ lastUsed: -1 });
};

// Método estático para obtener contraseñas débiles
passwordSchema.statics.getWeakPasswords = async function(userId) {
  return this.find({
    user: userId,
    strength: { $in: ['weak', 'medium'] }
  }).sort({ strength: 1 });
};

// Método estático para obtener contraseñas antiguas
passwordSchema.statics.getOldPasswords = async function(userId, days = 90) {
  return this.find({
    user: userId,
    passwordAge: { $gte: days }
  }).sort({ passwordAge: -1 });
};

// Método estático para buscar contraseñas
passwordSchema.statics.search = async function(userId, query) {
  return this.find({
    user: userId,
    $or: [
      { website: { $regex: query, $options: 'i' } },
      { username: { $regex: query, $options: 'i' } },
      { email: { $regex: query, $options: 'i' } },
      { tags: { $regex: query, $options: 'i' } }
    ]
  }).sort({ website: 1 });
};

// Middleware para actualizar passwordAge antes de guardar
passwordSchema.pre('save', function(next) {
  this.updatePasswordAge();
  next();
});

// Índices
passwordSchema.index({ user: 1, website: 1 });
passwordSchema.index({ user: 1, category: 1 });
passwordSchema.index({ user: 1, isFavorite: 1 });
passwordSchema.index({ user: 1, strength: 1 });
passwordSchema.index({ user: 1, passwordAge: 1 });

const Password = mongoose.model('Password', passwordSchema);

export default Password;
