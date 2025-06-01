const express = require('express');
const { 
  getTags, 
  getTag, 
  createTag, 
  updateTag, 
  deleteTag 
} = require('../controllers/tags');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Proteger todas las rutas
router.use(protect);

router.route('/')
  .get(getTags)
  .post(createTag);

router.route('/:id')
  .get(getTag)
  .put(updateTag)
  .delete(deleteTag);

module.exports = router;
