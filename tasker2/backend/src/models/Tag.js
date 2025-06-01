const mongoose = require('mongoose');

const TagSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'El nombre de la etiqueta es obligatorio'],
    trim: true
  },
  color: {
    type: String,
    default: 'blue-500'
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

module.exports = mongoose.model('Tag', TagSchema);
