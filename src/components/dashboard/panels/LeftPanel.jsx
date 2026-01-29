import { useState } from 'react';
import { User, Folder, Plug, LogOut, Camera } from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

/**
 * Panel izquierdo del Dashboard
 * Contiene el perfil del usuario, proyectos y configuración de integraciones
 */
const LeftPanel = ({ onOpenTab }) => {
  const { user, logout } = useAuth();
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
    <aside className="h-full bg-white border-r border-neutral-200 flex flex-col shadow-lg">

      {/* Sección de perfil */}
      <div className="p-6 border-b border-neutral-200 bg-gradient-to-br from-primary-light/10 to-secondary/10">
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
            <h3 className="font-semibold text-lg text-primary-dark">
              {user?.firstName} {user?.lastName}
            </h3>
            <p className="text-sm text-neutral-600">@{user?.username}</p>
            <p className="text-xs text-neutral-500 mt-1">{user?.email}</p>
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
              : 'bg-neutral-50 text-neutral-700 hover:bg-neutral-100'
          }`}
        >
          <div className={`p-2 rounded-lg ${
            hoveredSection === 'projects'
              ? 'bg-white/20'
              : 'bg-primary/10'
          }`}>
            <Folder size={20} className={hoveredSection === 'projects' ? 'text-white' : 'text-primary'} />
          </div>
          <div className="flex-1 text-left">
            <p className="font-medium">Mis Proyectos</p>
            <p className={`text-xs ${
              hoveredSection === 'projects' ? 'text-white/80' : 'text-neutral-500'
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
              : 'bg-neutral-50 text-neutral-700 hover:bg-neutral-100'
          }`}
        >
          <div className={`p-2 rounded-lg ${
            hoveredSection === 'integrations'
              ? 'bg-white/20'
              : 'bg-secondary/10'
          }`}>
            <Plug size={20} className={hoveredSection === 'integrations' ? 'text-white' : 'text-secondary'} />
          </div>
          <div className="flex-1 text-left">
            <p className="font-medium">Integraciones</p>
            <p className={`text-xs ${
              hoveredSection === 'integrations' ? 'text-white/80' : 'text-neutral-500'
            }`}>
              Conecta tus herramientas favoritas
            </p>
          </div>
        </button>

        {/* Información de integraciones activas */}
        <div className="mt-6 p-4 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-lg border border-primary/20">
          <h4 className="text-sm font-semibold text-neutral-700 mb-2">
            Integraciones Activas
          </h4>
          <div className="space-y-2">
            {user?.integrations && user.integrations.length > 0 ? (
              user.integrations.map((integration, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 text-xs text-neutral-600"
                >
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>{integration.name}</span>
                </div>
              ))
            ) : (
              <p className="text-xs text-neutral-500">
                No hay integraciones configuradas
              </p>
            )}
          </div>
        </div>
      </nav>

      {/* Botón de logout */}
      <div className="p-4 border-t border-neutral-200">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 p-3 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors duration-200 font-medium"
        >
          <LogOut size={18} />
          Cerrar Sesión
        </button>
      </div>
    </aside>
  );
};

export default LeftPanel;
