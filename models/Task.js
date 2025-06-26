const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,

  priority: {
    type: String,
    enum: ['baixa', 'média', 'alta'],
    default: 'média'
  },

  status: {
    type: String,
    enum: ['não iniciada', 'em andamento', 'concluída'],
    default: 'não iniciada'
  },

  dueDate: { type: Date }, // data de entrega

  completed: { type: Boolean, default: false }, // pode manter por compatibilidade
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  sharedWith: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
}, { timestamps: true });

module.exports = mongoose.model('Task', taskSchema);
