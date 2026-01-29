import { useState } from 'react';
import { Folder, Plus, ExternalLink, GitBranch, Users, Clock } from 'lucide-react';

/**
 * Vista de proyectos en marcha
 * Muestra todos los proyectos activos del usuario con sus estadísticas
 */
const ProjectsView = () => {
  const projects = [
    {
      id: '1',
      name: 'UP TO DAY',
      description: 'Organizador personal para desarrolladores',
      status: 'active',
      progress: 75,
      category: 'Desarrollo',
      team: 1,
      tasks: { total: 20, completed: 15 },
      lastUpdate: '2026-01-29',
      technologies: ['React', 'Tailwind', 'Next.js'],
      color: 'from-blue-400 to-blue-600'
    },
    {
      id: '2',
      name: 'Portfolio Personal',
      description: 'Sitio web personal con blog integrado',
      status: 'active',
      progress: 45,
      category: 'Diseño',
      team: 1,
      tasks: { total: 12, completed: 5 },
      lastUpdate: '2026-01-28',
      technologies: ['Next.js', 'MDX', 'Framer Motion'],
      color: 'from-purple-400 to-purple-600'
    },
    {
      id: '3',
      name: 'E-commerce App',
      description: 'Plataforma de comercio electrónico',
      status: 'planning',
      progress: 15,
      category: 'Backend',
      team: 3,
      tasks: { total: 30, completed: 4 },
      lastUpdate: '2026-01-25',
      technologies: ['Node.js', 'PostgreSQL', 'Stripe'],
      color: 'from-green-400 to-green-600'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-700';
      case 'planning':
        return 'bg-yellow-100 text-yellow-700';
      case 'completed':
        return 'bg-blue-100 text-blue-700';
      default:
        return 'bg-neutral-100 text-neutral-700';
    }
  };

  const getStatusText = (status) => {
    const map = { active: 'Activo', planning: 'En Planificación', completed: 'Completado' };
    return map[status] || status;
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-darkTheme-bg dark:to-darkTheme-border transition-colors duration-200">

      {/* Header */}
      <div className="bg-white dark:bg-darkTheme-card border-b border-neutral-200 dark:border-darkTheme-border px-8 py-6 shadow-sm transition-colors duration-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Folder className="text-primary dark:text-primary-light" size={32} />
            <div>
              <h2 className="text-3xl font-bold text-primary-dark dark:text-primary-light">
                Mis Proyectos
              </h2>
              <p className="text-neutral-600 dark:text-darkTheme-muted">
                Gestiona todos tus proyectos de desarrollo
              </p>
            </div>
          </div>
          <button className="btn-primary flex items-center gap-2">
            <Plus size={20} />
            Nuevo Proyecto
          </button>
        </div>
      </div>

      {/* Estadísticas generales */}
      <div className="bg-white dark:bg-darkTheme-card border-b border-neutral-200 dark:border-darkTheme-border px-8 py-4 transition-colors duration-200">
        <div className="grid grid-cols-4 gap-4">
          <div className="text-center">
            <p className="text-3xl font-bold text-primary dark:text-primary-light">{projects.length}</p>
            <p className="text-sm text-neutral-600 dark:text-darkTheme-muted">Proyectos Totales</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-green-600 dark:text-green-400">
              {projects.filter(p => p.status === 'active').length}
            </p>
            <p className="text-sm text-neutral-600 dark:text-darkTheme-muted">Activos</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-secondary dark:text-secondary">
              {projects.reduce((sum, p) => sum + p.tasks.total, 0)}
            </p>
            <p className="text-sm text-neutral-600 dark:text-darkTheme-muted">Tareas Totales</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">
              {Math.round(projects.reduce((sum, p) => sum + p.progress, 0) / projects.length)}%
            </p>
            <p className="text-sm text-neutral-600 dark:text-darkTheme-muted">Progreso Promedio</p>
          </div>
        </div>
      </div>

      {/* Grid de proyectos */}
      <div className="flex-1 overflow-y-auto p-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-7xl mx-auto">
          {projects.map(project => (
            <div
              key={project.id}
              className="card hover:shadow-xl transition-all duration-200 cursor-pointer group dark:bg-darkTheme-card dark:border-darkTheme-border"
            >
              {/* Header del proyecto con gradiente */}
              <div className={`bg-gradient-to-r ${project.color} rounded-lg p-4 mb-4 text-white transition-colors duration-200`}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-1">{project.name}</h3>
                    <p className="text-sm opacity-90">{project.description}</p>
                  </div>
                  <button className="p-2 hover:bg-white/20 rounded-lg transition-colors duration-200">
                    <ExternalLink size={20} />
                  </button>
                </div>
              </div>

              {/* Estado y categoría */}
              <div className="flex items-center gap-2 mb-4">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                  {getStatusText(project.status)}
                </span>
                <span className="px-3 py-1 bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary-light rounded-full text-xs font-medium transition-colors duration-200">
                  {project.category}
                </span>
              </div>

              {/* Progreso */}
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-neutral-600 dark:text-darkTheme-muted">Progreso del proyecto</span>
                  <span className="font-bold text-primary dark:text-primary-light">{project.progress}%</span>
                </div>
                <div className="w-full bg-neutral-200 dark:bg-darkTheme-border rounded-full h-2">
                  <div
                    className="bg-primary dark:bg-primary-light h-2 rounded-full transition-all duration-200"
                    style={{ width: `${project.progress}%` }}
                  ></div>
                </div>
              </div>

              {/* Estadísticas */}
              <div className="grid grid-cols-3 gap-4 mb-4 pb-4 border-b border-neutral-200 dark:border-darkTheme-border">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 text-neutral-600 dark:text-darkTheme-muted mb-1">
                    <Users size={16} />
                  </div>
                  <p className="text-lg font-bold text-neutral-800 dark:text-darkTheme-text">{project.team}</p>
                  <p className="text-xs text-neutral-500 dark:text-darkTheme-muted">Miembros</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 text-neutral-600 dark:text-darkTheme-muted mb-1">
                    <GitBranch size={16} />
                  </div>
                  <p className="text-lg font-bold text-neutral-800 dark:text-darkTheme-text">
                    {project.tasks.completed}/{project.tasks.total}
                  </p>
                  <p className="text-xs text-neutral-500 dark:text-darkTheme-muted">Tareas</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 text-neutral-600 dark:text-darkTheme-muted mb-1">
                    <Clock size={16} />
                  </div>
                  <p className="text-xs font-medium text-neutral-800 dark:text-darkTheme-text">
                    {new Date(project.lastUpdate).toLocaleDateString('es-ES', { month: 'short', day: 'numeric' })}
                  </p>
                  <p className="text-xs text-neutral-500 dark:text-darkTheme-muted">Actualización</p>
                </div>
              </div>

              {/* Tecnologías */}
              <div>
                <p className="text-xs text-neutral-600 dark:text-darkTheme-muted mb-2">Tecnologías:</p>
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-neutral-100 dark:bg-darkTheme-bg text-neutral-700 dark:text-darkTheme-text text-xs rounded transition-colors duration-200"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProjectsView;
