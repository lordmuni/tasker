const mongoose = require('mongoose');

const ChecklistItemSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
    trim: true,
    maxlength: [200, 'El texto del item no puede exceder los 200 caracteres']
  },
  completed: {
    type: Boolean,
    default: false
  }
});

const TaskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'El título de la tarea es obligatorio'],
    trim: true,
    maxlength: [255, 'El título de la tarea no puede exceder los 255 caracteres']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [1000, 'La descripción de la tarea no puede exceder los 1000 caracteres']
  },
  status: {
    type: String,
    enum: ['pending', 'in-progress', 'completed'],
    default: 'pending'
  },
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project'
  },
  tags: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tag'
  }],
  checklist: [ChecklistItemSchema],
  dueDate: {
    type: Date
  },
  image: {
    type: String
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

module.exports = mongoose.model('Task', TaskSchema);
