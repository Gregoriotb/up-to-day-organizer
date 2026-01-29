import { useState } from 'react';
import { User, Folder, Plug, LogOut, Camera, Sun, Moon } from 'lucide-react';
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

  return (
    <aside className="h-full bg-white dark:bg-darkTheme-bg border-r border-neutral-200 dark:border-darkTheme-border flex flex-col shadow-lg transition-colors duration-200">

      {/* Sección de perfil */}
      <div className="p-6 border-b border-neutral-200 dark:border-darkTheme-border bg-gradient-to-br from-primary-light/10 to-secondary/10 dark:from-primary/10 dark:to-secondary/10">
        <div className="flex flex-col items-center space-y-4">
          {/* Imagen de perfil */}
          <div className="relative group">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-3xl font-bold shadow-lg">
              {user?.profileImage ? (
                <img
                  src={user.profileImage}
                  alt={user.username}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <span>{user?.firstName?.[0]}{user?.lastName?.[0]}</span>
              )}
            </div>

            {/* Botón para cambiar foto (hover) */}
            <button
              className="absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
              title="Cambiar foto de perfil"
            >
              <Camera size={16} />
            </button>
          </div>

          {/* Información del usuario */}
          <div className="text-center">
            <h3 className="font-semibold text-lg text-primary-dark dark:text-primary-light">
              {user?.firstName} {user?.lastName}
            </h3>
            <p className="text-sm text-neutral-600 dark:text-darkTheme-text">@{user?.username}</p>
            <p className="text-xs text-neutral-500 dark:text-darkTheme-muted mt-1">{user?.email}</p>
          </div>

          {/* Botón ver perfil completo */}
          <button className="btn-outline text-sm py-2 w-full">
            <User size={16} className="inline mr-2" />
            Ver Perfil Completo
          </button>
        </div>
      </div>

      {/* Menú de opciones */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-2">

        {/* Opción: Mis Proyectos */}
        <button
          onClick={handleOpenProjects}
          onMouseEnter={() => setHoveredSection('projects')}
          onMouseLeave={() => setHoveredSection(null)}
          className={`w-full flex items-center gap-3 p-4 rounded-lg transition-all duration-200 ${
            hoveredSection === 'projects'
              ? 'bg-primary text-white shadow-md transform scale-105'
              : 'bg-neutral-50 dark:bg-darkTheme-card text-neutral-700 dark:text-darkTheme-text hover:bg-neutral-100 dark:hover:bg-darkTheme-card/80'
          }`}
        >
          <div className={`p-2 rounded-lg ${
            hoveredSection === 'projects'
              ? 'bg-white/20'
              : 'bg-primary/10 dark:bg-primary/20'
          }`}>
            <Folder size={20} className={hoveredSection === 'projects' ? 'text-white' : 'text-primary dark:text-primary-light'} />
          </div>
          <div className="flex-1 text-left">
            <p className="font-medium">Mis Proyectos</p>
            <p className={`text-xs ${
              hoveredSection === 'projects' ? 'text-white/80' : 'text-neutral-500 dark:text-darkTheme-muted'
            }`}>
              Gestiona tus proyectos de desarrollo
            </p>
          </div>
        </button>

        {/* Opción: Integraciones */}
        <button
          onClick={handleOpenIntegrations}
          onMouseEnter={() => setHoveredSection('integrations')}
          onMouseLeave={() => setHoveredSection(null)}
          className={`w-full flex items-center gap-3 p-4 rounded-lg transition-all duration-200 ${
            hoveredSection === 'integrations'
              ? 'bg-secondary text-white shadow-md transform scale-105'
              : 'bg-neutral-50 dark:bg-darkTheme-card text-neutral-700 dark:text-darkTheme-text hover:bg-neutral-100 dark:hover:bg-darkTheme-card/80'
          }`}
        >
          <div className={`p-2 rounded-lg ${
            hoveredSection === 'integrations'
              ? 'bg-white/20'
              : 'bg-secondary/10 dark:bg-secondary/20'
          }`}>
            <Plug size={20} className={hoveredSection === 'integrations' ? 'text-white' : 'text-secondary dark:text-secondary-light'} />
          </div>
          <div className="flex-1 text-left">
            <p className="font-medium">Integraciones</p>
            <p className={`text-xs ${
              hoveredSection === 'integrations' ? 'text-white/80' : 'text-neutral-500 dark:text-darkTheme-muted'
            }`}>
              Conecta tus herramientas favoritas
            </p>
          </div>
        </button>

        {/* Información de integraciones activas */}
        <div className="mt-6 p-4 bg-gradient-to-br from-primary/5 to-secondary/5 dark:from-primary/10 dark:to-secondary/10 rounded-lg border border-primary/20 dark:border-primary/30">
          <h4 className="text-sm font-semibold text-neutral-700 dark:text-darkTheme-text mb-2">
            Integraciones Activas
          </h4>
          <div className="space-y-2">
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
