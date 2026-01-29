import { useState } from 'react';
import { Plus, Trash2, Edit, Check, X, Lightbulb, Star } from 'lucide-react';

/**
 * Vista de anotador de ideas estilo checklist
 * Permite guardar, marcar como favoritas y gestionar ideas
 */
const IdeasView = () => {
  const [ideas, setIdeas] = useState([
    {
      id: '1',
      text: 'Implementar modo oscuro en la aplicación',
      completed: false,
      favorite: true,
      category: 'UI/UX',
      createdAt: '2026-01-28'
    },
    {
      id: '2',
      text: 'Agregar integración con Notion para sincronizar notas',
      completed: false,
      favorite: true,
      category: 'Integraciones',
      createdAt: '2026-01-27'
    },
    {
      id: '3',
      text: 'Crear sistema de notificaciones push',
      completed: true,
      favorite: false,
      category: 'Backend',
      createdAt: '2026-01-26'
    },
    {
      id: '4',
      text: 'Optimizar rendimiento de carga de imágenes',
      completed: false,
      favorite: false,
      category: 'Performance',
      createdAt: '2026-01-25'
    }
  ]);

  const [newIdea, setNewIdea] = useState('');
  const [newCategory, setNewCategory] = useState('General');
  const [filter, setFilter] = useState('all'); // all, active, completed, favorites
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');

  /**
   * Agrega una nueva idea
   */
  const handleAddIdea = (e) => {
    e.preventDefault();
    if (newIdea.trim()) {
      const idea = {
        id: Date.now().toString(),
        text: newIdea,
        completed: false,
        favorite: false,
        category: newCategory,
        createdAt: new Date().toISOString().split('T')[0]
      };
      setIdeas([idea, ...ideas]);
      setNewIdea('');
      setNewCategory('General');
    }
  };

  /**
   * Marca una idea como completada/no completada
   */
  const toggleComplete = (id) => {
    setIdeas(ideas.map(idea =>
      idea.id === id ? { ...idea, completed: !idea.completed } : idea
    ));
  };

  /**
   * Marca una idea como favorita
   */
  const toggleFavorite = (id) => {
    setIdeas(ideas.map(idea =>
      idea.id === id ? { ...idea, favorite: !idea.favorite } : idea
    ));
  };

  /**
   * Elimina una idea
   */
  const deleteIdea = (id) => {
    if (confirm('¿Estás seguro de eliminar esta idea?')) {
      setIdeas(ideas.filter(idea => idea.id !== id));
    }
  };

  /**
   * Inicia la edición de una idea
   */
  const startEdit = (idea) => {
    setEditingId(idea.id);
    setEditText(idea.text);
  };

  /**
   * Guarda la edición de una idea
   */
  const saveEdit = () => {
    if (editText.trim()) {
      setIdeas(ideas.map(idea =>
        idea.id === editingId ? { ...idea, text: editText } : idea
      ));
    }
    setEditingId(null);
    setEditText('');
  };

  /**
   * Cancela la edición
   */
  const cancelEdit = () => {
    setEditingId(null);
    setEditText('');
  };

  /**
   * Filtra las ideas según el filtro activo
   */
  const getFilteredIdeas = () => {
    switch (filter) {
      case 'active':
        return ideas.filter(idea => !idea.completed);
      case 'completed':
        return ideas.filter(idea => idea.completed);
      case 'favorites':
        return ideas.filter(idea => idea.favorite);
      default:
        return ideas;
    }
  };

  const filteredIdeas = getFilteredIdeas();

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-darkTheme-bg dark:to-darkTheme-border transition-colors duration-200">

      {/* Header */}
      <div className="bg-white dark:bg-darkTheme-card border-b border-neutral-200 dark:border-darkTheme-border px-8 py-6 shadow-sm transition-colors duration-200">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <Lightbulb className="text-yellow-500 dark:text-yellow-400" size={32} />
            <h2 className="text-3xl font-bold text-primary-dark dark:text-primary-light">
              Mis Ideas
            </h2>
          </div>
          <p className="text-neutral-600 dark:text-darkTheme-muted">
            Captura y organiza todas tus ideas brillantes
          </p>
        </div>
      </div>

      {/* Formulario para nueva idea */}
      <div className="bg-white dark:bg-darkTheme-card border-b border-neutral-200 dark:border-darkTheme-border px-8 py-4 shadow-sm transition-colors duration-200">
        <form onSubmit={handleAddIdea} className="max-w-4xl mx-auto">
          <div className="flex gap-3">
            <input
              type="text"
              value={newIdea}
              onChange={(e) => setNewIdea(e.target.value)}
              placeholder="Escribe tu nueva idea aquí..."
              className="input-field flex-1"
            />
            <select
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              className="input-field w-40"
            >
              <option>General</option>
              <option>UI/UX</option>
              <option>Backend</option>
              <option>Frontend</option>
              <option>Performance</option>
              <option>Integraciones</option>
            </select>
            <button type="submit" className="btn-primary flex items-center gap-2 px-6">
              <Plus size={20} />
              Agregar
            </button>
          </div>
        </form>
      </div>

      {/* Filtros */}
      <div className="bg-white dark:bg-darkTheme-card border-b border-neutral-200 dark:border-darkTheme-border px-8 py-3 transition-colors duration-200">
        <div className="max-w-4xl mx-auto flex gap-2">
          {[
            { value: 'all', label: 'Todas', count: ideas.length },
            { value: 'active', label: 'Activas', count: ideas.filter(i => !i.completed).length },
            { value: 'completed', label: 'Completadas', count: ideas.filter(i => i.completed).length },
            { value: 'favorites', label: 'Favoritas', count: ideas.filter(i => i.favorite).length }
          ].map(f => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                filter === f.value
                  ? 'bg-primary text-white'
                  : 'bg-neutral-100 dark:bg-darkTheme-bg text-neutral-700 dark:text-darkTheme-text hover:bg-neutral-200 dark:hover:bg-darkTheme-border'
              }`}
            >
              {f.label} ({f.count})
            </button>
          ))}
        </div>
      </div>

      {/* Lista de ideas */}
      <div className="flex-1 overflow-y-auto p-8">
        <div className="max-w-4xl mx-auto space-y-3">
          {filteredIdeas.length === 0 ? (
            <div className="text-center py-16">
              <Lightbulb size={64} className="mx-auto text-neutral-300 dark:text-neutral-600 mb-4" />
              <p className="text-neutral-500 dark:text-darkTheme-muted">No hay ideas que mostrar</p>
            </div>
          ) : (
            filteredIdeas.map((idea) => (
              <div
                key={idea.id}
                className={`card flex items-center gap-4 hover:shadow-lg transition-all duration-200 ${
                  idea.completed ? 'bg-neutral-50 dark:bg-darkTheme-bg opacity-75' : 'bg-white dark:bg-darkTheme-card'
                } dark:border-darkTheme-border`}
              >
                {/* Checkbox */}
                <button
                  onClick={() => toggleComplete(idea.id)}
                  className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                    idea.completed
                      ? 'bg-green-500 dark:bg-green-600 border-green-500 dark:border-green-600'
                      : 'border-neutral-300 dark:border-darkTheme-border hover:border-primary dark:hover:border-primary-light'
                  }`}
                >
                  {idea.completed && <Check size={16} className="text-white" />}
                </button>

                {/* Contenido de la idea */}
                <div className="flex-1">
                  {editingId === idea.id ? (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        className="input-field flex-1"
                        autoFocus
                      />
                      <button
                        onClick={saveEdit}
                        className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-200"
                      >
                        <Check size={18} />
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200"
                      >
                        <X size={18} />
                      </button>
                    </div>
                  ) : (
                    <>
                      <p className={`font-medium ${
                        idea.completed ? 'line-through text-neutral-500 dark:text-darkTheme-muted' : 'text-neutral-800 dark:text-darkTheme-text'
                      }`}>
                        {idea.text}
                      </p>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-xs px-2 py-1 bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary-light rounded-full transition-colors duration-200">
                          {idea.category}
                        </span>
                        <span className="text-xs text-neutral-500 dark:text-darkTheme-muted">
                          {new Date(idea.createdAt).toLocaleDateString('es-ES', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </span>
                      </div>
                    </>
                  )}
                </div>

                {/* Acciones */}
                {editingId !== idea.id && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => toggleFavorite(idea.id)}
                      className={`p-2 rounded-lg transition-colors duration-200 ${
                        idea.favorite
                          ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400'
                          : 'bg-neutral-100 dark:bg-darkTheme-bg text-neutral-600 dark:text-darkTheme-muted hover:bg-yellow-100 dark:hover:bg-yellow-900/30 hover:text-yellow-600 dark:hover:text-yellow-400'
                      }`}
                      title="Marcar como favorito"
                    >
                      <Star size={18} fill={idea.favorite ? 'currentColor' : 'none'} />
                    </button>
                    <button
                      onClick={() => startEdit(idea)}
                      className="p-2 bg-neutral-100 dark:bg-darkTheme-bg text-neutral-600 dark:text-darkTheme-muted rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
                      title="Editar"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => deleteIdea(idea.id)}
                      className="p-2 bg-neutral-100 dark:bg-darkTheme-bg text-neutral-600 dark:text-darkTheme-muted rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 hover:text-red-600 dark:hover:text-red-400 transition-colors duration-200"
                      title="Eliminar"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default IdeasView;
