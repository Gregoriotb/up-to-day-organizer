import mongoose from 'mongoose';
import crypto from 'crypto';

const emailAccountSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  accountName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  provider: {
    type: String,
    enum: ['gmail', 'outlook', 'yahoo', 'icloud', 'custom'],
    required: true
  },
  // Configuración IMAP
  imapHost: {
    type: String,
    required: true
  },
  imapPort: {
    type: Number,
    required: true,
    default: 993
  },
  imapSecure: {
    type: Boolean,
    default: true
  },
  // Configuración SMTP
  smtpHost: {
    type: String,
    required: true
  },
  smtpPort: {
    type: Number,
    required: true,
    default: 587
  },
  smtpSecure: {
    type: Boolean,
    default: false
  },
  // Credenciales encriptadas
  encryptedPassword: {
    type: String,
    required: true
  },
  // Configuración de sincronización
  syncEnabled: {
    type: Boolean,
    default: true
  },
  syncInterval: {
    type: Number,
    default: 5 // minutos
  },
  lastSync: {
    type: Date
  },
  // Folders a sincronizar
  folders: [{
    name: String,
    path: String,
    unreadCount: {
      type: Number,
      default: 0
    }
  }],
  // Estadísticas
  totalEmails: {
    type: Number,
    default: 0
  },
  unreadEmails: {
    type: Number,
    default: 0
  },
  // Estado
  isActive: {
    type: Boolean,
    default: true
  },
  lastError: {
    type: String
  }
}, {
  timestamps: true
});

// Método para encriptar contraseña
emailAccountSchema.methods.encryptPassword = function(password) {
  const algorithm = 'aes-256-cbc';
  const key = crypto.scryptSync(process.env.EMAIL_ENCRYPTION_KEY || 'default-key-change-this', 'salt', 32);
  const iv = crypto.randomBytes(16);

  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(password, 'utf8', 'hex');
  encrypted += cipher.final('hex');

  return iv.toString('hex') + ':' + encrypted;
};

// Método para desencriptar contraseña
emailAccountSchema.methods.decryptPassword = function() {
  const algorithm = 'aes-256-cbc';
  const key = crypto.scryptSync(process.env.EMAIL_ENCRYPTION_KEY || 'default-key-change-this', 'salt', 32);

  const parts = this.encryptedPassword.split(':');
  const iv = Buffer.from(parts[0], 'hex');
  const encryptedText = parts[1];

  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
  decrypted += decipher.final('utf8');

  return decrypted;
};

// Configuraciones predefinidas por proveedor
emailAccountSchema.statics.getProviderConfig = function(provider) {
  const configs = {
    gmail: {
      imapHost: 'imap.gmail.com',
      imapPort: 993,
      imapSecure: true,
      smtpHost: 'smtp.gmail.com',
      smtpPort: 587,
      smtpSecure: false
    },
    outlook: {
      imapHost: 'outlook.office365.com',
      imapPort: 993,
      imapSecure: true,
      smtpHost: 'smtp.office365.com',
      smtpPort: 587,
      smtpSecure: false
    },
    yahoo: {
      imapHost: 'imap.mail.yahoo.com',
      imapPort: 993,
      imapSecure: true,
      smtpHost: 'smtp.mail.yahoo.com',
      smtpPort: 587,
      smtpSecure: false
    },
    icloud: {
      imapHost: 'imap.mail.me.com',
      imapPort: 993,
      imapSecure: true,
      smtpHost: 'smtp.mail.me.com',
      smtpPort: 587,
      smtpSecure: false
    }
  };

  return configs[provider] || null;
};

// Índices
emailAccountSchema.index({ user: 1, email: 1 }, { unique: true });
emailAccountSchema.index({ user: 1, isActive: 1 });

const EmailAccount = mongoose.model('EmailAccount', emailAccountSchema);

export default EmailAccount;
