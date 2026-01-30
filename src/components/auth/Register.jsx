import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { UserPlus, ArrowRight, ArrowLeft, Check } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

/**
 * Componente de registro de usuario con flujo multi-paso
 * Paso 1: Información personal (nombre, apellido, email)
 * Paso 2: Credenciales (username, contraseña) y verificación
 */
const Register = () => {
  // Estado para el paso actual (1 o 2)
  const [currentStep, setCurrentStep] = useState(1);

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
   */
  const handleCaptchaVerify = () => {
    setCaptchaVerified(true);
    setTimeout(() => {
      alert('CAPTCHA verificado correctamente');
    }, 100);
  };

  /**
   * Valida el paso 1 (información personal)
   */
  const validateStep1 = () => {
    if (!formData.firstName.trim()) {
      throw new Error('El nombre es obligatorio');
    }
    if (!formData.lastName.trim()) {
      throw new Error('El apellido es obligatorio');
    }
    if (!formData.email.trim()) {
      throw new Error('El email es obligatorio');
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      throw new Error('El formato del email no es válido');
    }
  };

  /**
   * Valida el paso 2 (credenciales)
   */
  const validateStep2 = () => {
    if (!formData.username.trim()) {
      throw new Error('El usuario es obligatorio');
    }
    if (formData.username.length < 3) {
      throw new Error('El usuario debe tener al menos 3 caracteres');
    }
    if (!formData.password.trim()) {
      throw new Error('La contraseña es obligatoria');
    }
    if (formData.password.length < 6) {
      throw new Error('La contraseña debe tener al menos 6 caracteres');
    }
    if (formData.password !== formData.confirmPassword) {
      throw new Error('Las contraseñas no coinciden');
    }
    if (!captchaVerified) {
      throw new Error('Por favor verifica el CAPTCHA');
    }
  };

  /**
   * Avanza al siguiente paso
   */
  const handleNextStep = () => {
    setError('');

    try {
      if (currentStep === 1) {
        validateStep1();
        setCurrentStep(2);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  /**
   * Retrocede al paso anterior
   */
  const handlePreviousStep = () => {
    setError('');
    setCurrentStep(1);
  };

  /**
   * Maneja el envío final del formulario de registro
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Validar paso 2
      validateStep2();

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

  /**
   * Renderiza el indicador de progreso
   */
  const renderProgressIndicator = () => (
    <div className="flex items-center justify-center gap-4 mb-8">
      {/* Paso 1 */}
      <div className="flex items-center">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all duration-200 ${
          currentStep >= 1
            ? 'bg-primary text-white'
            : 'bg-neutral-200 dark:bg-darkTheme-border text-neutral-500 dark:text-darkTheme-muted'
        }`}>
          {currentStep > 1 ? <Check size={20} /> : '1'}
        </div>
        <div className="ml-3">
          <p className={`text-sm font-medium ${
            currentStep >= 1
              ? 'text-primary dark:text-primary-light'
              : 'text-neutral-500 dark:text-darkTheme-muted'
          }`}>
            Paso 1
          </p>
          <p className="text-xs text-neutral-600 dark:text-darkTheme-text">
            Información Personal
          </p>
        </div>
      </div>

      {/* Línea conectora */}
      <div className={`w-12 h-1 rounded-full transition-all duration-200 ${
        currentStep >= 2
          ? 'bg-primary'
          : 'bg-neutral-200 dark:bg-darkTheme-border'
      }`}></div>

      {/* Paso 2 */}
      <div className="flex items-center">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all duration-200 ${
          currentStep >= 2
            ? 'bg-primary text-white'
            : 'bg-neutral-200 dark:bg-darkTheme-border text-neutral-500 dark:text-darkTheme-muted'
        }`}>
          2
        </div>
        <div className="ml-3">
          <p className={`text-sm font-medium ${
            currentStep >= 2
              ? 'text-primary dark:text-primary-light'
              : 'text-neutral-500 dark:text-darkTheme-muted'
          }`}>
            Paso 2
          </p>
          <p className="text-xs text-neutral-600 dark:text-darkTheme-text">
            Credenciales
          </p>
        </div>
      </div>
    </div>
  );

  /**
   * Renderiza el contenido del paso 1
   */
  const renderStep1 = () => (
    <div className="space-y-4 animate-fade-in">
      {/* Grid para nombre y apellido */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Campo de nombre */}
        <div>
          <label
            htmlFor="firstName"
            className="block text-sm font-medium text-neutral-700 dark:text-darkTheme-text mb-2"
          >
            Nombre *
          </label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            className="input-field"
            placeholder="Tu nombre"
            autoFocus
          />
        </div>

        {/* Campo de apellido */}
        <div>
          <label
            htmlFor="lastName"
            className="block text-sm font-medium text-neutral-700 dark:text-darkTheme-text mb-2"
          >
            Apellido *
          </label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            className="input-field"
            placeholder="Tu apellido"
          />
        </div>
      </div>

      {/* Campo de email */}
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-neutral-700 dark:text-darkTheme-text mb-2"
        >
          Email *
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="input-field"
          placeholder="tu@email.com"
        />
      </div>

      {/* Botón siguiente */}
      <button
        type="button"
        onClick={handleNextStep}
        className="w-full btn-primary flex items-center justify-center gap-2 py-3"
      >
        Siguiente
        <ArrowRight size={20} />
      </button>
    </div>
  );

  /**
   * Renderiza el contenido del paso 2
   */
  const renderStep2 = () => (
    <div className="space-y-4 animate-fade-in">
      {/* Campo de usuario */}
      <div>
        <label
          htmlFor="username"
          className="block text-sm font-medium text-neutral-700 dark:text-darkTheme-text mb-2"
        >
          Usuario *
        </label>
        <input
          type="text"
          id="username"
          name="username"
          value={formData.username}
          onChange={handleChange}
          className="input-field"
          placeholder="Elige un nombre de usuario (mín. 3 caracteres)"
          disabled={loading}
          autoFocus
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
            Contraseña *
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
            Confirmar Contraseña *
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
      <div className="bg-neutral-100 dark:bg-darkTheme-bg rounded-lg p-4 flex items-center justify-between border border-neutral-200 dark:border-darkTheme-border">
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

      {/* Botones de navegación */}
      <div className="flex gap-3">
        <button
          type="button"
          onClick={handlePreviousStep}
          className="flex-1 btn-outline flex items-center justify-center gap-2 py-3"
          disabled={loading}
        >
          <ArrowLeft size={20} />
          Anterior
        </button>
        <button
          type="submit"
          disabled={loading}
          className="flex-1 btn-primary flex items-center justify-center gap-2 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <UserPlus size={20} />
          {loading ? 'Registrando...' : 'Registrarse'}
        </button>
      </div>
    </div>
  );

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

        {/* Indicador de progreso */}
        {renderProgressIndicator()}

        {/* Mensaje de error */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 dark:border-red-400 p-4 rounded">
            <p className="text-red-700 dark:text-red-400 text-sm">{error}</p>
          </div>
        )}

        {/* Formulario de registro */}
        <form onSubmit={handleSubmit}>
          {/* Renderizar el paso correspondiente */}
          {currentStep === 1 ? renderStep1() : renderStep2()}
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
