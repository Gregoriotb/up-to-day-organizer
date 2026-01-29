import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { LogIn, Github } from 'lucide-react';
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
  const { login, loginWithGoogle, loginWithGithub } = useAuth();

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

  /**
   * Maneja el login con Google
   */
  const handleGoogleLogin = async () => {
    setError('');
    setLoading(true);
    try {
      await loginWithGoogle();
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Error al iniciar sesión con Google');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Maneja el login con GitHub
   */
  const handleGithubLogin = async () => {
    setError('');
    setLoading(true);
    try {
      await loginWithGithub();
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Error al iniciar sesión con GitHub');
    } finally {
      setLoading(false);
    }
  };

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

        {/* Separador */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-neutral-300 dark:border-darkTheme-border"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white dark:bg-darkTheme-card text-neutral-500 dark:text-darkTheme-muted">O continúa con</span>
          </div>
        </div>

        {/* Botones de OAuth */}
        <div className="grid grid-cols-2 gap-3">
          {/* Google Login */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={loading}
            className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-neutral-200 dark:border-darkTheme-border rounded-lg hover:bg-neutral-50 dark:hover:bg-darkTheme-bg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            <span className="text-sm font-medium text-neutral-700 dark:text-darkTheme-text">Google</span>
          </button>

          {/* GitHub Login */}
          <button
            type="button"
            onClick={handleGithubLogin}
            disabled={loading}
            className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-neutral-200 dark:border-darkTheme-border rounded-lg hover:bg-neutral-50 dark:hover:bg-darkTheme-bg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Github size={20} className="text-neutral-700 dark:text-darkTheme-text" />
            <span className="text-sm font-medium text-neutral-700 dark:text-darkTheme-text">GitHub</span>
          </button>
        </div>

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
