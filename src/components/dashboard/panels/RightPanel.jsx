import { useState } from 'react';
import { BookOpen, CheckSquare, Lightbulb, Calendar, FolderOpen } from 'lucide-react';

/**
 * Panel derecho del Dashboard (Sidebar con herramientas)
 * Contiene accesos rápidos a: Tareas, Ideas, Calendario y Archivos
 * Incluye animación del icono del libro al hacer hover
 */
const RightPanel = ({ onOpenTab }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [hoveredTool, setHoveredTool] = useState(null);

  /**
   * Herramientas disponibles en el panel
   */
  const tools = [
    {
      id: 'tasks',
      title: 'Tareas',
      description: 'Organizador estilo Trello',
      icon: CheckSquare,
      color: 'from-blue-400 to-blue-600',
      component: 'Tasks'
    },
    {
      id: 'ideas',
      title: 'Ideas',
      description: 'Anotador de ideas',
      icon: Lightbulb,
      color: 'from-yellow-400 to-orange-500',
      component: 'Ideas'
    },
    {
      id: 'calendar',
      title: 'Calendario',
      description: 'Calendario de actividades',
      icon: Calendar,
      color: 'from-green-400 to-emerald-600',
      component: 'Calendar'
    },
    {
      id: 'files',
      title: 'Archivos',
      description: 'Carpetas multimedia',
      icon: FolderOpen,
      color: 'from-purple-400 to-purple-600',
      component: 'Files'
    }
  ];

  /**
   * Abre una herramienta en una nueva pestaña
   */
  const openTool = (tool) => {
    onOpenTab({
      id: tool.id,
      title: tool.title,
      component: tool.component
    });
  };

  return (
    <aside className="h-full bg-white dark:bg-darkTheme-bg border-l border-neutral-200 dark:border-darkTheme-border flex flex-col shadow-lg relative transition-colors duration-200">

      {/* Botón de toggle con icono de libro */}
      <div className="absolute -left-6 top-8 z-10">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          onMouseEnter={() => setIsExpanded(true)}
          className={`bg-white dark:bg-darkTheme-card border-2 border-primary dark:border-primary-light rounded-l-xl p-3 shadow-lg transition-all duration-300 transform hover:scale-110 ${
            isExpanded ? 'bg-primary dark:bg-primary-light' : 'hover:bg-primary-light dark:hover:bg-primary'
          }`}
          title="Herramientas"
        >
          <BookOpen
            size={24}
            className={`transition-all duration-300 ${
              isExpanded ? 'text-white rotate-0' : 'text-primary'
            }`}
          />
        </button>
      </div>

      {/* Header del panel */}
      <div className="p-6 border-b border-neutral-200 dark:border-darkTheme-border bg-gradient-to-br from-primary/5 to-secondary/5 dark:from-primary/10 dark:to-secondary/10">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary rounded-lg">
            <BookOpen size={24} className="text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-primary-dark dark:text-primary-light">
              Herramientas
            </h2>
            <p className="text-xs text-neutral-500 dark:text-darkTheme-muted">
              Gestiona tu trabajo diario
            </p>
          </div>
        </div>
      </div>

      {/* Grid de herramientas */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="grid grid-cols-2 gap-4">
          {tools.map((tool) => {
            const Icon = tool.icon;
            const isHovered = hoveredTool === tool.id;

            return (
              <button
                key={tool.id}
                onClick={() => openTool(tool)}
                onMouseEnter={() => setHoveredTool(tool.id)}
                onMouseLeave={() => setHoveredTool(null)}
                className={`relative overflow-hidden rounded-xl p-4 transition-all duration-300 transform ${
                  isHovered
                    ? 'scale-105 shadow-xl'
                    : 'scale-100 shadow-md hover:shadow-lg'
                }`}
              >
                {/* Fondo con gradiente */}
                <div className={`absolute inset-0 bg-gradient-to-br ${tool.color} opacity-90`}></div>

                {/* Contenido */}
                <div className="relative z-10 flex flex-col items-center justify-center text-white space-y-2">
                  <Icon
                    size={32}
                    className={`transition-transform duration-300 ${
                      isHovered ? 'scale-125' : 'scale-100'
                    }`}
                  />
                  <span className="font-semibold text-sm">
                    {tool.title}
                  </span>
                </div>

                {/* Efecto de brillo al hover */}
                {isHovered && (
                  <div className="absolute inset-0 bg-white opacity-20 animate-pulse"></div>
                )}
              </button>
            );
          })}
        </div>

        {/* Información adicional */}
        <div className="mt-6 space-y-3">
          {tools.map((tool) => (
            <div
              key={`info-${tool.id}`}
              className="bg-neutral-50 dark:bg-darkTheme-card rounded-lg p-3 border-l-4 border-primary/30 dark:border-primary/40 hover:border-primary dark:hover:border-primary-light transition-colors duration-200"
            >
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg bg-gradient-to-br ${tool.color}`}>
                  <tool.icon size={16} className="text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-semibold text-neutral-800 dark:text-darkTheme-text">
                    {tool.title}
                  </h4>
                  <p className="text-xs text-neutral-600 dark:text-darkTheme-muted mt-1">
                    {tool.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Tips */}
        <div className="mt-6 p-4 bg-gradient-to-br from-primary-light/20 to-secondary-light/20 dark:from-primary/10 dark:to-secondary/10 rounded-lg border border-primary/20 dark:border-primary/30">
          <h4 className="text-sm font-bold text-primary-dark dark:text-primary-light mb-2 flex items-center gap-2">
            <Lightbulb size={16} />
            Tip del día
          </h4>
          <p className="text-xs text-neutral-700 dark:text-darkTheme-text">
            Organiza tus tareas por prioridad y sincronízalas con tu calendario para una mejor gestión del tiempo.
          </p>
        </div>
      </div>

      {/* Footer con estadísticas */}
      <div className="p-4 border-t border-neutral-200 dark:border-darkTheme-border bg-neutral-50 dark:bg-darkTheme-card">
        <div className="grid grid-cols-2 gap-2 text-center">
          <div className="bg-white dark:bg-darkTheme-bg rounded-lg p-3 shadow-sm">
            <p className="text-2xl font-bold text-primary dark:text-primary-light">12</p>
            <p className="text-xs text-neutral-600 dark:text-darkTheme-muted">Tareas Activas</p>
          </div>
          <div className="bg-white dark:bg-darkTheme-bg rounded-lg p-3 shadow-sm">
            <p className="text-2xl font-bold text-secondary dark:text-secondary-light">5</p>
            <p className="text-xs text-neutral-600 dark:text-darkTheme-muted">Ideas Guardadas</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default RightPanel;
