const Task = require('../models/Task');

exports.createTask = async (req, res) => {
  try {
    const task = await Task.create({
      ...req.body,
      owner: req.user.id
    });
    res.status(201).json(task);
  } catch (err) {
    res.status(400).json({ error: 'Erro ao criar tarefa.' });
  }
};

exports.getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({
      $or: [
        { owner: req.user.id },
        { sharedWith: req.user.id }
      ]
    }).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar tarefas.' });
  }
};

exports.getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task || (task.owner.toString() !== req.user.id && !task.sharedWith.includes(req.user.id))) {
      return res.status(403).json({ error: 'Acesso negado.' });
    }
    res.json(task);
  } catch (err) {
    res.status(404).json({ error: 'Tarefa não encontrada.' });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task || task.owner.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Acesso negado.' });
    }
    Object.assign(task, req.body);
    await task.save();
    res.json(task);
  } catch (err) {
    res.status(400).json({ error: 'Erro ao atualizar tarefa.' });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task || task.owner.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Acesso negado.' });
    }
    await task.remove();
    res.json({ message: 'Tarefa removida.' });
  } catch (err) {
    res.status(400).json({ error: 'Erro ao deletar tarefa.' });
  }
};
