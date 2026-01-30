import { useState, useEffect } from 'react';
import { Mail, Plus, RefreshCw, Inbox, Star, Send, Trash2, Search, Settings, MailOpen, ChevronLeft, Paperclip, X } from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Vista de gestión de correos electrónicos
 * Interfaz similar a Thunderbird para administrar múltiples cuentas
 */
const EmailView = () => {
  const { token } = useAuth();

  // Estados principales
  const [activeView, setActiveView] = useState('accounts'); // 'accounts', 'inbox', 'email', 'compose', 'add-account'
  const [accounts, setAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [emails, setEmails] = useState([]);
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [message, setMessage] = useState({ type: '', text: '' });

  // Formulario de nueva cuenta
  const [accountForm, setAccountForm] = useState({
    accountName: '',
    email: '',
    password: '',
    provider: 'gmail'
  });

  // Formulario de composición
  const [composeForm, setComposeForm] = useState({
    to: '',
    subject: '',
    text: '',
    html: ''
  });

  // Cargar cuentas al montar
  useEffect(() => {
    fetchAccounts();
  }, []);

  /**
   * Obtener todas las cuentas de correo
   */
  const fetchAccounts = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/email/accounts`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setAccounts(data);
      }
    } catch (error) {
      console.error('Error fetching accounts:', error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Crear una nueva cuenta de correo
   */
  const handleCreateAccount = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/email/accounts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(accountForm)
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: 'success', text: 'Cuenta agregada exitosamente' });
        setAccountForm({ accountName: '', email: '', password: '', provider: 'gmail' });
        await fetchAccounts();
        setTimeout(() => setActiveView('accounts'), 1500);
      } else {
        setMessage({ type: 'error', text: data.message || 'Error al agregar cuenta' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setLoading(false);
    }
  };

  /**
   * Sincronizar emails de una cuenta
   */
  const handleSync = async (accountId) => {
    try {
      setSyncing(true);
      const response = await fetch(`${API_URL}/email/accounts/${accountId}/sync`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setMessage({ type: 'success', text: `${data.emailsSynced} emails sincronizados` });
        await fetchEmails(accountId);
        await fetchAccounts();
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Error al sincronizar emails' });
    } finally {
      setSyncing(false);
    }
  };

  /**
   * Obtener emails de una cuenta
   */
  const fetchEmails = async (accountId, search = '') => {
    try {
      setLoading(true);
      const url = `${API_URL}/email/accounts/${accountId}/emails${search ? `?search=${search}` : ''}`;

      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setEmails(data.emails);
      }
    } catch (error) {
      console.error('Error fetching emails:', error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Abrir una cuenta y ver sus emails
   */
  const openAccount = (account) => {
    setSelectedAccount(account);
    fetchEmails(account._id);
    setActiveView('inbox');
  };

  /**
   * Abrir un email específico
   */
  const openEmail = async (email) => {
    try {
      const response = await fetch(`${API_URL}/email/emails/${email._id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setSelectedEmail(data);
        setActiveView('email');
      }
    } catch (error) {
      console.error('Error opening email:', error);
    }
  };

  /**
   * Alternar estrella en email
   */
  const toggleStar = async (emailId, e) => {
    e.stopPropagation();
    try {
      const response = await fetch(`${API_URL}/email/emails/${emailId}/star`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        await fetchEmails(selectedAccount._id, searchQuery);
      }
    } catch (error) {
      console.error('Error toggling star:', error);
    }
  };

  /**
   * Eliminar email
   */
  const deleteEmail = async (emailId) => {
    if (!confirm('¿Estás seguro de eliminar este email?')) return;

    try {
      const response = await fetch(`${API_URL}/email/emails/${emailId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        setMessage({ type: 'success', text: 'Email eliminado' });
        await fetchEmails(selectedAccount._id, searchQuery);
        setActiveView('inbox');
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Error al eliminar email' });
    }
  };

  /**
   * Enviar email
   */
  const handleSendEmail = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/email/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          accountId: selectedAccount._id,
          ...composeForm
        })
      });

      if (response.ok) {
        setMessage({ type: 'success', text: 'Email enviado exitosamente' });
        setComposeForm({ to: '', subject: '', text: '', html: '' });
        setTimeout(() => setActiveView('inbox'), 1500);
      } else {
        const data = await response.json();
        setMessage({ type: 'error', text: data.message || 'Error al enviar email' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setLoading(false);
    }
  };

  /**
   * Búsqueda de emails
   */
  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (selectedAccount && query.length > 2) {
      fetchEmails(selectedAccount._id, query);
    } else if (selectedAccount && query.length === 0) {
      fetchEmails(selectedAccount._id);
    }
  };

  /**
   * Formatear fecha
   */
  const formatDate = (date) => {
    const d = new Date(date);
    const today = new Date();
    const isToday = d.toDateString() === today.toDateString();

    if (isToday) {
      return d.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
    }
    return d.toLocaleDateString('es-ES', { day: '2-digit', month: 'short' });
  };

  // ===== RENDERIZADO DE VISTAS =====

  /**
   * Vista de lista de cuentas
   */
  const renderAccountsView = () => (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-neutral-800 dark:text-darkTheme-text">
            Cuentas de Correo
          </h2>
          <p className="text-sm text-neutral-600 dark:text-darkTheme-muted mt-1">
            Administra tus cuentas de correo electrónico
          </p>
        </div>
        <button
          onClick={() => setActiveView('add-account')}
          className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg transition-colors"
        >
          <Plus size={20} />
          Agregar Cuenta
        </button>
      </div>

      {loading && accounts.length === 0 ? (
        <div className="text-center py-12">
          <RefreshCw className="animate-spin mx-auto mb-4 text-primary" size={40} />
          <p className="text-neutral-600 dark:text-darkTheme-muted">Cargando cuentas...</p>
        </div>
      ) : accounts.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-darkTheme-card rounded-lg border-2 border-dashed border-neutral-300 dark:border-darkTheme-border">
          <Mail className="mx-auto mb-4 text-neutral-400" size={48} />
          <p className="text-neutral-600 dark:text-darkTheme-text font-medium">No tienes cuentas configuradas</p>
          <p className="text-sm text-neutral-500 dark:text-darkTheme-muted mt-2">
            Agrega una cuenta para comenzar a administrar tus emails
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {accounts.map(account => (
            <div
              key={account._id}
              onClick={() => openAccount(account)}
              className="bg-white dark:bg-darkTheme-card border border-neutral-200 dark:border-darkTheme-border rounded-lg p-6 hover:shadow-lg transition-all cursor-pointer group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-primary/10 dark:bg-primary/20 rounded-lg group-hover:bg-primary group-hover:text-white transition-colors">
                    <Mail size={24} className="text-primary group-hover:text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-neutral-800 dark:text-darkTheme-text">
                      {account.accountName}
                    </h3>
                    <p className="text-sm text-neutral-600 dark:text-darkTheme-muted">
                      {account.email}
                    </p>
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSync(account._id);
                  }}
                  disabled={syncing}
                  className="p-2 hover:bg-neutral-100 dark:hover:bg-darkTheme-border rounded-lg transition-colors"
                  title="Sincronizar"
                >
                  <RefreshCw size={18} className={syncing ? 'animate-spin' : ''} />
                </button>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-neutral-200 dark:border-darkTheme-border">
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-primary dark:text-primary-light">
                      {account.unreadEmails || 0}
                    </p>
                    <p className="text-xs text-neutral-600 dark:text-darkTheme-muted">No leídos</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-neutral-700 dark:text-darkTheme-text">
                      {account.totalEmails || 0}
                    </p>
                    <p className="text-xs text-neutral-600 dark:text-darkTheme-muted">Total</p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  account.isActive
                    ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                    : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                }`}>
                  {account.isActive ? 'Activa' : 'Inactiva'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  /**
   * Vista de agregar cuenta
   */
  const renderAddAccountView = () => (
    <div className="p-6 max-w-2xl mx-auto">
      <button
        onClick={() => setActiveView('accounts')}
        className="flex items-center gap-2 text-neutral-600 dark:text-darkTheme-muted hover:text-primary mb-6"
      >
        <ChevronLeft size={20} />
        Volver a cuentas
      </button>

      <div className="bg-white dark:bg-darkTheme-card rounded-lg border border-neutral-200 dark:border-darkTheme-border p-8">
        <h2 className="text-2xl font-bold text-neutral-800 dark:text-darkTheme-text mb-6">
          Agregar Cuenta de Correo
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

        <form onSubmit={handleCreateAccount} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-darkTheme-text mb-2">
              Nombre de la cuenta
            </label>
            <input
              type="text"
              value={accountForm.accountName}
              onChange={(e) => setAccountForm({...accountForm, accountName: e.target.value})}
              className="w-full px-4 py-2 border border-neutral-300 dark:border-darkTheme-border rounded-lg bg-white dark:bg-darkTheme-bg text-neutral-800 dark:text-darkTheme-text focus:ring-2 focus:ring-primary"
              placeholder="Mi cuenta personal"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-darkTheme-text mb-2">
              Proveedor
            </label>
            <select
              value={accountForm.provider}
              onChange={(e) => setAccountForm({...accountForm, provider: e.target.value})}
              className="w-full px-4 py-2 border border-neutral-300 dark:border-darkTheme-border rounded-lg bg-white dark:bg-darkTheme-bg text-neutral-800 dark:text-darkTheme-text focus:ring-2 focus:ring-primary"
            >
              <option value="gmail">Gmail</option>
              <option value="outlook">Outlook</option>
              <option value="yahoo">Yahoo</option>
              <option value="icloud">iCloud</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-darkTheme-text mb-2">
              Correo electrónico
            </label>
            <input
              type="email"
              value={accountForm.email}
              onChange={(e) => setAccountForm({...accountForm, email: e.target.value})}
              className="w-full px-4 py-2 border border-neutral-300 dark:border-darkTheme-border rounded-lg bg-white dark:bg-darkTheme-bg text-neutral-800 dark:text-darkTheme-text focus:ring-2 focus:ring-primary"
              placeholder="usuario@gmail.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-darkTheme-text mb-2">
              Contraseña de aplicación
            </label>
            <input
              type="password"
              value={accountForm.password}
              onChange={(e) => setAccountForm({...accountForm, password: e.target.value})}
              className="w-full px-4 py-2 border border-neutral-300 dark:border-darkTheme-border rounded-lg bg-white dark:bg-darkTheme-bg text-neutral-800 dark:text-darkTheme-text focus:ring-2 focus:ring-primary"
              placeholder="••••••••"
              required
            />
            <p className="text-xs text-neutral-500 dark:text-darkTheme-muted mt-2">
              Para Gmail: debes generar una contraseña de aplicación en la configuración de seguridad de Google
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-primary hover:bg-primary-dark text-white rounded-lg font-medium transition-colors disabled:opacity-50"
          >
            {loading ? 'Agregando...' : 'Agregar Cuenta'}
          </button>
        </form>
      </div>
    </div>
  );

  /**
   * Vista de bandeja de entrada
   */
  const renderInboxView = () => (
    <div className="flex h-full">
      {/* Sidebar izquierdo */}
      <div className="w-64 bg-white dark:bg-darkTheme-card border-r border-neutral-200 dark:border-darkTheme-border p-4">
        <button
          onClick={() => setActiveView('accounts')}
          className="flex items-center gap-2 text-neutral-600 dark:text-darkTheme-muted hover:text-primary mb-6 w-full"
        >
          <ChevronLeft size={20} />
          Cuentas
        </button>

        <div className="mb-6">
          <h3 className="font-semibold text-neutral-800 dark:text-darkTheme-text mb-2">
            {selectedAccount?.accountName}
          </h3>
          <p className="text-sm text-neutral-600 dark:text-darkTheme-muted">
            {selectedAccount?.email}
          </p>
        </div>

        <button
          onClick={() => setActiveView('compose')}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-primary hover:bg-primary-dark text-white rounded-lg transition-colors mb-6"
        >
          <Send size={18} />
          Redactar
        </button>

        <div className="space-y-2">
          <button className="w-full flex items-center gap-3 px-4 py-2 bg-primary/10 dark:bg-primary/20 text-primary rounded-lg">
            <Inbox size={18} />
            <span>Bandeja de entrada</span>
            <span className="ml-auto bg-primary text-white text-xs px-2 py-1 rounded-full">
              {selectedAccount?.unreadEmails || 0}
            </span>
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-2 hover:bg-neutral-100 dark:hover:bg-darkTheme-border text-neutral-700 dark:text-darkTheme-text rounded-lg transition-colors">
            <Star size={18} />
            <span>Destacados</span>
          </button>
        </div>
      </div>

      {/* Lista de emails */}
      <div className="flex-1 flex flex-col">
        <div className="p-4 bg-white dark:bg-darkTheme-card border-b border-neutral-200 dark:border-darkTheme-border">
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={20} />
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearch}
                placeholder="Buscar emails..."
                className="w-full pl-10 pr-4 py-2 border border-neutral-300 dark:border-darkTheme-border rounded-lg bg-white dark:bg-darkTheme-bg text-neutral-800 dark:text-darkTheme-text focus:ring-2 focus:ring-primary"
              />
            </div>
            <button
              onClick={() => handleSync(selectedAccount._id)}
              disabled={syncing}
              className="p-2 hover:bg-neutral-100 dark:hover:bg-darkTheme-border rounded-lg transition-colors"
              title="Sincronizar"
            >
              <RefreshCw size={20} className={syncing ? 'animate-spin' : ''} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto bg-neutral-50 dark:bg-darkTheme-bg">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <RefreshCw className="animate-spin text-primary" size={40} />
            </div>
          ) : emails.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-neutral-500 dark:text-darkTheme-muted">
              <MailOpen size={64} className="mb-4 opacity-50" />
              <p>No hay emails en esta carpeta</p>
            </div>
          ) : (
            <div className="divide-y divide-neutral-200 dark:divide-darkTheme-border">
              {emails.map(email => (
                <div
                  key={email._id}
                  onClick={() => openEmail(email)}
                  className={`p-4 hover:bg-white dark:hover:bg-darkTheme-card cursor-pointer transition-colors ${
                    !email.isRead ? 'bg-blue-50 dark:bg-blue-900/10' : ''
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <button
                      onClick={(e) => toggleStar(email._id, e)}
                      className="mt-1"
                    >
                      <Star
                        size={18}
                        className={email.isStarred ? 'fill-yellow-400 text-yellow-400' : 'text-neutral-400'}
                      />
                    </button>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <p className={`font-medium truncate ${
                          !email.isRead ? 'text-neutral-900 dark:text-white' : 'text-neutral-700 dark:text-darkTheme-text'
                        }`}>
                          {email.from.name || email.from.address}
                        </p>
                        <span className="text-sm text-neutral-500 dark:text-darkTheme-muted ml-4">
                          {formatDate(email.date)}
                        </span>
                      </div>
                      <p className={`text-sm truncate mb-1 ${
                        !email.isRead ? 'font-medium text-neutral-800 dark:text-darkTheme-text' : 'text-neutral-600 dark:text-darkTheme-muted'
                      }`}>
                        {email.subject}
                      </p>
                      <p className="text-sm text-neutral-500 dark:text-darkTheme-muted truncate">
                        {email.textBody?.substring(0, 100)}...
                      </p>
                      {email.attachments?.length > 0 && (
                        <div className="flex items-center gap-2 mt-2">
                          <Paperclip size={14} className="text-neutral-400" />
                          <span className="text-xs text-neutral-500 dark:text-darkTheme-muted">
                            {email.attachments.length} adjunto(s)
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  /**
   * Vista de email detallado
   */
  const renderEmailView = () => (
    <div className="flex flex-col h-full bg-white dark:bg-darkTheme-card">
      <div className="p-4 border-b border-neutral-200 dark:border-darkTheme-border">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setActiveView('inbox')}
            className="flex items-center gap-2 text-neutral-600 dark:text-darkTheme-muted hover:text-primary"
          >
            <ChevronLeft size={20} />
            Volver
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={() => toggleStar(selectedEmail._id, { stopPropagation: () => {} })}
              className="p-2 hover:bg-neutral-100 dark:hover:bg-darkTheme-border rounded-lg"
            >
              <Star
                size={20}
                className={selectedEmail?.isStarred ? 'fill-yellow-400 text-yellow-400' : 'text-neutral-400'}
              />
            </button>
            <button
              onClick={() => deleteEmail(selectedEmail._id)}
              className="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 rounded-lg"
            >
              <Trash2 size={20} />
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <h1 className="text-2xl font-bold text-neutral-900 dark:text-white mb-4">
          {selectedEmail?.subject}
        </h1>

        <div className="flex items-center gap-4 mb-6 pb-6 border-b border-neutral-200 dark:border-darkTheme-border">
          <div className="flex-1">
            <p className="font-medium text-neutral-800 dark:text-darkTheme-text">
              {selectedEmail?.from.name || selectedEmail?.from.address}
            </p>
            <p className="text-sm text-neutral-600 dark:text-darkTheme-muted">
              {selectedEmail?.from.address}
            </p>
          </div>
          <p className="text-sm text-neutral-500 dark:text-darkTheme-muted">
            {selectedEmail && new Date(selectedEmail.date).toLocaleString('es-ES', {
              day: '2-digit',
              month: 'long',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </p>
        </div>

        {selectedEmail?.attachments?.length > 0 && (
          <div className="mb-6 p-4 bg-neutral-50 dark:bg-darkTheme-bg rounded-lg">
            <h3 className="font-medium text-neutral-800 dark:text-darkTheme-text mb-3 flex items-center gap-2">
              <Paperclip size={18} />
              Adjuntos ({selectedEmail.attachments.length})
            </h3>
            <div className="space-y-2">
              {selectedEmail.attachments.map((att, idx) => (
                <div key={idx} className="flex items-center gap-3 p-2 bg-white dark:bg-darkTheme-card rounded border border-neutral-200 dark:border-darkTheme-border">
                  <Paperclip size={16} className="text-neutral-400" />
                  <span className="text-sm text-neutral-700 dark:text-darkTheme-text">{att.filename}</span>
                  <span className="text-xs text-neutral-500 dark:text-darkTheme-muted ml-auto">
                    {(att.size / 1024).toFixed(2)} KB
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="prose dark:prose-invert max-w-none">
          {selectedEmail?.htmlBody ? (
            <div dangerouslySetInnerHTML={{ __html: selectedEmail.htmlBody }} />
          ) : (
            <pre className="whitespace-pre-wrap font-sans text-neutral-700 dark:text-darkTheme-text">
              {selectedEmail?.textBody}
            </pre>
          )}
        </div>
      </div>
    </div>
  );

  /**
   * Vista de redactar email
   */
  const renderComposeView = () => (
    <div className="p-6 max-w-4xl mx-auto">
      <button
        onClick={() => setActiveView('inbox')}
        className="flex items-center gap-2 text-neutral-600 dark:text-darkTheme-muted hover:text-primary mb-6"
      >
        <ChevronLeft size={20} />
        Cancelar
      </button>

      <div className="bg-white dark:bg-darkTheme-card rounded-lg border border-neutral-200 dark:border-darkTheme-border p-8">
        <h2 className="text-2xl font-bold text-neutral-800 dark:text-darkTheme-text mb-6">
          Redactar Email
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

        <form onSubmit={handleSendEmail} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-darkTheme-text mb-2">
              Para
            </label>
            <input
              type="email"
              value={composeForm.to}
              onChange={(e) => setComposeForm({...composeForm, to: e.target.value})}
              className="w-full px-4 py-2 border border-neutral-300 dark:border-darkTheme-border rounded-lg bg-white dark:bg-darkTheme-bg text-neutral-800 dark:text-darkTheme-text focus:ring-2 focus:ring-primary"
              placeholder="destinatario@ejemplo.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-darkTheme-text mb-2">
              Asunto
            </label>
            <input
              type="text"
              value={composeForm.subject}
              onChange={(e) => setComposeForm({...composeForm, subject: e.target.value})}
              className="w-full px-4 py-2 border border-neutral-300 dark:border-darkTheme-border rounded-lg bg-white dark:bg-darkTheme-bg text-neutral-800 dark:text-darkTheme-text focus:ring-2 focus:ring-primary"
              placeholder="Asunto del email"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-darkTheme-text mb-2">
              Mensaje
            </label>
            <textarea
              value={composeForm.text}
              onChange={(e) => setComposeForm({...composeForm, text: e.target.value})}
              rows={12}
              className="w-full px-4 py-2 border border-neutral-300 dark:border-darkTheme-border rounded-lg bg-white dark:bg-darkTheme-bg text-neutral-800 dark:text-darkTheme-text focus:ring-2 focus:ring-primary resize-none"
              placeholder="Escribe tu mensaje aquí..."
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-primary hover:bg-primary-dark text-white rounded-lg font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <Send size={20} />
            {loading ? 'Enviando...' : 'Enviar Email'}
          </button>
        </form>
      </div>
    </div>
  );

  // Renderizado principal
  return (
    <div className="h-full flex flex-col bg-neutral-50 dark:bg-darkTheme-bg">
      {activeView === 'accounts' && renderAccountsView()}
      {activeView === 'add-account' && renderAddAccountView()}
      {activeView === 'inbox' && renderInboxView()}
      {activeView === 'email' && renderEmailView()}
      {activeView === 'compose' && renderComposeView()}
    </div>
  );
};

export default EmailView;
