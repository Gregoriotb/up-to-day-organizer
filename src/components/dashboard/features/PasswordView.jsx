import { useState, useEffect } from 'react';
import { Lock, Plus, Search, Eye, EyeOff, Copy, Star, Trash2, Shield, AlertTriangle, Key, RefreshCw, Download, Upload, ChevronLeft, Check, Globe, Mail as MailIcon, User, StickyNote } from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Vista de gestión de contraseñas
 * Bóveda segura con encriptación AES-256
 */
const PasswordView = () => {
  const { token } = useAuth();

  // Estados principales
  const [activeView, setActiveView] = useState('vault'); // 'vault', 'add', 'edit', 'details', 'generator', 'security'
  const [passwords, setPasswords] = useState([]);
  const [filteredPasswords, setFilteredPasswords] = useState([]);
  const [selectedPassword, setSelectedPassword] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [message, setMessage] = useState({ type: '', text: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [copiedField, setCopiedField] = useState('');

  // Formulario de contraseña
  const [passwordForm, setPasswordForm] = useState({
    website: '',
    websiteUrl: '',
    username: '',
    email: '',
    password: '',
    notes: '',
    category: 'other',
    tags: [],
    has2FA: false,
    twoFactorType: 'none'
  });

  // Generador de contraseñas
  const [generatorOptions, setGeneratorOptions] = useState({
    length: 16,
    includeUppercase: true,
    includeLowercase: true,
    includeNumbers: true,
    includeSymbols: true
  });
  const [generatedPassword, setGeneratedPassword] = useState('');

  const categories = [
    { value: 'all', label: 'Todas', icon: Globe },
    { value: 'social', label: 'Redes Sociales', icon: User },
    { value: 'banking', label: 'Banca', icon: Shield },
    { value: 'email', label: 'Email', icon: MailIcon },
    { value: 'shopping', label: 'Compras', icon: Globe },
    { value: 'work', label: 'Trabajo', icon: Globe },
    { value: 'entertainment', label: 'Entretenimiento', icon: Globe },
    { value: 'utilities', label: 'Servicios', icon: Globe },
    { value: 'other', label: 'Otros', icon: Globe }
  ];

  // Cargar contraseñas y estadísticas
  useEffect(() => {
    fetchPasswords();
    fetchStats();
  }, []);

  // Filtrar contraseñas
  useEffect(() => {
    let filtered = passwords;

    if (filterCategory !== 'all') {
      filtered = filtered.filter(pwd => pwd.category === filterCategory);
    }

    if (searchQuery) {
      filtered = filtered.filter(pwd =>
        pwd.website.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pwd.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pwd.email?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredPasswords(filtered);
  }, [passwords, filterCategory, searchQuery]);

  /**
   * Obtener todas las contraseñas
   */
  const fetchPasswords = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/password/passwords`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setPasswords(data);
      }
    } catch (error) {
      console.error('Error fetching passwords:', error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Obtener estadísticas de seguridad
   */
  const fetchStats = async () => {
    try {
      const response = await fetch(`${API_URL}/password/stats`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  /**
   * Crear nueva contraseña
   */
  const handleCreatePassword = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/password/passwords`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(passwordForm)
      });

      if (response.ok) {
        setMessage({ type: 'success', text: 'Contraseña guardada exitosamente' });
        resetForm();
        await fetchPasswords();
        await fetchStats();
        setTimeout(() => setActiveView('vault'), 1500);
      } else {
        const data = await response.json();
        setMessage({ type: 'error', text: data.message || 'Error al guardar contraseña' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setLoading(false);
    }
  };

  /**
   * Actualizar contraseña
   */
  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/password/passwords/${selectedPassword._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(passwordForm)
      });

      if (response.ok) {
        setMessage({ type: 'success', text: 'Contraseña actualizada exitosamente' });
        await fetchPasswords();
        await fetchStats();
        setTimeout(() => setActiveView('vault'), 1500);
      } else {
        const data = await response.json();
        setMessage({ type: 'error', text: data.message || 'Error al actualizar contraseña' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setLoading(false);
    }
  };

  /**
   * Eliminar contraseña
   */
  const handleDeletePassword = async (id) => {
    if (!confirm('¿Estás seguro de eliminar esta contraseña?')) return;

    try {
      const response = await fetch(`${API_URL}/password/passwords/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        setMessage({ type: 'success', text: 'Contraseña eliminada' });
        await fetchPasswords();
        await fetchStats();
        setActiveView('vault');
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Error al eliminar contraseña' });
    }
  };

  /**
   * Ver detalles de una contraseña (con desencriptación)
   */
  const viewPasswordDetails = async (id) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/password/passwords/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setSelectedPassword(data);
        setActiveView('details');
      }
    } catch (error) {
      console.error('Error viewing password:', error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Editar contraseña
   */
  const editPassword = async (id) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/password/passwords/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setSelectedPassword(data);
        setPasswordForm({
          website: data.website,
          websiteUrl: data.websiteUrl || '',
          username: data.username,
          email: data.email || '',
          password: data.password,
          notes: data.notes || '',
          category: data.category,
          tags: data.tags || [],
          has2FA: data.has2FA,
          twoFactorType: data.twoFactorType
        });
        setActiveView('edit');
      }
    } catch (error) {
      console.error('Error loading password:', error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Alternar favorito
   */
  const toggleFavorite = async (id, e) => {
    e.stopPropagation();
    try {
      await fetch(`${API_URL}/password/passwords/${id}/favorite`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      await fetchPasswords();
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  /**
   * Generar contraseña segura
   */
  const handleGeneratePassword = async () => {
    try {
      const response = await fetch(`${API_URL}/password/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          length: generatorOptions.length,
          options: {
            includeUppercase: generatorOptions.includeUppercase,
            includeLowercase: generatorOptions.includeLowercase,
            includeNumbers: generatorOptions.includeNumbers,
            includeSymbols: generatorOptions.includeSymbols
          }
        })
      });

      if (response.ok) {
        const data = await response.json();
        setGeneratedPassword(data.password);
      }
    } catch (error) {
      console.error('Error generating password:', error);
    }
  };

  /**
   * Copiar al portapapeles
   */
  const copyToClipboard = (text, field) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(''), 2000);
  };

  /**
   * Usar contraseña generada
   */
  const useGeneratedPassword = () => {
    setPasswordForm({ ...passwordForm, password: generatedPassword });
    setActiveView('add');
  };

  /**
   * Resetear formulario
   */
  const resetForm = () => {
    setPasswordForm({
      website: '',
      websiteUrl: '',
      username: '',
      email: '',
      password: '',
      notes: '',
      category: 'other',
      tags: [],
      has2FA: false,
      twoFactorType: 'none'
    });
    setSelectedPassword(null);
  };

  /**
   * Obtener color de fortaleza
   */
  const getStrengthColor = (strength) => {
    const colors = {
      'weak': 'text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-400',
      'medium': 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-400',
      'strong': 'text-blue-600 bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400',
      'very-strong': 'text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400'
    };
    return colors[strength] || colors.medium;
  };

  /**
   * Obtener texto de fortaleza
   */
  const getStrengthText = (strength) => {
    const texts = {
      'weak': 'Débil',
      'medium': 'Media',
      'strong': 'Fuerte',
      'very-strong': 'Muy Fuerte'
    };
    return texts[strength] || 'Media';
  };

  // ===== RENDERIZADO DE VISTAS =====

  /**
   * Vista de bóveda (lista de contraseñas)
   */
  const renderVaultView = () => (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-neutral-800 dark:text-darkTheme-text">
            Bóveda de Contraseñas
          </h2>
          <p className="text-sm text-neutral-600 dark:text-darkTheme-muted mt-1">
            {passwords.length} contraseñas almacenadas de forma segura
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setActiveView('security')}
            className="flex items-center gap-2 px-4 py-2 bg-neutral-200 dark:bg-darkTheme-border hover:bg-neutral-300 dark:hover:bg-neutral-600 text-neutral-800 dark:text-darkTheme-text rounded-lg transition-colors"
          >
            <Shield size={20} />
            Seguridad
          </button>
          <button
            onClick={() => setActiveView('generator')}
            className="flex items-center gap-2 px-4 py-2 bg-secondary hover:bg-secondary-dark text-white rounded-lg transition-colors"
          >
            <Key size={20} />
            Generar
          </button>
          <button
            onClick={() => {
              resetForm();
              setActiveView('add');
            }}
            className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg transition-colors"
          >
            <Plus size={20} />
            Nueva
          </button>
        </div>
      </div>

      {/* Búsqueda y filtros */}
      <div className="flex gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={20} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar contraseñas..."
            className="w-full pl-10 pr-4 py-2 border border-neutral-300 dark:border-darkTheme-border rounded-lg bg-white dark:bg-darkTheme-bg text-neutral-800 dark:text-darkTheme-text focus:ring-2 focus:ring-primary"
          />
        </div>
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="px-4 py-2 border border-neutral-300 dark:border-darkTheme-border rounded-lg bg-white dark:bg-darkTheme-bg text-neutral-800 dark:text-darkTheme-text focus:ring-2 focus:ring-primary"
        >
          {categories.map(cat => (
            <option key={cat.value} value={cat.value}>{cat.label}</option>
          ))}
        </select>
      </div>

      {/* Lista de contraseñas */}
      {loading && passwords.length === 0 ? (
        <div className="text-center py-12">
          <RefreshCw className="animate-spin mx-auto mb-4 text-primary" size={40} />
          <p className="text-neutral-600 dark:text-darkTheme-muted">Cargando contraseñas...</p>
        </div>
      ) : filteredPasswords.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-darkTheme-card rounded-lg border-2 border-dashed border-neutral-300 dark:border-darkTheme-border">
          <Lock className="mx-auto mb-4 text-neutral-400" size={48} />
          <p className="text-neutral-600 dark:text-darkTheme-text font-medium">
            {passwords.length === 0 ? 'No tienes contraseñas guardadas' : 'No se encontraron contraseñas'}
          </p>
          <p className="text-sm text-neutral-500 dark:text-darkTheme-muted mt-2">
            {passwords.length === 0 ? 'Agrega tu primera contraseña para comenzar' : 'Prueba con otros términos de búsqueda'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPasswords.map(pwd => (
            <div
              key={pwd._id}
              onClick={() => viewPasswordDetails(pwd._id)}
              className="bg-white dark:bg-darkTheme-card border border-neutral-200 dark:border-darkTheme-border rounded-lg p-6 hover:shadow-lg transition-all cursor-pointer group"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-neutral-800 dark:text-darkTheme-text truncate mb-1">
                    {pwd.website}
                  </h3>
                  <p className="text-sm text-neutral-600 dark:text-darkTheme-muted truncate">
                    {pwd.username}
                  </p>
                </div>
                <button
                  onClick={(e) => toggleFavorite(pwd._id, e)}
                  className="p-1"
                >
                  <Star
                    size={18}
                    className={pwd.isFavorite ? 'fill-yellow-400 text-yellow-400' : 'text-neutral-400'}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-neutral-200 dark:border-darkTheme-border">
                <span className={`px-2 py-1 rounded text-xs font-medium ${getStrengthColor(pwd.strength)}`}>
                  {getStrengthText(pwd.strength)}
                </span>
                <div className="flex items-center gap-2 text-xs text-neutral-500 dark:text-darkTheme-muted">
                  {pwd.has2FA && (
                    <span className="flex items-center gap-1 text-green-600 dark:text-green-400">
                      <Shield size={14} />
                      2FA
                    </span>
                  )}
                  <span>{pwd.passwordAge}d</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  /**
   * Vista de detalles de contraseña
   */
  const renderDetailsView = () => (
    <div className="p-6 max-w-2xl mx-auto">
      <button
        onClick={() => setActiveView('vault')}
        className="flex items-center gap-2 text-neutral-600 dark:text-darkTheme-muted hover:text-primary mb-6"
      >
        <ChevronLeft size={20} />
        Volver a la bóveda
      </button>

      <div className="bg-white dark:bg-darkTheme-card rounded-lg border border-neutral-200 dark:border-darkTheme-border p-8">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-neutral-800 dark:text-darkTheme-text mb-2">
              {selectedPassword?.website}
            </h2>
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStrengthColor(selectedPassword?.strength)}`}>
              Seguridad: {getStrengthText(selectedPassword?.strength)}
            </span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => editPassword(selectedPassword._id)}
              className="p-2 hover:bg-neutral-100 dark:hover:bg-darkTheme-border rounded-lg transition-colors"
              title="Editar"
            >
              <Key size={20} />
            </button>
            <button
              onClick={() => handleDeletePassword(selectedPassword._id)}
              className="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 rounded-lg transition-colors"
              title="Eliminar"
            >
              <Trash2 size={20} />
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {selectedPassword?.websiteUrl && (
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-darkTheme-text mb-2">
                URL del sitio
              </label>
              <a
                href={selectedPassword.websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                {selectedPassword.websiteUrl}
              </a>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-darkTheme-text mb-2">
              Usuario
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={selectedPassword?.username || ''}
                readOnly
                className="flex-1 px-4 py-2 border border-neutral-300 dark:border-darkTheme-border rounded-lg bg-neutral-50 dark:bg-darkTheme-bg text-neutral-800 dark:text-darkTheme-text"
              />
              <button
                onClick={() => copyToClipboard(selectedPassword?.username, 'username')}
                className="p-2 hover:bg-neutral-100 dark:hover:bg-darkTheme-border rounded-lg transition-colors"
                title="Copiar"
              >
                {copiedField === 'username' ? <Check size={20} className="text-green-600" /> : <Copy size={20} />}
              </button>
            </div>
          </div>

          {selectedPassword?.email && (
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-darkTheme-text mb-2">
                Email
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={selectedPassword.email}
                  readOnly
                  className="flex-1 px-4 py-2 border border-neutral-300 dark:border-darkTheme-border rounded-lg bg-neutral-50 dark:bg-darkTheme-bg text-neutral-800 dark:text-darkTheme-text"
                />
                <button
                  onClick={() => copyToClipboard(selectedPassword.email, 'email')}
                  className="p-2 hover:bg-neutral-100 dark:hover:bg-darkTheme-border rounded-lg transition-colors"
                  title="Copiar"
                >
                  {copiedField === 'email' ? <Check size={20} className="text-green-600" /> : <Copy size={20} />}
                </button>
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-darkTheme-text mb-2">
              Contraseña
            </label>
            <div className="flex items-center gap-2">
              <input
                type={showPassword ? 'text' : 'password'}
                value={selectedPassword?.password || ''}
                readOnly
                className="flex-1 px-4 py-2 border border-neutral-300 dark:border-darkTheme-border rounded-lg bg-neutral-50 dark:bg-darkTheme-bg text-neutral-800 dark:text-darkTheme-text font-mono"
              />
              <button
                onClick={() => setShowPassword(!showPassword)}
                className="p-2 hover:bg-neutral-100 dark:hover:bg-darkTheme-border rounded-lg transition-colors"
                title={showPassword ? 'Ocultar' : 'Mostrar'}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
              <button
                onClick={() => copyToClipboard(selectedPassword?.password, 'password')}
                className="p-2 hover:bg-neutral-100 dark:hover:bg-darkTheme-border rounded-lg transition-colors"
                title="Copiar"
              >
                {copiedField === 'password' ? <Check size={20} className="text-green-600" /> : <Copy size={20} />}
              </button>
            </div>
          </div>

          {selectedPassword?.notes && (
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-darkTheme-text mb-2">
                Notas
              </label>
              <textarea
                value={selectedPassword.notes}
                readOnly
                rows={4}
                className="w-full px-4 py-2 border border-neutral-300 dark:border-darkTheme-border rounded-lg bg-neutral-50 dark:bg-darkTheme-bg text-neutral-800 dark:text-darkTheme-text resize-none"
              />
            </div>
          )}

          <div className="pt-4 border-t border-neutral-200 dark:border-darkTheme-border">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-neutral-600 dark:text-darkTheme-muted">Categoría</p>
                <p className="font-medium text-neutral-800 dark:text-darkTheme-text">
                  {categories.find(c => c.value === selectedPassword?.category)?.label || 'Otros'}
                </p>
              </div>
              <div>
                <p className="text-neutral-600 dark:text-darkTheme-muted">2FA</p>
                <p className="font-medium text-neutral-800 dark:text-darkTheme-text">
                  {selectedPassword?.has2FA ? `Sí (${selectedPassword.twoFactorType})` : 'No'}
                </p>
              </div>
              <div>
                <p className="text-neutral-600 dark:text-darkTheme-muted">Antigüedad</p>
                <p className="font-medium text-neutral-800 dark:text-darkTheme-text">
                  {selectedPassword?.passwordAge} días
                </p>
              </div>
              <div>
                <p className="text-neutral-600 dark:text-darkTheme-muted">Veces usado</p>
                <p className="font-medium text-neutral-800 dark:text-darkTheme-text">
                  {selectedPassword?.timesUsed || 0}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  /**
   * Vista de formulario (agregar/editar)
   */
  const renderFormView = () => {
    const isEdit = activeView === 'edit';

    return (
      <div className="p-6 max-w-2xl mx-auto">
        <button
          onClick={() => setActiveView('vault')}
          className="flex items-center gap-2 text-neutral-600 dark:text-darkTheme-muted hover:text-primary mb-6"
        >
          <ChevronLeft size={20} />
          Volver a la bóveda
        </button>

        <div className="bg-white dark:bg-darkTheme-card rounded-lg border border-neutral-200 dark:border-darkTheme-border p-8">
          <h2 className="text-2xl font-bold text-neutral-800 dark:text-darkTheme-text mb-6">
            {isEdit ? 'Editar Contraseña' : 'Nueva Contraseña'}
          </h2>

          {message.text && (
            <div className={`p-4 rounded-lg mb-6 ${
              message.type === 'success'
                ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
            }`}>
              {message.text}
            </div>
          )}

          <form onSubmit={isEdit ? handleUpdatePassword : handleCreatePassword} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-sm font-medium text-neutral-700 dark:text-darkTheme-text mb-2">
                  Sitio web *
                </label>
                <input
                  type="text"
                  value={passwordForm.website}
                  onChange={(e) => setPasswordForm({...passwordForm, website: e.target.value})}
                  className="w-full px-4 py-2 border border-neutral-300 dark:border-darkTheme-border rounded-lg bg-white dark:bg-darkTheme-bg text-neutral-800 dark:text-darkTheme-text focus:ring-2 focus:ring-primary"
                  placeholder="Google, Facebook, GitHub..."
                  required
                />
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium text-neutral-700 dark:text-darkTheme-text mb-2">
                  URL del sitio
                </label>
                <input
                  type="url"
                  value={passwordForm.websiteUrl}
                  onChange={(e) => setPasswordForm({...passwordForm, websiteUrl: e.target.value})}
                  className="w-full px-4 py-2 border border-neutral-300 dark:border-darkTheme-border rounded-lg bg-white dark:bg-darkTheme-bg text-neutral-800 dark:text-darkTheme-text focus:ring-2 focus:ring-primary"
                  placeholder="https://ejemplo.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-darkTheme-text mb-2">
                  Usuario *
                </label>
                <input
                  type="text"
                  value={passwordForm.username}
                  onChange={(e) => setPasswordForm({...passwordForm, username: e.target.value})}
                  className="w-full px-4 py-2 border border-neutral-300 dark:border-darkTheme-border rounded-lg bg-white dark:bg-darkTheme-bg text-neutral-800 dark:text-darkTheme-text focus:ring-2 focus:ring-primary"
                  placeholder="usuario123"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-darkTheme-text mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={passwordForm.email}
                  onChange={(e) => setPasswordForm({...passwordForm, email: e.target.value})}
                  className="w-full px-4 py-2 border border-neutral-300 dark:border-darkTheme-border rounded-lg bg-white dark:bg-darkTheme-bg text-neutral-800 dark:text-darkTheme-text focus:ring-2 focus:ring-primary"
                  placeholder="usuario@ejemplo.com"
                />
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium text-neutral-700 dark:text-darkTheme-text mb-2">
                  Contraseña *
                </label>
                <div className="flex gap-2">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={passwordForm.password}
                    onChange={(e) => setPasswordForm({...passwordForm, password: e.target.value})}
                    className="flex-1 px-4 py-2 border border-neutral-300 dark:border-darkTheme-border rounded-lg bg-white dark:bg-darkTheme-bg text-neutral-800 dark:text-darkTheme-text focus:ring-2 focus:ring-primary font-mono"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="p-2 hover:bg-neutral-100 dark:hover:bg-darkTheme-border rounded-lg transition-colors"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveView('generator')}
                    className="px-4 py-2 bg-secondary hover:bg-secondary-dark text-white rounded-lg transition-colors"
                  >
                    <Key size={20} />
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-darkTheme-text mb-2">
                  Categoría
                </label>
                <select
                  value={passwordForm.category}
                  onChange={(e) => setPasswordForm({...passwordForm, category: e.target.value})}
                  className="w-full px-4 py-2 border border-neutral-300 dark:border-darkTheme-border rounded-lg bg-white dark:bg-darkTheme-bg text-neutral-800 dark:text-darkTheme-text focus:ring-2 focus:ring-primary"
                >
                  {categories.filter(c => c.value !== 'all').map(cat => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-darkTheme-text mb-2">
                  2FA
                </label>
                <select
                  value={passwordForm.twoFactorType}
                  onChange={(e) => setPasswordForm({
                    ...passwordForm,
                    twoFactorType: e.target.value,
                    has2FA: e.target.value !== 'none'
                  })}
                  className="w-full px-4 py-2 border border-neutral-300 dark:border-darkTheme-border rounded-lg bg-white dark:bg-darkTheme-bg text-neutral-800 dark:text-darkTheme-text focus:ring-2 focus:ring-primary"
                >
                  <option value="none">Sin 2FA</option>
                  <option value="app">App Autenticación</option>
                  <option value="sms">SMS</option>
                  <option value="email">Email</option>
                  <option value="hardware">Llave Hardware</option>
                </select>
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium text-neutral-700 dark:text-darkTheme-text mb-2">
                  Notas (opcional)
                </label>
                <textarea
                  value={passwordForm.notes}
                  onChange={(e) => setPasswordForm({...passwordForm, notes: e.target.value})}
                  rows={4}
                  className="w-full px-4 py-2 border border-neutral-300 dark:border-darkTheme-border rounded-lg bg-white dark:bg-darkTheme-bg text-neutral-800 dark:text-darkTheme-text focus:ring-2 focus:ring-primary resize-none"
                  placeholder="Información adicional sobre esta contraseña..."
                  maxLength={500}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-primary hover:bg-primary-dark text-white rounded-lg font-medium transition-colors disabled:opacity-50"
            >
              {loading ? 'Guardando...' : (isEdit ? 'Actualizar Contraseña' : 'Guardar Contraseña')}
            </button>
          </form>
        </div>
      </div>
    );
  };

  /**
   * Vista de generador de contraseñas
   */
  const renderGeneratorView = () => (
    <div className="p-6 max-w-2xl mx-auto">
      <button
        onClick={() => setActiveView(passwordForm.website ? 'add' : 'vault')}
        className="flex items-center gap-2 text-neutral-600 dark:text-darkTheme-muted hover:text-primary mb-6"
      >
        <ChevronLeft size={20} />
        Volver
      </button>

      <div className="bg-white dark:bg-darkTheme-card rounded-lg border border-neutral-200 dark:border-darkTheme-border p-8">
        <h2 className="text-2xl font-bold text-neutral-800 dark:text-darkTheme-text mb-6 flex items-center gap-2">
          <Key size={28} className="text-primary" />
          Generador de Contraseñas
        </h2>

        <div className="space-y-6">
          {generatedPassword && (
            <div className="p-4 bg-primary/10 dark:bg-primary/20 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-neutral-700 dark:text-darkTheme-text">
                  Contraseña generada:
                </span>
                <button
                  onClick={() => copyToClipboard(generatedPassword, 'generated')}
                  className="flex items-center gap-2 px-3 py-1 bg-white dark:bg-darkTheme-bg hover:bg-neutral-100 dark:hover:bg-darkTheme-border rounded transition-colors"
                >
                  {copiedField === 'generated' ? (
                    <>
                      <Check size={16} className="text-green-600" />
                      <span className="text-sm text-green-600">¡Copiado!</span>
                    </>
                  ) : (
                    <>
                      <Copy size={16} />
                      <span className="text-sm">Copiar</span>
                    </>
                  )}
                </button>
              </div>
              <div className="font-mono text-lg p-3 bg-white dark:bg-darkTheme-bg rounded border border-neutral-300 dark:border-darkTheme-border text-neutral-800 dark:text-darkTheme-text break-all">
                {generatedPassword}
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-darkTheme-text mb-2">
              Longitud: {generatorOptions.length}
            </label>
            <input
              type="range"
              min="8"
              max="32"
              value={generatorOptions.length}
              onChange={(e) => setGeneratorOptions({...generatorOptions, length: parseInt(e.target.value)})}
              className="w-full"
            />
          </div>

          <div className="space-y-3">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={generatorOptions.includeUppercase}
                onChange={(e) => setGeneratorOptions({...generatorOptions, includeUppercase: e.target.checked})}
                className="w-4 h-4 text-primary focus:ring-primary"
              />
              <span className="text-sm text-neutral-700 dark:text-darkTheme-text">Incluir mayúsculas (A-Z)</span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={generatorOptions.includeLowercase}
                onChange={(e) => setGeneratorOptions({...generatorOptions, includeLowercase: e.target.checked})}
                className="w-4 h-4 text-primary focus:ring-primary"
              />
              <span className="text-sm text-neutral-700 dark:text-darkTheme-text">Incluir minúsculas (a-z)</span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={generatorOptions.includeNumbers}
                onChange={(e) => setGeneratorOptions({...generatorOptions, includeNumbers: e.target.checked})}
                className="w-4 h-4 text-primary focus:ring-primary"
              />
              <span className="text-sm text-neutral-700 dark:text-darkTheme-text">Incluir números (0-9)</span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={generatorOptions.includeSymbols}
                onChange={(e) => setGeneratorOptions({...generatorOptions, includeSymbols: e.target.checked})}
                className="w-4 h-4 text-primary focus:ring-primary"
              />
              <span className="text-sm text-neutral-700 dark:text-darkTheme-text">Incluir símbolos (!@#$%^&*)</span>
            </label>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleGeneratePassword}
              className="flex-1 py-3 bg-primary hover:bg-primary-dark text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
            >
              <RefreshCw size={20} />
              Generar Contraseña
            </button>

            {generatedPassword && (
              <button
                onClick={useGeneratedPassword}
                className="flex-1 py-3 bg-secondary hover:bg-secondary-dark text-white rounded-lg font-medium transition-colors"
              >
                Usar esta contraseña
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  /**
   * Vista de dashboard de seguridad
   */
  const renderSecurityView = () => (
    <div className="p-6">
      <button
        onClick={() => setActiveView('vault')}
        className="flex items-center gap-2 text-neutral-600 dark:text-darkTheme-muted hover:text-primary mb-6"
      >
        <ChevronLeft size={20} />
        Volver a la bóveda
      </button>

      <div className="mb-6">
        <h2 className="text-2xl font-bold text-neutral-800 dark:text-darkTheme-text mb-2">
          Dashboard de Seguridad
        </h2>
        <p className="text-neutral-600 dark:text-darkTheme-muted">
          Análisis de la seguridad de tus contraseñas
        </p>
      </div>

      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white dark:bg-darkTheme-card border border-neutral-200 dark:border-darkTheme-border rounded-lg p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className={`p-3 rounded-lg ${
                stats.securityScore >= 80 ? 'bg-green-100 dark:bg-green-900/30' :
                stats.securityScore >= 60 ? 'bg-yellow-100 dark:bg-yellow-900/30' :
                'bg-red-100 dark:bg-red-900/30'
              }`}>
                <Shield size={24} className={
                  stats.securityScore >= 80 ? 'text-green-600 dark:text-green-400' :
                  stats.securityScore >= 60 ? 'text-yellow-600 dark:text-yellow-400' :
                  'text-red-600 dark:text-red-400'
                } />
              </div>
              <div>
                <p className="text-2xl font-bold text-neutral-800 dark:text-darkTheme-text">
                  {stats.securityScore}%
                </p>
                <p className="text-xs text-neutral-600 dark:text-darkTheme-muted">Score de Seguridad</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-darkTheme-card border border-neutral-200 dark:border-darkTheme-border rounded-lg p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-lg">
                <AlertTriangle size={24} className="text-red-600 dark:text-red-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-neutral-800 dark:text-darkTheme-text">{stats.weak}</p>
                <p className="text-xs text-neutral-600 dark:text-darkTheme-muted">Contraseñas Débiles</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-darkTheme-card border border-neutral-200 dark:border-darkTheme-border rounded-lg p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
                <AlertTriangle size={24} className="text-yellow-600 dark:text-yellow-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-neutral-800 dark:text-darkTheme-text">{stats.old}</p>
                <p className="text-xs text-neutral-600 dark:text-darkTheme-muted">Contraseñas Antiguas</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-darkTheme-card border border-neutral-200 dark:border-darkTheme-border rounded-lg p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <Shield size={24} className="text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-neutral-800 dark:text-darkTheme-text">{stats.with2FA}</p>
                <p className="text-xs text-neutral-600 dark:text-darkTheme-muted">Con 2FA</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-darkTheme-card border border-neutral-200 dark:border-darkTheme-border rounded-lg p-6">
          <h3 className="font-semibold text-neutral-800 dark:text-darkTheme-text mb-4">
            Distribución por Fortaleza
          </h3>
          {stats && (
            <div className="space-y-3">
              {Object.entries(stats.byStrength).map(([strength, count]) => (
                <div key={strength} className="flex items-center justify-between">
                  <span className={`px-3 py-1 rounded text-sm font-medium ${getStrengthColor(strength)}`}>
                    {getStrengthText(strength)}
                  </span>
                  <span className="text-neutral-700 dark:text-darkTheme-text font-medium">{count}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white dark:bg-darkTheme-card border border-neutral-200 dark:border-darkTheme-border rounded-lg p-6">
          <h3 className="font-semibold text-neutral-800 dark:text-darkTheme-text mb-4">
            Distribución por Categoría
          </h3>
          {stats && (
            <div className="space-y-3">
              {Object.entries(stats.byCategory).map(([category, count]) => (
                <div key={category} className="flex items-center justify-between">
                  <span className="text-sm text-neutral-700 dark:text-darkTheme-text">
                    {categories.find(c => c.value === category)?.label || category}
                  </span>
                  <span className="text-neutral-700 dark:text-darkTheme-text font-medium">{count}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  // Renderizado principal
  return (
    <div className="h-full bg-neutral-50 dark:bg-darkTheme-bg overflow-auto">
      {activeView === 'vault' && renderVaultView()}
      {activeView === 'details' && renderDetailsView()}
      {(activeView === 'add' || activeView === 'edit') && renderFormView()}
      {activeView === 'generator' && renderGeneratorView()}
      {activeView === 'security' && renderSecurityView()}
    </div>
  );
};

export default PasswordView;
