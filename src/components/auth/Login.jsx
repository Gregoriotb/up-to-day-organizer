import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { LogIn } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

/**
 * Componente de inicio de sesión
 * Permite autenticación mediante usuario/contraseña o servicios externos (Google, GitHub)
 */
const Login = () => {
  // Estado para los campos del formulario
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  /**
   * Maneja los cambios en los inputs del formulario
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  /**
   * Maneja el envío del formulario de login tradicional
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Validación básica
      if (!formData.username || !formData.password) {
        throw new Error('Por favor completa todos los campos');
      }

      // Intentar login
      await login(formData.username, formData.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  // Login social desactivado temporalmente

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-light via-secondary to-primary dark:from-primary dark:via-secondary dark:to-primary-dark p-4 transition-colors duration-200">
      {/* Contenedor principal del formulario */}
      <div className="w-full max-w-md bg-white dark:bg-darkTheme-card rounded-2xl shadow-2xl p-8 space-y-6">

        {/* Logo y título */}
        <div className="text-center space-y-4">
          <img
            src="/assets/logo.png"
            alt="UP TO DAY Logo"
            className="h-24 mx-auto"
          />
          <h1 className="text-3xl font-bold text-primary-dark dark:text-primary-light">
            Bienvenido de vuelta
          </h1>
          <p className="text-neutral-500 dark:text-darkTheme-muted">
            Inicia sesión para continuar organizando tus proyectos
          </p>
        </div>

        {/* Mensaje de error */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 dark:border-red-400 p-4 rounded">
            <p className="text-red-700 dark:text-red-400 text-sm">{error}</p>
          </div>
        )}

        {/* Formulario de login */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Campo de usuario */}
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-neutral-700 dark:text-darkTheme-text mb-2"
            >
              Usuario
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="input-field"
              placeholder="Ingresa tu usuario"
              disabled={loading}
            />
          </div>

          {/* Campo de contraseña */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-neutral-700 dark:text-darkTheme-text mb-2"
            >
              Contraseña
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="input-field"
              placeholder="Ingresa tu contraseña"
              disabled={loading}
            />
          </div>

          {/* Botón de submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary flex items-center justify-center gap-2 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <LogIn size={20} />
            {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </button>
        </form>

        {/* Login social temporalmente desactivado */}
        {/* Se reactivará cuando se implemente OAuth */}

        {/* Link a registro */}
        <div className="text-center pt-4 border-t border-neutral-200 dark:border-darkTheme-border">
          <p className="text-sm text-neutral-600 dark:text-darkTheme-muted">
            ¿No tienes una cuenta?{' '}
            <Link
              to="/register"
              className="font-medium text-primary dark:text-primary-light hover:text-primary-dark dark:hover:text-primary transition-colors"
            >
              Regístrate aquí
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
