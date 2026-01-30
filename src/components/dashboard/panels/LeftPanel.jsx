import { useState } from 'react';
import { User, Folder, Plug, LogOut, Camera, Sun, Moon, ChevronDown, ChevronUp } from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';
import { useTheme } from '../../../contexts/ThemeContext';
import { useNavigate } from 'react-router-dom';

/**
 * Panel izquierdo del Dashboard
 * Contiene el perfil del usuario, proyectos y configuración de integraciones
 */
const LeftPanel = ({ onOpenTab }) => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme, isDark } = useTheme();
  const navigate = useNavigate();
  const [hoveredSection, setHoveredSection] = useState(null);
  const [showIntegrations, setShowIntegrations] = useState(true);

  // Debug: Log user data
  console.log('👤 LeftPanel - Usuario actual:', user);

  /**
   * Maneja el logout del usuario
   */
  const handleLogout = () => {
    if (confirm('¿Estás seguro de que deseas cerrar sesión?')) {
      logout();
      navigate('/login');
    }
  };

  /**
   * Abre la vista de proyectos en una nueva pestaña
   */
  const handleOpenProjects = () => {
    onOpenTab({
      id: 'projects',
      title: 'Mis Proyectos',
      component: 'Projects'
    });
  };

  /**
   * Abre la vista de integraciones en una nueva pestaña
   */
  const handleOpenIntegrations = () => {
    onOpenTab({
      id: 'integrations',
      title: 'Integraciones',
      component: 'Integrations'
    });
  };

  /**
   * Abre la vista de edición de perfil en una nueva pestaña
   */
  const handleOpenProfile = () => {
    onOpenTab({
      id: 'profile-edit',
      title: 'Editar Perfil',
      component: 'ProfileEdit'
    });
  };

  return (
    <aside className="h-full bg-white dark:bg-darkTheme-bg border-r border-neutral-200 dark:border-darkTheme-border flex flex-col shadow-lg transition-colors duration-200">

      {/* Sección de perfil */}
      <div className="relative border-b border-neutral-200 dark:border-darkTheme-border overflow-hidden">
        {/* Portada con efecto difuminado */}
        <div className="relative h-32">
          {user?.coverImage ? (
            <img
              src={user.coverImage}
              alt="Portada"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-primary via-secondary to-primary-light" />
          )}
          {/* Efecto difuminado hacia abajo */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white dark:to-darkTheme-bg"></div>
        </div>

        {/* Contenido del perfil */}
        <div className="relative px-6 pb-6 -mt-12">
          <div className="flex flex-col items-center space-y-3">
            {/* Imagen de perfil con borde adaptable */}
            <div className="relative group">
              <div className={`w-24 h-24 rounded-full flex items-center justify-center shadow-xl border-4 ${
                user?.coverImage
                  ? 'border-white dark:border-darkTheme-bg'
                  : 'border-white dark:border-darkTheme-bg'
              } bg-gradient-to-br from-primary to-secondary`}>
                {user?.profileImage && (
                  <img
                    src={user.profileImage}
                    alt={user.username}
                    className="w-full h-full rounded-full object-cover"
                  />
                )}
              </div>

              {/* Botón para cambiar foto (hover) - 30% más pequeño */}
              <button
                className="absolute bottom-0 right-0 bg-primary text-white p-1.5 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                title="Cambiar foto de perfil"
              >
                <Camera size={12} />
              </button>
            </div>

            {/* Información del usuario (sin email) */}
            <div className="text-center">
              <h3 className="font-semibold text-lg text-primary-dark dark:text-primary-light">
                {user?.firstName} {user?.lastName}
              </h3>
              <p className="text-sm text-neutral-600 dark:text-darkTheme-text">@{user?.username}</p>
            </div>

            {/* Botón ver perfil completo */}
            <button onClick={handleOpenProfile} className="btn-outline text-sm py-2 w-full">
              <User size={16} className="inline mr-2" />
              Ver Perfil Completo
            </button>
          </div>
        </div>
      </div>

      {/* Menú de opciones */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-2">

        {/* Opción: Mis Proyectos - Diseño compacto */}
        <button
          onClick={handleOpenProjects}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 bg-neutral-100 dark:bg-darkTheme-card hover:bg-primary hover:text-white dark:hover:bg-primary border border-neutral-200 dark:border-darkTheme-border"
        >
          <Folder size={16} />
          <span className="text-sm font-medium">Mis Proyectos</span>
        </button>

        {/* Opción: Integraciones - Diseño compacto */}
        <button
          onClick={handleOpenIntegrations}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 bg-neutral-100 dark:bg-darkTheme-card hover:bg-secondary hover:text-white dark:hover:bg-secondary border border-neutral-200 dark:border-darkTheme-border"
        >
          <Plug size={16} />
          <span className="text-sm font-medium">Integraciones</span>
        </button>

        {/* Información de integraciones activas - Con botón collapse */}
        <div className="mt-6 bg-neutral-50 dark:bg-darkTheme-card rounded-lg border border-neutral-200 dark:border-darkTheme-border overflow-hidden">
          {/* Header con botón collapse */}
          <button
            onClick={() => setShowIntegrations(!showIntegrations)}
            className="w-full flex items-center justify-between p-3 hover:bg-neutral-100 dark:hover:bg-darkTheme-bg transition-colors"
          >
            <h4 className="text-sm font-semibold text-neutral-700 dark:text-darkTheme-text">
              Integraciones Activas
            </h4>
            {showIntegrations ? (
              <ChevronUp size={16} className="text-neutral-500 dark:text-darkTheme-muted" />
            ) : (
              <ChevronDown size={16} className="text-neutral-500 dark:text-darkTheme-muted" />
            )}
          </button>

          {/* Contenido colapsable */}
          {showIntegrations && (
            <div className="px-3 pb-3 space-y-2">
              {user?.integrations && user.integrations.length > 0 ? (
                user.integrations.map((integration, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 text-xs text-neutral-600 dark:text-darkTheme-muted"
                  >
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>{integration.name}</span>
                  </div>
                ))
              ) : (
                <p className="text-xs text-neutral-500 dark:text-darkTheme-muted">
                  No hay integraciones configuradas
                </p>
              )}
            </div>
          )}
        </div>
      </nav>

      {/* Switch de tema y logout */}
      <div className="p-4 border-t border-neutral-200 dark:border-darkTheme-border space-y-3">

        {/* Switch de Tema - Solo el toggle */}
        <div className="flex items-center justify-center">
          <button
            onClick={toggleTheme}
            className={`relative w-14 h-7 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-darkTheme-bg ${
              isDark
                ? 'bg-gradient-to-r from-primary to-secondary'
                : 'bg-neutral-300'
            }`}
            aria-label="Toggle theme"
            title={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
          >
            <span
              className={`absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full shadow-md transform transition-transform duration-300 flex items-center justify-center ${
                isDark ? 'translate-x-7' : 'translate-x-0'
              }`}
            >
              {isDark ? (
                <Moon size={14} className="text-primary" />
              ) : (
                <Sun size={14} className="text-yellow-500" />
              )}
            </span>
          </button>
        </div>

        {/* Botón de logout */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors duration-200 font-medium"
        >
          <LogOut size={18} />
          Cerrar Sesión
        </button>
      </div>
    </aside>
  );
};

export default LeftPanel;
