import mongoose from 'mongoose';

const ideaSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  // Contenido de la idea
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  content: {
    type: String,
    required: true
  },
  // Categorización y organización
  category: {
    type: String,
    enum: ['personal', 'work', 'project', 'business', 'creative', 'technical', 'random', 'other'],
    default: 'other'
  },
  tags: [{
    type: String,
    trim: true
  }],
  color: {
    type: String,
    default: '#FFD700' // Color por defecto (dorado)
  },
  // Estado y prioridad
  status: {
    type: String,
    enum: ['draft', 'active', 'archived', 'completed'],
    default: 'active'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  // Características
  isFavorite: {
    type: Boolean,
    default: false
  },
  isPinned: {
    type: Boolean,
    default: false
  },
  isPrivate: {
    type: Boolean,
    default: false
  },
  // Recordatorios y fechas
  reminderDate: {
    type: Date
  },
  dueDate: {
    type: Date
  },
  completedAt: {
    type: Date
  },
  // Checklist dentro de la idea
  checklist: [{
    text: {
      type: String,
      required: true
    },
    completed: {
      type: Boolean,
      default: false
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  // Adjuntos y referencias
  attachments: [{
    name: String,
    url: String,
    type: String,
    size: Number
  }],
  links: [{
    url: String,
    title: String,
    description: String
  }],
  // Colaboración
  sharedWith: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  // Estadísticas
  viewCount: {
    type: Number,
    default: 0
  },
  lastViewed: {
    type: Date
  }
}, {
  timestamps: true
});

// Método para marcar como favorita
ideaSchema.methods.toggleFavorite = async function() {
  this.isFavorite = !this.isFavorite;
  return this.save();
};

// Método para anclar/desanclar
ideaSchema.methods.togglePin = async function() {
  this.isPinned = !this.isPinned;
  return this.save();
};

// Método para cambiar estado
ideaSchema.methods.updateStatus = async function(newStatus) {
  this.status = newStatus;
  if (newStatus === 'completed' && !this.completedAt) {
    this.completedAt = new Date();
  }
  return this.save();
};

// Método para agregar item al checklist
ideaSchema.methods.addChecklistItem = async function(text) {
  this.checklist.push({ text, completed: false });
  return this.save();
};

// Método para marcar item del checklist
ideaSchema.methods.toggleChecklistItem = async function(itemId) {
  const item = this.checklist.id(itemId);
  if (item) {
    item.completed = !item.completed;
    return this.save();
  }
  throw new Error('Item no encontrado');
};

// Método para incrementar contador de vistas
ideaSchema.methods.incrementViewCount = async function() {
  this.viewCount += 1;
  this.lastViewed = new Date();
  return this.save();
};

// Método estático para obtener ideas por categoría
ideaSchema.statics.getByCategory = async function(userId, category) {
  return this.find({
    user: userId,
    category: category,
    status: { $ne: 'archived' }
  }).sort({ isPinned: -1, createdAt: -1 });
};

// Método estático para obtener favoritas
ideaSchema.statics.getFavorites = async function(userId) {
  return this.find({
    user: userId,
    isFavorite: true,
    status: { $ne: 'archived' }
  }).sort({ isPinned: -1, updatedAt: -1 });
};

// Método estático para buscar ideas
ideaSchema.statics.search = async function(userId, query) {
  return this.find({
    user: userId,
    status: { $ne: 'archived' },
    $or: [
      { title: { $regex: query, $options: 'i' } },
      { content: { $regex: query, $options: 'i' } },
      { tags: { $regex: query, $options: 'i' } }
    ]
  }).sort({ isPinned: -1, updatedAt: -1 });
};

// Método estático para obtener estadísticas
ideaSchema.statics.getStats = async function(userId) {
  const [total, byCategory, byStatus, byPriority] = await Promise.all([
    this.countDocuments({ user: userId }),
    this.aggregate([
      { $match: { user: userId } },
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]),
    this.aggregate([
      { $match: { user: userId } },
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]),
    this.aggregate([
      { $match: { user: userId, status: 'active' } },
      { $group: { _id: '$priority', count: { $sum: 1 } } }
    ])
  ]);

  return {
    total,
    byCategory: byCategory.reduce((acc, item) => {
      acc[item._id] = item.count;
      return acc;
    }, {}),
    byStatus: byStatus.reduce((acc, item) => {
      acc[item._id] = item.count;
      return acc;
    }, {}),
    byPriority: byPriority.reduce((acc, item) => {
      acc[item._id] = item.count;
      return acc;
    }, {})
  };
};

// Índices
ideaSchema.index({ user: 1, status: 1 });
ideaSchema.index({ user: 1, category: 1 });
ideaSchema.index({ user: 1, isFavorite: 1 });
ideaSchema.index({ user: 1, isPinned: 1 });
ideaSchema.index({ user: 1, createdAt: -1 });
ideaSchema.index({ title: 'text', content: 'text', tags: 'text' });

const Idea = mongoose.model('Idea', ideaSchema);

export default Idea;
