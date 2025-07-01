const Task = require("../models/Task");

exports.createTask = async (req, res) => {
  try {
    const task = await Task.create({
      ...req.body,
      owner: req.user.id,
    });
    res.status(201).json(task);
  } catch (err) {
    console.error("Erro ao criar tarefa:", err.message);
    if (err.name === "ValidationError") {
      return res
        .status(400)
        .json({
          error: "Dados inválidos para criação da tarefa.",
          details: err.message,
        });
    }
    res.status(500).json({ error: "Erro inesperado ao criar tarefa." });
  }
};

exports.getTasks = async (req, res) => {
  try {
    const { priority, status, dueBefore, dueAfter } = req.query;
    const filter = {
      $or: [{ owner: req.user.id }, { sharedWith: req.user.id }],
    };

    if (priority) filter.priority = priority;
    if (status) filter.status = status;
    if (dueBefore || dueAfter) {
      filter.dueDate = {};
      if (dueBefore) {
        const beforeDate = new Date(dueBefore);
        if (!isNaN(beforeDate)) filter.dueDate.$lt = beforeDate;
      }
      if (dueAfter) {
        const afterDate = new Date(dueAfter);
        if (!isNaN(afterDate)) filter.dueDate.$gt = afterDate;
      }
      if (Object.keys(filter.dueDate).length === 0) delete filter.dueDate;
    }

    const tasks = await Task.find(filter).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (err) {
    console.error("Erro ao buscar tarefas:", err.message);
    res.status(500).json({ error: "Erro inesperado ao buscar tarefas." });
  }
};

exports.getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res
        .status(404)
        .json({ error: "Tarefa não encontrada com o ID informado." });
    }
    if (
      task.owner.toString() !== req.user.id &&
      !task.sharedWith.includes(req.user.id)
    ) {
      return res
        .status(403)
        .json({ error: "Você não tem permissão para acessar esta tarefa." });
    }
    res.json(task);
  } catch (err) {
    console.error("Erro ao buscar tarefa por ID:", err.message);
    res.status(500).json({ error: "Erro inesperado ao buscar tarefa." });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res
        .status(404)
        .json({ error: "Tarefa não encontrada para atualização." });
    }

    if (task.owner.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ error: "Você não tem permissão para atualizar esta tarefa." });
    }

    Object.assign(task, req.body);

    try {
      await task.save();
      res.json(task);
    } catch (saveErr) {
      if (saveErr.name === "ValidationError") {
        return res
          .status(400)
          .json({
            error: "Dados inválidos para atualização da tarefa.",
            details: saveErr.message,
          });
      }
      res.status(500).json({ error: "Erro inesperado ao salvar a tarefa." });
    }
  } catch (err) {
    console.error("Erro ao atualizar tarefa:", err.message);
    res.status(500).json({ error: "Erro inesperado ao atualizar tarefa." });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res
        .status(404)
        .json({ error: "Tarefa não encontrada para remoção." });
    }

    if (task.owner.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ error: "Você não tem permissão para remover esta tarefa." });
    }

    try {
      await Task.deleteOne({ _id: task._id });
      res.json({ message: "Tarefa removida com sucesso." });
    } catch (removeErr) {
      console.error("Erro detalhado ao remover tarefa:", removeErr);
      res.status(500).json({ error: "Erro inesperado ao remover a tarefa." });
    }
  } catch (err) {
    console.error("Erro ao deletar tarefa:", err.message);
    res.status(500).json({ error: "Erro inesperado ao deletar tarefa." });
  }
};
