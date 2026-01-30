import Transaction from '../models/Transaction.js';

/**
 * @desc    Obtener todas las transacciones del usuario
 * @route   GET /api/finance/transactions
 * @access  Private
 */
export const getTransactions = async (req, res) => {
  try {
    const { startDate, endDate, type, category, limit = 50, page = 1 } = req.query;

    const query = { user: req.user._id };

    // Filtros opcionales
    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }
    if (type) query.type = type;
    if (category) query.category = category;

    const skip = (page - 1) * limit;

    const transactions = await Transaction.find(query)
      .sort({ date: -1 })
      .limit(parseInt(limit))
      .skip(skip);

    const total = await Transaction.countDocuments(query);

    res.json({
      transactions,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Crear una nueva transacción
 * @route   POST /api/finance/transactions
 * @access  Private
 */
export const createTransaction = async (req, res) => {
  try {
    const { type, amount, category, description, date, recurring, recurringFrequency, tags, notes } = req.body;

    const transaction = await Transaction.create({
      user: req.user._id,
      type,
      amount,
      category,
      description,
      date: date || Date.now(),
      recurring,
      recurringFrequency,
      tags,
      notes
    });

    res.status(201).json(transaction);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/**
 * @desc    Actualizar una transacción
 * @route   PUT /api/finance/transactions/:id
 * @access  Private
 */
export const updateTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!transaction) {
      return res.status(404).json({ message: 'Transacción no encontrada' });
    }

    const { type, amount, category, description, date, recurring, recurringFrequency, tags, notes } = req.body;

    if (type) transaction.type = type;
    if (amount !== undefined) transaction.amount = amount;
    if (category) transaction.category = category;
    if (description) transaction.description = description;
    if (date) transaction.date = date;
    if (recurring !== undefined) transaction.recurring = recurring;
    if (recurringFrequency) transaction.recurringFrequency = recurringFrequency;
    if (tags) transaction.tags = tags;
    if (notes !== undefined) transaction.notes = notes;

    await transaction.save();

    res.json(transaction);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/**
 * @desc    Eliminar una transacción
 * @route   DELETE /api/finance/transactions/:id
 * @access  Private
 */
export const deleteTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id
    });

    if (!transaction) {
      return res.status(404).json({ message: 'Transacción no encontrada' });
    }

    res.json({ message: 'Transacción eliminada exitosamente' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Obtener resumen financiero
 * @route   GET /api/finance/summary
 * @access  Private
 */
export const getSummary = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const query = { user: req.user._id };

    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    // Calcular totales por tipo
    const summary = await Transaction.aggregate([
      { $match: query },
      {
        $group: {
          _id: '$type',
          total: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      }
    ]);

    // Organizar resultados
    const result = {
      income: 0,
      expense: 0,
      balance: 0,
      transactionCount: {
        income: 0,
        expense: 0
      }
    };

    summary.forEach(item => {
      result[item._id] = item.total;
      result.transactionCount[item._id] = item.count;
    });

    result.balance = result.income - result.expense;

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Obtener desglose por categoría
 * @route   GET /api/finance/breakdown
 * @access  Private
 */
export const getCategoryBreakdown = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const start = startDate ? new Date(startDate) : new Date(new Date().getFullYear(), 0, 1);
    const end = endDate ? new Date(endDate) : new Date();

    const breakdown = await Transaction.getCategoryBreakdown(req.user._id, start, end);

    res.json(breakdown);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Obtener estadísticas mensuales
 * @route   GET /api/finance/monthly-stats
 * @access  Private
 */
export const getMonthlyStats = async (req, res) => {
  try {
    const { year, month } = req.query;

    const currentYear = year ? parseInt(year) : new Date().getFullYear();
    const currentMonth = month ? parseInt(month) : new Date().getMonth() + 1;

    const stats = await Transaction.getMonthlyStats(req.user._id, currentYear, currentMonth);

    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Obtener tendencias de ingresos/gastos
 * @route   GET /api/finance/trends
 * @access  Private
 */
export const getTrends = async (req, res) => {
  try {
    const { months = 6 } = req.query;

    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - parseInt(months));

    const trends = await Transaction.aggregate([
      {
        $match: {
          user: req.user._id,
          date: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$date' },
            month: { $month: '$date' },
            type: '$type'
          },
          total: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1 }
      }
    ]);

    res.json(trends);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
