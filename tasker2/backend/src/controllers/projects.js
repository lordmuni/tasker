const Project = require('../models/Project');
const Task = require('../models/Task');

// @desc    Obtener todos los proyectos del usuario
// @route   GET /api/projects
// @access  Private
exports.getProjects = async (req, res) => {
  try {
    const projects = await Project.find({ user: req.user.id });

    res.status(200).json(projects);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Error al obtener proyectos'
    });
  }
};

// @desc    Obtener un proyecto
// @route   GET /api/projects/:id
// @access  Private
exports.getProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Proyecto no encontrado'
      });
    }

    // Verificar si el proyecto pertenece al usuario
    if (project.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'No autorizado'
      });
    }

    res.status(200).json(project);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Error al obtener proyecto'
    });
  }
};

// @desc    Crear un proyecto
// @route   POST /api/projects
// @access  Private
exports.createProject = async (req, res) => {
  try {
    // Agregar usuario al proyecto
    req.body.user = req.user.id;

    const project = await Project.create(req.body);

    res.status(201).json(project);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Error al crear proyecto'
    });
  }
};

// @desc    Actualizar un proyecto
// @route   PUT /api/projects/:id
// @access  Private
exports.updateProject = async (req, res) => {
  try {
    let project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Proyecto no encontrado'
      });
    }

    // Verificar si el proyecto pertenece al usuario
    if (project.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'No autorizado'
      });
    }

    project = await Project.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json(project);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Error al actualizar proyecto'
    });
  }
};

// @desc    Eliminar un proyecto
// @route   DELETE /api/projects/:id
// @access  Private
exports.deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Proyecto no encontrado'
      });
    }

    // Verificar si el proyecto pertenece al usuario
    if (project.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'No autorizado'
      });
    }

    // Eliminar tareas asociadas al proyecto
    await Task.deleteMany({ project: req.params.id });

    // Eliminar proyecto
    await project.deleteOne();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Error al eliminar proyecto'
    });
  }
};
