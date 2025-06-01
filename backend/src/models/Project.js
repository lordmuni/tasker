const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'El nombre del proyecto es obligatorio'],
    trim: true,
    maxlength: [100, 'El nombre del proyecto no puede exceder los 100 caracteres']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [1000, 'La descripción del proyecto no puede exceder los 1000 caracteres']
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Project', ProjectSchema);
