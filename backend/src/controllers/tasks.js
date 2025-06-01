const Task = require('../models/Task');

// @desc    Obtener todas las tareas del usuario
// @route   GET /api/tasks
// @access  Private
exports.getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user.id });

    res.status(200).json(tasks);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Error al obtener tareas'
    });
  }
};

// @desc    Obtener una tarea
// @route   GET /api/tasks/:id
// @access  Private
exports.getTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Tarea no encontrada'
      });
    }

    // Verificar si la tarea pertenece al usuario
    if (task.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'No autorizado'
      });
    }

    res.status(200).json(task);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Error al obtener tarea'
    });
  }
};

// @desc    Crear una tarea
// @route   POST /api/tasks
// @access  Private
exports.createTask = async (req, res) => {
  try {
    // Agregar usuario a la tarea
    req.body.user = req.user.id;

    const task = await Task.create(req.body);

    res.status(201).json(task);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Error al crear tarea'
    });
  }
};

// @desc    Actualizar una tarea
// @route   PUT /api/tasks/:id
// @access  Private
exports.updateTask = async (req, res) => {
  try {
    let task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Tarea no encontrada'
      });
    }

    // Verificar si la tarea pertenece al usuario
    if (task.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'No autorizado'
      });
    }

    task = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json(task);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Error al actualizar tarea'
    });
  }
};

// @desc    Eliminar una tarea
// @route   DELETE /api/tasks/:id
// @access  Private
exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Tarea no encontrada'
      });
    }

    // Verificar si la tarea pertenece al usuario
    if (task.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'No autorizado'
      });
    }

    await task.deleteOne();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Error al eliminar tarea'
    });
  }
};
