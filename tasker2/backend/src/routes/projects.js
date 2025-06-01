const express = require('express');
const { 
  getProjects, 
  getProject, 
  createProject, 
  updateProject, 
  deleteProject 
} = require('../controllers/projects');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Proteger todas las rutas
router.use(protect);

router.route('/')
  .get(getProjects)
  .post(createProject);

router.route('/:id')
  .get(getProject)
  .put(updateProject)
  .delete(deleteProject);

module.exports = router;
