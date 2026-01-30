import Idea from '../models/Idea.js';

/**
 * Obtener todas las ideas del usuario
 */
export const getIdeas = async (req, res) => {
  try {
    const { category, status, search, favorites } = req.query;

    let ideas;

    if (search) {
      ideas = await Idea.search(req.user._id, search);
    } else if (favorites) {
      ideas = await Idea.getFavorites(req.user._id);
    } else if (category) {
      ideas = await Idea.getByCategory(req.user._id, category);
    } else {
      const filter = { user: req.user._id };
      if (status) filter.status = status;

      ideas = await Idea.find(filter)
        .sort({ isPinned: -1, updatedAt: -1 });
    }

    res.json(ideas);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Obtener una idea específica
 */
export const getIdea = async (req, res) => {
  try {
    const { id } = req.params;

    const idea = await Idea.findOne({
      _id: id,
      user: req.user._id
    });

    if (!idea) {
      return res.status(404).json({ message: 'Idea no encontrada' });
    }

    // Incrementar contador de vistas
    await idea.incrementViewCount();

    res.json(idea);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Crear una nueva idea
 */
export const createIdea = async (req, res) => {
  try {
    const {
      title,
      content,
      category,
      tags,
      color,
      priority,
      reminderDate,
      dueDate,
      isPrivate,
      checklist,
      links
    } = req.body;

    if (!title || !content) {
      return res.status(400).json({
        message: 'Título y contenido son requeridos'
      });
    }

    const idea = await Idea.create({
      user: req.user._id,
      title,
      content,
      category: category || 'other',
      tags: tags || [],
      color: color || '#FFD700',
      priority: priority || 'medium',
      reminderDate,
      dueDate,
      isPrivate: isPrivate || false,
      checklist: checklist || [],
      links: links || []
    });

    res.status(201).json(idea);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Actualizar una idea
 */
export const updateIdea = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const idea = await Idea.findOne({
      _id: id,
      user: req.user._id
    });

    if (!idea) {
      return res.status(404).json({ message: 'Idea no encontrada' });
    }

    // Actualizar campos permitidos
    const allowedUpdates = [
      'title', 'content', 'category', 'tags', 'color',
      'status', 'priority', 'reminderDate', 'dueDate',
      'isPrivate', 'checklist', 'links', 'attachments'
    ];

    allowedUpdates.forEach(field => {
      if (updates[field] !== undefined) {
        idea[field] = updates[field];
      }
    });

    await idea.save();

    res.json(idea);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Eliminar una idea
 */
export const deleteIdea = async (req, res) => {
  try {
    const { id } = req.params;

    const idea = await Idea.findOne({
      _id: id,
      user: req.user._id
    });

    if (!idea) {
      return res.status(404).json({ message: 'Idea no encontrada' });
    }

    await idea.deleteOne();

    res.json({ message: 'Idea eliminada exitosamente' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Alternar favorito
 */
export const toggleFavorite = async (req, res) => {
  try {
    const { id } = req.params;

    const idea = await Idea.findOne({
      _id: id,
      user: req.user._id
    });

    if (!idea) {
      return res.status(404).json({ message: 'Idea no encontrada' });
    }

    await idea.toggleFavorite();

    res.json({ isFavorite: idea.isFavorite });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Alternar pin
 */
export const togglePin = async (req, res) => {
  try {
    const { id } = req.params;

    const idea = await Idea.findOne({
      _id: id,
      user: req.user._id
    });

    if (!idea) {
      return res.status(404).json({ message: 'Idea no encontrada' });
    }

    await idea.togglePin();

    res.json({ isPinned: idea.isPinned });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Cambiar estado
 */
export const updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['draft', 'active', 'archived', 'completed'].includes(status)) {
      return res.status(400).json({ message: 'Estado inválido' });
    }

    const idea = await Idea.findOne({
      _id: id,
      user: req.user._id
    });

    if (!idea) {
      return res.status(404).json({ message: 'Idea no encontrada' });
    }

    await idea.updateStatus(status);

    res.json(idea);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Agregar item al checklist
 */
export const addChecklistItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ message: 'Texto requerido' });
    }

    const idea = await Idea.findOne({
      _id: id,
      user: req.user._id
    });

    if (!idea) {
      return res.status(404).json({ message: 'Idea no encontrada' });
    }

    await idea.addChecklistItem(text);

    res.json(idea);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Alternar item del checklist
 */
export const toggleChecklistItem = async (req, res) => {
  try {
    const { id, itemId } = req.params;

    const idea = await Idea.findOne({
      _id: id,
      user: req.user._id
    });

    if (!idea) {
      return res.status(404).json({ message: 'Idea no encontrada' });
    }

    await idea.toggleChecklistItem(itemId);

    res.json(idea);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Obtener estadísticas
 */
export const getStats = async (req, res) => {
  try {
    const stats = await Idea.getStats(req.user._id);

    // Agregar información adicional
    const favorites = await Idea.countDocuments({
      user: req.user._id,
      isFavorite: true
    });

    const pinned = await Idea.countDocuments({
      user: req.user._id,
      isPinned: true
    });

    res.json({
      ...stats,
      favorites,
      pinned
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Duplicar idea
 */
export const duplicateIdea = async (req, res) => {
  try {
    const { id } = req.params;

    const originalIdea = await Idea.findOne({
      _id: id,
      user: req.user._id
    });

    if (!originalIdea) {
      return res.status(404).json({ message: 'Idea no encontrada' });
    }

    const duplicatedIdea = await Idea.create({
      user: req.user._id,
      title: `${originalIdea.title} (Copia)`,
      content: originalIdea.content,
      category: originalIdea.category,
      tags: originalIdea.tags,
      color: originalIdea.color,
      priority: originalIdea.priority,
      isPrivate: originalIdea.isPrivate,
      checklist: originalIdea.checklist,
      links: originalIdea.links
    });

    res.status(201).json(duplicatedIdea);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Archivar múltiples ideas
 */
export const archiveMultiple = async (req, res) => {
  try {
    const { ids } = req.body;

    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ message: 'IDs requeridos' });
    }

    const result = await Idea.updateMany(
      {
        _id: { $in: ids },
        user: req.user._id
      },
      {
        status: 'archived'
      }
    );

    res.json({
      message: `${result.modifiedCount} ideas archivadas`,
      count: result.modifiedCount
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Eliminar múltiples ideas
 */
export const deleteMultiple = async (req, res) => {
  try {
    const { ids } = req.body;

    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ message: 'IDs requeridos' });
    }

    const result = await Idea.deleteMany({
      _id: { $in: ids },
      user: req.user._id
    });

    res.json({
      message: `${result.deletedCount} ideas eliminadas`,
      count: result.deletedCount
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
