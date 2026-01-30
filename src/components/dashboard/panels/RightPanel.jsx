import { useState } from 'react';
import { BookOpen, CheckSquare, Lightbulb, Calendar, FolderOpen, DollarSign, Mail, Lock } from 'lucide-react';

/**
 * Panel derecho del Dashboard (Sidebar con herramientas)
 * Contiene accesos rápidos a: Tareas, Ideas, Calendario y Archivos
 * Incluye animación del icono del libro al hacer hover
 */
const RightPanel = ({ onOpenTab }) => {
  const [hoveredTool, setHoveredTool] = useState(null);

  /**
   * Herramientas disponibles en el panel
   */
  const tools = [
    {
      id: 'finance',
      title: 'Finanzas',
      description: 'Control de ingresos y gastos',
      icon: DollarSign,
      color: 'from-emerald-400 to-green-600',
      component: 'Finance'
    },
    {
      id: 'email',
      title: 'Correos',
      description: 'Gestor de correos electrónicos',
      icon: Mail,
      color: 'from-cyan-400 to-blue-600',
      component: 'Email'
    },
    {
      id: 'passwords',
      title: 'Contraseñas',
      description: 'Bóveda segura de contraseñas',
      icon: Lock,
      color: 'from-indigo-400 to-purple-600',
      component: 'Password'
    },
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
    <aside className="h-full bg-white dark:bg-darkTheme-bg border-l border-neutral-200 dark:border-darkTheme-border flex flex-col shadow-lg transition-colors duration-200">

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

      {/* Botones de herramientas - Diseño ancho */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-3">
          {tools.map((tool) => {
            const Icon = tool.icon;
            const isHovered = hoveredTool === tool.id;

            return (
              <button
                key={tool.id}
                onClick={() => openTool(tool)}
                onMouseEnter={() => setHoveredTool(tool.id)}
                onMouseLeave={() => setHoveredTool(null)}
                className="w-full group relative overflow-hidden rounded-lg transition-all duration-200"
              >
                {/* Fondo con gradiente */}
                <div className={`absolute inset-0 bg-gradient-to-r ${tool.color} transition-opacity duration-200 ${
                  isHovered ? 'opacity-100' : 'opacity-90'
                }`}></div>

                {/* Contenido */}
                <div className="relative z-10 flex items-center gap-3 px-4 py-3 text-white">
                  <div className={`p-2 bg-white/20 rounded-lg transition-transform duration-200 ${
                    isHovered ? 'scale-110' : 'scale-100'
                  }`}>
                    <Icon size={20} />
                  </div>
                  <div className="flex-1 text-left">
                    <h3 className="font-semibold text-sm">
                      {tool.title}
                    </h3>
                    <p className="text-xs opacity-90">
                      {tool.description}
                    </p>
                  </div>
                  <div className={`transition-transform duration-200 ${
                    isHovered ? 'translate-x-1' : 'translate-x-0'
                  }`}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>

                {/* Efecto de brillo al hover */}
                {isHovered && (
                  <div className="absolute inset-0 bg-white opacity-10"></div>
                )}
              </button>
            );
          })}
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
