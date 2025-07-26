//taskRoutes.js
const express = require("express");
const router = express.Router();

const {
  getTasks,
  createTask,
  toggleTask,
  deleteTask,
} = require("../controllers/taskController.js");

const { protect } = require("../middleware/authMiddleware.js");

// Apply protect middleware to all routes below
router.use(protect);

router.get("/", getTasks);
router.post("/", createTask);
router.put("/:id", toggleTask);
router.delete("/:id", deleteTask);

module.exports = router;
