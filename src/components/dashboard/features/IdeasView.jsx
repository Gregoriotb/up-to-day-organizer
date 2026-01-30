import { useState, useEffect } from 'react';
import { Plus, Trash2, Edit, Check, X, Lightbulb, Star, Pin, TrendingUp, CheckSquare, StickyNote } from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Vista de anotador de ideas completa con backend
 * Permite guardar, categorizar y gestionar ideas con checklist
 */
const IdeasView = () => {
  const { token } = useAuth();

  const [ideas, setIdeas] = useState([]);
  const [newIdea, setNewIdea] = useState({
    title: '',
    content: '',
    category: 'other',
    priority: 'medium',
    color: '#FFD700'
  });
  const [filter, setFilter] = useState('all'); // all, active, completed, favorites, pinned
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [expandedId, setExpandedId] = useState(null);

  const categories = [
    { value: 'personal', label: 'Personal' },
    { value: 'work', label: 'Trabajo' },
    { value: 'project', label: 'Proyecto' },
    { value: 'business', label: 'Negocio' },
    { value: 'creative', label: 'Creativo' },
    { value: 'technical', label: 'Técnico' },
    { value: 'random', label: 'Aleatorio' },
    { value: 'other', label: 'Otro' }
  ];

  const priorities = [
    { value: 'low', label: 'Baja', color: 'text-gray-600' },
    { value: 'medium', label: 'Media', color: 'text-blue-600' },
    { value: 'high', label: 'Alta', color: 'text-orange-600' },
    { value: 'urgent', label: 'Urgente', color: 'text-red-600' }
  ];

  // Cargar ideas al montar
  useEffect(() => {
    fetchIdeas();
  }, []);

  /**
   * Obtener todas las ideas
   */
  const fetchIdeas = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/idea/ideas`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setIdeas(data);
      }
    } catch (error) {
      console.error('Error fetching ideas:', error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Agrega una nueva idea
   */
  const handleAddIdea = async (e) => {
    e.preventDefault();
    if (!newIdea.title.trim() || !newIdea.content.trim()) {
      setMessage({ type: 'error', text: 'Título y contenido son requeridos' });
      return;
    }

    try {
      const response = await fetch(`${API_URL}/idea/ideas`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newIdea)
      });

      if (response.ok) {
        setMessage({ type: 'success', text: 'Idea creada exitosamente' });
        setNewIdea({
          title: '',
          content: '',
          category: 'other',
          priority: 'medium',
          color: '#FFD700'
        });
        await fetchIdeas();
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Error al crear idea' });
    }
  };

  /**
   * Alternar estado completado
   */
  const toggleComplete = async (id, currentStatus) => {
    try {
      const newStatus = currentStatus === 'completed' ? 'active' : 'completed';
      await fetch(`${API_URL}/idea/ideas/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      await fetchIdeas();
    } catch (error) {
      console.error('Error toggling complete:', error);
    }
  };

  /**
   * Alternar favorito
   */
  const toggleFavorite = async (id) => {
    try {
      await fetch(`${API_URL}/idea/ideas/${id}/favorite`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      await fetchIdeas();
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  /**
   * Alternar pin
   */
  const togglePin = async (id) => {
    try {
      await fetch(`${API_URL}/idea/ideas/${id}/pin`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      await fetchIdeas();
    } catch (error) {
      console.error('Error toggling pin:', error);
    }
  };

  /**
   * Elimina una idea
   */
  const deleteIdea = async (id) => {
    if (!confirm('¿Estás seguro de eliminar esta idea?')) return;

    try {
      await fetch(`${API_URL}/idea/ideas/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setMessage({ type: 'success', text: 'Idea eliminada' });
      await fetchIdeas();
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (error) {
      setMessage({ type: 'error', text: 'Error al eliminar idea' });
    }
  };

  /**
   * Inicia la edición de una idea
   */
  const startEdit = (idea) => {
    setEditingId(idea._id);
    setEditData({
      title: idea.title,
      content: idea.content,
      category: idea.category,
      priority: idea.priority
    });
  };

  /**
   * Guarda la edición de una idea
   */
  const saveEdit = async () => {
    if (!editData.title?.trim() || !editData.content?.trim()) return;

    try {
      await fetch(`${API_URL}/idea/ideas/${editingId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(editData)
      });
      setEditingId(null);
      setEditData({});
      await fetchIdeas();
    } catch (error) {
      console.error('Error saving edit:', error);
    }
  };

  /**
   * Cancela la edición
   */
  const cancelEdit = () => {
    setEditingId(null);
    setEditData({});
  };

  /**
   * Filtra las ideas según el filtro activo
   */
  const getFilteredIdeas = () => {
    switch (filter) {
      case 'active':
        return ideas.filter(idea => idea.status !== 'completed' && idea.status !== 'archived');
      case 'completed':
        return ideas.filter(idea => idea.status === 'completed');
      case 'favorites':
        return ideas.filter(idea => idea.isFavorite);
      case 'pinned':
        return ideas.filter(idea => idea.isPinned);
      default:
        return ideas.filter(idea => idea.status !== 'archived');
    }
  };

  const filteredIdeas = getFilteredIdeas();
  const stats = {
    total: ideas.filter(i => i.status !== 'archived').length,
    active: ideas.filter(i => i.status === 'active').length,
    completed: ideas.filter(i => i.status === 'completed').length,
    favorites: ideas.filter(i => i.isFavorite).length,
    pinned: ideas.filter(i => i.isPinned).length
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-darkTheme-bg dark:to-darkTheme-border transition-colors duration-200">

      {/* Header */}
      <div className="bg-white dark:bg-darkTheme-card border-b border-neutral-200 dark:border-darkTheme-border px-8 py-6 shadow-sm transition-colors duration-200">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <Lightbulb className="text-yellow-500 dark:text-yellow-400" size={32} />
              <h2 className="text-3xl font-bold text-primary-dark dark:text-primary-light">
                Mis Ideas
              </h2>
            </div>
            <div className="flex gap-4 text-sm">
              <div className="text-center px-4 py-2 bg-neutral-100 dark:bg-darkTheme-bg rounded-lg">
                <p className="font-bold text-lg text-primary dark:text-primary-light">{stats.total}</p>
                <p className="text-neutral-600 dark:text-darkTheme-muted">Total</p>
              </div>
              <div className="text-center px-4 py-2 bg-neutral-100 dark:bg-darkTheme-bg rounded-lg">
                <p className="font-bold text-lg text-blue-600 dark:text-blue-400">{stats.active}</p>
                <p className="text-neutral-600 dark:text-darkTheme-muted">Activas</p>
              </div>
            </div>
          </div>
          <p className="text-neutral-600 dark:text-darkTheme-muted">
            Captura y organiza todas tus ideas brillantes
          </p>
        </div>
      </div>

      {/* Formulario para nueva idea */}
      <div className="bg-white dark:bg-darkTheme-card border-b border-neutral-200 dark:border-darkTheme-border px-8 py-4 shadow-sm transition-colors duration-200">
        <form onSubmit={handleAddIdea} className="max-w-6xl mx-auto">
          {message.text && (
            <div className={`mb-4 p-3 rounded-lg ${
              message.type === 'success'
                ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
            }`}>
              {message.text}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
            <input
              type="text"
              value={newIdea.title}
              onChange={(e) => setNewIdea({...newIdea, title: e.target.value})}
              placeholder="Título de la idea..."
              className="input-field md:col-span-4"
              required
            />
            <input
              type="text"
              value={newIdea.content}
              onChange={(e) => setNewIdea({...newIdea, content: e.target.value})}
              placeholder="Descripción..."
              className="input-field md:col-span-4"
              required
            />
            <select
              value={newIdea.category}
              onChange={(e) => setNewIdea({...newIdea, category: e.target.value})}
              className="input-field md:col-span-2"
            >
              {categories.map(cat => (
                <option key={cat.value} value={cat.value}>{cat.label}</option>
              ))}
            </select>
            <button type="submit" className="btn-primary flex items-center justify-center gap-2 md:col-span-2">
              <Plus size={20} />
              Agregar
            </button>
          </div>
        </form>
      </div>

      {/* Filtros */}
      <div className="bg-white dark:bg-darkTheme-card border-b border-neutral-200 dark:border-darkTheme-border px-8 py-3 transition-colors duration-200">
        <div className="max-w-6xl mx-auto flex gap-2 overflow-x-auto">
          {[
            { value: 'all', label: 'Todas', count: stats.total, icon: StickyNote },
            { value: 'active', label: 'Activas', count: stats.active, icon: TrendingUp },
            { value: 'completed', label: 'Completadas', count: stats.completed, icon: CheckSquare },
            { value: 'favorites', label: 'Favoritas', count: stats.favorites, icon: Star },
            { value: 'pinned', label: 'Fijadas', count: stats.pinned, icon: Pin }
          ].map(f => {
            const Icon = f.icon;
            return (
              <button
                key={f.value}
                onClick={() => setFilter(f.value)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                  filter === f.value
                    ? 'bg-primary text-white'
                    : 'bg-neutral-100 dark:bg-darkTheme-bg text-neutral-700 dark:text-darkTheme-text hover:bg-neutral-200 dark:hover:bg-darkTheme-border'
                }`}
              >
                <Icon size={16} />
                {f.label} ({f.count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Lista de ideas */}
      <div className="flex-1 overflow-y-auto p-8">
        <div className="max-w-6xl mx-auto space-y-3">
          {loading ? (
            <div className="text-center py-16">
              <p className="text-neutral-500 dark:text-darkTheme-muted">Cargando ideas...</p>
            </div>
          ) : filteredIdeas.length === 0 ? (
            <div className="text-center py-16">
              <Lightbulb size={64} className="mx-auto text-neutral-300 dark:text-neutral-600 mb-4" />
              <p className="text-neutral-500 dark:text-darkTheme-muted">No hay ideas que mostrar</p>
            </div>
          ) : (
            filteredIdeas.map((idea) => (
              <div
                key={idea._id}
                className={`card transition-all duration-200 ${
                  idea.status === 'completed' ? 'bg-neutral-50 dark:bg-darkTheme-bg opacity-75' : 'bg-white dark:bg-darkTheme-card'
                } dark:border-darkTheme-border ${idea.isPinned ? 'ring-2 ring-primary dark:ring-primary-light' : ''}`}
              >
                <div className="flex items-start gap-4">
                  {/* Checkbox */}
                  <button
                    onClick={() => toggleComplete(idea._id, idea.status)}
                    className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                      idea.status === 'completed'
                        ? 'bg-green-500 dark:bg-green-600 border-green-500 dark:border-green-600'
                        : 'border-neutral-300 dark:border-darkTheme-border hover:border-primary dark:hover:border-primary-light'
                    }`}
                  >
                    {idea.status === 'completed' && <Check size={16} className="text-white" />}
                  </button>

                  {/* Contenido de la idea */}
                  <div className="flex-1 min-w-0">
                    {editingId === idea._id ? (
                      <div className="space-y-3">
                        <input
                          type="text"
                          value={editData.title}
                          onChange={(e) => setEditData({...editData, title: e.target.value})}
                          className="input-field w-full"
                          placeholder="Título"
                        />
                        <input
                          type="text"
                          value={editData.content}
                          onChange={(e) => setEditData({...editData, content: e.target.value})}
                          className="input-field w-full"
                          placeholder="Descripción"
                        />
                        <div className="flex gap-2">
                          <select
                            value={editData.category}
                            onChange={(e) => setEditData({...editData, category: e.target.value})}
                            className="input-field flex-1"
                          >
                            {categories.map(cat => (
                              <option key={cat.value} value={cat.value}>{cat.label}</option>
                            ))}
                          </select>
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
                      </div>
                    ) : (
                      <>
                        <div className="flex items-start justify-between mb-2">
                          <h3 className={`font-semibold text-lg ${
                            idea.status === 'completed' ? 'line-through text-neutral-500 dark:text-darkTheme-muted' : 'text-neutral-800 dark:text-darkTheme-text'
                          }`}>
                            {idea.title}
                            {idea.isPinned && <Pin size={16} className="inline ml-2 text-primary" />}
                          </h3>
                        </div>

                        <p className={`text-sm mb-3 ${
                          idea.status === 'completed' ? 'text-neutral-400 dark:text-darkTheme-muted' : 'text-neutral-600 dark:text-darkTheme-text'
                        }`}>
                          {idea.content}
                        </p>

                        <div className="flex items-center gap-3 flex-wrap">
                          <span className="text-xs px-3 py-1 bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary-light rounded-full transition-colors duration-200">
                            {categories.find(c => c.value === idea.category)?.label}
                          </span>
                          <span className={`text-xs px-3 py-1 rounded-full ${
                            priorities.find(p => p.value === idea.priority)?.color
                          } bg-neutral-100 dark:bg-darkTheme-bg`}>
                            {priorities.find(p => p.value === idea.priority)?.label}
                          </span>
                          {idea.checklist && idea.checklist.length > 0 && (
                            <span className="text-xs px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full">
                              <CheckSquare size={12} className="inline mr-1" />
                              {idea.checklist.filter(i => i.completed).length}/{idea.checklist.length}
                            </span>
                          )}
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
                  {editingId !== idea._id && (
                    <div className="flex gap-2 flex-shrink-0">
                      <button
                        onClick={() => togglePin(idea._id)}
                        className={`p-2 rounded-lg transition-colors duration-200 ${
                          idea.isPinned
                            ? 'bg-primary/20 text-primary'
                            : 'bg-neutral-100 dark:bg-darkTheme-bg text-neutral-600 dark:text-darkTheme-muted hover:bg-primary/10'
                        }`}
                        title="Fijar"
                      >
                        <Pin size={18} />
                      </button>
                      <button
                        onClick={() => toggleFavorite(idea._id)}
                        className={`p-2 rounded-lg transition-colors duration-200 ${
                          idea.isFavorite
                            ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400'
                            : 'bg-neutral-100 dark:bg-darkTheme-bg text-neutral-600 dark:text-darkTheme-muted hover:bg-yellow-100 dark:hover:bg-yellow-900/30 hover:text-yellow-600 dark:hover:text-yellow-400'
                        }`}
                        title="Favorito"
                      >
                        <Star size={18} fill={idea.isFavorite ? 'currentColor' : 'none'} />
                      </button>
                      <button
                        onClick={() => startEdit(idea)}
                        className="p-2 bg-neutral-100 dark:bg-darkTheme-bg text-neutral-600 dark:text-darkTheme-muted rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
                        title="Editar"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => deleteIdea(idea._id)}
                        className="p-2 bg-neutral-100 dark:bg-darkTheme-bg text-neutral-600 dark:text-darkTheme-muted rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 hover:text-red-600 dark:hover:text-red-400 transition-colors duration-200"
                        title="Eliminar"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default IdeasView;
