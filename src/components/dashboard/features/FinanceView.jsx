import { useState, useEffect } from 'react';
import {
  DollarSign, TrendingUp, TrendingDown, PlusCircle, Filter,
  Calendar, PieChart, BarChart3, ListFilter, Save, X
} from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';
import API_URL from '../../../config/api';

/**
 * Vista de Gestión Financiera
 * Permite controlar ingresos y gastos personales
 */
const FinanceView = () => {
  const { token } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState({ income: 0, expense: 0, balance: 0 });
  const [breakdown, setBreakdown] = useState([]);
  const [filter, setFilter] = useState({ type: 'all', category: 'all', period: 'month' });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Form state
  const [formData, setFormData] = useState({
    type: 'expense',
    amount: '',
    category: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    recurring: false,
    notes: ''
  });

  // Categorías
  const categories = {
    income: [
      { value: 'salary', label: 'Salario', icon: '💼' },
      { value: 'freelance', label: 'Freelance', icon: '💻' },
      { value: 'investment', label: 'Inversiones', icon: '📈' },
      { value: 'gift', label: 'Regalo', icon: '🎁' },
      { value: 'other-income', label: 'Otro ingreso', icon: '💰' }
    ],
    expense: [
      { value: 'food', label: 'Alimentación', icon: '🍔' },
      { value: 'transport', label: 'Transporte', icon: '🚗' },
      { value: 'housing', label: 'Vivienda', icon: '🏠' },
      { value: 'utilities', label: 'Servicios', icon: '💡' },
      { value: 'entertainment', label: 'Entretenimiento', icon: '🎬' },
      { value: 'healthcare', label: 'Salud', icon: '🏥' },
      { value: 'education', label: 'Educación', icon: '📚' },
      { value: 'shopping', label: 'Compras', icon: '🛍️' },
      { value: 'insurance', label: 'Seguros', icon: '🛡️' },
      { value: 'debt', label: 'Deudas', icon: '💳' },
      { value: 'savings', label: 'Ahorros', icon: '🏦' },
      { value: 'other-expense', label: 'Otro gasto', icon: '💸' }
    ]
  };

  // Cargar datos
  useEffect(() => {
    fetchSummary();
    fetchTransactions();
    fetchBreakdown();
  }, [filter]);

  const fetchSummary = async () => {
    try {
      const dateRange = getDateRange(filter.period);
      const response = await fetch(
        `${API_URL}/finance/summary?startDate=${dateRange.start.toISOString()}&endDate=${dateRange.end.toISOString()}`,
        {
          headers: { 'Authorization': `Bearer ${token}` }
        }
      );
      if (response.ok) {
        const data = await response.json();
        setSummary(data);
      }
    } catch (error) {
      console.error('Error al cargar resumen:', error);
    }
  };

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const dateRange = getDateRange(filter.period);
      let url = `${API_URL}/finance/transactions?startDate=${dateRange.start.toISOString()}&endDate=${dateRange.end.toISOString()}`;

      if (filter.type !== 'all') url += `&type=${filter.type}`;
      if (filter.category !== 'all') url += `&category=${filter.category}`;

      const response = await fetch(url, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        setTransactions(data.transactions || []);
      }
    } catch (error) {
      console.error('Error al cargar transacciones:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchBreakdown = async () => {
    try {
      const dateRange = getDateRange(filter.period);
      const response = await fetch(
        `${API_URL}/finance/breakdown?startDate=${dateRange.start.toISOString()}&endDate=${dateRange.end.toISOString()}`,
        {
          headers: { 'Authorization': `Bearer ${token}` }
        }
      );
      if (response.ok) {
        const data = await response.json();
        setBreakdown(data);
      }
    } catch (error) {
      console.error('Error al cargar desglose:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    try {
      if (!formData.amount || !formData.category || !formData.description) {
        throw new Error('Por favor completa todos los campos obligatorios');
      }

      const response = await fetch(`${API_URL}/finance/transactions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formData,
          amount: parseFloat(formData.amount)
        })
      });

      if (response.ok) {
        setMessage({ type: 'success', text: 'Transacción registrada exitosamente' });
        setFormData({
          type: 'expense',
          amount: '',
          category: '',
          description: '',
          date: new Date().toISOString().split('T')[0],
          recurring: false,
          notes: ''
        });
        fetchSummary();
        fetchTransactions();
        fetchBreakdown();
        setTimeout(() => setActiveTab('transactions'), 1500);
      } else {
        const error = await response.json();
        throw new Error(error.message || 'Error al registrar transacción');
      }
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('¿Estás seguro de eliminar esta transacción?')) return;

    try {
      const response = await fetch(`${API_URL}/finance/transactions/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        fetchSummary();
        fetchTransactions();
        fetchBreakdown();
      }
    } catch (error) {
      console.error('Error al eliminar transacción:', error);
    }
  };

  const getDateRange = (period) => {
    const end = new Date();
    const start = new Date();

    switch (period) {
      case 'week':
        start.setDate(start.getDate() - 7);
        break;
      case 'month':
        start.setMonth(start.getMonth() - 1);
        break;
      case 'year':
        start.setFullYear(start.getFullYear() - 1);
        break;
      default:
        start.setMonth(start.getMonth() - 1);
    }

    return { start, end };
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getCategoryInfo = (type, categoryValue) => {
    const allCategories = [...categories.income, ...categories.expense];
    return allCategories.find(cat => cat.value === categoryValue) || { label: categoryValue, icon: '💰' };
  };

  const getCurrentCategories = () => {
    return formData.type === 'income' ? categories.income : categories.expense;
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-darkTheme-bg dark:to-darkTheme-border transition-colors duration-200">

      {/* Header */}
      <div className="bg-white dark:bg-darkTheme-card border-b border-neutral-200 dark:border-darkTheme-border px-8 py-6 shadow-sm transition-colors duration-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <DollarSign className="text-primary dark:text-primary-light" size={32} />
            <div>
              <h2 className="text-3xl font-bold text-primary-dark dark:text-primary-light">
                Finanzas
              </h2>
              <p className="text-neutral-600 dark:text-darkTheme-muted">
                Gestiona tus ingresos y gastos
              </p>
            </div>
          </div>

          {/* Filtro de período */}
          <div className="flex items-center gap-2">
            {['week', 'month', 'year'].map((period) => (
              <button
                key={period}
                onClick={() => setFilter({ ...filter, period })}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter.period === period
                    ? 'bg-primary text-white dark:bg-primary-light'
                    : 'bg-neutral-100 dark:bg-darkTheme-border text-neutral-700 dark:text-darkTheme-text hover:bg-neutral-200 dark:hover:bg-darkTheme-card'
                }`}
              >
                {period === 'week' ? 'Semana' : period === 'month' ? 'Mes' : 'Año'}
              </button>
            ))}
          </div>
        </div>

        {/* Resumen Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          {/* Ingresos */}
          <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-xl p-6 border border-green-200 dark:border-green-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-700 dark:text-green-400 font-medium">Ingresos</p>
                <p className="text-3xl font-bold text-green-800 dark:text-green-300 mt-1">
                  {formatCurrency(summary.income)}
                </p>
              </div>
              <TrendingUp className="text-green-600 dark:text-green-400" size={32} />
            </div>
          </div>

          {/* Gastos */}
          <div className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 rounded-xl p-6 border border-red-200 dark:border-red-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-red-700 dark:text-red-400 font-medium">Gastos</p>
                <p className="text-3xl font-bold text-red-800 dark:text-red-300 mt-1">
                  {formatCurrency(summary.expense)}
                </p>
              </div>
              <TrendingDown className="text-red-600 dark:text-red-400" size={32} />
            </div>
          </div>

          {/* Balance */}
          <div className={`bg-gradient-to-br rounded-xl p-6 border ${
            summary.balance >= 0
              ? 'from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-700'
              : 'from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 border-orange-200 dark:border-orange-700'
          }`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm font-medium ${
                  summary.balance >= 0
                    ? 'text-blue-700 dark:text-blue-400'
                    : 'text-orange-700 dark:text-orange-400'
                }`}>Balance</p>
                <p className={`text-3xl font-bold mt-1 ${
                  summary.balance >= 0
                    ? 'text-blue-800 dark:text-blue-300'
                    : 'text-orange-800 dark:text-orange-300'
                }`}>
                  {formatCurrency(summary.balance)}
                </p>
              </div>
              <DollarSign className={
                summary.balance >= 0
                  ? 'text-blue-600 dark:text-blue-400'
                  : 'text-orange-600 dark:text-orange-400'
              } size={32} />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white dark:bg-darkTheme-card border-b border-neutral-200 dark:border-darkTheme-border px-8 py-3">
        <div className="flex gap-2">
          {[
            { id: 'overview', label: 'Vista General', icon: BarChart3 },
            { id: 'transactions', label: 'Transacciones', icon: ListFilter },
            { id: 'add', label: 'Agregar', icon: PlusCircle }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-primary text-white dark:bg-primary-light'
                  : 'text-neutral-600 dark:text-darkTheme-text hover:bg-neutral-100 dark:hover:bg-darkTheme-border'
              }`}
            >
              <tab.icon size={18} />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-8">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="max-w-6xl mx-auto space-y-6">
            <div className="card dark:bg-darkTheme-card dark:border-darkTheme-border">
              <h3 className="text-lg font-semibold text-neutral-800 dark:text-darkTheme-text mb-4 flex items-center gap-2">
                <PieChart size={20} />
                Desglose por Categoría
              </h3>

              {breakdown.length === 0 ? (
                <p className="text-center text-neutral-500 dark:text-darkTheme-muted py-8">
                  No hay datos en este período
                </p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Ingresos */}
                  <div>
                    <h4 className="text-sm font-semibold text-green-700 dark:text-green-400 mb-3">
                      Ingresos
                    </h4>
                    <div className="space-y-2">
                      {breakdown
                        .filter(item => item._id.type === 'income')
                        .map((item, index) => {
                          const categoryInfo = getCategoryInfo(item._id.type, item._id.category);
                          const percentage = ((item.total / summary.income) * 100).toFixed(1);
                          return (
                            <div key={index} className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/10 rounded-lg">
                              <div className="flex items-center gap-2">
                                <span className="text-2xl">{categoryInfo.icon}</span>
                                <span className="text-sm font-medium text-neutral-700 dark:text-darkTheme-text">
                                  {categoryInfo.label}
                                </span>
                              </div>
                              <div className="text-right">
                                <p className="text-sm font-bold text-green-700 dark:text-green-400">
                                  {formatCurrency(item.total)}
                                </p>
                                <p className="text-xs text-neutral-500 dark:text-darkTheme-muted">
                                  {percentage}%
                                </p>
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  </div>

                  {/* Gastos */}
                  <div>
                    <h4 className="text-sm font-semibold text-red-700 dark:text-red-400 mb-3">
                      Gastos
                    </h4>
                    <div className="space-y-2">
                      {breakdown
                        .filter(item => item._id.type === 'expense')
                        .map((item, index) => {
                          const categoryInfo = getCategoryInfo(item._id.type, item._id.category);
                          const percentage = ((item.total / summary.expense) * 100).toFixed(1);
                          return (
                            <div key={index} className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/10 rounded-lg">
                              <div className="flex items-center gap-2">
                                <span className="text-2xl">{categoryInfo.icon}</span>
                                <span className="text-sm font-medium text-neutral-700 dark:text-darkTheme-text">
                                  {categoryInfo.label}
                                </span>
                              </div>
                              <div className="text-right">
                                <p className="text-sm font-bold text-red-700 dark:text-red-400">
                                  {formatCurrency(item.total)}
                                </p>
                                <p className="text-xs text-neutral-500 dark:text-darkTheme-muted">
                                  {percentage}%
                                </p>
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Transactions Tab */}
        {activeTab === 'transactions' && (
          <div className="max-w-6xl mx-auto">
            <div className="card dark:bg-darkTheme-card dark:border-darkTheme-border">
              <h3 className="text-lg font-semibold text-neutral-800 dark:text-darkTheme-text mb-4">
                Historial de Transacciones
              </h3>

              {loading ? (
                <p className="text-center text-neutral-500 dark:text-darkTheme-muted py-8">
                  Cargando...
                </p>
              ) : transactions.length === 0 ? (
                <p className="text-center text-neutral-500 dark:text-darkTheme-muted py-8">
                  No hay transacciones en este período
                </p>
              ) : (
                <div className="space-y-3">
                  {transactions.map((transaction) => {
                    const categoryInfo = getCategoryInfo(transaction.type, transaction.category);
                    return (
                      <div
                        key={transaction._id}
                        className="flex items-center justify-between p-4 bg-neutral-50 dark:bg-darkTheme-bg rounded-lg hover:bg-neutral-100 dark:hover:bg-darkTheme-border transition-colors group"
                      >
                        <div className="flex items-center gap-4 flex-1">
                          <div className="text-3xl">{categoryInfo.icon}</div>
                          <div className="flex-1">
                            <p className="font-medium text-neutral-800 dark:text-darkTheme-text">
                              {transaction.description}
                            </p>
                            <p className="text-sm text-neutral-500 dark:text-darkTheme-muted">
                              {categoryInfo.label} • {formatDate(transaction.date)}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className={`text-lg font-bold ${
                            transaction.type === 'income'
                              ? 'text-green-600 dark:text-green-400'
                              : 'text-red-600 dark:text-red-400'
                          }`}>
                            {transaction.type === 'income' ? '+' : '-'} {formatCurrency(transaction.amount)}
                          </div>
                          <button
                            onClick={() => handleDelete(transaction._id)}
                            className="opacity-0 group-hover:opacity-100 p-2 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-lg transition-all"
                          >
                            <X size={16} className="text-red-600 dark:text-red-400" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Add Transaction Tab */}
        {activeTab === 'add' && (
          <div className="max-w-2xl mx-auto">
            <div className="card dark:bg-darkTheme-card dark:border-darkTheme-border">
              <h3 className="text-lg font-semibold text-neutral-800 dark:text-darkTheme-text mb-6">
                Registrar Nueva Transacción
              </h3>

              {message.text && (
                <div className={`mb-4 p-4 rounded-lg border-l-4 ${
                  message.type === 'success'
                    ? 'bg-green-50 dark:bg-green-900/20 border-green-500 dark:border-green-400'
                    : 'bg-red-50 dark:bg-red-900/20 border-red-500 dark:border-red-400'
                }`}>
                  <p className={`text-sm ${
                    message.type === 'success'
                      ? 'text-green-700 dark:text-green-400'
                      : 'text-red-700 dark:text-red-400'
                  }`}>
                    {message.text}
                  </p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Tipo de transacción */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-darkTheme-text mb-2">
                    Tipo de Transacción *
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, type: 'income', category: '' })}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        formData.type === 'income'
                          ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                          : 'border-neutral-200 dark:border-darkTheme-border hover:border-green-300'
                      }`}
                    >
                      <TrendingUp className={`mx-auto mb-2 ${
                        formData.type === 'income' ? 'text-green-600' : 'text-neutral-400'
                      }`} size={24} />
                      <p className={`font-medium ${
                        formData.type === 'income'
                          ? 'text-green-700 dark:text-green-400'
                          : 'text-neutral-600 dark:text-darkTheme-muted'
                      }`}>Ingreso</p>
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, type: 'expense', category: '' })}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        formData.type === 'expense'
                          ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                          : 'border-neutral-200 dark:border-darkTheme-border hover:border-red-300'
                      }`}
                    >
                      <TrendingDown className={`mx-auto mb-2 ${
                        formData.type === 'expense' ? 'text-red-600' : 'text-neutral-400'
                      }`} size={24} />
                      <p className={`font-medium ${
                        formData.type === 'expense'
                          ? 'text-red-700 dark:text-red-400'
                          : 'text-neutral-600 dark:text-darkTheme-muted'
                      }`}>Gasto</p>
                    </button>
                  </div>
                </div>

                {/* Monto */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-darkTheme-text mb-2">
                    Monto *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500">$</span>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.amount}
                      onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                      className="input-field pl-8"
                      placeholder="0.00"
                      required
                    />
                  </div>
                </div>

                {/* Categoría */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-darkTheme-text mb-2">
                    Categoría *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="input-field"
                    required
                  >
                    <option value="">Selecciona una categoría</option>
                    {getCurrentCategories().map((cat) => (
                      <option key={cat.value} value={cat.value}>
                        {cat.icon} {cat.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Descripción */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-darkTheme-text mb-2">
                    Descripción *
                  </label>
                  <input
                    type="text"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="input-field"
                    placeholder="Ej: Compra en supermercado"
                    maxLength={200}
                    required
                  />
                </div>

                {/* Fecha */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-darkTheme-text mb-2">
                    Fecha
                  </label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="input-field"
                  />
                </div>

                {/* Notas opcionales */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-darkTheme-text mb-2">
                    Notas (Opcional)
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="input-field resize-none"
                    rows="3"
                    placeholder="Información adicional..."
                    maxLength={500}
                  />
                </div>

                {/* Botón de envío */}
                <button
                  type="submit"
                  className="w-full btn-primary flex items-center justify-center gap-2"
                >
                  <Save size={20} />
                  Registrar Transacción
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FinanceView;
