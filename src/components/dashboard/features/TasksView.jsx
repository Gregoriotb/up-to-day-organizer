import { useState } from 'react';
import { Plus, MoreVertical, Calendar, User, Tag } from 'lucide-react';

/**
 * Vista de tareas estilo Trello
 * Organiza tareas en columnas: Por Hacer, En Progreso, Completado
 */
const TasksView = () => {
  // Estado inicial de las columnas y tareas
  const [columns, setColumns] = useState([
    {
      id: 'todo',
      title: 'Por Hacer',
      color: 'bg-blue-500',
      tasks: [
        {
          id: '1',
          title: 'Diseñar wireframes del proyecto',
          description: 'Crear wireframes de alta fidelidad para todas las pantallas',
          priority: 'high',
          tags: ['Diseño', 'UI/UX'],
          dueDate: '2026-02-05',
          assignee: 'Tu'
        },
        {
          id: '2',
          title: 'Configurar repositorio en GitHub',
          description: 'Inicializar repositorio y configurar ramas principales',
          priority: 'medium',
          tags: ['Desarrollo', 'Git'],
          dueDate: '2026-02-03',
          assignee: 'Tu'
        }
      ]
    },
    {
      id: 'inprogress',
      title: 'En Progreso',
      color: 'bg-yellow-500',
      tasks: [
        {
          id: '3',
          title: 'Implementar sistema de autenticación',
          description: 'OAuth con Google y GitHub',
          priority: 'high',
          tags: ['Desarrollo', 'Backend'],
          dueDate: '2026-02-02',
          assignee: 'Tu'
        }
      ]
    },
    {
      id: 'done',
      title: 'Completado',
      color: 'bg-green-500',
      tasks: [
        {
          id: '4',
          title: 'Investigar stack tecnológico',
          description: 'Decidir entre React vs Vue, Node vs Next',
          priority: 'low',
          tags: ['Investigación'],
          dueDate: '2026-01-28',
          assignee: 'Tu'
        }
      ]
    }
  ]);

  /**
   * Obtiene el color del badge según la prioridad
   */
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-700 border-red-300';
      case 'medium':
        return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      case 'low':
        return 'bg-green-100 text-green-700 border-green-300';
      default:
        return 'bg-neutral-100 text-neutral-700 border-neutral-300';
    }
  };

  /**
   * Obtiene el texto de la prioridad
   */
  const getPriorityText = (priority) => {
    const map = { high: 'Alta', medium: 'Media', low: 'Baja' };
    return map[priority] || priority;
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-neutral-50 to-neutral-100">

      {/* Header */}
      <div className="bg-white border-b border-neutral-200 px-8 py-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-primary-dark">
              Mis Tareas
            </h2>
            <p className="text-neutral-600 mt-1">
              Organiza y gestiona tus tareas como un profesional
            </p>
          </div>
          <button className="btn-primary flex items-center gap-2">
            <Plus size={20} />
            Nueva Tarea
          </button>
        </div>

        {/* Filtros */}
        <div className="flex gap-4 mt-4">
          <select className="input-field text-sm">
            <option>Todas las prioridades</option>
            <option>Alta</option>
            <option>Media</option>
            <option>Baja</option>
          </select>
          <select className="input-field text-sm">
            <option>Todas las etiquetas</option>
            <option>Diseño</option>
            <option>Desarrollo</option>
            <option>Backend</option>
          </select>
        </div>
      </div>

      {/* Tablero estilo Trello */}
      <div className="flex-1 overflow-x-auto p-8">
        <div className="flex gap-6 h-full min-w-max">

          {/* Renderizar cada columna */}
          {columns.map((column) => (
            <div
              key={column.id}
              className="w-80 flex flex-col bg-white rounded-xl shadow-md border border-neutral-200"
            >
              {/* Header de la columna */}
              <div className={`${column.color} text-white px-4 py-3 rounded-t-xl flex items-center justify-between`}>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-lg">{column.title}</h3>
                  <span className="bg-white/30 px-2 py-0.5 rounded-full text-sm">
                    {column.tasks.length}
                  </span>
                </div>
                <button className="hover:bg-white/20 p-1 rounded">
                  <MoreVertical size={18} />
                </button>
              </div>

              {/* Lista de tareas */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {column.tasks.map((task) => (
                  <div
                    key={task.id}
                    className="card p-4 hover:shadow-lg cursor-pointer transition-all duration-200 border border-neutral-100 hover:border-primary"
                  >
                    {/* Título de la tarea */}
                    <h4 className="font-semibold text-neutral-800 mb-2">
                      {task.title}
                    </h4>

                    {/* Descripción */}
                    {task.description && (
                      <p className="text-sm text-neutral-600 mb-3">
                        {task.description}
                      </p>
                    )}

                    {/* Tags */}
                    {task.tags && task.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-3">
                        {task.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full flex items-center gap-1"
                          >
                            <Tag size={12} />
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Footer de la tarjeta */}
                    <div className="flex items-center justify-between pt-3 border-t border-neutral-100">
                      {/* Prioridad */}
                      <span className={`px-2 py-1 text-xs rounded-full border ${getPriorityColor(task.priority)}`}>
                        {getPriorityText(task.priority)}
                      </span>

                      {/* Fecha y asignado */}
                      <div className="flex items-center gap-2">
                        {task.dueDate && (
                          <div className="flex items-center gap-1 text-xs text-neutral-500">
                            <Calendar size={14} />
                            <span>{new Date(task.dueDate).toLocaleDateString('es-ES', { month: 'short', day: 'numeric' })}</span>
                          </div>
                        )}
                        {task.assignee && (
                          <div className="flex items-center gap-1 text-xs text-neutral-500">
                            <User size={14} />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Botón para agregar tarea en la columna */}
              <div className="p-3 border-t border-neutral-200">
                <button className="w-full flex items-center justify-center gap-2 p-2 text-neutral-600 hover:bg-neutral-100 rounded-lg transition-colors">
                  <Plus size={18} />
                  <span className="text-sm font-medium">Agregar tarea</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TasksView;
