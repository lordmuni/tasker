const Tag = require('../models/Tag');
const Task = require('../models/Task');

// @desc    Obtener todas las etiquetas del usuario
// @route   GET /api/tags
// @access  Private
exports.getTags = async (req, res) => {
  try {
    const tags = await Tag.find({ user: req.user.id });

    res.status(200).json(tags);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Error al obtener etiquetas'
    });
  }
};

// @desc    Obtener una etiqueta
// @route   GET /api/tags/:id
// @access  Private
exports.getTag = async (req, res) => {
  try {
    const tag = await Tag.findById(req.params.id);

    if (!tag) {
      return res.status(404).json({
        success: false,
        message: 'Etiqueta no encontrada'
      });
    }

    // Verificar si la etiqueta pertenece al usuario
    if (tag.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'No autorizado'
      });
    }

    res.status(200).json(tag);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Error al obtener etiqueta'
    });
  }
};

// @desc    Crear una etiqueta
// @route   POST /api/tags
// @access  Private
exports.createTag = async (req, res) => {
  try {
    // Agregar usuario a la etiqueta
    req.body.user = req.user.id;

    const tag = await Tag.create(req.body);

    res.status(201).json(tag);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Error al crear etiqueta'
    });
  }
};

// @desc    Actualizar una etiqueta
// @route   PUT /api/tags/:id
// @access  Private
exports.updateTag = async (req, res) => {
  try {
    let tag = await Tag.findById(req.params.id);

    if (!tag) {
      return res.status(404).json({
        success: false,
        message: 'Etiqueta no encontrada'
      });
    }

    // Verificar si la etiqueta pertenece al usuario
    if (tag.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'No autorizado'
      });
    }

    tag = await Tag.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json(tag);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Error al actualizar etiqueta'
    });
  }
};

// @desc    Eliminar una etiqueta
// @route   DELETE /api/tags/:id
// @access  Private
exports.deleteTag = async (req, res) => {
  try {
    const tag = await Tag.findById(req.params.id);

    if (!tag) {
      return res.status(404).json({
        success: false,
        message: 'Etiqueta no encontrada'
      });
    }

    // Verificar si la etiqueta pertenece al usuario
    if (tag.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'No autorizado'
      });
    }

    // Actualizar tareas que tienen esta etiqueta
    await Task.updateMany(
      { tags: req.params.id },
      { $pull: { tags: req.params.id } }
    );

    // Eliminar etiqueta
    await tag.deleteOne();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Error al eliminar etiqueta'
    });
  }
};
