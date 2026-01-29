import { useAuth } from '../../../contexts/AuthContext';
import { CheckCircle, Lightbulb, Calendar, TrendingUp, Rocket } from 'lucide-react';

/**
 * Vista de inicio del Dashboard
 * Muestra un resumen de las actividades y estadísticas del usuario
 */
const HomeView = () => {
  const { user } = useAuth();

  // Obtener hora del día para el saludo
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return '¡Buenos días';
    if (hour < 18) return '¡Buenas tardes';
    return '¡Buenas noches';
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">

      {/* Saludo personalizado */}
      <div className="bg-gradient-to-r from-primary via-secondary to-primary-light rounded-2xl p-8 text-white shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">
              {getGreeting()}, {user?.firstName}! 👋
            </h1>
            <p className="text-lg opacity-90">
              Listo para organizar tu día y alcanzar tus metas
            </p>
          </div>
          <div className="hidden md:block">
            <Rocket size={80} className="opacity-80 animate-bounce" />
          </div>
        </div>
      </div>

      {/* Tarjetas de resumen */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

        {/* Tareas pendientes */}
        <div className="card bg-gradient-to-br from-blue-50 to-blue-100 border-l-4 border-blue-500">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-blue-600 font-medium mb-1">Tareas Pendientes</p>
              <p className="text-3xl font-bold text-blue-900">12</p>
              <p className="text-xs text-blue-600 mt-2">3 para hoy</p>
            </div>
            <div className="bg-blue-500 p-3 rounded-lg">
              <CheckCircle className="text-white" size={24} />
            </div>
          </div>
        </div>

        {/* Ideas guardadas */}
        <div className="card bg-gradient-to-br from-yellow-50 to-yellow-100 border-l-4 border-yellow-500">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-yellow-600 font-medium mb-1">Ideas Guardadas</p>
              <p className="text-3xl font-bold text-yellow-900">5</p>
              <p className="text-xs text-yellow-600 mt-2">2 nuevas esta semana</p>
            </div>
            <div className="bg-yellow-500 p-3 rounded-lg">
              <Lightbulb className="text-white" size={24} />
            </div>
          </div>
        </div>

        {/* Eventos próximos */}
        <div className="card bg-gradient-to-br from-green-50 to-green-100 border-l-4 border-green-500">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-green-600 font-medium mb-1">Eventos Próximos</p>
              <p className="text-3xl font-bold text-green-900">8</p>
              <p className="text-xs text-green-600 mt-2">Esta semana</p>
            </div>
            <div className="bg-green-500 p-3 rounded-lg">
              <Calendar className="text-white" size={24} />
            </div>
          </div>
        </div>

        {/* Proyectos activos */}
        <div className="card bg-gradient-to-br from-purple-50 to-purple-100 border-l-4 border-purple-500">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-purple-600 font-medium mb-1">Proyectos Activos</p>
              <p className="text-3xl font-bold text-purple-900">3</p>
              <p className="text-xs text-purple-600 mt-2">75% completado</p>
            </div>
            <div className="bg-purple-500 p-3 rounded-lg">
              <TrendingUp className="text-white" size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Actividad reciente */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Tareas recientes */}
        <div className="card col-span-2">
          <h3 className="text-xl font-bold text-neutral-800 mb-4 flex items-center gap-2">
            <CheckCircle className="text-primary" size={24} />
            Tareas Recientes
          </h3>
          <div className="space-y-3">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="flex items-center gap-3 p-3 bg-neutral-50 rounded-lg hover:bg-neutral-100 transition-colors"
              >
                <input
                  type="checkbox"
                  className="w-5 h-5 text-primary rounded focus:ring-primary"
                />
                <div className="flex-1">
                  <p className="font-medium text-neutral-800">
                    Completar diseño del dashboard
                  </p>
                  <p className="text-xs text-neutral-500">
                    Proyecto: UP TO DAY • Vence: Hoy
                  </p>
                </div>
                <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                  En progreso
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Progreso semanal */}
        <div className="card">
          <h3 className="text-xl font-bold text-neutral-800 mb-4 flex items-center gap-2">
            <TrendingUp className="text-secondary" size={24} />
            Progreso Semanal
          </h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-neutral-600">Tareas Completadas</span>
                <span className="font-bold text-primary">18/25</span>
              </div>
              <div className="w-full bg-neutral-200 rounded-full h-2">
                <div className="bg-primary h-2 rounded-full" style={{ width: '72%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-neutral-600">Ideas Implementadas</span>
                <span className="font-bold text-secondary">3/5</span>
              </div>
              <div className="w-full bg-neutral-200 rounded-full h-2">
                <div className="bg-secondary h-2 rounded-full" style={{ width: '60%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-neutral-600">Eventos Asistidos</span>
                <span className="font-bold text-green-600">6/8</span>
              </div>
              <div className="w-full bg-neutral-200 rounded-full h-2">
                <div className="bg-green-600 h-2 rounded-full" style={{ width: '75%' }}></div>
              </div>
            </div>
          </div>

          <div className="mt-6 p-3 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg">
            <p className="text-sm font-medium text-center text-primary-dark">
              ¡Excelente progreso! 🎉
            </p>
          </div>
        </div>
      </div>

      {/* Accesos rápidos */}
      <div className="card">
        <h3 className="text-xl font-bold text-neutral-800 mb-4">
          Accesos Rápidos
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { name: 'Nueva Tarea', icon: '✅', color: 'from-blue-400 to-blue-600' },
            { name: 'Nueva Idea', icon: '💡', color: 'from-yellow-400 to-orange-500' },
            { name: 'Nuevo Evento', icon: '📅', color: 'from-green-400 to-emerald-600' },
            { name: 'Subir Archivo', icon: '📁', color: 'from-purple-400 to-purple-600' }
          ].map((action) => (
            <button
              key={action.name}
              className={`p-6 rounded-xl bg-gradient-to-br ${action.color} text-white hover:shadow-xl transition-all duration-300 transform hover:scale-105`}
            >
              <div className="text-4xl mb-2">{action.icon}</div>
              <p className="font-medium">{action.name}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomeView;
