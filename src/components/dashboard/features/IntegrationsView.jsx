import { useState } from 'react';
import { Plug, Check, ExternalLink, Settings } from 'lucide-react';

/**
 * Vista de integraciones
 * Permite conectar y gestionar aplicaciones externas (GitHub, Canva, Trello, etc.)
 */
const IntegrationsView = () => {
  const [integrations, setIntegrations] = useState([
    {
      id: 'github',
      name: 'GitHub',
      description: 'Sincroniza tus repositorios y pull requests',
      category: 'Código',
      icon: '🐙',
      color: 'from-gray-700 to-gray-900',
      connected: true
    },
    {
      id: 'canva',
      name: 'Canva',
      description: 'Importa tus diseños y plantillas',
      category: 'Diseño',
      icon: '🎨',
      color: 'from-cyan-400 to-blue-500',
      connected: false
    },
    {
      id: 'trello',
      name: 'Trello',
      description: 'Sincroniza tableros y tarjetas',
      category: 'Productividad',
      icon: '📋',
      color: 'from-blue-500 to-blue-700',
      connected: true
    },
    {
      id: 'notion',
      name: 'Notion',
      description: 'Conecta tus páginas y bases de datos',
      category: 'Productividad',
      icon: '📝',
      color: 'from-neutral-700 to-neutral-900',
      connected: false
    },
    {
      id: 'figma',
      name: 'Figma',
      description: 'Importa archivos de diseño',
      category: 'Diseño',
      icon: '🎨',
      color: 'from-purple-500 to-pink-500',
      connected: false
    },
    {
      id: 'vercel',
      name: 'Vercel',
      description: 'Monitorea tus deploys',
      category: 'Código',
      icon: '▲',
      color: 'from-black to-neutral-800',
      connected: true
    },
    {
      id: 'capcut',
      name: 'CapCut',
      description: 'Gestiona tus proyectos de video',
      category: 'Publicidad',
      icon: '🎬',
      color: 'from-pink-500 to-rose-600',
      connected: false
    },
    {
      id: 'slack',
      name: 'Slack',
      description: 'Recibe notificaciones en tu workspace',
      category: 'Comunicación',
      icon: '💬',
      color: 'from-purple-600 to-pink-600',
      connected: false
    }
  ]);

  const toggleConnection = (id) => {
    setIntegrations(integrations.map(int =>
      int.id === id ? { ...int, connected: !int.connected } : int
    ));
  };

  const categories = ['Todos', 'Código', 'Diseño', 'Productividad', 'Publicidad', 'Comunicación'];
  const [selectedCategory, setSelectedCategory] = useState('Todos');

  const filteredIntegrations = selectedCategory === 'Todos'
    ? integrations
    : integrations.filter(int => int.category === selectedCategory);

  const connectedCount = integrations.filter(int => int.connected).length;

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-darkTheme-bg dark:to-darkTheme-border transition-colors duration-200">

      {/* Header */}
      <div className="bg-white dark:bg-darkTheme-card border-b border-neutral-200 dark:border-darkTheme-border px-8 py-6 shadow-sm transition-colors duration-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Plug className="text-secondary dark:text-secondary" size={32} />
            <div>
              <h2 className="text-3xl font-bold text-primary-dark dark:text-primary-light">
                Integraciones
              </h2>
              <p className="text-neutral-600 dark:text-darkTheme-muted">
                Conecta tus herramientas de trabajo favoritas
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold text-primary dark:text-primary-light">{connectedCount}</p>
            <p className="text-sm text-neutral-600 dark:text-darkTheme-muted">Conectadas</p>
          </div>
        </div>
      </div>

      {/* Filtros por categoría */}
      <div className="bg-white dark:bg-darkTheme-card border-b border-neutral-200 dark:border-darkTheme-border px-8 py-4 transition-colors duration-200">
        <div className="flex gap-2 overflow-x-auto">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                selectedCategory === category
                  ? 'bg-primary text-white'
                  : 'bg-neutral-100 dark:bg-darkTheme-bg text-neutral-700 dark:text-darkTheme-text hover:bg-neutral-200 dark:hover:bg-darkTheme-border'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Grid de integraciones */}
      <div className="flex-1 overflow-y-auto p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {filteredIntegrations.map(integration => (
            <div
              key={integration.id}
              className={`card hover:shadow-xl transition-all duration-200 dark:bg-darkTheme-card dark:border-darkTheme-border ${
                integration.connected ? 'border-2 border-green-300 dark:border-green-500' : ''
              }`}
            >
              {/* Header con icono y gradiente */}
              <div className={`bg-gradient-to-r ${integration.color} rounded-lg p-4 mb-4 text-white relative transition-colors duration-200`}>
                <div className="text-5xl mb-2">{integration.icon}</div>
                <h3 className="font-bold text-lg">{integration.name}</h3>

                {/* Indicador de conexión */}
                {integration.connected && (
                  <div className="absolute top-2 right-2 bg-green-500 dark:bg-green-600 text-white rounded-full p-1">
                    <Check size={16} />
                  </div>
                )}
              </div>

              {/* Descripción */}
              <p className="text-sm text-neutral-600 dark:text-darkTheme-muted mb-4">
                {integration.description}
              </p>

              {/* Categoría */}
              <span className="inline-block px-3 py-1 bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary-light text-xs rounded-full mb-4 transition-colors duration-200">
                {integration.category}
              </span>

              {/* Botones de acción */}
              <div className="flex gap-2">
                <button
                  onClick={() => toggleConnection(integration.id)}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg font-medium transition-all duration-200 ${
                    integration.connected
                      ? 'bg-red-500 text-white hover:bg-red-600'
                      : 'bg-primary text-white hover:bg-primary/90'
                  }`}
                >
                  {integration.connected ? (
                    <>
                      <Check size={16} />
                      Desconectar
                    </>
                  ) : (
                    <>
                      <Plug size={16} />
                      Conectar
                    </>
                  )}
                </button>

                {integration.connected && (
                  <button
                    className="p-2 bg-neutral-100 dark:bg-darkTheme-bg text-neutral-600 dark:text-darkTheme-muted rounded-lg hover:bg-neutral-200 dark:hover:bg-darkTheme-border transition-colors duration-200"
                    title="Configurar"
                  >
                    <Settings size={18} />
                  </button>
                )}
              </div>

              {/* Link a documentación */}
              {integration.connected && (
                <a
                  href="#"
                  className="flex items-center justify-center gap-2 mt-3 text-sm text-primary dark:text-primary-light hover:text-primary-dark dark:hover:text-primary transition-colors duration-200"
                >
                  <ExternalLink size={14} />
                  Ver configuración
                </a>
              )}
            </div>
          ))}
        </div>

        {filteredIntegrations.length === 0 && (
          <div className="text-center py-16">
            <Plug size={64} className="mx-auto text-neutral-300 dark:text-neutral-600 mb-4" />
            <p className="text-neutral-500 dark:text-darkTheme-muted">No hay integraciones en esta categoría</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default IntegrationsView;
