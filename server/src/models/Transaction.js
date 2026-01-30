import mongoose from 'mongoose';

/**
 * Modelo de Transacción Financiera
 * Representa ingresos y gastos del usuario
 */
const transactionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  type: {
    type: String,
    enum: ['income', 'expense'],
    required: [true, 'El tipo de transacción es obligatorio'],
  },
  amount: {
    type: Number,
    required: [true, 'El monto es obligatorio'],
    min: [0, 'El monto no puede ser negativo'],
  },
  category: {
    type: String,
    required: [true, 'La categoría es obligatoria'],
    enum: [
      // Categorías de Ingresos
      'salary', 'freelance', 'investment', 'gift', 'other-income',
      // Categorías de Gastos
      'food', 'transport', 'housing', 'utilities', 'entertainment',
      'healthcare', 'education', 'shopping', 'insurance', 'debt',
      'savings', 'other-expense'
    ],
  },
  description: {
    type: String,
    required: [true, 'La descripción es obligatoria'],
    trim: true,
    maxlength: [200, 'La descripción no puede exceder 200 caracteres'],
  },
  date: {
    type: Date,
    default: Date.now,
    required: true,
  },
  recurring: {
    type: Boolean,
    default: false,
  },
  recurringFrequency: {
    type: String,
    enum: ['daily', 'weekly', 'monthly', 'yearly'],
  },
  tags: [{
    type: String,
    trim: true,
  }],
  notes: {
    type: String,
    maxlength: [500, 'Las notas no pueden exceder 500 caracteres'],
  },
}, {
  timestamps: true,
});

// Índice compuesto para consultas eficientes
transactionSchema.index({ user: 1, date: -1 });
transactionSchema.index({ user: 1, type: 1 });
transactionSchema.index({ user: 1, category: 1 });

// Métodos estáticos para estadísticas
transactionSchema.statics.getMonthlyStats = async function(userId, year, month) {
  return this.aggregate([
    {
      $match: {
        user: userId,
        date: {
          $gte: new Date(year, month - 1, 1),
          $lt: new Date(year, month, 1)
        }
      }
    },
    {
      $group: {
        _id: '$type',
        total: { $sum: '$amount' },
        count: { $sum: 1 }
      }
    }
  ]);
};

transactionSchema.statics.getCategoryBreakdown = async function(userId, startDate, endDate) {
  return this.aggregate([
    {
      $match: {
        user: userId,
        date: { $gte: startDate, $lte: endDate }
      }
    },
    {
      $group: {
        _id: { type: '$type', category: '$category' },
        total: { $sum: '$amount' },
        count: { $sum: 1 }
      }
    },
    {
      $sort: { total: -1 }
    }
  ]);
};

const Transaction = mongoose.model('Transaction', transactionSchema);

export default Transaction;
