import { useState } from 'react';
import { FolderOpen, File, Plus, Upload, Search, MoreVertical, Image, FileText, Film } from 'lucide-react';

/**
 * Vista de archivos multimedia organizados por proyectos
 * Permite gestionar carpetas y archivos asociados a proyectos
 */
const FilesView = () => {
  const [selectedFolder, setSelectedFolder] = useState('all');

  // Estructura de carpetas por proyecto
  const folders = [
    { id: 'all', name: 'Todos los archivos', count: 24, color: 'text-neutral-600' },
    { id: 'project1', name: 'UP TO DAY', count: 12, color: 'text-blue-600' },
    { id: 'project2', name: 'Portfolio Personal', count: 8, color: 'text-purple-600' },
    { id: 'project3', name: 'E-commerce App', count: 4, color: 'text-green-600' }
  ];

  // Archivos de ejemplo
  const files = [
    {
      id: '1',
      name: 'wireframe-dashboard.fig',
      type: 'design',
      size: '2.4 MB',
      project: 'project1',
      date: '2026-01-28',
      icon: Image
    },
    {
      id: '2',
      name: 'arquitectura-sistema.pdf',
      type: 'document',
      size: '1.8 MB',
      project: 'project1',
      date: '2026-01-27',
      icon: FileText
    },
    {
      id: '3',
      name: 'demo-video.mp4',
      type: 'video',
      size: '45 MB',
      project: 'project1',
      date: '2026-01-26',
      icon: Film
    },
    {
      id: '4',
      name: 'mockup-homepage.png',
      type: 'image',
      size: '3.2 MB',
      project: 'project2',
      date: '2026-01-25',
      icon: Image
    }
  ];

  // Filtrar archivos según la carpeta seleccionada
  const filteredFiles = selectedFolder === 'all'
    ? files
    : files.filter(file => file.project === selectedFolder);

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-purple-50 to-pink-50 dark:from-darkTheme-bg dark:to-darkTheme-border transition-colors duration-200">

      {/* Header */}
      <div className="bg-white dark:bg-darkTheme-card border-b border-neutral-200 dark:border-darkTheme-border px-8 py-6 shadow-sm transition-colors duration-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FolderOpen className="text-purple-500 dark:text-purple-400" size={32} />
            <div>
              <h2 className="text-3xl font-bold text-primary-dark dark:text-primary-light">
                Archivos
              </h2>
              <p className="text-neutral-600 dark:text-darkTheme-muted">
                Organiza tus recursos multimedia por proyecto
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="btn-outline flex items-center gap-2">
              <Upload size={20} />
              Subir
            </button>
            <button className="btn-primary flex items-center gap-2">
              <Plus size={20} />
              Nueva Carpeta
            </button>
          </div>
        </div>

        {/* Buscador */}
        <div className="mt-4 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 dark:text-darkTheme-muted" size={20} />
          <input
            type="text"
            placeholder="Buscar archivos..."
            className="input-field pl-10 w-full"
          />
        </div>
      </div>

      {/* Contenedor principal */}
      <div className="flex-1 overflow-hidden flex">

        {/* Sidebar de carpetas */}
        <aside className="w-64 bg-white dark:bg-darkTheme-card border-r border-neutral-200 dark:border-darkTheme-border p-4 overflow-y-auto transition-colors duration-200">
          <h3 className="font-semibold text-neutral-700 dark:text-darkTheme-text mb-3">Proyectos</h3>
          <div className="space-y-1">
            {folders.map(folder => (
              <button
                key={folder.id}
                onClick={() => setSelectedFolder(folder.id)}
                className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all duration-200 ${
                  selectedFolder === folder.id
                    ? 'bg-primary text-white'
                    : 'hover:bg-neutral-100 dark:hover:bg-darkTheme-border text-neutral-700 dark:text-darkTheme-text'
                }`}
              >
                <FolderOpen size={20} />
                <div className="flex-1 text-left">
                  <p className="font-medium text-sm">{folder.name}</p>
                  <p className={`text-xs ${
                    selectedFolder === folder.id ? 'text-white/80' : 'text-neutral-500 dark:text-darkTheme-muted'
                  }`}>
                    {folder.count} archivos
                  </p>
                </div>
              </button>
            ))}
          </div>
        </aside>

        {/* Grid de archivos */}
        <div className="flex-1 overflow-y-auto p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredFiles.map(file => {
              const Icon = file.icon;
              return (
                <div
                  key={file.id}
                  className="card hover:shadow-xl cursor-pointer transition-all duration-200 group dark:bg-darkTheme-card dark:border-darkTheme-border"
                >
                  {/* Preview del archivo */}
                  <div className="aspect-video bg-gradient-to-br from-primary/10 to-secondary/10 dark:from-primary/20 dark:to-secondary/20 rounded-lg mb-3 flex items-center justify-center transition-colors duration-200">
                    <Icon size={48} className="text-primary dark:text-primary-light group-hover:scale-110 transition-transform" />
                  </div>

                  {/* Información del archivo */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-neutral-800 dark:text-darkTheme-text text-sm truncate">
                        {file.name}
                      </h4>
                      <p className="text-xs text-neutral-500 dark:text-darkTheme-muted mt-1">
                        {file.size} • {new Date(file.date).toLocaleDateString('es-ES', { month: 'short', day: 'numeric' })}
                      </p>
                    </div>
                    <button className="p-1 hover:bg-neutral-100 dark:hover:bg-darkTheme-border rounded transition-colors duration-200">
                      <MoreVertical size={16} className="text-neutral-400 dark:text-darkTheme-muted" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredFiles.length === 0 && (
            <div className="text-center py-16">
              <FolderOpen size={64} className="mx-auto text-neutral-300 dark:text-neutral-600 mb-4" />
              <p className="text-neutral-500 dark:text-darkTheme-muted">No hay archivos en esta carpeta</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FilesView;
