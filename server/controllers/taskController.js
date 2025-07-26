//taskController.js
const Task = require("../models/Task.js");

// GET /api/tasks
exports.getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.user._id }).sort("-createdAt");
    res.json(tasks);
  } catch (err) {
    console.error("Error fetching tasks:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// POST /api/tasks
exports.createTask = async (req, res) => {
  try {
    const { text } = req.body;
    if (!text || !text.trim()) {
      return res.status(400).json({ message: "Task text is required" });
    }

    const task = new Task({
      text: text.trim(),
      userId: req.user._id,
    });

    await task.save();
    res.status(201).json(task);
  } catch (err) {
    console.error("Error creating task:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// PATCH /api/tasks/:id
exports.toggleTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { done } = req.body;

    if (typeof done !== "boolean") {
      return res.status(400).json({ message: "Invalid 'done' value" });
    }

    const task = await Task.findOneAndUpdate(
      { _id: id, userId: req.user._id },
      { done },
      { new: true }
    );

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json(task);
  } catch (err) {
    console.error("Error toggling task:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// DELETE /api/tasks/:id
exports.deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    const task = await Task.findOneAndDelete({ _id: id, userId: req.user._id });
    if (!task) return res.status(404).json({ message: "Task not found" });

    res.json({ message: "Task deleted" });
  } catch (err) {
    console.error("Error deleting task:", err);
    res.status(500).json({ message: "Server error" });
  }
};
