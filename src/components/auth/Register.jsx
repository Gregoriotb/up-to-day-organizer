import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { UserPlus } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

/**
 * Componente de registro de usuario
 * Captura información básica del usuario y valida los datos antes de crear la cuenta
 */
const Register = () => {
  // Estado para los campos del formulario
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    firstName: '',
    lastName: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [captchaVerified, setCaptchaVerified] = useState(false);

  const navigate = useNavigate();
  const { register } = useAuth();

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
   * Simula la verificación del captcha
   * En producción, esto debería integrarse con un servicio real como reCAPTCHA
   */
  const handleCaptchaVerify = () => {
    setCaptchaVerified(true);
    setTimeout(() => {
      alert('CAPTCHA verificado correctamente');
    }, 100);
  };

  /**
   * Valida los datos del formulario
   */
  const validateForm = () => {
    // Validar campos vacíos
    if (Object.values(formData).some(value => !value.trim())) {
      throw new Error('Todos los campos son obligatorios');
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      throw new Error('El formato del email no es válido');
    }

    // Validar longitud de usuario
    if (formData.username.length < 3) {
      throw new Error('El usuario debe tener al menos 3 caracteres');
    }

    // Validar longitud de contraseña
    if (formData.password.length < 6) {
      throw new Error('La contraseña debe tener al menos 6 caracteres');
    }

    // Validar que las contraseñas coincidan
    if (formData.password !== formData.confirmPassword) {
      throw new Error('Las contraseñas no coinciden');
    }

    // Validar captcha
    if (!captchaVerified) {
      throw new Error('Por favor verifica el CAPTCHA');
    }
  };

  /**
   * Maneja el envío del formulario de registro
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Validar formulario
      validateForm();

      // Intentar registro
      await register({
        username: formData.username,
        email: formData.email,
        firstName: formData.firstName,
        lastName: formData.lastName,
        password: formData.password
      });

      // Redirigir al login después del registro exitoso
      alert('¡Registro exitoso! Ahora puedes iniciar sesión.');
      navigate('/login');
    } catch (err) {
      setError(err.message || 'Error al registrar usuario');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-light via-secondary to-primary dark:from-primary dark:via-secondary dark:to-primary-dark p-4 py-12 transition-colors duration-200">
      {/* Contenedor principal del formulario */}
      <div className="w-full max-w-2xl bg-white dark:bg-darkTheme-card rounded-2xl shadow-2xl p-8 space-y-6">

        {/* Logo y título */}
        <div className="text-center space-y-4">
          <img
            src="/assets/logo.png"
            alt="UP TO DAY Logo"
            className="h-20 mx-auto"
          />
          <h1 className="text-3xl font-bold text-primary-dark dark:text-primary-light">
            Crea tu cuenta
          </h1>
          <p className="text-neutral-500 dark:text-darkTheme-muted">
            Únete a UP TO DAY y organiza tus proyectos de desarrollo
          </p>
        </div>

        {/* Mensaje de error */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 dark:border-red-400 p-4 rounded">
            <p className="text-red-700 dark:text-red-400 text-sm">{error}</p>
          </div>
        )}

        {/* Formulario de registro */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Grid para nombre y apellido */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Campo de nombre */}
            <div>
              <label
                htmlFor="firstName"
                className="block text-sm font-medium text-neutral-700 dark:text-darkTheme-text mb-2"
              >
                Nombre
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="input-field"
                placeholder="Tu nombre"
                disabled={loading}
              />
            </div>

            {/* Campo de apellido */}
            <div>
              <label
                htmlFor="lastName"
                className="block text-sm font-medium text-neutral-700 dark:text-darkTheme-text mb-2"
              >
                Apellido
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="input-field"
                placeholder="Tu apellido"
                disabled={loading}
              />
            </div>
          </div>

          {/* Campo de usuario */}
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-neutral-700 mb-2"
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
              placeholder="Elige un nombre de usuario"
              disabled={loading}
            />
          </div>

          {/* Campo de email */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-neutral-700 mb-2"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="input-field"
              placeholder="tu@email.com"
              disabled={loading}
            />
          </div>

          {/* Grid para contraseñas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                placeholder="Mínimo 6 caracteres"
                disabled={loading}
              />
            </div>

            {/* Campo de confirmar contraseña */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-neutral-700 dark:text-darkTheme-text mb-2"
              >
                Confirmar Contraseña
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="input-field"
                placeholder="Repite tu contraseña"
                disabled={loading}
              />
            </div>
          </div>

          {/* CAPTCHA simulado */}
          <div className="bg-neutral-100 dark:bg-darkTheme-bg rounded-lg p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="captcha"
                checked={captchaVerified}
                onChange={handleCaptchaVerify}
                className="w-5 h-5 text-primary focus:ring-primary rounded"
                disabled={loading}
              />
              <label htmlFor="captcha" className="text-sm text-neutral-700 dark:text-darkTheme-text">
                No soy un robot
              </label>
            </div>
            <div className="text-xs text-neutral-500 dark:text-darkTheme-muted">
              reCAPTCHA
            </div>
          </div>

          {/* Botón de submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary flex items-center justify-center gap-2 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <UserPlus size={20} />
            {loading ? 'Registrando...' : 'Registrarse'}
          </button>
        </form>

        {/* Link a login */}
        <div className="text-center pt-4 border-t border-neutral-200 dark:border-darkTheme-border">
          <p className="text-sm text-neutral-600 dark:text-darkTheme-muted">
            ¿Ya tienes una cuenta?{' '}
            <Link
              to="/login"
              className="font-medium text-primary dark:text-primary-light hover:text-primary-dark dark:hover:text-primary transition-colors"
            >
              Inicia sesión aquí
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
