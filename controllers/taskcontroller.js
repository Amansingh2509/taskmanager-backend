const Task = require("../models/task");

exports.getTasks = async (req, res) => {
  const userId = req.user.id;
  const tasks = await Task.find({ user: userId });
  res.json(tasks);
};

exports.addTask = async (req, res) => {
  const { title } = req.body;
  const userId = req.user.id;
  const task = await Task.create({ title, user: userId });
  res.status(201).json(task);
};

exports.updateTask = async (req, res) => {
  const { title, completed } = req.body;
  const task = await Task.findById(req.params.id);
  if (!task) return res.status(404).json({ message: "Task not found" });

  // Update title if provided, otherwise toggle completed
  if (title !== undefined) {
    task.title = title;
  }
  if (completed !== undefined) {
    task.completed = completed;
  }

  await task.save();
  res.json(task);
};

exports.deleteTask = async (req, res) => {
  const task = await Task.findById(req.params.id);
  if (!task) return res.status(404).json({ message: "Task not found" });

  await task.deleteOne();
  res.json({ message: "Task deleted" });
};
