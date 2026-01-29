import { X } from 'lucide-react';
import HomeView from './features/HomeView';
import TasksView from './features/TasksView';
import IdeasView from './features/IdeasView';
import CalendarView from './features/CalendarView';
import FilesView from './features/FilesView';
import ProjectsView from './features/ProjectsView';
import IntegrationsView from './features/IntegrationsView';

/**
 * Sistema de pestañas para el Dashboard
 * Permite navegar entre diferentes vistas sin recargar la página
 */
const TabSystem = ({ tabs, activeTab, onTabChange, onTabClose }) => {

  /**
   * Renderiza el contenido de la pestaña activa
   */
  const renderTabContent = () => {
    const currentTab = tabs.find(tab => tab.id === activeTab);
    if (!currentTab) return null;

    // Mapeo de componentes según el tipo de vista
    const componentMap = {
      'Home': HomeView,
      'Tasks': TasksView,
      'Ideas': IdeasView,
      'Calendar': CalendarView,
      'Files': FilesView,
      'Projects': ProjectsView,
      'Integrations': IntegrationsView
    };

    const Component = componentMap[currentTab.component] || HomeView;
    return <Component />;
  };

  return (
    <div className="flex flex-col h-full">
      {/* Barra de pestañas */}
      {tabs.length > 0 && (
        <div className="bg-white border-b border-neutral-200 px-2 py-1 flex items-center gap-1 overflow-x-auto scrollbar-thin">
          {tabs.map(tab => (
            <div
              key={tab.id}
              className={`flex items-center gap-2 px-4 py-2 rounded-t-lg transition-all duration-200 cursor-pointer group ${
                activeTab === tab.id
                  ? 'bg-primary text-white'
                  : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
              }`}
              onClick={() => onTabChange(tab.id)}
            >
              {/* Título de la pestaña */}
              <span className="text-sm font-medium whitespace-nowrap">
                {tab.title}
              </span>

              {/* Botón de cerrar (no se puede cerrar la pestaña Home) */}
              {tab.id !== 'home' && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onTabClose(tab.id);
                  }}
                  className={`p-0.5 rounded transition-colors ${
                    activeTab === tab.id
                      ? 'hover:bg-primary-dark'
                      : 'hover:bg-neutral-300'
                  }`}
                >
                  <X size={14} />
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Contenido de la pestaña activa */}
      <div className="flex-1 overflow-auto bg-neutral-50">
        <div className="animate-fade-in">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default TabSystem;
