import mongoose from 'mongoose';

const emailMessageSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  account: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'EmailAccount',
    required: true
  },
  // Identificadores únicos del mensaje
  messageId: {
    type: String,
    required: true
  },
  uid: {
    type: Number,
    required: true
  },
  // Información del remitente
  from: {
    name: String,
    address: {
      type: String,
      required: true,
      lowercase: true
    }
  },
  // Destinatarios
  to: [{
    name: String,
    address: {
      type: String,
      lowercase: true
    }
  }],
  cc: [{
    name: String,
    address: {
      type: String,
      lowercase: true
    }
  }],
  bcc: [{
    name: String,
    address: {
      type: String,
      lowercase: true
    }
  }],
  // Contenido del mensaje
  subject: {
    type: String,
    required: true
  },
  textBody: {
    type: String
  },
  htmlBody: {
    type: String
  },
  // Adjuntos
  attachments: [{
    filename: String,
    contentType: String,
    size: Number,
    path: String // ruta donde se guardó el archivo
  }],
  // Metadatos
  date: {
    type: Date,
    required: true
  },
  folder: {
    type: String,
    default: 'INBOX'
  },
  // Flags y estado
  flags: [{
    type: String
  }],
  isRead: {
    type: Boolean,
    default: false
  },
  isStarred: {
    type: Boolean,
    default: false
  },
  isImportant: {
    type: Boolean,
    default: false
  },
  isDraft: {
    type: Boolean,
    default: false
  },
  // Etiquetas personalizadas
  labels: [{
    type: String
  }],
  // Tamaño del mensaje
  size: {
    type: Number
  },
  // Referencias para hilos de conversación
  inReplyTo: {
    type: String
  },
  references: [{
    type: String
  }],
  // Headers completos (opcional, para casos especiales)
  rawHeaders: {
    type: Map,
    of: String
  }
}, {
  timestamps: true
});

// Índices para búsqueda eficiente
emailMessageSchema.index({ user: 1, account: 1, messageId: 1 }, { unique: true });
emailMessageSchema.index({ user: 1, account: 1, folder: 1, date: -1 });
emailMessageSchema.index({ user: 1, isRead: 1 });
emailMessageSchema.index({ user: 1, isStarred: 1 });
emailMessageSchema.index({ 'from.address': 1 });
emailMessageSchema.index({ subject: 'text', textBody: 'text' }); // Índice de texto para búsqueda

// Método para marcar como leído
emailMessageSchema.methods.markAsRead = async function() {
  this.isRead = true;
  if (!this.flags.includes('\\Seen')) {
    this.flags.push('\\Seen');
  }
  return this.save();
};

// Método para marcar como no leído
emailMessageSchema.methods.markAsUnread = async function() {
  this.isRead = false;
  this.flags = this.flags.filter(flag => flag !== '\\Seen');
  return this.save();
};

// Método para alternar estrella
emailMessageSchema.methods.toggleStar = async function() {
  this.isStarred = !this.isStarred;
  if (this.isStarred && !this.flags.includes('\\Flagged')) {
    this.flags.push('\\Flagged');
  } else if (!this.isStarred) {
    this.flags = this.flags.filter(flag => flag !== '\\Flagged');
  }
  return this.save();
};

// Método estático para obtener emails no leídos por cuenta
emailMessageSchema.statics.getUnreadCount = async function(userId, accountId) {
  return this.countDocuments({
    user: userId,
    account: accountId,
    isRead: false
  });
};

// Método estático para obtener emails por carpeta
emailMessageSchema.statics.getByFolder = async function(userId, accountId, folder, page = 1, limit = 50) {
  const skip = (page - 1) * limit;

  return this.find({
    user: userId,
    account: accountId,
    folder: folder
  })
  .sort({ date: -1 })
  .skip(skip)
  .limit(limit)
  .select('-htmlBody -rawHeaders'); // Excluir campos pesados en listados
};

// Método estático para búsqueda
emailMessageSchema.statics.search = async function(userId, accountId, query, page = 1, limit = 50) {
  const skip = (page - 1) * limit;

  return this.find({
    user: userId,
    account: accountId,
    $or: [
      { subject: { $regex: query, $options: 'i' } },
      { textBody: { $regex: query, $options: 'i' } },
      { 'from.address': { $regex: query, $options: 'i' } },
      { 'from.name': { $regex: query, $options: 'i' } }
    ]
  })
  .sort({ date: -1 })
  .skip(skip)
  .limit(limit)
  .select('-htmlBody -rawHeaders');
};

const EmailMessage = mongoose.model('EmailMessage', emailMessageSchema);

export default EmailMessage;
